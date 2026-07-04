/**
 * 版本更新检查模块
 * @file versionChecker.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责检查和处理脚本更新，UI 与存储委托给独立模块
 */
import { CONFIG } from './config.js';
import { utils } from './utils/utils.js';
import { updateNotification } from './updateNotification.js';
import { versionStorage } from './versionStorage.js';

/**
 * 远程脚本的已知哈希值（用于完整性验证）
 * 在发布新版本时通过 collect-dict.cjs 或手动计算 SHA-256 后填入。
 * 留空对象表示跳过完整性校验（仅发出未验证警告）。
 */
const KNOWN_SCRIPT_HASHES = {};

/**
 * 版本检查器对象
 */
const versionChecker = {
  /**
   * 检查版本更新
   * 支持重试机制和更详细的错误处理
   * @returns {Promise<boolean>} 检查完成的Promise，resolve为是否发现更新
   */
  async checkForUpdates() {
    if (!CONFIG.updateCheck.enabled) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 已禁用更新检查');
      }
      return false;
    }

    // 检查是否达到检查间隔
    const lastCheck = localStorage.getItem('githubZhLastUpdateCheck');
    const now = Date.now();
    const intervalMs = (CONFIG.updateCheck.intervalHours || 24) * 60 * 60 * 1000;

    if (lastCheck && now - parseInt(lastCheck) < intervalMs) {
      if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 未达到更新检查间隔，跳过检查 (上次检查: ${new Date(parseInt(lastCheck)).toLocaleString()})`,
        );
      }
      return false;
    }

    try {
      localStorage.setItem('githubZhLastUpdateCheck', now.toString());

      const scriptContent = await this.fetchWithRetry(CONFIG.updateCheck.scriptUrl);
      const remoteVersion = this.extractVersion(scriptContent);

      if (!remoteVersion) {
        throw new Error('无法从远程脚本提取有效的版本号');
      }

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 当前版本: ${CONFIG.version}, 远程版本: ${remoteVersion}`);
      }

      if (this.isNewerVersion(remoteVersion, CONFIG.version)) {
        this.showUpdateNotification(remoteVersion);

        if (CONFIG.updateCheck.autoUpdateVersion) {
          this.updateVersionInStorage(remoteVersion);
        }

        this.recordVersionHistory(remoteVersion);
        return true;
      }

      return false;
    } catch (error) {
      const sanitizedError = utils.sanitizeErrorMessage(error);
      const errorMsg = `[GitHub 中文翻译] 检查更新时发生错误: ${sanitizedError}`;
      if (CONFIG.debugMode) {
        console.error(errorMsg);
      }

      try {
        localStorage.setItem(
          'githubZhUpdateError',
          JSON.stringify({
            message: sanitizedError,
            timestamp: now,
          }),
        );
      } catch (_e) {
        // 忽略存储错误
      }

      return false;
    }
  },

  /**
   * 带重试机制的网络请求
   * @param {string} url - 请求URL
   * @param {number} maxRetries - 最大重试次数
   * @param {number} retryDelay - 重试间隔（毫秒）
   * @returns {Promise<string>} 响应文本
   */
  async fetchWithRetry(url, maxRetries = 2, retryDelay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (CONFIG.debugMode && attempt > 0) {
          console.log(`[GitHub 中文翻译] 重试更新检查 (${attempt}/${maxRetries})...`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            Accept: 'text/javascript, text/plain, */*',
          },
          signal: controller.signal,
          credentials: 'omit',
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }

        const scriptContent = await response.text();

        if (KNOWN_SCRIPT_HASHES[url]) {
          const isValid = await this.verifyScriptIntegrity(scriptContent, url);
          if (!isValid && CONFIG.debugMode) {
            console.warn('[GitHub 中文翻译] 脚本完整性验证失败，可能存在安全风险');
          }
        }

        return scriptContent;
      } catch (error) {
        lastError = error;
        if (attempt === maxRetries) {
          throw error;
        }
        await utils.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError;
  },

  /**
   * 验证脚本完整性
   * @param {string} scriptContent - 脚本内容
   * @param {string} url - 脚本URL
   * @returns {Promise<boolean>} 验证是否通过
   */
  async verifyScriptIntegrity(scriptContent, url) {
    try {
      const expectedHash = KNOWN_SCRIPT_HASHES[url];
      if (!expectedHash) {
        return true;
      }

      const actualHash = await utils.sha256Hash(scriptContent);
      const isValid = actualHash === expectedHash;

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 脚本完整性验证: ${isValid ? '通过' : '失败'}`);
        if (!isValid) {
          console.log(`[GitHub 中文翻译] 期望哈希: ${expectedHash.substring(0, 16)}...`);
          console.log(`[GitHub 中文翻译] 实际哈希: ${actualHash.substring(0, 16)}...`);
        }
      }

      return isValid;
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 脚本完整性验证出错:', utils.sanitizeErrorMessage(error));
      }
      return false;
    }
  },

  /**
   * 从脚本内容中提取版本号
   * @param {string} content - 脚本内容
   * @returns {string|null} 提取的版本号或null
   */
  extractVersion(content) {
    const patterns = [
      /\/\*\s*@version\s+(\d+\.\d+\.\d+)\s*\*\//i,
      /\/\/\s*@version\s+(\d+\.\d+\.\d+)/i,
      /\/\/\s*version\s*:\s*(\d+\.\d+\.\d+)/i,
      /version\s*=\s*['"](\d+\.\d+\.\d+)['"]/i,
      /version:\s*['"](\d+\.\d+\.\d+)['"]/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  },

  /**
   * 比较版本号，判断是否有新版本
   * @param {string} newVersion - 新版本号
   * @param {string} currentVersion - 当前版本号
   * @returns {boolean} 是否有新版本
   */
  isNewerVersion(newVersion, currentVersion) {
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (newPart > currentPart) {
        return true;
      } else if (newPart < currentPart) {
        return false;
      }
    }

    return false;
  },

  // 委托给 updateNotification 模块
  showUpdateNotification(newVersion) {
    return updateNotification.showUpdateNotification(newVersion);
  },

  hideNotification(notification, permanently = false) {
    return updateNotification.hideNotification(notification, permanently);
  },

  // 委托给 versionStorage 模块
  recordVersionHistory(version) {
    return versionStorage.recordVersionHistory(version);
  },

  updateVersionInStorage(newVersion) {
    return versionStorage.updateVersionInStorage(newVersion);
  },

  getCachedVersion() {
    return versionStorage.getCachedVersion();
  },

  clearNotificationDismissal() {
    return versionStorage.clearNotificationDismissal();
  },
};

export { versionChecker };
