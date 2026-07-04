/**
 * GitHub 中文翻译配置管理模块
 * @file configManager.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责用户配置的加载、保存、合并与重置逻辑
 */

import { CONFIG } from '../config.js';
import { utils } from '../utils/utils.js';

// 配置存储键名
const CONFIG_STORAGE_KEY = 'github-i18n-config';

/** 从 localStorage 加载用户设置（带混淆解码，兼容旧格式） */
export function loadUserSettings() {
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

/** 保存用户设置到 localStorage（混淆存储）并触发配置合并 */
export function saveUserSettings(instance, settings) {
  try {
    const jsonData = JSON.stringify(settings);
    // 混淆存储配置数据，防止恶意脚本或扩展读取
    const obfuscatedData = utils.obfuscateData(jsonData);
    localStorage.setItem(CONFIG_STORAGE_KEY, obfuscatedData);
    instance.userConfig = { ...settings };
    instance.mergeUserConfig();
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 保存用户配置失败:', utils.sanitizeErrorMessage(error));
    }
  }
}

/** 将用户配置深度合并到全局 CONFIG */
export function mergeUserConfig(instance) {
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

  merge(CONFIG, instance.userConfig);
}

/** 处理保存按钮点击：收集表单值并保存 */
export function handleSave(instance) {
  const newSettings = {
    debugMode: document.getElementById('github-i18n-debug-mode')?.checked || false,
    enablePartialMatch:
      document.getElementById('github-i18n-enable-partial-match')?.checked || false,
    autoUpdate: document.getElementById('github-i18n-auto-update')?.checked || false,
    enableTranslationCache:
      document.getElementById('github-i18n-translation-cache')?.checked || false,
    enableVirtualDom: document.getElementById('github-i18n-virtual-dom')?.checked || false,
  };

  instance.saveUserSettings(newSettings);
  instance.hide();
}

/** 处理重置按钮点击：清除存储并重置状态 */
export function handleReset(instance) {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  instance.userConfig = {};
  instance.settings = {};
  instance.hide();
}
