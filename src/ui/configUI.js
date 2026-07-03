/**
 * GitHub 中文翻译配置界面模块
 * @file configUI.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 提供用户友好的配置界面，允许用户调整插件参数
 */

import { CONFIG } from '../config.js';
import { addConfigUIStyles } from './styles/configUI.styles.js';
import { updatePerformanceStats } from './components/performanceMonitor.js';
import { createConfigUI, createConfigHeader, createConfigContent, createConfigFooter, createConfigSection } from './configPanelRenderer.js';
import { addConfigPanelEventListeners, cleanupConfigPanelEventListeners } from './configPanelEvents.js';
import { loadUserSettings, saveUserSettings, mergeUserConfig, handleSave, handleReset } from './configManager.js';

class ConfigUI {
  constructor() {
    this.config = CONFIG;
    this.userConfig = {};
    this.isOpen = false;
    this.container = null;
    this.floatingButton = null;
    this.settings = this.loadUserSettings();
    this.isPageUnloading = false;
    this.eventListeners = [];
    this.initialized = false;

    this.setupPageUnloadHandler();
  }

  /**
   * 初始化配置界面
   * 合并用户配置、创建浮动按钮、注册 Tampermonkey 菜单命令
   */
  init() {
    if (this.initialized) return;
    this.mergeUserConfig();
    this.createFloatingButton();
    this.registerMenuCommands();
    this.initialized = true;

    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 配置界面已初始化');
    }
  }

  /**
   * 创建右下角浮动设置按钮（对齐 prototype.md 规范）
   */
  createFloatingButton() {
    if (this.floatingButton) return;

    const btn = document.createElement('button');
    btn.className = 'github-i18n-floating-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'GitHub 中文翻译设置');
    btn.textContent = '⚙';

    btn.addEventListener('click', () => {
      this.toggle();
    });

    addConfigUIStyles();

    if (document.body) {
      document.body.appendChild(btn);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(btn);
      });
    }

    this.floatingButton = btn;
  }

  /**
   * 注册 Tampermonkey 菜单命令（对齐 prototype.md 规范）
   */
  registerMenuCommands() {
    if (typeof GM_registerMenuCommand === 'function') {
      try {
        GM_registerMenuCommand('⚙ 打开 GitHub 中文翻译设置', () => this.show());
        GM_registerMenuCommand('🔄 立即翻译当前页面', () => {
          if (typeof window !== 'undefined' && window.translationCore) {
            window.translationCore.translate();
          }
        });
      } catch (_error) {
        // 非 GM 环境下静默忽略
      }
    }
  }

  loadUserSettings() {
    return loadUserSettings();
  }

  saveUserSettings(settings) {
    saveUserSettings(this, settings);
  }

  mergeUserConfig() {
    mergeUserConfig(this);
  }

  createUI() {
    createConfigUI(this);
  }

  createHeader() {
    return createConfigHeader();
  }

  createContent() {
    return createConfigContent(this);
  }

  createFooter() {
    return createConfigFooter();
  }

  createConfigSection(title, items) {
    return createConfigSection(title, items);
  }

  addEventListeners() {
    addConfigPanelEventListeners(this);
  }

  cleanupEventListeners() {
    cleanupConfigPanelEventListeners(this);
  }

  show() {
    if (!this.container) {
      this.createUI();
    }

    document.body.appendChild(this.container);
    this.isOpen = true;

    setTimeout(() => {
      updatePerformanceStats();
    }, 100);
  }

  hide() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.isOpen = false;
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  setupPageUnloadHandler() {
    const handlePageUnload = () => {
      this.isPageUnloading = true;
      this.cleanup();
    };

    window.addEventListener('beforeunload', handlePageUnload, { once: true });
    window.addEventListener('unload', handlePageUnload, { once: true });
  }

  cleanup() {
    this.hide();
    this.cleanupEventListeners();
    if (this.floatingButton && this.floatingButton.parentNode) {
      this.floatingButton.parentNode.removeChild(this.floatingButton);
    }
    this.floatingButton = null;
    this.container = null;
    this.initialized = false;
  }

  handleSave() {
    handleSave(this);
  }

  handleReset() {
    handleReset(this);
  }
}

// 创建单例实例，供 main.js 直接导入使用
const configUI = new ConfigUI();

export { ConfigUI, configUI };
export default configUI;
