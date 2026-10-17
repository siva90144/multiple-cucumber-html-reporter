import type { LabelKey, LabelValue, PluralForms, ReportLabels, SupportedLocale, TranslateParams } from '../types.js';
import reportLanguages from './report-languages.json' with { type: 'json' };

/**
 * All bundled translations live in a single `report-languages.json`, mirroring
 * how Gherkin itself ships `gherkin-languages.json`. Adding a language is one
 * file edit plus the `SupportedLocale` union, and the data stays in a format
 * translation platforms (Crowdin, Weblate, Transifex) can read directly.
 *
 * `en` is the source of truth for `LabelKey` and the guaranteed fallback, so it
 * must be complete; every other locale may be partial.
 */
const languages = reportLanguages satisfies Record<SupportedLocale, Partial<ReportLabels>> as Record<
  SupportedLocale,
  Partial<ReportLabels>
>;

const en = languages.en as ReportLabels;

/**
 * Every locale bundled with the reporter, read from the JSON's keys. The
 * `SupportedLocale` union is derived from the same keys, so this cast is exact
 * and a new language cannot be half-registered.
 *
 * Feeds the CLI `--locale` choices, the `--help` text and the validation error
 * message, so the list of allowed values has exactly one source.
 */
export const SUPPORTED_LOCALES = Object.keys(languages) as ReadonlyArray<SupportedLocale>;

export const DEFAULT_LOCALE: SupportedLocale = 'en';

/**
 * The subset of labels needed by the browser-side scripts in
 * `templates/scripts/`, which re-render the features table, the charts and the
 * attachment modal on the client.
 *
 * Only these are inlined into the page. Shipping the whole map would add ~4 KB
 * to every page and, worse, would place strings in pages that never render
 * them — e.g. the inline-layout attachment links would appear in the markup of
 * a modal-layout report.
 *
 * `i18n-client-labels.spec.ts` scans the script files and fails if one of them
 * references a key that is missing here, so this list cannot silently drift.
 */
export const CLIENT_LABEL_KEYS = [
  'chart.duration',
  'chart.features',
  'chart.notAvailable',
  'chart.scenarios',
  'chart.steps',
  'chart.total',
  'modal.consoleLog',
  'modal.copied',
  'modal.copyError',
  'modal.copyLog',
  'modal.errorDetails',
  'modal.videoUnsupported',
  'status.ambiguous',
  'status.failed',
  'status.notDefined',
  'status.passed',
  'status.pending',
  'status.skipped',
  'table.browserStack',
  'table.clear',
  'table.desktop',
  'table.filterByTags',
  'table.localMachine',
  'table.showingEntries',
  'table.tags',
  'table.testMu',
] as const satisfies readonly LabelKey[];

/** Narrows a resolved label map to the keys the browser scripts read. */
export const pickClientLabels = (labels: ReportLabels): Partial<ReportLabels> => {
  const picked: Partial<ReportLabels> = {};
  for (const key of CLIENT_LABEL_KEYS) {
    picked[key] = labels[key];
  }
  return picked;
};

/** True for a non-empty object of plural categories, as opposed to null. */
const isPluralForms = (value: unknown): value is PluralForms =>
  typeof value === 'object' && value !== null && Object.keys(value).length > 0;

const normalise = (tag: string): string => tag.trim().toLowerCase();

const byNormalisedTag = new Map<string, SupportedLocale>(SUPPORTED_LOCALES.map((tag) => [normalise(tag), tag]));

/**
 * Maps a user-supplied tag onto a bundled locale.
 *
 * Matching is case-insensitive, then narrows to the base language so `en-US`,
 * `en-GB` and `en-AU` all land on `en` without needing entries of their own.
 *
 * The narrowing is deliberately one-directional. Widening a bare `pt` to
 * `pt-BR` would quietly hand Brazilian Portuguese to a reader in Portugal, so
 * an unmatched tag throws and names the supported values instead of guessing a
 * dialect.
 */
export const resolveLocale = (locale?: string): SupportedLocale => {
  if (locale === undefined) {
    return DEFAULT_LOCALE;
  }

  const wanted = normalise(locale);
  const exact = byNormalisedTag.get(wanted);
  if (exact) {
    return exact;
  }

  const baseLanguage = wanted.split('-')[0];
  if (baseLanguage !== wanted) {
    const narrowed = byNormalisedTag.get(baseLanguage);
    if (narrowed) {
      return narrowed;
    }
  }

  throw new Error(
    `Invalid locale: "${locale}". Expected one of: ${SUPPORTED_LOCALES.join(', ')} (or leave it unset to use the default, "${DEFAULT_LOCALE}").`,
  );
};

/**
 * Builds the complete label map for a run: English underneath, the selected
 * locale over it, then the caller's overrides last. Only `en` is guaranteed
 * complete, so a partial translation degrades to English key by key rather than
 * rendering `undefined`.
 */
export const resolveLabels = (locale?: string, overrides?: Partial<ReportLabels>): ReportLabels => {
  const resolved = resolveLocale(locale);
  const labels: ReportLabels = { ...en, ...languages[resolved] };

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      // Guard against `undefined`/`null` from JSON and YAML configs blanking a
      // label that the locale had filled in correctly.
      if (typeof value === 'string' ? value.length > 0 : isPluralForms(value)) {
        labels[key as LabelKey] = value as LabelValue;
      }
    }
  }

  return labels;
};

/**
 * Picks the plural form matching `count` for the active locale, using the
 * runtime's own CLDR data via `Intl.PluralRules`. No plural tables are
 * bundled.
 *
 * Falls back to `other`, then to any form present, so a translation that only
 * supplies some categories still renders something sensible.
 */
const selectPluralForm = (forms: PluralForms, locale: string, count: number): string => {
  const category = new Intl.PluralRules(locale).select(count);
  return forms[category] ?? forms.other ?? Object.values(forms)[0] ?? '';
};

/** Replaces `{name}` placeholders with values from `params`. */
const interpolate = (template: string, params: TranslateParams): string =>
  template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined || value === null ? match : String(value);
  });

/**
 * Builds a translator bound to a label map and locale.
 *
 * Placeholders are named — `{start}`, `{count}` — rather than positional, so a
 * translator can see what each one means and reorder them freely.
 *
 * A label whose value is an object of plural categories is resolved against
 * `params.count`, which is what makes "1 entry" / "2 entries" correct in
 * English and gives Russian, Polish and Arabic the extra forms they need.
 *
 * An unrecognised key renders as the key itself: visible in the report and
 * greppable in review, rather than failing the build or emitting an empty
 * string.
 */
export const createTranslator =
  (labels: ReportLabels, locale: string) =>
  (key: string, params: TranslateParams = {}): string => {
    const value = labels[key as LabelKey];

    if (value === undefined) {
      return key;
    }

    const template = typeof value === 'string' ? value : selectPluralForm(value, locale, Number(params.count ?? 0));

    return interpolate(template, params);
  };

/** The complete English label set, exported for tests and key-parity checks. */
export { en as englishLabels };
