import { DEFAULT_LOCALE, resolveLabels, resolveLocale, SUPPORTED_LOCALES, translate } from '@/i18n/index.js';
import { en } from '@/i18n/locales/en.js';
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
      expect(typeof labels[key as keyof ReportLabels]).toBe('string');
      expect(labels[key as keyof ReportLabels].length).toBeGreaterThan(0);
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

describe('i18n translate', () => {
  const labels = resolveLabels('en');

  it('should look up a known key', () => {
    expect(translate(labels, 'status.passed')).toBe('Passed');
  });

  it('should return the key itself when it is unknown', () => {
    expect(translate(labels, 'does.not.exist')).toBe('does.not.exist');
  });

  it('should substitute positional placeholders', () => {
    expect(translate(labels, 'table.showingEntries', 1, 10, 42)).toBe('Showing 1 to 10 of 42 entries');
  });

  it('should leave a placeholder in place when no argument is supplied for it', () => {
    expect(translate(labels, 'table.showingEntries', 1, 10)).toBe('Showing 1 to 10 of {2} entries');
  });

  it('should not alter a string that has no placeholders', () => {
    expect(translate(labels, 'status.failed', 'unused')).toBe('Failed');
  });
});
