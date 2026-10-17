import {
  createTranslator,
  DEFAULT_LOCALE,
  englishLabels as en,
  resolveLabels,
  resolveLocale,
  SUPPORTED_LOCALES,
} from '@/i18n/index.js';
import type { ReportLabels } from '@/types.js';

describe('i18n locale resolution', () => {
  it('should default to English when no locale is given', () => {
    expect(resolveLocale()).toBe('en');
    expect(DEFAULT_LOCALE).toBe('en');
  });

  it('should resolve every bundled locale exactly', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(resolveLocale(locale)).toBe(locale);
    }
  });

  it('should match tags case-insensitively and return the canonical casing', () => {
    expect(resolveLocale('PT-br')).toBe('pt-BR');
    expect(resolveLocale('pt-br')).toBe('pt-BR');
    expect(resolveLocale('EN')).toBe('en');
  });

  it('should ignore surrounding whitespace', () => {
    expect(resolveLocale('  pt-BR  ')).toBe('pt-BR');
  });

  it('should narrow a region subtag to its base language', () => {
    expect(resolveLocale('en-US')).toBe('en');
    expect(resolveLocale('en-GB')).toBe('en');
    expect(resolveLocale('en-AU')).toBe('en');
  });

  it('should refuse to widen a base language into a regional dialect', () => {
    // Resolving a bare `pt` to `pt-BR` would hand Brazilian Portuguese to a
    // reader in Portugal, so this must throw rather than guess.
    expect(() => resolveLocale('pt')).toThrowError(/Invalid locale: "pt"/);
  });

  it('should throw on an unknown locale and list the supported values', () => {
    expect(() => resolveLocale('xx-YY')).toThrowError(/Invalid locale: "xx-YY"/);
    expect(() => resolveLocale('xx-YY')).toThrowError(/en, pt-BR/);
  });

  it('should throw on a malformed tag that uses an underscore', () => {
    expect(() => resolveLocale('pt_BR')).toThrowError(/Invalid locale: "pt_BR"/);
  });
});

describe('i18n label resolution', () => {
  it('should return the complete English set by default', () => {
    const labels = resolveLabels();
    expect(Object.keys(labels).length).toBe(Object.keys(en).length);
    expect(labels['status.passed']).toBe('Passed');
    expect(labels['table.title']).toBe('Features Overview');
  });

  it('should apply caller overrides over the locale', () => {
    const labels = resolveLabels('en', { 'table.featureName': 'Test Suite' });
    expect(labels['table.featureName']).toBe('Test Suite');
    // Untouched keys keep their locale value.
    expect(labels['table.environment']).toBe('Environment');
  });

  it('should fall back to English for keys a locale does not translate', () => {
    const labels = resolveLabels('pt-BR');
    for (const key of Object.keys(en)) {
      const value = labels[key as keyof ReportLabels];
      expect(value).toBeDefined();
      // Plural labels resolve to an object of forms rather than a bare string.
      const forms = typeof value === 'string' ? [value] : Object.values(value);
      expect(forms.length).toBeGreaterThan(0);
      for (const form of forms) {
        expect(typeof form).toBe('string');
        expect((form as string).length).toBeGreaterThan(0);
      }
    }
  });

  it('should never leave a key undefined', () => {
    const labels = resolveLabels('pt-BR', { 'status.passed': 'Aprovado' });
    expect(Object.values(labels).some((value) => value === undefined)).toBe(false);
  });

  it('should ignore null and empty overrides rather than blanking a label', () => {
    const labels = resolveLabels('en', {
      'status.passed': '',
      'status.failed': null as unknown as string,
      'status.skipped': undefined,
    });
    expect(labels['status.passed']).toBe('Passed');
    expect(labels['status.failed']).toBe('Failed');
    expect(labels['status.skipped']).toBe('Skipped');
  });

  it('should propagate an invalid locale as an error', () => {
    expect(() => resolveLabels('nope')).toThrowError(/Invalid locale/);
  });
});

describe('i18n translator', () => {
  const t = createTranslator(resolveLabels('en'), 'en');

  it('should look up a known key', () => {
    expect(t('status.passed')).toBe('Passed');
  });

  it('should return the key itself when it is unknown', () => {
    expect(t('does.not.exist')).toBe('does.not.exist');
  });

  it('should substitute named placeholders', () => {
    expect(t('scenario.attachmentScreenshot', { index: 3 })).toBe('Screenshot 3');
  });

  it('should leave a placeholder in place when no value is supplied for it', () => {
    expect(t('scenario.attachmentScreenshot')).toBe('Screenshot {index}');
  });

  it('should not alter a string that has no placeholders', () => {
    expect(t('status.failed', { index: 9 })).toBe('Failed');
  });

  it('should select the singular form at a count of one', () => {
    // The previous implementation rendered "of 1 entries" here.
    expect(t('table.showingEntries', { start: 1, end: 1, count: 1 })).toBe('Showing 1 to 1 of 1 entry');
  });

  it('should select the plural form for other counts', () => {
    expect(t('table.showingEntries', { start: 1, end: 10, count: 42 })).toBe('Showing 1 to 10 of 42 entries');
    expect(t('table.showingEntries', { start: 0, end: 0, count: 0 })).toBe('Showing 0 to 0 of 0 entries');
  });

  it("should use the locale's own plural categories, not English ones", () => {
    // Russian distinguishes one/few/many where English has only one/other.
    const forms = { one: '{count} запись', few: '{count} записи', many: '{count} записей' };
    const ru = createTranslator({ ...resolveLabels('en'), 'table.showingEntries': forms }, 'ru');
    expect(ru('table.showingEntries', { count: 1 })).toBe('1 запись');
    expect(ru('table.showingEntries', { count: 2 })).toBe('2 записи');
    expect(ru('table.showingEntries', { count: 5 })).toBe('5 записей');
  });

  it('should fall back to another plural form when the needed category is absent', () => {
    const partial = createTranslator(
      { ...resolveLabels('en'), 'table.showingEntries': { other: '{count} items' } },
      'en',
    );
    expect(partial('table.showingEntries', { count: 1 })).toBe('1 items');
  });
});
