/**
 * GitHub 中文翻译配置界面样式模块
 * @file configUI.styles.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 配置界面的CSS样式定义
 */

/**
 * 获取配置界面的完整样式
 * @returns {string} CSS样式字符串
 */
export function getConfigUIStyles() {
  return `
    .github-i18n-config-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
    }

    .github-i18n-config-panel {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }

    .github-i18n-config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background-color: #f6f8fa;
      border-bottom: 1px solid #e1e4e8;
    }

    .github-i18n-config-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #24292e;
    }

    .github-i18n-config-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #586069;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .github-i18n-config-close:hover {
      background-color: #e1e4e8;
    }

    .github-i18n-config-content {
      padding: 20px;
      max-height: calc(80vh - 120px);
      overflow-y: auto;
    }

    .github-i18n-config-section {
      margin-bottom: 24px;
    }

    .github-i18n-config-section h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #24292e;
    }

    .github-i18n-config-item {
      margin-bottom: 12px;
    }

    .github-i18n-config-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #24292e;
    }

    .github-i18n-config-label input[type="checkbox"] {
      margin-right: 8px;
    }

    .github-i18n-config-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      background-color: #f6f8fa;
      border-top: 1px solid #e1e4e8;
    }

    .github-i18n-config-footer button {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
    }

    .github-i18n-config-reset {
      background-color: #f6f8fa;
      color: #24292e;
      border-color: #e1e4e8;
    }

    .github-i18n-config-reset:hover {
      background-color: #e1e4e8;
    }

    .github-i18n-config-save {
      background-color: #2ea44f;
      color: white;
      border-color: #2ea44f;
    }

    .github-i18n-config-save:hover {
      background-color: #2c974b;
    }

    /* GitHub 风格按钮 */
    .github-i18n-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #24292e !important;
      color: white !important;
      border: 2px solid #30363d !important;
      border-radius: 50% !important;
      width: 56px !important;
      height: 56px !important;
      font-size: 16px !important;
      font-weight: bold !important;
      cursor: pointer !important;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }

    .github-i18n-toggle-btn:hover {
      background-color: #30363d !important;
      transform: scale(1.1) !important;
    }

    .github-i18n-toggle-btn:active {
      transform: scale(0.95) !important;
    }
  `;
}

/**
 * 将样式添加到页面
 */
export function addConfigUIStyles() {
  const style = document.createElement('style');
  style.textContent = getConfigUIStyles();
  document.head.appendChild(style);
}
