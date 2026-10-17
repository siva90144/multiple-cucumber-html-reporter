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
   * Falls back to the key itself, matching the server-side `t` filter.
   */
  t: (key, ...args) => {
    const labels = (window.ReportConfig && window.ReportConfig.labels) || {};
    const value = labels[key] || key;
    if (args.length === 0) return value;
    return value.replace(/\{(\d+)\}/g, (match, index) => {
      const arg = args[Number(index)];
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
