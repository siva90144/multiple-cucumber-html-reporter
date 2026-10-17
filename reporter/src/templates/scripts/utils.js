/**
 * Shared utility functions
 */
window.ReportUtils = {
  clear: (id) => {
    const el = document.querySelector(id);
    if (el) el.innerHTML = '';
  },

  isDark: () => document.documentElement.classList.contains('dark'),

  getTextColor: () => (window.ReportUtils.isDark() ? '#94a3b8' : '#64748b'),

  getGridColor: () => (window.ReportUtils.isDark() ? '#334155' : '#e2e8f0'),

  escape: (unsafe) => {
    return (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Translates a label key using the map inlined into window.ReportConfig by
   * the page template. The report has to work from file://, so the labels are
   * embedded in the page rather than fetched.
   *
   * Mirrors the server-side translator: named {name} placeholders, plural
   * selection from params.count via Intl.PluralRules, and an unknown key
   * rendering as the key itself.
   *
   *   ReportUtils.t('status.passed')
   *   ReportUtils.t('table.showingEntries', { start: 1, end: 10, count: 42 })
   */
  t: (key, params) => {
    const config = window.ReportConfig || {};
    const value = (config.labels || {})[key];
    if (value === undefined) return key;

    const args = params || {};
    let template = value;

    if (typeof value !== 'string') {
      const locale = config.locale || 'en';
      const category = new Intl.PluralRules(locale).select(Number(args.count || 0));
      template = value[category] || value.other || Object.values(value)[0] || '';
    }

    return template.replace(/\{(\w+)\}/g, (match, name) => {
      const arg = args[name];
      return arg === undefined || arg === null ? match : String(arg);
    });
  },

  /**
   * The six status names in the fixed order the charts rely on.
   */
  statusLabels: () => [
    window.ReportUtils.t('status.passed'),
    window.ReportUtils.t('status.failed'),
    window.ReportUtils.t('status.ambiguous'),
    window.ReportUtils.t('status.notDefined'),
    window.ReportUtils.t('status.pending'),
    window.ReportUtils.t('status.skipped'),
  ],
};
