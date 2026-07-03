/**
 * 版本存储模块
 * @file versionStorage.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 版本检查相关的本地存储读写（历史记录、缓存版本、通知状态）
 */
import { CONFIG } from './config.js';
import { utils } from './utils/utils.js';

const versionStorage = {
  /**
   * 记录版本历史
   * @param {string} version - 版本号
   */
  recordVersionHistory(version) {
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

      // 限制历史记录数量
      if (history.length > 10) {
        history = history.slice(-10);
      }

      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (_error) {
      // 忽略存储错误
    }
  },

  /**
   * 更新本地存储中的版本号
   * @param {string} newVersion - 新版本号
   */
  updateVersionInStorage(newVersion) {
    try {
      const cacheData = {
        version: newVersion,
        cachedAt: Date.now(),
        currentVersion: CONFIG.version,
      };

      localStorage.setItem('githubZhCachedVersion', utils.safeJSONStringify(cacheData));

      if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 已缓存新版本号: ${newVersion} (缓存时间: ${new Date().toLocaleString()})`,
        );
      }

      return true;
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 更新缓存版本号时出错:', error);
      }
      return false;
    }
  },

  /**
   * 获取缓存的版本信息
   * @returns {Object|null} 缓存的版本数据
   */
  getCachedVersion() {
    try {
      return utils.safeJSONParse(localStorage.getItem('githubZhCachedVersion'));
    } catch (_error) {
      return null;
    }
  },

  /**
   * 清除更新通知的忽略状态
   * 允许再次显示更新通知
   */
  clearNotificationDismissal() {
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
  },
};

export { versionStorage };
