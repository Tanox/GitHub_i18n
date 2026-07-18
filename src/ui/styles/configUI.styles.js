/**
 * GitHub 中文翻译配置界面样式模块
 * @file configUI.styles.js
 * @version 1.9.21
 * @date 2026-06-10
 * @author Sut
 * @description 配置界面的CSS样式定义，遵循原型设计系统的深色主题规范
 */

/**
 * 获取配置界面的完整样式
 * @returns {string} CSS样式字符串
 */
export function getConfigUIStyles() {
  return `
    /* ========== 配置面板容器 ========== */
    .github-i18n-config-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.55);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2147483200;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
        "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
        sans-serif;
    }

    /* ========== 配置面板主体 ========== */
    .github-i18n-config-panel {
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 12px;
      width: 560px;
      max-width: 90%;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
    }

    /* ========== 面板头部 ========== */
    .github-i18n-config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background-color: #0d1117;
      border-bottom: 1px solid #21262d;
    }

    .github-i18n-config-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #e6edf3;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .github-i18n-config-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #8b949e;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.12s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .github-i18n-config-close:hover {
      background-color: #21262d;
      color: #e6edf3;
    }

    /* ========== 面板内容区 ========== */
    .github-i18n-config-content {
      padding: 24px;
      max-height: calc(80vh - 120px);
      overflow-y: auto;
      display: grid;
      gap: 20px;
    }

    /* 滚动条样式 */
    .github-i18n-config-content::-webkit-scrollbar {
      width: 8px;
    }
    .github-i18n-config-content::-webkit-scrollbar-track {
      background: #010409;
    }
    .github-i18n-config-content::-webkit-scrollbar-thumb {
      background: #30363d;
      border-radius: 4px;
    }
    .github-i18n-config-content::-webkit-scrollbar-thumb:hover {
      background: #484f58;
    }

    /* ========== 配置分组 ========== */
    .github-i18n-config-section {
      background-color: #0d1117;
      border: 1px solid #21262d;
      border-radius: 8px;
      padding: 16px;
    }

    .github-i18n-config-section h4 {
      margin: 0 0 12px 0;
      font-size: 15px;
      font-weight: 600;
      color: #e6edf3;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ========== 配置项行 ========== */
    .github-i18n-config-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dashed #21262d;
    }

    .github-i18n-config-item:last-child {
      border-bottom: none;
    }

    .github-i18n-config-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 14px;
      color: #e6edf3;
      gap: 8px;
      flex: 1;
    }

    .github-i18n-config-label input[type="checkbox"] {
      margin: 0;
      accent-color: #2ea44f;
      width: 16px;
      height: 16px;
    }

    /* ========== 配置项提示文字 ========== */
    .github-i18n-config-hint {
      font-size: 12px;
      color: #6e7681;
      margin-top: 2px;
    }

    /* ========== 面板底部 ========== */
    .github-i18n-config-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background-color: #0d1117;
      border-top: 1px solid #21262d;
    }

    .github-i18n-config-footer .github-i18n-config-footer-right {
      display: flex;
      gap: 8px;
    }

    .github-i18n-config-footer button {
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.12s cubic-bezier(0.22, 1, 0.36, 1);
      font-family: inherit;
    }

    .github-i18n-config-reset {
      background-color: transparent;
      color: #8b949e;
      border-color: transparent;
    }

    .github-i18n-config-reset:hover {
      background-color: #21262d;
      color: #e6edf3;
    }

    .github-i18n-config-cancel {
      background-color: transparent;
      color: #8b949e;
      border-color: transparent;
    }

    .github-i18n-config-cancel:hover {
      background-color: #21262d;
      color: #e6edf3;
    }

    .github-i18n-config-save {
      background-color: #2ea44f;
      color: #ffffff;
      border-color: rgba(240, 246, 252, 0.1);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 1px 2px rgba(0, 0, 0, 0.25);
    }

    .github-i18n-config-save:hover {
      background-color: #2c974b;
    }

    .github-i18n-config-save:active {
      background-color: #298e46;
      transform: translateY(1px);
    }

    /* ========== 浮动设置按钮 ========== */
    .github-i18n-toggle-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #2ea44f !important;
      color: #ffffff !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 50% !important;
      width: 56px !important;
      height: 56px !important;
      font-size: 22px !important;
      cursor: pointer !important;
      box-shadow: 0 6px 18px rgba(46, 160, 67, 0.22), 0 2px 6px rgba(0, 0, 0, 0.35) !important;
      z-index: 2147483000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 0.2s cubic-bezier(0.22, 1, 0.36, 1) !important;
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
    }

    .github-i18n-toggle-btn:hover {
      background-color: #2c974b !important;
      transform: translateY(-2px) scale(1.05) !important;
      box-shadow: 0 10px 28px rgba(46, 160, 67, 0.3),
        0 4px 12px rgba(0, 0, 0, 0.35) !important;
    }

    .github-i18n-toggle-btn:active {
      transform: translateY(1px) scale(0.98) !important;
    }

    /* ========== 性能监控网格 ========== */
    .github-i18n-perf-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 8px;
    }

    .github-i18n-perf-stat {
      background-color: #010409;
      border: 1px solid #21262d;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: left;
    }

    .github-i18n-perf-stat .k {
      font-family: "JetBrains Mono", "SF Mono", SFMono-Regular, Menlo, Consolas,
        "Courier New", monospace;
      font-size: 11px;
      color: #6e7681;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .github-i18n-perf-stat .v {
      font-size: 20px;
      font-weight: 600;
      color: #3fb950;
      margin-top: 4px;
    }

    /* ========== 高级统计区 ========== */
    .github-i18n-advanced-stats {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #21262d;
    }

    /* ========== 操作按钮区 ========== */
    .github-i18n-config-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px dashed #21262d;
    }

    .github-i18n-config-actions button {
      flex: 1;
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid #30363d;
      background-color: #161b22;
      color: #e6edf3;
      transition: all 0.12s cubic-bezier(0.22, 1, 0.36, 1);
      font-family: inherit;
    }

    .github-i18n-config-actions button:hover {
      background-color: #21262d;
      border-color: #484f58;
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
