import type { LabelKey, ReportLabels, SupportedLocale } from '../types.js';
import { en } from './locales/en.js';
import { ptBr } from './locales/pt-br.js';

/**
 * Every locale bundled with the reporter. Adding an entry here updates the CLI
 * `--locale` choices, the `--help` text and the validation error message, so
 * the list of allowed values never has to be maintained in more than one spot.
 *
 * The `satisfies` clause keeps this array and the `SupportedLocale` union in
 * lockstep; the `registry` below catches the opposite mistake of a union member
 * with no translation file.
 */
export const SUPPORTED_LOCALES = ['en', 'pt-BR'] as const satisfies readonly SupportedLocale[];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

const registry: Record<SupportedLocale, Partial<ReportLabels>> = {
  en,
  'pt-BR': ptBr,
};

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
 * `i18n.spec.ts` scans the script files and fails if one of them references a
 * key that is missing here, so this list cannot silently drift.
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

const normalise = (tag: string): string => tag.trim().toLowerCase();

const byNormalisedTag = new Map<string, SupportedLocale>(SUPPORTED_LOCALES.map((tag) => [normalise(tag), tag]));

/**
 * Maps a user-supplied tag onto a bundled locale.
 *
 * Matching is case-insensitive, then narrows to the base language so `en-US`,
 * `en-GB` and `en-AU` all land on `en` without needing files of their own.
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
  const labels: ReportLabels = { ...en, ...registry[resolved] };

  if (overrides) {
    for (const [key, value] of Object.entries(overrides)) {
      // Guard against `undefined`/`null` from JSON and YAML configs blanking a
      // label that the locale had filled in correctly.
      if (typeof value === 'string' && value.length > 0) {
        labels[key as LabelKey] = value;
      }
    }
  }

  return labels;
};

/**
 * Looks up `key` in `labels`, substituting any positional `{0}`-style
 * placeholders from `args`.
 *
 * An unrecognised key renders as the key itself. That is deliberately visible
 * in the report and greppable in review, rather than failing the build or
 * silently emitting an empty string.
 */
export const translate = (labels: ReportLabels, key: string, ...args: unknown[]): string => {
  const value = labels[key as LabelKey] ?? key;

  if (args.length === 0) {
    return value;
  }

  return value.replace(/\{(\d+)\}/g, (match, index: string) => {
    const arg = args[Number(index)];
    return arg === undefined || arg === null ? match : String(arg);
  });
};
