/**
 * 更新通知 UI 模块
 * @file updateNotification.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 负责渲染和隐藏脚本更新通知（安全 DOM 操作，不使用 innerHTML）
 */
import { CONFIG } from './config.js';

const updateNotification = {
  /**
   * 显示更新通知
   * @param {string} newVersion - 新版本号
   */
  showUpdateNotification(newVersion) {
    const notificationKey = 'githubZhUpdateNotificationDismissed';
    const notificationVersionKey = 'githubZhLastNotifiedVersion';

    const lastNotifiedVersion = localStorage.getItem(notificationVersionKey);

    // 已关闭通知或已通知过相同版本，则不显示
    if (
      localStorage.getItem(notificationKey) === 'dismissed' ||
      lastNotifiedVersion === newVersion
    ) {
      if (CONFIG.debugMode && lastNotifiedVersion === newVersion) {
        console.log(`[GitHub 中文翻译] 已经通知过版本 ${newVersion} 的更新`);
      }
      return;
    }

    try {
      const notification = this.buildNotificationElement(newVersion, notificationId());
      if (!document.body) {
        return;
      }

      document.body.appendChild(notification);
      localStorage.setItem(notificationVersionKey, newVersion);

      if (CONFIG.updateCheck.autoHideNotification !== false) {
        setTimeout(() => {
          this.hideNotification(notification, false);
        }, 20000);
      }

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 显示更新通知: 版本 ${newVersion}`);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 创建更新通知失败:', error);
    }
  },

  // 构建通知元素（含图标、文案、按钮）
  buildNotificationElement(newVersion, notificationId) {
    const notification = document.createElement('div');
    notification.className =
      'fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-md transform transition-all duration-300 translate-y-0 opacity-100';
    notification.id = notificationId;

    const flex = document.createElement('div');
    flex.className = 'flex items-start';
    notification.appendChild(flex);

    flex.appendChild(this.buildIcon());
    flex.appendChild(this.buildContent(newVersion, notificationId));

    return notification;
  },

  // 构建图标容器与 SVG
  buildIcon() {
    const iconContainer = document.createElement('div');
    iconContainer.className = 'flex-shrink-0 bg-blue-100 rounded-full p-2';

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('class', 'h-6 w-6 text-blue-600');
    svgIcon.setAttribute('fill', 'none');
    svgIcon.setAttribute('viewBox', '0 0 24 24');
    svgIcon.setAttribute('stroke', 'currentColor');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('d', 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
    svgIcon.appendChild(path);
    iconContainer.appendChild(svgIcon);

    return iconContainer;
  },

  // 构建文案与按钮区
  buildContent(newVersion, notificationId) {
    const container = document.createElement('div');
    container.className = 'ml-3 flex-1';

    const title = document.createElement('p');
    title.className = 'text-sm font-medium text-blue-800';
    title.textContent = 'GitHub 中文翻译脚本更新';
    container.appendChild(title);

    const message = document.createElement('p');
    message.className = 'text-sm text-blue-700 mt-1';
    message.textContent = `发现新版本 ${newVersion}，建议更新以获得更好的翻译体验。`;
    container.appendChild(message);

    const buttons = document.createElement('div');
    buttons.className = 'mt-3 flex space-x-2';
    buttons.appendChild(this.buildUpdateButton(notificationId));
    buttons.appendChild(this.buildLaterButton());
    buttons.appendChild(this.buildDismissButton());
    container.appendChild(buttons);

    return container;
  },

  // 构建立即更新按钮
  buildUpdateButton(notificationId) {
    const btn = document.createElement('a');
    btn.id = `${notificationId}-update-btn`;
    btn.href = CONFIG.updateCheck.scriptUrl || '#';
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className =
      'inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors';
    btn.textContent = '立即更新';
    return btn;
  },

  // 构建"稍后"按钮
  buildLaterButton() {
    const btn = document.createElement('button');
    btn.className =
      'inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-transparent hover:bg-blue-50 transition-colors';
    btn.textContent = '稍后';
    btn.addEventListener('click', () => {
      this.hideNotification(btn.closest('div.fixed'), false);
    });
    return btn;
  },

  // 构建"不再提醒"按钮
  buildDismissButton() {
    const btn = document.createElement('button');
    btn.className =
      'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors';
    btn.textContent = '不再提醒';
    btn.addEventListener('click', () => {
      this.hideNotification(btn.closest('div.fixed'), true);
    });
    return btn;
  },

  /**
   * 隐藏通知元素（带动画效果）
   * @param {HTMLElement} notification - 通知元素
   * @param {boolean} permanently - 是否永久隐藏
   */
  hideNotification(notification, permanently = false) {
    if (!notification) {
      return;
    }
    try {
      notification.style.transform = 'translateY(20px)';
      notification.style.opacity = '0';

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);

      if (permanently) {
        localStorage.setItem('githubZhUpdateNotificationDismissed', 'dismissed');
        if (CONFIG.debugMode) {
          console.log('[GitHub 中文翻译] 更新通知已永久隐藏');
        }
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 隐藏通知失败:', error);
    }
  },
};

// 生成唯一通知 ID
function notificationId() {
  return `github-zh-update-${Date.now()}`;
}

export { updateNotification };
