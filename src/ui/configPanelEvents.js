/**
 * GitHub 中文翻译配置面板事件模块
 * @file configPanelEvents.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责配置面板的事件绑定与清理
 */

import { updatePerformanceStats, exportPerformanceStats } from './components/performanceMonitor.js';

/** 为配置面板绑定关闭/保存/重置/取消/刷新/导出/容器点击事件 */
export function addConfigPanelEventListeners(instance) {
  if (!instance.container) return;

  const closeBtn = instance.container.querySelector('.github-i18n-config-close');
  const saveBtn = instance.container.querySelector('.github-i18n-config-save');
  const resetBtn = instance.container.querySelector('.github-i18n-config-reset');
  const cancelBtn = instance.container.querySelector('.github-i18n-config-cancel');
  const refreshBtn = instance.container.querySelector('#github-i18n-refresh-stats');
  const exportBtn = instance.container.querySelector('#github-i18n-export-stats');

  const handleClose = () => instance.hide();
  const handleSaveClick = () => instance.handleSave();
  const handleResetClick = () => instance.handleReset();
  const handleRefresh = () => updatePerformanceStats();
  const handleExport = () => exportPerformanceStats();
  const handleContainerClick = (e) => {
    if (e.target === instance.container) {
      instance.hide();
    }
  };

  closeBtn?.addEventListener('click', handleClose);
  saveBtn?.addEventListener('click', handleSaveClick);
  resetBtn?.addEventListener('click', handleResetClick);
  cancelBtn?.addEventListener('click', handleClose);
  refreshBtn?.addEventListener('click', handleRefresh);
  exportBtn?.addEventListener('click', handleExport);
  instance.container?.addEventListener('click', handleContainerClick);

  instance.eventListeners.push(
    { element: closeBtn, event: 'click', handler: handleClose },
    { element: saveBtn, event: 'click', handler: handleSaveClick },
    { element: resetBtn, event: 'click', handler: handleResetClick },
    { element: cancelBtn, event: 'click', handler: handleClose },
    { element: refreshBtn, event: 'click', handler: handleRefresh },
    { element: exportBtn, event: 'click', handler: handleExport },
    { element: instance.container, event: 'click', handler: handleContainerClick },
  );
}

/** 清理已绑定的事件监听器 */
export function cleanupConfigPanelEventListeners(instance) {
  instance.eventListeners.forEach(({ element, event, handler }) => {
    element?.removeEventListener(event, handler);
  });
  instance.eventListeners = [];
}
