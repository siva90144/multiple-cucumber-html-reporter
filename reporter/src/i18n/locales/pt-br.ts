import type { ReportLabels } from '../../types.js';

/**
 * Brazilian Portuguese labels.
 *
 * Registered under the BCP-47 tag `pt-BR`. It is deliberately not offered as a
 * bare `pt`: European Portuguese differs enough in vocabulary that resolving
 * `pt` to this file would be a guess rather than a translation.
 *
 * Typed as `Partial<ReportLabels>` so the build fails on a misspelled key while
 * still allowing the file to be incomplete — anything missing falls back to
 * English rather than rendering `undefined`.
 */
export const ptBr: Partial<ReportLabels> = {
  // ── Status
  'status.passed': 'Aprovado',
  'status.failed': 'Falhou',
  'status.ambiguous': 'Ambíguo',
  'status.notDefined': 'Não definido',
  'status.pending': 'Pendente',
  'status.skipped': 'Ignorado',

  // ── Dashboard
  'dashboard.featuresStatus': 'Status das funcionalidades',
  'dashboard.scenariosStatus': 'Status dos cenários',
  'dashboard.stepsStatus': 'Status dos passos',
  'dashboard.deviceOs': 'Dispositivo e SO',
  'dashboard.browsers': 'Navegadores',
  'dashboard.topTags': 'Top 10 etiquetas',
  'dashboard.featuresStatusTrend': 'Tendência do status das funcionalidades',

  // ── Features table
  'table.title': 'Visão geral das funcionalidades',
  'table.searchPlaceholder': 'Buscar funcionalidades...',
  'table.filterByTags': 'Filtrar por etiquetas...',
  'table.tags': 'Etiquetas',
  'table.clear': 'Limpar',
  'table.show': 'Exibir:',
  'table.featureName': 'Funcionalidade',
  'table.environment': 'Ambiente',
  'table.stepsStatus': 'Status dos passos',
  'table.passPercentage': '% aprovado',
  'table.duration': 'Duração',
  'table.durationWallClock': 'Duração (tempo real)',
  'table.desktop': 'Desktop',
  'table.localMachine': 'Máquina local',
  'table.noFeatureFound': 'Nenhuma funcionalidade encontrada',
  'table.noFeatureFoundHint': 'Tente ajustar os filtros ou os termos da busca.',
  'table.showingEntries': 'Exibindo {0} a {1} de {2} registros',

  // ── Run information
  'runInfo.projectRelease': 'Projeto e versão',
  'runInfo.release': 'Versão',
  'runInfo.testCycle': 'Ciclo de teste',
  'runInfo.build': 'Build',
  'runInfo.environment': 'Ambiente',
  'runInfo.ciPipeline': 'Pipeline de CI',
  'runInfo.executionPeriod': 'Período de execução',
  'runInfo.duration': 'Duração:',
  'runInfo.username': 'Usuário',
  'runInfo.nodeVersion': 'Versão do Node',
  'runInfo.reportVersion': 'Versão do relatório',
  'runInfo.hostname': 'Nome do host',
  'runInfo.machineArch': 'Arquitetura',

  // ── Feature detail page
  'feature.breadcrumbDashboard': 'Painel',
  'feature.breadcrumbCurrent': 'Detalhe da funcionalidade',
  'feature.scenarioDistribution': 'Distribuição dos cenários',
  'feature.slowestScenarios': 'Top 10 cenários mais lentos',
  'feature.slowestSteps': 'Top 10 passos mais lentos',
  'feature.stepStatusBreakdown': 'Detalhamento do status dos passos',
  'feature.stepsPerScenario': 'Passos por cenário',
  'feature.topTags': 'Top 10 etiquetas',
  'feature.scenarios': 'Cenários',
  'feature.searchPlaceholder': 'Buscar cenários...',
  'feature.noScenarioFound': 'Nenhum cenário encontrado',
  'feature.noScenarioFoundHint': 'Tente ajustar os filtros ou os termos da busca.',
  'feature.runningOnBrowserStack': 'Executando no BrowserStack',
  'feature.runningOnTestMu': 'Executando no TestMu AI',
  'feature.runningLocally': 'Executando localmente',
  'feature.nodePrefix': 'Node',
  'feature.reporterPrefix': 'Relatório',

  // ── Status filter buttons (rendered in capitals by design)
  'feature.filterAll': 'TODOS',
  'feature.filterPassed': 'APROVADO',
  'feature.filterFailed': 'FALHOU',
  'feature.filterAmbiguous': 'AMBÍGUO',
  'feature.filterNotDefined': 'NÃO DEFINIDO',
  'feature.filterPending': 'PENDENTE',
  'feature.filterSkipped': 'IGNORADO',

  // ── Scenario cards and attachments
  'scenario.description': 'Descrição',
  'scenario.attachments': 'Anexos',
  'scenario.showInfo': '+ Mostrar informações',
  'scenario.video': '+ Vídeo',
  'scenario.screenshot': '+ Captura de tela',
  'scenario.attachmentIndexed': '+ Anexo {0}',
  'scenario.recordingOf': 'Gravação de:',
  'scenario.previewNotAvailable': 'Pré-visualização não disponível.',
  'scenario.download': 'Baixar',
  'scenario.errorDetails': 'Detalhes do erro',
  'scenario.modalTitle': 'Anexo',
  'scenario.attachmentScreenshot': 'Captura de tela - {0}',
  'scenario.attachmentScreenshotListed': 'Captura de tela {0}',
  'scenario.attachmentLog': 'Log - {0}',
  'scenario.attachmentLogListed': 'Log {0}',
  'scenario.attachmentVideo': 'Vídeo',
  'scenario.attachmentVideoIndexed': 'Vídeo - {0}',
  'scenario.attachmentVideoListed': 'Vídeo {0}',
  'scenario.attachmentHtml': 'HTML - {0}',
  'scenario.attachmentHtmlListed': 'HTML {0}',
  'scenario.attachmentJson': 'JSON - {0}',
  'scenario.attachmentJsonListed': 'JSON {0}',
  'scenario.attachmentGeneric': 'Anexo - {0}',
  'scenario.attachmentGenericListed': 'Anexo {0}',

  // ── Attachment modal
  'modal.videoUnsupported': 'Seu navegador não suporta a tag de vídeo.',
  'modal.consoleLog': 'Log do console',
  'modal.copyLog': 'Copiar log',
  'modal.errorDetails': 'Detalhes do erro e rastreamento de pilha',
  'modal.copyError': 'Copiar erro',
  'modal.copied': 'Copiado!',

  // ── Charts
  'chart.features': 'Funcionalidades',
  'chart.scenarios': 'Cenários',
  'chart.steps': 'Passos',
  'chart.total': 'Total',
  'chart.duration': 'Duração',
  'chart.notAvailable': 'N/D',

  // ── Page chrome
  'meta.pageTitle': 'Relatório de testes Cucumber',
  'meta.reportName': 'Relatório Cucumber',
  'meta.reportSubtitle': 'Insights de execução automatizada',
  'meta.logoAlt': 'Logotipo',
  'meta.generatedBy': 'Gerado por',
  'meta.builtWith': 'Feito com ❤️ por',

  // `meta.reporterName`, `meta.authorName` and `table.browserStack` /
  // `table.testMu` are intentionally omitted: product and personal names are
  // not translated, so they fall through to English.
};
