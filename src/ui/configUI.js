/**
 * GitHub 中文翻译配置界面模块
 * @file configUI.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 提供用户友好的配置界面，允许用户调整插件参数
 */

import { CONFIG } from '../config.js';
import { utils } from '../utils/utils.js';
import { addConfigUIStyles } from './styles/configUI.styles.js';
import {
  createPerformanceMonitoringSection,
  updatePerformanceStats,
  exportPerformanceStats,
} from './components/performanceMonitor.js';

// 配置存储键名
const CONFIG_STORAGE_KEY = 'github-i18n-config';

class ConfigUI {
  constructor() {
    this.config = CONFIG;
    this.userConfig = {};
    this.isOpen = false;
    this.container = null;
    this.settings = this.loadUserSettings();
    this.isPageUnloading = false;
    this.eventListeners = [];

    this.setupPageUnloadHandler();
  }

  static loadUserSettings() {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!saved) return {};

      // 尝试解码混淆的数据
      const decoded = utils.deobfuscateData(saved);
      if (decoded) {
        return JSON.parse(decoded);
      }

      // 如果解码失败，尝试直接解析（兼容旧格式）
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 加载用户配置失败:', utils.sanitizeErrorMessage(error));
      }
      return {};
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
    this.container = null;
  }

  saveUserSettings(settings) {
    try {
      const jsonData = JSON.stringify(settings);
      // 混淆存储配置数据，防止恶意脚本或扩展读取
      const obfuscatedData = utils.obfuscateData(jsonData);
      localStorage.setItem(CONFIG_STORAGE_KEY, obfuscatedData);
      this.userConfig = { ...settings };
      this.mergeUserConfig();
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 保存用户配置失败:', utils.sanitizeErrorMessage(error));
      }
    }
  }

  mergeUserConfig() {
    const merge = (target, source) => {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
          } else {
            target[key] = source[key];
          }
        }
      }
      return target;
    };

    merge(CONFIG, this.userConfig);
  }

  createUI() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'github-i18n-config-container';

    const configPanel = document.createElement('div');
    configPanel.className = 'github-i18n-config-panel';

    const header = this.createHeader();
    const content = this.createContent();
    const footer = this.createFooter();

    configPanel.appendChild(header);
    configPanel.appendChild(content);
    configPanel.appendChild(footer);

    this.container.appendChild(configPanel);

    addConfigUIStyles();
    this.addEventListeners();
  }

  static createHeader() {
    const header = document.createElement('div');
    header.className = 'github-i18n-config-header';

    const title = document.createElement('h3');
    title.textContent = 'GitHub 中文翻译配置';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'github-i18n-config-close';
    closeBtn.textContent = '×';

    header.appendChild(title);
    header.appendChild(closeBtn);

    return header;
  }

  createContent() {
    const content = document.createElement('div');
    content.className = 'github-i18n-config-content';

    const basicSection = this.createConfigSection('基本设置', [
      {
        type: 'checkbox',
        id: 'github-i18n-debug-mode',
        label: '启用调试模式',
        checked: this.config.debugMode,
      },
      {
        type: 'checkbox',
        id: 'github-i18n-enable-partial-match',
        label: '启用部分匹配',
        checked: this.config.performance.enablePartialMatch,
      },
    ]);

    const updateSection = this.createConfigSection('更新设置', [
      {
        type: 'checkbox',
        id: 'github-i18n-auto-update',
        label: '自动检查更新',
        checked: this.config.updateCheck.enabled,
      },
    ]);

    const performanceSection = this.createConfigSection('性能设置', [
      {
        type: 'checkbox',
        id: 'github-i18n-translation-cache',
        label: '启用翻译缓存',
        checked: this.config.performance.enableTranslationCache,
      },
      {
        type: 'checkbox',
        id: 'github-i18n-virtual-dom',
        label: '启用虚拟DOM优化',
        checked: this.config.performance.enableVirtualDom,
      },
    ]);

    const monitoringSection = createPerformanceMonitoringSection();

    content.appendChild(basicSection);
    content.appendChild(updateSection);
    content.appendChild(performanceSection);
    content.appendChild(monitoringSection);

    return content;
  }

  static createFooter() {
    const footer = document.createElement('div');
    footer.className = 'github-i18n-config-footer';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'github-i18n-config-reset';
    resetBtn.textContent = '重置默认';

    const saveBtn = document.createElement('button');
    saveBtn.className = 'github-i18n-config-save';
    saveBtn.textContent = '保存配置';

    footer.appendChild(resetBtn);
    footer.appendChild(saveBtn);

    return footer;
  }

  static createConfigSection(title, items) {
    const section = document.createElement('div');
    section.className = 'github-i18n-config-section';

    const sectionTitle = document.createElement('h4');
    sectionTitle.textContent = title;
    section.appendChild(sectionTitle);

    items.forEach((item) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'github-i18n-config-item';

      const label = document.createElement('label');
      label.className = 'github-i18n-config-label';

      const input = document.createElement('input');
      input.type = item.type;
      input.id = item.id;
      if (item.checked !== undefined) {
        input.checked = item.checked;
      }

      const textNode = document.createTextNode(item.label);

      label.appendChild(input);
      label.appendChild(textNode);
      itemDiv.appendChild(label);
      section.appendChild(itemDiv);
    });

    return section;
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

  addEventListeners() {
    if (!this.container) return;

    const closeBtn = this.container.querySelector('.github-i18n-config-close');
    const saveBtn = this.container.querySelector('.github-i18n-config-save');
    const resetBtn = this.container.querySelector('.github-i18n-config-reset');
    const refreshBtn = this.container.querySelector('#github-i18n-refresh-stats');
    const exportBtn = this.container.querySelector('#github-i18n-export-stats');

    const handleClose = () => this.hide();
    const handleSave = () => this.handleSave();
    const handleReset = () => this.handleReset();
    const handleRefresh = () => updatePerformanceStats();
    const handleExport = () => exportPerformanceStats();
    const handleContainerClick = (e) => {
      if (e.target === this.container) {
        this.hide();
      }
    };

    closeBtn?.addEventListener('click', handleClose);
    saveBtn?.addEventListener('click', handleSave);
    resetBtn?.addEventListener('click', handleReset);
    refreshBtn?.addEventListener('click', handleRefresh);
    exportBtn?.addEventListener('click', handleExport);
    this.container?.addEventListener('click', handleContainerClick);

    this.eventListeners.push(
      { element: closeBtn, event: 'click', handler: handleClose },
      { element: saveBtn, event: 'click', handler: handleSave },
      { element: resetBtn, event: 'click', handler: handleReset },
      { element: refreshBtn, event: 'click', handler: handleRefresh },
      { element: exportBtn, event: 'click', handler: handleExport },
      { element: this.container, event: 'click', handler: handleContainerClick },
    );
  }

  cleanupEventListeners() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element?.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }

  handleSave() {
    const newSettings = {
      debugMode: document.getElementById('github-i18n-debug-mode')?.checked || false,
      enablePartialMatch:
        document.getElementById('github-i18n-enable-partial-match')?.checked || false,
      autoUpdate: document.getElementById('github-i18n-auto-update')?.checked || false,
      enableTranslationCache:
        document.getElementById('github-i18n-translation-cache')?.checked || false,
      enableVirtualDom: document.getElementById('github-i18n-virtual-dom')?.checked || false,
    };

    this.saveUserSettings(newSettings);
    this.hide();
  }

  handleReset() {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    this.userConfig = {};
    this.settings = {};
    this.hide();
  }
}

export { ConfigUI };
