/**
 * 版本更新检查模块
 * @file versionChecker.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 负责检查和处理脚本更新
 */
import { CONFIG } from './config.js';
import { utils } from './utils/utils.js';
import { extractVersion, isNewerVersion } from './versionUtils.js';
import {
  showUpdateNotification,
  recordVersionHistory,
  clearNotificationDismissal,
} from './updateNotification.js';

const DEFAULT_INTERVAL_HOURS = 24;
const HOURS_TO_MS = 60 * 60 * 1000;
const PARSE_INT_RADIX = 10;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 1000;
const FETCH_TIMEOUT_MS = 8000;
const EXPONENTIAL_BASE = 2;

const KNOWN_SCRIPT_HASHES = {
  'https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js':
    'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
};

const versionChecker = {
  async checkForUpdates() {
    if (!CONFIG.updateCheck.enabled) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 已禁用更新检查');
      }
      return false;
    }

    const lastCheck = localStorage.getItem('githubZhLastUpdateCheck');
    const now = Date.now();
    const intervalMs = (CONFIG.updateCheck.intervalHours || DEFAULT_INTERVAL_HOURS) * HOURS_TO_MS;

    if (lastCheck && now - parseInt(lastCheck, PARSE_INT_RADIX) < intervalMs) {
      if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 未达到更新检查间隔，跳过检查 (上次检查: ${new Date(parseInt(lastCheck, PARSE_INT_RADIX)).toLocaleString()})`,
        );
      }
      return false;
    }

    try {
      localStorage.setItem('githubZhLastUpdateCheck', now.toString());

      const scriptContent = await this.fetchWithRetry(CONFIG.updateCheck.scriptUrl);

      const remoteVersion = extractVersion(scriptContent);

      if (!remoteVersion) {
        throw new Error('无法从远程脚本提取有效的版本号');
      }

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 当前版本: ${CONFIG.version}, 远程版本: ${remoteVersion}`);
      }

      if (isNewerVersion(remoteVersion, CONFIG.version)) {
        showUpdateNotification(remoteVersion);

        if (CONFIG.updateCheck.autoUpdateVersion) {
          this.updateVersionInStorage(remoteVersion);
        }

        recordVersionHistory(remoteVersion);

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

  async fetchWithRetry(url, maxRetries = DEFAULT_MAX_RETRIES, retryDelay = DEFAULT_RETRY_DELAY_MS) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (CONFIG.debugMode && attempt > 0) {
          console.log(`[GitHub 中文翻译] 重试更新检查 (${attempt}/${maxRetries})...`);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

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
          if (!isValid) {
            if (CONFIG.debugMode) {
              console.warn('[GitHub 中文翻译] 脚本完整性验证失败，可能存在安全风险');
            }
          }
        }

        return scriptContent;
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          throw error;
        }

        await utils.delay(retryDelay * Math.pow(EXPONENTIAL_BASE, attempt));
      }
    }

    throw lastError;
  },

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
      }

      return isValid;
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 脚本完整性验证出错:', utils.sanitizeErrorMessage(error));
      }
      return false;
    }
  },

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

  getCachedVersion() {
    try {
      const cachedData = utils.safeJSONParse(localStorage.getItem('githubZhCachedVersion'));
      return cachedData;
    } catch (_error) {
      return null;
    }
  },

  clearNotificationDismissal,
};

export { versionChecker };
