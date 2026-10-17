/**
 * English labels. This is the source of truth for the `LabelKey` union and the
 * guaranteed fallback for every other locale, so it must stay complete: any key
 * added here has to be resolvable, while other locales may be partial.
 *
 * Placeholders use `{0}`, `{1}`, ... and are substituted positionally by the
 * `t` filter.
 */
export const en = {
  // ── Status names. Shared on purpose: these six words appear in the table
  // legend, the feature KPI tiles, the filter buttons and the charts, and they
  // must agree across all of them.
  'status.passed': 'Passed',
  'status.failed': 'Failed',
  'status.ambiguous': 'Ambiguous',
  'status.notDefined': 'Not Defined',
  'status.pending': 'Pending',
  'status.skipped': 'Skipped',

  // ── Dashboard chart cards
  'dashboard.featuresStatus': 'Features Status',
  'dashboard.scenariosStatus': 'Scenarios Status',
  'dashboard.stepsStatus': 'Steps Status',
  'dashboard.deviceOs': 'Device & OS',
  'dashboard.browsers': 'Browsers',
  'dashboard.topTags': 'Top 10 Tags',
  'dashboard.featuresStatusTrend': 'Features Status Trend',

  // ── Features overview table
  'table.title': 'Features Overview',
  'table.searchPlaceholder': 'Search features...',
  'table.filterByTags': 'Filter by tags...',
  'table.tags': 'Tags',
  'table.clear': 'Clear',
  'table.show': 'Show:',
  'table.featureName': 'Feature Name',
  'table.environment': 'Environment',
  'table.stepsStatus': 'Steps status',
  'table.passPercentage': 'Pass %',
  'table.duration': 'Duration',
  'table.durationWallClock': 'Duration (wall clock)',
  'table.desktop': 'Desktop',
  'table.browserStack': 'BrowserStack',
  'table.testMu': 'TestMu AI',
  'table.localMachine': 'Local machine',
  'table.noFeatureFound': 'No feature found',
  'table.noFeatureFoundHint': 'Try adjusting your filters or search terms.',
  'table.showingEntries': 'Showing {0} to {1} of {2} entries',

  // ── Run information card
  'runInfo.projectRelease': 'Project & Release',
  'runInfo.release': 'Release',
  'runInfo.testCycle': 'Test Cycle',
  'runInfo.build': 'Build',
  'runInfo.environment': 'Environment',
  'runInfo.ciPipeline': 'CI Pipeline',
  'runInfo.executionPeriod': 'Execution Period',
  'runInfo.duration': 'Duration:',
  'runInfo.username': 'Username',
  'runInfo.nodeVersion': 'Node Version',
  'runInfo.reportVersion': 'Report Version',
  'runInfo.hostname': 'Hostname',
  'runInfo.machineArch': 'Machine Arch',

  // ── Feature detail page
  'feature.breadcrumbDashboard': 'Dashboard',
  'feature.breadcrumbCurrent': 'Feature Detail',
  'feature.scenarioDistribution': 'Scenario Distribution',
  'feature.slowestScenarios': 'Top 10 Slowest Scenarios',
  'feature.slowestSteps': 'Top 10 Slowest Steps',
  'feature.stepStatusBreakdown': 'Step Status Breakdown',
  'feature.stepsPerScenario': 'Steps per Scenarios',
  'feature.topTags': 'Top 10 Tags',
  'feature.scenarios': 'Scenarios',
  'feature.searchPlaceholder': 'Search scenarios...',
  'feature.noScenarioFound': 'No scenario found',
  'feature.noScenarioFoundHint': 'Try adjusting your filters or search terms.',
  'feature.runningOnBrowserStack': 'Running on BrowserStack',
  'feature.runningOnTestMu': 'Running on TestMu AI',
  'feature.runningLocally': 'Running locally',
  'feature.nodePrefix': 'Node',
  'feature.reporterPrefix': 'Reporter',

  // ── Scenario status filter buttons. Separate from `status.*` because the
  // design renders them in capitals as literal text; keeping them as their own
  // keys lets a translator choose the casing instead of relying on `upcase`,
  // which misbehaves for Turkish dotted/dotless i and German sharp s.
  'feature.filterAll': 'ALL',
  'feature.filterPassed': 'PASSED',
  'feature.filterFailed': 'FAILED',
  'feature.filterAmbiguous': 'AMBIGUOUS',
  'feature.filterNotDefined': 'NOT DEFINED',
  'feature.filterPending': 'PENDING',
  'feature.filterSkipped': 'SKIPPED',

  // ── Scenario cards and attachments
  'scenario.description': 'Description',
  'scenario.attachments': 'Attachments',
  'scenario.showInfo': '+ Show Info',
  'scenario.video': '+ Video',
  'scenario.screenshot': '+ Screenshot',
  'scenario.attachmentIndexed': '+ Attachment {0}',
  'scenario.recordingOf': 'Recording of:',
  'scenario.previewNotAvailable': 'Preview not available.',
  'scenario.download': 'Download',
  'scenario.errorDetails': 'Error details',
  'scenario.modalTitle': 'Attachment',
  // Default attachment names, used when a test does not supply its own.
  //
  // These come in two forms because the existing markup already differs: the
  // `data-attachment-name` attribute (surfaced as the modal title) is
  // hyphenated, while the visible list label is not. The split is preserved
  // rather than silently unified — see the note in the proposal.
  'scenario.attachmentScreenshot': 'Screenshot - {0}',
  'scenario.attachmentScreenshotListed': 'Screenshot {0}',
  'scenario.attachmentLog': 'Log - {0}',
  'scenario.attachmentLogListed': 'Log {0}',
  'scenario.attachmentVideo': 'Video',
  'scenario.attachmentVideoIndexed': 'Video - {0}',
  'scenario.attachmentVideoListed': 'Video {0}',
  'scenario.attachmentHtml': 'HTML - {0}',
  'scenario.attachmentHtmlListed': 'HTML {0}',
  'scenario.attachmentJson': 'JSON - {0}',
  'scenario.attachmentJsonListed': 'JSON {0}',
  'scenario.attachmentGeneric': 'Attachment - {0}',
  'scenario.attachmentGenericListed': 'Attachment {0}',

  // ── Attachment modal (rendered by scripts/modal.js)
  'modal.videoUnsupported': 'Your browser does not support the video tag.',
  'modal.consoleLog': 'Console Log',
  'modal.copyLog': 'Copy Log',
  'modal.errorDetails': 'Error Details & Stack Trace',
  'modal.copyError': 'Copy Error',
  'modal.copied': 'Copied!',

  // ── Chart series names and donut centre totals (scripts/charts.js)
  'chart.features': 'Features',
  'chart.scenarios': 'Scenarios',
  'chart.steps': 'Steps',
  'chart.total': 'Total',
  'chart.duration': 'Duration',
  'chart.notAvailable': 'N/A',

  // ── Page chrome
  'meta.pageTitle': 'Cucumber Test Report',
  'meta.reportName': 'Cucumber Report',
  'meta.reportSubtitle': 'Automated Execution Insights',
  'meta.logoAlt': 'Logo',
  'meta.generatedBy': 'Generated by',
  'meta.reporterName': 'Multiple Cucumber HTML Reporter',
  'meta.builtWith': 'Built with ❤️ by',
  'meta.authorName': 'Wasiq Bhamla',
} as const;
