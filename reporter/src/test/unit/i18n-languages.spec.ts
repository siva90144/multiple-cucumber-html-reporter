import { englishLabels, resolveLocale, SUPPORTED_LOCALES } from '@/i18n/index.js';
import reportLanguages from '@/i18n/report-languages.json' with { type: 'json' };

/**
 * Translations live in a single JSON file, so a misspelled key is no longer a
 * compile error the way it was with per-locale TypeScript modules. These specs
 * replace that safety net.
 */
describe('i18n report-languages.json', () => {
  const languages = reportLanguages as unknown as Record<string, Record<string, unknown>>;
  const englishKeys = Object.keys(englishLabels).sort();

  it('should expose each locale in the file through SUPPORTED_LOCALES', () => {
    // SupportedLocale is derived from this file's keys, so drift between the
    // union and the data is impossible by construction. What this guards is
    // that every entry is actually reachable through the public resolver.
    for (const locale of Object.keys(languages)) {
      expect(() => resolveLocale(locale)).not.toThrow();
      expect(SUPPORTED_LOCALES as readonly string[]).toContain(locale);
    }
  });

  it('should include English as the fallback locale', () => {
    expect(Object.keys(languages)).toContain('en');
  });

  it('should not let any locale introduce a key English does not define', () => {
    // A key here that English lacks is almost always a typo, and would never
    // be rendered because lookups are typed against the English key set.
    for (const [locale, labels] of Object.entries(languages)) {
      const unknown = Object.keys(labels).filter((key) => !englishKeys.includes(key));
      expect(unknown).toEqual([], `locale "${locale}" defines unknown keys: ${unknown.join(', ')}`);
    }
  });

  it('should give every key in every locale a non-empty value', () => {
    for (const [locale, labels] of Object.entries(languages)) {
      for (const [key, value] of Object.entries(labels)) {
        if (typeof value === 'string') {
          expect(value.length).toBeGreaterThan(0, `${locale}.${key} is empty`);
        } else {
          const forms = Object.values(value as Record<string, string>);
          expect(forms.length).toBeGreaterThan(0, `${locale}.${key} has no plural forms`);
          for (const form of forms) {
            expect(typeof form).toBe('string', `${locale}.${key} has a non-string plural form`);
            expect(form.length).toBeGreaterThan(0, `${locale}.${key} has an empty plural form`);
          }
        }
      }
    }
  });

  it('should preserve the placeholders English uses in each translated key', () => {
    // A translation that drops {count} silently loses a number from the page.
    const placeholders = (value: unknown): string[] =>
      [
        ...new Set(
          String(typeof value === 'string' ? value : Object.values(value as object).join(' ')).match(/\{\w+\}/g) ?? [],
        ),
      ].sort();

    for (const [locale, labels] of Object.entries(languages)) {
      if (locale === 'en') continue;
      for (const [key, value] of Object.entries(labels)) {
        const expected = placeholders((englishLabels as Record<string, unknown>)[key]);
        expect(placeholders(value)).toEqual(expected, `${locale}.${key} placeholders differ from English`);
      }
    }
  });

  it('should give every plural label the categories its locale requires', () => {
    for (const [locale, labels] of Object.entries(languages)) {
      const required = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;
      for (const [key, value] of Object.entries(labels)) {
        if (typeof value === 'string') continue;
        const missing = required.filter((category) => !(category in (value as object)));
        expect(missing).toEqual([], `${locale}.${key} is missing plural categories: ${missing.join(', ')}`);
      }
    }
  });

  it('should keep English complete, since it is the fallback for every other locale', () => {
    expect(englishKeys.length).toBeGreaterThan(0);
    expect(Object.keys(languages.en).sort()).toEqual(englishKeys);
  });
});
