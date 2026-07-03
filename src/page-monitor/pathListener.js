/**
 * 路径变化监听模块
 * @file pageMonitor/pathListener.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 监听URL路径变化
 */
import { CONFIG } from '../config.js';
import { utils } from '../utils/utils.js';
import { pageMonitorCache } from './cacheManager.js';

export const pathListener = {
  lastPath: '',
  onPathChange: null,
  originalPushState: null,
  originalReplaceState: null,
  popstateHandler: null,

  init(pathChangeCallback) {
    this.onPathChange = pathChangeCallback;
    this.lastPath = window.location.pathname + window.location.search;
    this.setupPathListener();
  },

  setupPathListener() {
    this.popstateHandler = utils.debounce(() => {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== this.lastPath) {
        this.handlePathChange();
      }
    }, CONFIG.routeChangeDelay || 500);

    // 仅通过 pageMonitorCache 注册一次，避免重复绑定
    pageMonitorCache.addEventListener({
      target: window,
      type: 'popstate',
      handler: this.popstateHandler,
    });

    // 保存原始引用，便于 cleanup 还原
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      pathListener.originalPushState.apply(this, args);
      pathListener.handlePathChange();
    };

    history.replaceState = function (...args) {
      pathListener.originalReplaceState.apply(this, args);
      pathListener.handlePathChange();
    };
  },

  /**
   * 还原 history 方法并清理，防止脚本卸载后仍触发翻译
   */
  cleanup() {
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
      this.originalPushState = null;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
      this.originalReplaceState = null;
    }
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
  },

  handlePathChange() {
    try {
      const currentPath = window.location.pathname + window.location.search;
      this.lastPath = currentPath;

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 页面路径变化: ${currentPath}`);
      }

      if (this.onPathChange) {
        setTimeout(() => {
          this.onPathChange();
        }, CONFIG.routeChangeDelay || 500);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 路径变化处理失败:', error);
    }
  },
};
