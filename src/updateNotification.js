/**
 * 更新通知模块
 * @file updateNotification.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 更新通知 UI 相关功能
 */
import { CONFIG } from './config.js';
import { utils } from './utils/utils.js';

const NOTIFICATION_AUTO_HIDE_MS = 20000;
const NOTIFICATION_ANIMATION_MS = 300;
const MAX_HISTORY_LENGTH = 10;

/**
 * 显示更新通知
 * @param {string} newVersion - 新版本号
 */
function showUpdateNotification(newVersion) {
  const notificationKey = 'githubZhUpdateNotificationDismissed';
  const notificationVersionKey = 'githubZhLastNotifiedVersion';

  const lastNotifiedVersion = localStorage.getItem(notificationVersionKey);

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
    const notification = document.createElement('div');
    notification.className =
      'fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-md transform transition-all duration-300 translate-y-0 opacity-100';

    const notificationId = `github-zh-update-${Date.now()}`;
    notification.id = notificationId;

    const flexContainer = document.createElement('div');
    flexContainer.className = 'flex items-start';
    notification.appendChild(flexContainer);

    const iconContainer = document.createElement('div');
    iconContainer.className = 'flex-shrink-0 bg-blue-100 rounded-full p-2';
    flexContainer.appendChild(iconContainer);

    const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgIcon.setAttribute('class', 'h-6 w-6 text-blue-600');
    svgIcon.setAttribute('fill', 'none');
    svgIcon.setAttribute('viewBox', '0 0 24 24');
    svgIcon.setAttribute('stroke', 'currentColor');
    iconContainer.appendChild(svgIcon);

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('stroke-linecap', 'round');
    pathElement.setAttribute('stroke-linejoin', 'round');
    pathElement.setAttribute('stroke-width', '2');
    pathElement.setAttribute(
      'd',
      'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    );
    svgIcon.appendChild(pathElement);

    const contentContainer = document.createElement('div');
    contentContainer.className = 'ml-3 flex-1';
    flexContainer.appendChild(contentContainer);

    const titleElement = document.createElement('p');
    titleElement.className = 'text-sm font-medium text-blue-800';
    titleElement.textContent = 'GitHub 中文翻译脚本更新';
    contentContainer.appendChild(titleElement);

    const messageElement = document.createElement('p');
    messageElement.className = 'text-sm text-blue-700 mt-1';
    messageElement.textContent = `发现新版本 ${newVersion}，建议更新以获得更好的翻译体验。`;
    contentContainer.appendChild(messageElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'mt-3 flex space-x-2';
    contentContainer.appendChild(buttonsContainer);

    const updateButton = document.createElement('a');
    updateButton.id = `${notificationId}-update-btn`;
    updateButton.href = CONFIG.updateCheck.scriptUrl || '#';
    updateButton.target = '_blank';
    updateButton.rel = 'noopener noreferrer';
    updateButton.className =
      'inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors';
    updateButton.textContent = '立即更新';
    buttonsContainer.appendChild(updateButton);

    const laterButton = document.createElement('button');
    laterButton.id = `${notificationId}-later-btn`;
    laterButton.className =
      'inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-transparent hover:bg-blue-50 transition-colors';
    laterButton.textContent = '稍后';
    laterButton.addEventListener('click', () => {
      hideNotification(notification, false);
    });
    buttonsContainer.appendChild(laterButton);

    const dismissButton = document.createElement('button');
    dismissButton.id = `${notificationId}-dismiss-btn`;
    dismissButton.className =
      'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors';
    dismissButton.textContent = '不再提醒';
    dismissButton.addEventListener('click', () => {
      hideNotification(notification, true);
    });
    buttonsContainer.appendChild(dismissButton);

    if (document.body) {
      document.body.appendChild(notification);

      localStorage.setItem(notificationVersionKey, newVersion);

      if (CONFIG.updateCheck.autoHideNotification !== false) {
        setTimeout(() => {
          hideNotification(notification, false);
        }, NOTIFICATION_AUTO_HIDE_MS);
      }

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 显示更新通知: 版本 ${newVersion}`);
      }
    }
  } catch (error) {
    console.error('[GitHub 中文翻译] 创建更新通知失败:', error);
  }
}

/**
 * 隐藏通知元素（带动画效果）
 * @param {HTMLElement} notification - 通知元素
 * @param {boolean} permanently - 是否永久隐藏
 */
function hideNotification(notification, permanently = false) {
  try {
    notification.style.transform = 'translateY(20px)';
    notification.style.opacity = '0';

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, NOTIFICATION_ANIMATION_MS);

    if (permanently) {
      localStorage.setItem('githubZhUpdateNotificationDismissed', 'dismissed');
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 更新通知已永久隐藏');
      }
    }
  } catch (error) {
    console.error('[GitHub 中文翻译] 隐藏通知失败:', error);
  }
}

/**
 * 记录版本历史
 * @param {string} version - 版本号
 */
function recordVersionHistory(version) {
  try {
    const historyKey = 'githubZhVersionHistory';
    let history = utils.safeJSONParse(localStorage.getItem(historyKey), []);

    if (!Array.isArray(history)) {
      history = [];
    }

    history.push({
      version,
      detectedAt: Date.now(),
    });

    if (history.length > MAX_HISTORY_LENGTH) {
      history = history.slice(-MAX_HISTORY_LENGTH);
    }

    localStorage.setItem(historyKey, JSON.stringify(history));
  } catch (_error) {
    // 忽略存储错误
  }
}

/**
 * 清除更新通知的忽略状态
 * @returns {boolean} 是否成功
 */
function clearNotificationDismissal() {
  try {
    localStorage.removeItem('githubZhUpdateNotificationDismissed');
    localStorage.removeItem('githubZhLastNotifiedVersion');

    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 已清除更新通知忽略状态');
    }

    return true;
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 清除通知忽略状态失败:', error);
    }
    return false;
  }
}

export {
  showUpdateNotification,
  hideNotification,
  recordVersionHistory,
  clearNotificationDismissal,
};
