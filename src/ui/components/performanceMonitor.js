/**
 * GitHub 中文翻译性能监控组件
 * @file performanceMonitor.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 性能监控区域组件
 */

/**
 * 创建性能监控区域
 * @returns {HTMLElement} 性能监控区域元素
 */
export function createPerformanceMonitoringSection() {
  const section = document.createElement('div');
  section.className = 'github-i18n-config-section';

  const sectionTitle = document.createElement('h4');
  sectionTitle.textContent = '性能监控';
  section.appendChild(sectionTitle);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'github-i18n-config-content';

  const statsContainer = document.createElement('div');
  statsContainer.id = 'github-i18n-performance-stats';

  const basicStats = [
    { label: '总耗时:', id: 'github-i18n-stat-duration' },
    { label: '元素处理:', id: 'github-i18n-stat-elements' },
    { label: '文本翻译:', id: 'github-i18n-stat-texts' },
    { label: '缓存命中率:', id: 'github-i18n-stat-cache-rate' },
  ];

  basicStats.forEach((stat) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'github-i18n-config-item';

    const label = document.createElement('span');
    label.className = 'github-i18n-config-label';
    label.textContent = stat.label;

    const value = document.createElement('span');
    value.id = stat.id;
    value.textContent = '-';

    itemDiv.appendChild(label);
    itemDiv.appendChild(value);
    statsContainer.appendChild(itemDiv);
  });

  const advancedStatsDiv = document.createElement('div');
  advancedStatsDiv.className = 'github-i18n-advanced-stats';

  const advancedStats = [
    { label: '缓存命中:', id: 'github-i18n-stat-cache-hits' },
    { label: '缓存未命中:', id: 'github-i18n-stat-cache-misses' },
    { label: 'DOM操作:', id: 'github-i18n-stat-dom' },
    { label: '网络请求:', id: 'github-i18n-stat-network' },
    { label: '批处理次数:', id: 'github-i18n-stat-batches' },
  ];

  advancedStats.forEach((stat) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'github-i18n-config-item';

    const label = document.createElement('span');
    label.className = 'github-i18n-config-label';
    label.textContent = stat.label;

    const value = document.createElement('span');
    value.id = stat.id;
    value.textContent = '-';

    itemDiv.appendChild(label);
    itemDiv.appendChild(value);
    advancedStatsDiv.appendChild(itemDiv);
  });

  statsContainer.appendChild(advancedStatsDiv);

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'github-i18n-config-actions';

  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'github-i18n-config-save';
  refreshBtn.id = 'github-i18n-refresh-stats';
  refreshBtn.textContent = '刷新性能数据';

  const exportBtn = document.createElement('button');
  exportBtn.className = 'github-i18n-config-reset';
  exportBtn.id = 'github-i18n-export-stats';
  exportBtn.textContent = '导出性能数据';

  actionsDiv.appendChild(refreshBtn);
  actionsDiv.appendChild(exportBtn);

  statsContainer.appendChild(actionsDiv);
  contentDiv.appendChild(statsContainer);
  section.appendChild(contentDiv);

  return section;
}

/**
 * 更新性能统计数据显示
 */
export function updatePerformanceStats() {
  if (window.isPageUnloading) return;

  if (window.translationCore && window.translationCore.getPerformanceStats) {
    const stats = window.translationCore.getPerformanceStats();

    const durationEl = document.getElementById('github-i18n-stat-duration');
    if (durationEl) durationEl.textContent = `${stats.totalDuration} ms`;

    const elementsEl = document.getElementById('github-i18n-stat-elements');
    if (elementsEl) elementsEl.textContent = stats.elementsProcessed;

    const textsEl = document.getElementById('github-i18n-stat-texts');
    if (textsEl) textsEl.textContent = stats.textsTranslated;

    const cacheRateEl = document.getElementById('github-i18n-stat-cache-rate');
    if (cacheRateEl) cacheRateEl.textContent = `${stats.cacheHitRate}%`;

    const cacheHitsEl = document.getElementById('github-i18n-stat-cache-hits');
    if (cacheHitsEl) cacheHitsEl.textContent = stats.cacheHits;

    const cacheMissesEl = document.getElementById('github-i18n-stat-cache-misses');
    if (cacheMissesEl) cacheMissesEl.textContent = stats.cacheMisses;

    const domOpsEl = document.getElementById('github-i18n-stat-dom');
    if (domOpsEl) domOpsEl.textContent = stats.domOperations;

    const networkEl = document.getElementById('github-i18n-stat-network');
    if (networkEl) networkEl.textContent = stats.networkRequests;

    const batchesEl = document.getElementById('github-i18n-stat-batches');
    if (batchesEl) batchesEl.textContent = stats.batchProcessings;
  }
}

/**
 * 导出性能数据
 * @returns {Object} 性能数据对象
 */
export function exportPerformanceStats() {
  if (window.translationCore && window.translationCore.getPerformanceStats) {
    const stats = window.translationCore.getPerformanceStats();
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.9.19',
      ...stats,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-i18n-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return exportData;
  }
  return null;
}
