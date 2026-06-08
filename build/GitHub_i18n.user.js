// ==UserScript==
// @name         GitHub 中文翻译
// @namespace    https://github.com/Tanox/GitHub_i18n
// @version      1.9.20
// @description  GitHub页面自动翻译为中文
// @author       Sut
// @match        https://github.com/*
// @match        https://docs.github.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      github.com
// @run-at       document-idle
// @noframes
// @updateURL    https://raw.githubusercontent.com/Tanox/GitHub_i18n/main/build/GitHub_i18n.user.js
// @downloadURL  https://raw.githubusercontent.com/Tanox/GitHub_i18n/main/build/GitHub_i18n.user.js
// @license      GPL-2.0
// @homepage     https://github.com/Tanox/GitHub_i18n
// ==/UserScript==
(function() {
'use strict';
/**
 * 版本信息模块
 * @file version.js
 * @version 1.9.20
 * @date 2026-06-08
 * @author Sut
 * @description 统一管理GitHub自动化字符串更新工具的版本信息
 */
/**
 * 当前工具版本号
 * @type {string}
 * @description 这是项目的单一版本源，所有其他版本号引用都应从此处获取
 */
const VERSION = '1.9.20';
/**
 * GitHub 中文翻译配置文件
 * @file config.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含脚本所有可配置项
 */
// 导入版本常量（从单一版本源）
// 定义greasemonkeyInfo以避免未定义错误，使用空值合并运算符提高代码可读性
const greasemonkeyInfo = typeof window !== 'undefined' ? (window.GM_info ?? {}) : {};
/**
 * 从用户脚本头部注释中提取版本号
 * @returns {string} 版本号
 */
function getVersionFromComment() {
  try {
    // 作为用户脚本，我们可以直接从当前执行环境中提取版本信息
    const versionMatch = greasemonkeyInfo?.script?.version;
    if (versionMatch) {
      return versionMatch;
    }
    // 如果greasemonkeyInfo不可用，返回配置中的版本号
    return VERSION;
  } catch (_e) {
    // 出错时返回配置中的版本号
    return VERSION;
  }
}
/**
 * 配置对象，包含所有可配置项
 */
const CONFIG = {
  version: VERSION,
  debounceDelay: 500,
  routeChangeDelay: 500,
  debugMode: false,
  updateCheck: {
    enabled: true,
    intervalHours: 24,
    scriptUrl: 'https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js',
    autoUpdateVersion: true,
  },
  externalTranslation: {
    enabled: false,
    minLength: 20,
    maxLength: 500,
    timeout: 3000,
    requestInterval: 500,
    cacheSize: 500,
  },
  performance: {
    enableDeepObserver: true,
    enablePartialMatch: false,
    maxDictSize: 2000,
    enableTranslationCache: true,
    batchSize: 50,
    batchDelay: 0,
    logTiming: false,
    cacheExpiration: 3600000, // 缓存过期时间（毫秒）
    minTextLengthToTranslate: 3, // 最小翻译文本长度
    minTranslateInterval: 500, // 最小翻译间隔（毫秒）
    observeAttributes: true, // 是否观察属性变化
    observeSubtree: true, // 是否观察子树变化
    importantAttributes: [
      'title',
      'alt',
      'aria-label',
      'placeholder',
      'data-hovercard-url',
      'data-hovercard-type',
    ], // 重要的属性列表
    importantElements: [
      '.HeaderNavlink',
      '.js-selected-navigation-item',
      '.js-issue-title',
      '.js-commit-message',
      '.js-details-container',
      '.js-comment-body',
      '.js-activity-item',
      '.js-blob-content',
      '.js-repo-description',
      '.js-issue-row',
      '.js-pinned-issue-list-item',
      '.js-project-card-content',
      '.js-user-profile-bio',
      '.js-header-search-input',
      '.js-file-line',
      '.Header-link',
      '.TabNav-link',
      '.UnderlineNav-link',
      '.Label',
      '.btn-primary',
      '.btn-secondary',
      '.TimelineItem-body',
      '.Box-title',
      '.Subhead-heading',
      '.f4',
      '.f5',
      '.text-bold',
      '.text-semibold',
      '.avatar-user',
      '.contributor-avatar',
      '.commit-author',
      '.issue-author',
    ], // 重要内容元素
    ignoreElements: [
      'script',
      'style',
      'link',
      'meta',
      'svg',
      'canvas',
      'pre',
      'code',
      'kbd',
      'samp',
      '.blob-code-inner',
      '.file-line',
      '.highlight',
      '.language-*',
      '.mermaid',
      '.mathjax',
      '.js-zeroclipboard-button',
      '.js-minimizable-content',
      '.reponav-dropdown',
      '.dropdown-caret',
      '.avatar',
      '.emoji',
      '.blob-code',
      '.blob-code-marker',
      '.blob-num',
      '.blob-num-hunk',
      '.diff-line',
      '.diff-addition',
      '.diff-deletion',
      '.diff-header',
      '.line-comment',
      '.inline-comment',
      '.commit-diff-title',
      '.copyable-area',
      '.copy-button',
      '.token',
      '.syntax--',
      '.octicon',
      '.github-icon',
      '.icon',
      '.spinner',
      '.timestamp',
      '.time-ago',
      '.relative-time',
      '.local-time',
      '.sha',
      '.shortsha',
      '.commit-sha',
      '.blob-sha',
      '.username',
      '.login',
      '.user-mention',
      '.team-mention',
      '.repo-name',
      '.repo-link',
      '.branch-name',
      '.tag-name',
      '.file-name',
      '.file-path',
      '.directory',
      '.folder',
      '.language-color',
      '.repo-language-color',
      '.color-block',
      '.progress-bar',
      '.meter',
      '.counter',
      '.number',
      '.size',
      '.bytes',
      '.count',
      '.stat',
      '.statistic',
      '.code-search-result-match',
      '.search-match',
      '.highlighted-text',
      '.notification-indicator',
      '.notification-badge',
      '.notification-count',
      '.unread-indicator',
      '.new-indicator',
      '.badge',
      '.label',
    ], // 忽略翻译的元素
    mutationThreshold: 30, // 单次突变数量阈值
    contentChangeWeight: 1, // 内容变化权重
    importantChangeWeight: 2, // 重要变化权重
    translationTriggerRatio: 0.3, // 触发翻译的变化比例
    enableVirtualDom: true, // 是否启用虚拟DOM优化
    virtualDomCleanupInterval: 60000, // 虚拟DOM清理间隔（毫秒）
    virtualDomNodeTimeout: 3600000, // 虚拟DOM节点超时时间（毫秒）
    useSmartThrottling: true, // 启用智能节流
    ignoreCharacterDataMutations: false, // 是否忽略字符数据变化（用于性能优化）
    ignoreAttributeMutations: false, // 是否忽略属性变化（用于性能优化）
    minContentChangesToTrigger: 3, // 触发翻译的最小内容变化数
    maxMutationProcessing: 50, // 单次处理的最大突变数
    enableFullTranslation: true, // 是否启用完整翻译模式
    networkRequestInterval: 1000, // 网络请求间隔（毫秒）
    maxTranslationErrorCount: 10, // 最大翻译错误数
    maxDomErrorCount: 20, // 最大DOM操作错误数
    maxDictionaryErrorCount: 5, // 最大词典错误数
    maxNetworkErrorCount: 3, // 最大网络错误数
    maxPerformanceErrorCount: 15, // 最大性能错误数
    maxOtherErrorCount: 25, // 最大其他错误数
  },
  selectors: {
    primary: [
      'h1, h2, h3, h4, h5, h6',
      'p, span, a, button',
      'label, strong, em',
      'li, td, th',
      '.btn, .button',
      '.link, .text',
      '.nav-item, .menu-item',
    ],
    popupMenus: ['.dropdown-menu', '.menu-dropdown', '.context-menu', '.notification-popover'],
  },
  pagePatterns: {
    search: /\/search/,
    repository: /\/[\w-]+\/[\w-]+/,
    issues: /\/[\w-]+\/[\w-]+\/issues/,
    pullRequests: /\/[\w-]+\/[\w-]+\/pull/,
    settings: /\/settings/,
    dashboard: /^\/$/,
    explore: /\/explore/,
    codespaces: /\/codespaces/,
    notifications: /\/notifications/,
    profile: /\/[\w-]+$/,
    organizations: /\/organizations/,
    projects: /\/[\w-]+\/[\w-]+\/projects/,
    wiki: /\/[\w-]+\/[\w-]+\/wiki/,
    actions: /\/[\w-]+\/[\w-]+\/actions/,
    packages: /\/[\w-]+\/[\w-]+\/packages/,
    security: /\/[\w-]+\/[\w-]+\/security/,
    insights: /\/[\w-]+\/[\w-]+\/insights/,
    marketplace: /\/marketplace/,
    topics: /\/topics/,
    stars: /\/stars/,
    trending: /\/trending/,
  },
};
/**
 * Trie树数据结构模块
 * @file trie.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 高效的字符串匹配数据结构，用于部分匹配翻译
 */
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.value = null;
    this.length = 0;
  }
}
class Trie {
  constructor() {
    this.root = new TrieNode();
    this.size = 0;
  }
  insert(word, value) {
    if (!word || typeof word !== 'string' || word.length === 0) {
      return;
    }
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
    node.value = value;
    node.length = word.length;
    this.size++;
  }
  findAllMatches(text, minKeyLength = 0) {
    if (!text || typeof text !== 'string' || text.length === 0) {
      return [];
    }
    const matches = [];
    const textLen = text.length;
    for (let i = 0; i < textLen; i++) {
      let node = this.root;
      let currentWord = '';
      for (let j = i; j < textLen; j++) {
        const char = text[j];
        if (!node.children.has(char)) {
          break;
        }
        node = node.children.get(char);
        currentWord += char;
        if (node.isEndOfWord && currentWord.length >= minKeyLength) {
          matches.push({
            key: currentWord,
            value: node.value,
            start: i,
            end: j,
            length: node.length,
          });
        }
      }
    }
    return matches;
  }
  clear() {
    this.root = new TrieNode();
    this.size = 0;
  }
  getSize() {
    return this.size;
  }
}
/**
 * 工具函数模块
 * @file utils.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含各种通用的辅助函数
 */
/**
 * 工具函数集合
 */
const utils = {
  /**
   * 节流函数，用于限制高频操作的执行频率
   * 支持返回Promise
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 限制时间（毫秒）
   * @param {Object} options - 配置选项
   * @param {boolean} options.leading - 是否在开始时执行（默认true）
   * @param {boolean} options.trailing - 是否在结束后执行（默认true）
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit, options = {}) {
    const { leading = true, trailing = true } = options;
    let inThrottle, lastArgs, lastThis, result, timerId;
    const later = (context, args) => {
      inThrottle = false;
      if (trailing && lastArgs) {
        result = func.apply(context, args);
        lastArgs = lastThis = null;
      }
    };
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        if (leading) {
          result = func.apply(context, args);
        }
        inThrottle = true;
        timerId = setTimeout(() => later(context, args), limit);
      } else if (trailing) {
        lastArgs = args;
        lastThis = context;
        // 确保只有一个定时器
        clearTimeout(timerId);
        timerId = setTimeout(() => later(lastThis, lastArgs), limit);
      }
      return result;
    };
  },
  /**
   * 防抖函数，延迟执行函数直到停止触发一段时间
   * 支持返回Promise
   * @param {Function} func - 要防抖的函数
   * @param {number} delay - 延迟时间（毫秒）
   * @param {Object} options - 配置选项
   * @param {boolean} options.leading - 是否在开始时执行一次（默认false）
   * @returns {Function} 防抖后的函数
   */
  debounce(func, delay, options = {}) {
    const { leading = false } = options;
    let timeout, result;
    const later = (context, args) => {
      result = func.apply(context, args);
    };
    return function () {
      const args = arguments;
      const context = this;
      const isLeadingCall = !timeout && leading;
      clearTimeout(timeout);
      timeout = setTimeout(() => later(context, args), delay);
      if (isLeadingCall) {
        result = func.apply(context, args);
      }
      return result;
    };
  },
  /**
   * 延迟函数，返回Promise的setTimeout
   * @param {number} ms - 延迟时间（毫秒）
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  /**
   * 转义正则表达式中的特殊字符
   * @param {string} string - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeRegExp(string) {
    // 转义所有正则表达式特殊字符，包括/字符
    return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  },
  /**
   * 安全地解析JSON字符串
   * @param {string} jsonString - JSON字符串
   * @param {*} defaultValue - 解析失败时的默认值
   * @returns {*} 解析结果或默认值
   */
  safeJSONParse(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.warn('[GitHub 中文翻译] JSON解析失败:', error);
      return defaultValue;
    }
  },
  /**
   * 检查正则表达式是否存在潜在的ReDoS风险
   * @param {string|RegExp} pattern - 正则表达式模式
   * @returns {boolean} - 是否安全
   */
  isSafeRegex(pattern) {
    if (typeof pattern === 'string') {
      pattern = new RegExp(pattern);
    }
    const source = pattern.source;
    let depth = 0;
    let hasNestedRepetition = false;
    // 检查是否存在嵌套的重复量词（ReDoS的主要来源）
    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      if (char === '(' && source[i - 1] !== '\\') {
        depth++;
      } else if (char === ')' && source[i - 1] !== '\\') {
        depth--;
      } else if (depth > 0 && /[*+?]/.test(char) && source[i - 1] !== '\\') {
        // 在分组内发现重复量词
        hasNestedRepetition = true;
        break;
      }
    }
    // 检查是否存在长时间运行的可能性
    const longPatternWarning = source.length > 100; // 过长的正则表达式
    const hasMultipleRepetitions = (source.match(/[*+?]/g) || []).length > 5; // 过多的重复量词
    return !hasNestedRepetition && !longPatternWarning && !hasMultipleRepetitions;
  },
  /**
   * 安全地创建正则表达式，防止ReDoS攻击
   * @param {string} pattern - 正则表达式模式
   * @param {string} flags - 正则表达式标志
   * @returns {RegExp|null} - 安全的正则表达式或null
   */
  safeRegExp(pattern, flags = '') {
    try {
      const regex = new RegExp(pattern, flags);
      if (this.isSafeRegex(regex)) {
        return regex;
      }
      console.warn('[GitHub 中文翻译] 检测到可能存在ReDoS风险的正则表达式:', pattern);
      return null;
    } catch (error) {
      console.warn('[GitHub 中文翻译] 创建正则表达式失败:', error);
      return null;
    }
  },
  /**
   * 安全地序列化对象为JSON字符串
   * @param {*} obj - 要序列化的对象
   * @param {string} defaultValue - 序列化失败时的默认值
   * @returns {string} JSON字符串或默认值
   */
  safeJSONStringify(obj, defaultValue = '{}') {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('[GitHub 中文翻译] JSON序列化失败:', error);
      return defaultValue;
    }
  },
  /**
   * 获取当前页面路径
   * @returns {string} 当前页面的路径
   */
  getCurrentPath() {
    return window.location.pathname;
  },
  /**
   * 获取完整的当前页面URL（包含查询参数）
   * @returns {string} 完整的URL
   */
  getCurrentUrl() {
    return window.location.href;
  },
  /**
   * 判断当前页面是否匹配某个路径模式
   * @param {RegExp} pattern - 路径模式
   * @returns {boolean} 是否匹配
   */
  isCurrentPathMatch(pattern) {
    return pattern.test(this.getCurrentPath());
  },
  /**
   * 从URL获取查询参数
   * @param {string} name - 参数名
   * @param {string} url - URL字符串，默认使用当前页面URL
   * @returns {string|null} 参数值或null
   */
  getQueryParam(name, url = window.location.href) {
    const match = RegExp(`[?&]${name}=([^&]*)`).exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  },
  /**
   * 获取URL中的所有查询参数
   * @param {string} url - URL字符串，默认使用当前页面URL
   * @returns {Object} 查询参数对象
   */
  getAllQueryParams(url = window.location.href) {
    const params = {};
    try {
      const searchParams = new URL(url || window.location.href).searchParams;
      for (const [key, value] of searchParams) {
        params[key] = value;
      }
    } catch (error) {
      console.warn('[GitHub 中文翻译] 解析URL参数失败:', error);
    }
    return params;
  },
  /**
   * 收集DOM树中的所有文本节点内容
   * @param {HTMLElement} element - 要收集文本的起始元素
   * @param {Set<string>} resultSet - 用于存储结果的Set集合
   * @param {Object} options - 配置选项
   * @param {number} options.maxLength - 最大文本长度（默认200）
   * @param {string[]} options.skipTags - 跳过的标签名数组
   */
  collectTextNodes(element, resultSet, options = {}) {
    if (!element || !resultSet || typeof resultSet.add !== 'function') return;
    const {
      maxLength = 200,
      skipTags = [
        'script',
        'style',
        'code',
        'pre',
        'textarea',
        'input',
        'select',
        'noscript',
        'template',
      ],
    } = options;
    try {
      // 检查是否需要跳过此元素
      if (element.tagName && skipTags.includes(element.tagName.toLowerCase())) {
        return;
      }
      // 检查元素是否有隐藏类或样式
      if (element.classList && element.classList.contains('sr-only')) {
        return;
      }
      // 遍历所有子节点
      const childNodes = Array.from(element.childNodes || []);
      for (const node of childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue ? node.nodeValue.trim() : '';
          // 只收集符合条件的文本
          if (
            text &&
            text.length > 0 &&
            text.length < maxLength &&
            !/^\d+$/.test(text) &&
            // 使用基础字符类替代Unicode属性转义，避免构建过程中的解析问题
            !/^[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u00A1-\u00BF\u2000-\u206F\u3000-\u303F]+$/.test(
              text,
            )
          ) {
            resultSet.add(text);
          }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // 递归收集子元素的文本
          this.collectTextNodes(node, resultSet, options);
        }
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 收集文本节点时出错:', error);
    }
  },
  /**
   * 安全地访问对象属性，避免嵌套属性访问出错
   * @param {Object} obj - 目标对象
   * @param {string|string[]} path - 属性路径，如'a.b.c'或['a','b','c']
   * @param {*} defaultValue - 获取失败时的默认值
   * @returns {*} 属性值或默认值
   */
  getNestedProperty(obj, path, defaultValue = null) {
    try {
      const pathArray = Array.isArray(path) ? path : path.split('.');
      let result = obj;
      for (const key of pathArray) {
        if (result === null || result === undefined) {
          return defaultValue;
        }
        result = result[key];
      }
      return result === undefined ? defaultValue : result;
    } catch (_error) {
      return defaultValue;
    }
  },
  /**
   * 深拷贝对象
   * @param {*} obj - 要拷贝的对象
   * @returns {*} 拷贝后的对象
   */
  deepClone(obj) {
    try {
      if (obj === null || typeof obj !== 'object') return obj;
      if (obj instanceof Date) return new Date(obj.getTime());
      if (obj instanceof Array) return obj.map((item) => this.deepClone(item));
      if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = this.deepClone(obj[key]);
          }
        }
        return clonedObj;
      }
    } catch (error) {
      console.warn('[GitHub 中文翻译] 深拷贝失败:', error);
      return obj;
    }
  },
  /**
   * 安全地执行函数，捕获可能的异常
   * @param {Function} fn - 要执行的函数
   * @param {*} defaultValue - 执行失败时的默认返回值
   * @param {Object} context - 函数执行上下文
   * @param {...*} args - 函数参数
   * @returns {*} 函数返回值或默认值
   */
  safeExecute(fn, defaultValue = null, context = null, ...args) {
    try {
      if (typeof fn === 'function') {
        return fn.apply(context, args);
      }
      return defaultValue;
    } catch (error) {
      console.error('[GitHub 中文翻译] 安全执行函数失败:', error);
      return defaultValue;
    }
  },
};
/**
 * LRU缓存管理模块
 * @file cacheManager.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 实现LRU缓存策略，用于翻译结果缓存
 */
class CacheManager {
  constructor(maxSize = 2000) {
    this.translationCache = new Map();
    this.maxSize = maxSize;
    this.cacheStats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
    };
  }
  getFromCache(key) {
    const cacheItem = this.translationCache.get(key);
    if (cacheItem && cacheItem.value) {
      cacheItem.timestamp = Date.now();
      cacheItem.accessCount = (cacheItem.accessCount || 0) + 1;
      this.cacheStats.hits++;
      return cacheItem.value;
    }
    this.cacheStats.misses++;
    return null;
  }
  setToCache(key, value, isPageUnloading = false) {
    if (isPageUnloading) {
      return;
    }
    this.checkCacheSizeLimit();
    this.translationCache.set(key, {
      value,
      timestamp: Date.now(),
      accessCount: 1,
    });
    this.cacheStats.size = this.translationCache.size;
  }
  checkCacheSizeLimit() {
    if (this.translationCache.size >= this.maxSize) {
      this.performLRUCacheEviction(this.maxSize);
    }
  }
  performLRUCacheEviction(maxSize) {
    try {
      const targetSize = Math.floor(maxSize * 0.8);
      const cacheEntries = Array.from(this.translationCache.entries());
      cacheEntries.sort(([, itemA], [, itemB]) => {
        if (itemB.timestamp !== itemA.timestamp) {
          return itemB.timestamp - itemA.timestamp;
        }
        return (itemB.accessCount || 0) - (itemA.accessCount || 0);
      });
      const entriesToKeep = cacheEntries.slice(0, targetSize);
      const evictedCount = cacheEntries.length - entriesToKeep.length;
      this.translationCache.clear();
      entriesToKeep.forEach(([key, item]) => {
        this.translationCache.set(key, item);
      });
      this.cacheStats.evictions += evictedCount;
      this.cacheStats.size = this.translationCache.size;
    } catch (_error) {
      const evictCount = Math.max(50, Math.floor(this.translationCache.size * 0.2));
      const oldestEntries = Array.from(this.translationCache.entries())
        .sort(([, itemA], [, itemB]) => itemA.timestamp - itemB.timestamp)
        .slice(0, evictCount);
      oldestEntries.forEach(([key]) => {
        this.translationCache.delete(key);
      });
      this.cacheStats.evictions += evictCount;
      this.cacheStats.size = this.translationCache.size;
    }
  }
  cleanCache() {
    this.checkCacheSizeLimit();
  }
  clearCache() {
    this.translationCache.clear();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
    };
  }
  getStats() {
    return { ...this.cacheStats };
  }
}
/**
 * 错误处理模块
 * @file errorHandler.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 负责统一管理所有错误处理和恢复机制
 */
const ErrorHandler = {
  // 错误计数器
  errorCounts: new Map(),
  // 错误类型定义
  ERROR_TYPES: {
    TRANSLATION: 'translation',
    DOM_OPERATION: 'dom_operation',
    DICTIONARY: 'dictionary',
    NETWORK: 'network',
    PERFORMANCE: 'performance',
    OTHER: 'other',
  },
  /**
   * 初始化错误处理器
   */
  init() {
    this.errorCounts.clear();
    // 初始化所有错误类型的计数器
    Object.values(this.ERROR_TYPES).forEach((type) => {
      this.errorCounts.set(type, 0);
    });
  },
  /**
   * 处理错误
   * @param {string} context - 错误发生的上下文
   * @param {Error} error - 错误对象
   * @param {string} type - 错误类型
   * @param {Object} [options] - 错误处理选项
   * @param {boolean} [options.retryable] - 是否可重试
   * @param {Function} [options.recoveryFn] - 恢复函数
   * @param {number} [options.maxRetries] - 最大重试次数
   */
  handleError(context, error, type = this.ERROR_TYPES.OTHER, options = {}) {
    // 更新错误计数
    const currentCount = this.errorCounts.get(type) || 0;
    this.errorCounts.set(type, currentCount + 1);
    // 记录错误日志
    this.logError(context, error, type);
    // 检查是否需要进行恢复
    if (options.recoveryFn && typeof options.recoveryFn === 'function') {
      this.attemptRecovery(context, options.recoveryFn, options.maxRetries || 1);
    }
    // 检查是否需要采取紧急措施
    this.checkErrorThreshold(type, currentCount + 1);
  },
  /**
   * 记录错误日志
   * @param {string} context - 错误发生的上下文
   * @param {Error} error - 错误对象
   * @param {string} type - 错误类型
   */
  logError(context, error, type) {
    const errorMessage = `[GitHub 中文翻译] ${context}时出错 (${type}): ${error.message}`;
    if (CONFIG.debugMode) {
      console.error(errorMessage, error);
      // 在调试模式下，提供更详细的错误信息
      if (error.stack) {
        console.error('[GitHub 中文翻译] 错误堆栈:', error.stack);
      }
    } else {
      console.error(errorMessage);
    }
  },
  /**
   * 尝试恢复操作
   * @param {string} context - 恢复操作的上下文
   * @param {Function} recoveryFn - 恢复函数
   * @param {number} maxRetries - 最大重试次数
   * @param {number} [currentAttempt=0] - 当前尝试次数
   */
  attemptRecovery(context, recoveryFn, maxRetries, currentAttempt = 0) {
    try {
      recoveryFn();
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] ${context} - 恢复操作成功 (尝试: ${currentAttempt + 1})`);
      }
    } catch (recoveryError) {
      const attempt = currentAttempt + 1;
      if (CONFIG.debugMode) {
        console.error(
          `[GitHub 中文翻译] ${context} - 恢复操作失败 (尝试: ${attempt}/${maxRetries}):`,
          recoveryError,
        );
      }
      if (attempt < maxRetries) {
        // 指数退避重试
        const delay = Math.pow(2, attempt) * 100; // 100ms, 200ms, 400ms...
        setTimeout(() => {
          this.attemptRecovery(context, recoveryFn, maxRetries, attempt);
        }, delay);
      }
    }
  },
  /**
   * 检查错误阈值
   * @param {string} type - 错误类型
   * @param {number} count - 当前错误计数
   */
  checkErrorThreshold(type, count) {
    const thresholds = {
      [this.ERROR_TYPES.TRANSLATION]: CONFIG.performance?.maxTranslationErrorCount || 10,
      [this.ERROR_TYPES.DOM_OPERATION]: CONFIG.performance?.maxDomErrorCount || 20,
      [this.ERROR_TYPES.DICTIONARY]: CONFIG.performance?.maxDictionaryErrorCount || 5,
      [this.ERROR_TYPES.NETWORK]: CONFIG.performance?.maxNetworkErrorCount || 3,
      [this.ERROR_TYPES.PERFORMANCE]: CONFIG.performance?.maxPerformanceErrorCount || 15,
      [this.ERROR_TYPES.OTHER]: CONFIG.performance?.maxOtherErrorCount || 25,
    };
    const threshold = thresholds[type] || 20;
    if (count >= threshold) {
      this.handleErrorOverflow(type, count, threshold);
    }
  },
  /**
   * 处理错误溢出
   * @param {string} type - 错误类型
   * @param {number} count - 当前错误计数
   * @param {number} threshold - 阈值
   */
  handleErrorOverflow(type, count, threshold) {
    if (CONFIG.debugMode) {
      console.warn(`[GitHub 中文翻译] ${type} 错误超过阈值 (${count}/${threshold})，采取紧急措施`);
    }
    // 根据错误类型采取不同的紧急措施
    switch (type) {
      case this.ERROR_TYPES.TRANSLATION:
        // 切换到最小化翻译模式
        CONFIG.performance.enableFullTranslation = false;
        break;
      case this.ERROR_TYPES.DOM_OPERATION:
        // 减少DOM操作频率
        CONFIG.performance.batchDelay = Math.max(CONFIG.performance.batchDelay || 0, 50);
        break;
      case this.ERROR_TYPES.DICTIONARY:
        // 重新初始化词典
        if (typeof window.GitHub_i18n !== 'undefined' && window.GitHub_i18n.translationCore) {
          window.GitHub_i18n.translationCore.initDictionary();
        }
        break;
      case this.ERROR_TYPES.NETWORK:
        // 增加网络请求间隔
        CONFIG.performance.networkRequestInterval = Math.max(
          CONFIG.performance.networkRequestInterval || 1000,
          5000,
        );
        break;
      default:
        // 通用紧急措施：减少处理频率
        CONFIG.performance.batchDelay = Math.max(CONFIG.performance.batchDelay || 0, 100);
        break;
    }
    // 重置错误计数
    this.errorCounts.set(type, 0);
  },
  /**
   * 获取错误统计信息
   * @returns {Object} 错误统计对象
   */
  getErrorStats() {
    const stats = {};
    this.errorCounts.forEach((count, type) => {
      stats[type] = count;
    });
    return stats;
  },
  /**
   * 重置错误计数
   * @param {string} [type] - 可选的错误类型，不提供则重置所有
   */
  resetErrorCounts(type) {
    if (type) {
      this.errorCounts.set(type, 0);
    } else {
      this.init();
    }
  },
};
// 初始化错误处理器
ErrorHandler.init();
/**
 * 开发工具模块
 * @file tools.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含字符串提取、自动更新和词典处理等开发工具
 */
// 删除未使用的CONFIG导入
/**
 * 字符串提取器对象
 */
const stringExtractor = {
  /**
   * 收集页面上的字符串
   * @param {boolean} showInConsole - 是否在控制台显示结果
   * @returns {Set<string>} 收集到的字符串集合
   */
  collectStrings(showInConsole = true) {
    const strings = new Set();
    utils.collectTextNodes(document.body, strings);
    if (showInConsole) {
      console.log(`[GitHub 中文翻译] 收集到 ${strings.size} 个字符串`);
      console.log('收集到的字符串:', strings);
    }
    return strings;
  },
  /**
   * 查找未翻译的字符串
   * @param {boolean} showInConsole - 是否在控制台显示结果
   * @returns {Set<string>} 未翻译的字符串集合
   */
  findUntranslatedStrings(showInConsole = true) {
    const allStrings = this.collectStrings(false);
    const untranslated = new Set();
    // 合并所有词典
    const mergedDictionary = {};
    for (const module in translationModule) {
      Object.assign(mergedDictionary, translationModule[module]);
    }
    // 检查每个字符串是否已翻译
    allStrings.forEach((string) => {
      if (!mergedDictionary[string] || mergedDictionary[string].startsWith('待翻译: ')) {
        untranslated.add(string);
      }
    });
    if (showInConsole) {
      console.log(`[GitHub 中文翻译] 找到 ${untranslated.size} 个未翻译的字符串`);
      console.log('未翻译的字符串:', untranslated);
    }
    return untranslated;
  },
};
/**
 * 自动字符串更新器类
 */
class AutoStringUpdater {
  constructor() {
    this.processedCount = 0;
  }
  /**
   * 查找需要添加的字符串
   * @returns {Set<string>} 需要添加的字符串集合
   */
  findStringsToAdd() {
    const untranslated = stringExtractor.findUntranslatedStrings(false);
    return new Set(Array.from(untranslated).filter((str) => !str.startsWith('待翻译: ')));
  }
  /**
   * 生成更新报告
   * @returns {Object} 更新报告对象
   */
  generateUpdateReport() {
    const stringsToAdd = this.findStringsToAdd();
    return {
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pageTitle: document.title,
      stringsToAdd: Array.from(stringsToAdd),
      totalNew: stringsToAdd.size,
    };
  }
  /**
   * 在控制台显示报告
   */
  showReportInConsole() {
    const report = this.generateUpdateReport();
    console.log('[GitHub 中文翻译] 字符串更新报告');
    console.log(`📄 页面: ${report.pageTitle}`);
    console.log(`✅ 找到 ${report.totalNew} 个新字符串`);
  }
}
/**
 * 词典处理器类
 */
class DictionaryProcessor {
  constructor() {
    this.processedCount = 0;
  }
  /**
   * 合并词典
   * @returns {Object} 合并后的词典
   */
  mergeDictionaries() {
    const merged = {};
    for (const module in translationModule) {
      Object.assign(merged, translationModule[module]);
    }
    return merged;
  }
  /**
   * 验证词典
   * @returns {Object} 词典验证结果
   */
  validateDictionary() {
    const dictionary = this.mergeDictionaries();
    const total = Object.keys(dictionary).length;
    const untranslated = Array.from(stringExtractor.findUntranslatedStrings(false)).length;
    return {
      totalEntries: total,
      translatedEntries: total - untranslated,
      completionRate: total > 0 ? (((total - untranslated) / total) * 100).toFixed(2) : '0.00',
    };
  }
  /**
   * 在控制台显示统计信息
   */
  showStatisticsInConsole() {
    const stats = this.validateDictionary();
    console.log('[GitHub 中文翻译] 词典统计');
    console.log(`📊 总条目数: ${stats.totalEntries}`);
    console.log(`✅ 已翻译条目: ${stats.translatedEntries}`);
    console.log(`📈 完成率: ${stats.completionRate}%`);
  }
}
/**
 * 加载工具类
 * @returns {Object} 包含工具类的对象
 */
function loadTools() {
  return {
    stringExtractor,
    AutoStringUpdater,
    DictionaryProcessor,
  };
}
/**
 * 页面监控缓存管理模块
 * @file pageMonitor/cacheManager.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 管理页面监控中的缓存
 */
const pageMonitorCache = {
  nodeCheckCache: new Map(),
  lastCacheCleanupTime: Date.now(),
  cacheCleanupTimerId: null,
  eventListeners: [],
  startCacheCleanupTimer() {
    this.stopCacheCleanupTimer();
    this.cacheCleanupTimerId = setInterval(() => {
      if (!this.isPageUnloading) {
        this.cleanupNodeCheckCache();
      }
    }, CONFIG.performance?.cacheCleanupInterval || 30000);
  },
  stopCacheCleanupTimer() {
    if (this.cacheCleanupTimerId) {
      clearInterval(this.cacheCleanupTimerId);
      this.cacheCleanupTimerId = null;
    }
  },
  cleanupNodeCheckCache() {
    try {
      const maxCacheSize = CONFIG.performance?.maxNodeCacheSize || 1000;
      if (this.nodeCheckCache.size > maxCacheSize) {
        const entriesToRemove = Math.floor(this.nodeCheckCache.size * 0.3);
        const keysToRemove = Array.from(this.nodeCheckCache.keys()).slice(0, entriesToRemove);
        keysToRemove.forEach((key) => {
          this.nodeCheckCache.delete(key);
        });
        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 清理了${keysToRemove.length}个节点检查缓存条目`);
        }
      }
      this.lastCacheCleanupTime = Date.now();
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 清理节点检查缓存失败:', error);
      }
    }
  },
  clearCache() {
    this.nodeCheckCache.clear();
  },
  addEventListener(listener) {
    this.eventListeners.push(listener);
    listener.target.addEventListener(listener.type, listener.handler);
  },
  cleanupEventListeners() {
    this.eventListeners.forEach((listener) => {
      try {
        listener.target.removeEventListener(listener.type, listener.handler);
      } catch (error) {
        console.warn('[GitHub 中文翻译] 移除事件监听器失败:', error);
      }
    });
    this.eventListeners = [];
  },
};
/**
 * 页面分析模块
 * @file pageMonitor/pageAnalyzer.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 分析页面类型和关键区域
 */
const pageAnalyzer = {
  isComplexPage() {
    const complexPaths = [/\/pull\/\d+/, /\/issues\/\d+/, /\/blob\//, /\/commit\//, /\/compare\//];
    return complexPaths.some((pattern) => pattern.test(window.location.pathname));
  },
  getQuickPathThresholdByPageMode(pageMode) {
    const thresholds = {
      search: 5,
      issues: 4,
      pullRequests: 4,
      wiki: 6,
      actions: 5,
      codespaces: 3,
    };
    return thresholds[pageMode] || 3;
  },
  getModeSpecificThreshold(pageMode) {
    const thresholds = {
      issues: 0.35,
      pullRequests: 0.35,
      wiki: 0.4,
      search: 0.3,
      codespaces: 0.25,
    };
    return thresholds[pageMode];
  },
  getMinTextLengthByPageMode(pageMode) {
    const lengths = {
      issues: 4,
      pullRequests: 4,
      wiki: 5,
      search: 3,
    };
    return lengths[pageMode] || CONFIG.performance?.minTextLengthToTranslate || 3;
  },
  shouldSkipElementByPageMode(element, pageMode) {
    if (!element || !pageMode) return false;
    if (
      element.tagName === 'CODE' ||
      element.tagName === 'SCRIPT' ||
      element.tagName === 'STYLE' ||
      element.classList.contains('blob-code')
    ) {
      return true;
    }
    switch (pageMode) {
      case 'codespaces':
        return (
          element.classList.contains('terminal') ||
          element.classList.contains('command-input') ||
          element.dataset.terminal
        );
      case 'wiki':
        return (
          element.classList.contains('codehilite') ||
          element.classList.contains('highlight') ||
          element.closest('.highlight')
        );
      case 'issues':
      case 'pullRequests':
        return element.classList.contains('blob-code') || element.classList.contains('diff-line');
      case 'search':
        if (element.classList.contains('search-match')) {
          return false;
        }
        return element.classList.contains('text-small') || element.classList.contains('link-gray');
      default:
        return false;
    }
  },
  identifyKeyTranslationAreas() {
    const keySelectors = [];
    const path = window.location.pathname;
    if (/\/pull\/\d+/.test(path) || /\/issues\/\d+/.test(path)) {
      keySelectors.push('.js-discussion', '.issue-details', '.js-issue-title', '.js-issue-labels');
    } else if (/\/blob\//.test(path)) {
      keySelectors.push('.blob-wrapper', '.file-header', '.file-info');
    } else if (/\/commit\//.test(path)) {
      keySelectors.push('.commit-meta', '.commit-files', '.commit-body', '.commit-desc');
    } else if (/\/notifications/.test(path)) {
      keySelectors.push('.notifications-list', '.notification-shelf');
    } else if (/\/actions/.test(path)) {
      keySelectors.push('.workflow-run-list', '.workflow-jobs', '.workflow-run-header');
    } else if (/\/settings/.test(path)) {
      keySelectors.push('.settings-content', '.js-settings-content');
    } else if (/\/projects/.test(path)) {
      keySelectors.push('.project-layout', '.project-columns');
    } else if (/\/wiki/.test(path)) {
      keySelectors.push('.wiki-wrapper', '.markdown-body');
    } else if (/\/search/.test(path)) {
      keySelectors.push('.codesearch-results', '.search-title');
    } else if (/\/orgs\//.test(path) || /\/users\//.test(path)) {
      keySelectors.push(
        '.org-profile',
        '.profile-timeline',
        '.user-profile-sticky-header',
        '.user-profile-main',
      );
    } else if (/\/repos\/\w+\/\w+/.test(path)) {
      keySelectors.push('.repository-content', '.repository-meta-content', '.readme');
    } else {
      keySelectors.push('.repository-content', '.profile-timeline', '.application-main', 'main');
    }
    const elements = [];
    for (const selector of keySelectors) {
      const element = document.querySelector(selector);
      if (element) {
        elements.push(element);
      }
    }
    if (elements.length === 0) {
      const genericSelectors = ['#js-pjax-container', '.application-main', 'main', 'body'];
      for (const selector of genericSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          elements.push(element);
          break;
        }
      }
    }
    return elements;
  },
};
/**
 * 路径变化监听模块
 * @file pageMonitor/pathListener.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 监听URL路径变化
 */
const pathListener = {
  lastPath: '',
  onPathChange: null,
  init(pathChangeCallback) {
    this.onPathChange = pathChangeCallback;
    this.lastPath = window.location.pathname + window.location.search;
    this.setupPathListener();
  },
  setupPathListener() {
    const popstateHandler = utils.debounce(() => {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== this.lastPath) {
        this.handlePathChange();
      }
    }, CONFIG.routeChangeDelay || 500);
    window.addEventListener('popstate', popstateHandler);
    pageMonitorCache.addEventListener({
      target: window,
      type: 'popstate',
      handler: popstateHandler,
    });
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      pathListener.handlePathChange();
    };
    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      pathListener.handlePathChange();
    };
  },
  handlePathChange() {
    try {
      const currentPath = window.location.pathname + window.location.search;
      this.lastPath = currentPath;
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 页面路径变化: ${currentPath}`);
      }
      if (this.onPathChange) {
        setTimeout(() => {
          this.onPathChange();
        }, CONFIG.routeChangeDelay || 500);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 路径变化处理失败:', error);
    }
  },
};
/**
 * DOM变化观察器模块
 * @file pageMonitor/domObserver.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 观察DOM变化并触发翻译
 */
import {
  isElementImportant,
  isElementIgnored,
  isMutationContentRelated,
  processMutationBatch,
  checkWeightedThreshold,
} from './domObserver.utils.js';
const domObserver = {
  observer: null,
  onTranslationTrigger: null,
  isPageUnloading: false,
  errorCount: 0,
  init(translationTriggerCallback) {
    this.onTranslationTrigger = translationTriggerCallback;
    this.setupDomObserver();
  },
  setupDomObserver() {
    try {
      if (this.observer) {
        try {
          this.observer.disconnect();
          this.observer = null;
        } catch (error) {
          if (CONFIG.debugMode) {
            console.warn('[GitHub 中文翻译] 断开现有observer失败:', error);
          }
        }
      }
      const pageMode = translationCore.detectPageMode();
      const rootNode = this.selectOptimalRootNode(pageMode);
      const observerConfig = this.getOptimizedObserverConfig(pageMode);
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 当前页面模式:', pageMode);
      }
      const handleMutations = (mutations) => {
        try {
          const pageMode = translationCore.detectPageMode();
          if (this.shouldTriggerTranslation(mutations, pageMode)) {
            if (this.onTranslationTrigger) {
              this.onTranslationTrigger();
            }
          }
        } catch (error) {
          console.error('[GitHub 中文翻译] 处理DOM变化时出错:', error);
        }
      };
      this.observer = new MutationObserver(
        utils.debounce(handleMutations, CONFIG.debounceDelay || 300),
      );
      if (rootNode) {
        try {
          this.observer.observe(rootNode, observerConfig);
          if (CONFIG.debugMode) {
            console.log(
              '[GitHub 中文翻译] DOM观察器已启动，观察范围:',
              rootNode.tagName + (rootNode.id ? '#' + rootNode.id : ''),
            );
          }
        } catch (error) {
          if (CONFIG.debugMode) {
            console.error('[GitHub 中文翻译] 启动DOM观察者失败:', error);
          }
          this.setupFallbackMonitoring();
        }
      } else {
        console.error('[GitHub 中文翻译] 无法找到合适的观察节点，回退到body');
        const domLoadedHandler = () => {
          try {
            this.setupDomObserver();
          } catch (error) {
            if (CONFIG.debugMode) {
              console.error('[GitHub 中文翻译] DOMContentLoaded后启动观察者失败:', error);
            }
          }
        };
        document.addEventListener('DOMContentLoaded', domLoadedHandler);
        pageMonitorCache.addEventListener({
          target: document,
          type: 'DOMContentLoaded',
          handler: domLoadedHandler,
        });
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 设置DOM观察器失败:', error);
      this.setupFallbackMonitoring();
    }
  },
  selectOptimalRootNode(pageMode) {
    const effectivePageMode = pageMode || translationCore.detectPageMode();
    let candidateSelectors;
    switch (effectivePageMode) {
      case 'search':
        candidateSelectors = ['.codesearch-results', '#js-pjax-container', 'main', 'body'];
        break;
      case 'issues':
      case 'pullRequests':
        candidateSelectors = [
          '.js-discussion',
          '.issue-details',
          '#js-issue-title',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'repository':
        candidateSelectors = [
          '#js-repo-pjax-container',
          '.repository-content',
          '.application-main',
          'body',
        ];
        break;
      case 'notifications':
        candidateSelectors = [
          '.notifications-list',
          '.notification-shelf',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'wiki':
        candidateSelectors = [
          '.wiki-wrapper',
          '.markdown-body',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'actions':
        candidateSelectors = [
          '.workflow-run-list',
          '.workflow-jobs',
          '.workflow-run-header',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'projects':
        candidateSelectors = [
          '.project-layout',
          '.project-columns',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      default:
        candidateSelectors = ['#js-pjax-container', 'main', '.application-main', 'body'];
    }
    for (const selector of candidateSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 0) {
        return element;
      }
    }
    return document.body;
  },
  getOptimizedObserverConfig(pageMode) {
    pageMode = pageMode || translationCore.detectPageMode();
    const baseConfig = { childList: true };
    if (!CONFIG.performance?.ignoreCharacterDataMutations) {
      baseConfig.characterData = true;
    }
    const complexPages = ['wiki', 'issues', 'pullRequests', 'markdown'];
    const simplePages = ['search', 'codespaces', 'marketplace'];
    if (complexPages.includes(pageMode)) {
      baseConfig.subtree = CONFIG.performance?.observeSubtree;
    } else if (simplePages.includes(pageMode)) {
      baseConfig.subtree = false;
    } else {
      baseConfig.subtree = CONFIG.performance?.observeSubtree;
    }
    if (CONFIG.performance?.observeAttributes && !CONFIG.performance?.ignoreAttributeMutations) {
      baseConfig.attributes = true;
      baseConfig.attributeFilter = CONFIG.performance?.importantAttributes || [
        'id',
        'class',
        'href',
        'title',
      ];
    }
    return baseConfig;
  },
  setupFallbackMonitoring() {
    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 使用降级监控方案');
    }
  },
  shouldTriggerTranslation(mutations, pageMode) {
    pageMode = pageMode || translationCore.detectPageMode();
    try {
      if (!mutations || mutations.length === 0) {
        return false;
      }
      const { mutationThreshold = 30, maxMutationProcessing = 50 } = CONFIG.performance || {};
      const quickPathThreshold = pageAnalyzer.getQuickPathThresholdByPageMode(pageMode);
      if (mutations.length <= quickPathThreshold) {
        return this.detectImportantChanges(mutations, pageMode);
      }
      const maxCheckCount = Math.min(
        mutations.length,
        Math.max(mutationThreshold, maxMutationProcessing),
      );
      const batchResult = processMutationBatch(
        mutations.slice(0, maxCheckCount),
        maxCheckCount,
        pageMode,
      );
      if (batchResult.shouldTrigger) {
        return true;
      }
      return checkWeightedThreshold(
        batchResult.contentChanges,
        batchResult.importantChanges,
        maxCheckCount,
        pageMode,
      );
    } catch (error) {
      console.error('[GitHub 中文翻译] 判断翻译触发条件时出错:', error);
      return false;
    }
  },
  detectImportantChanges(mutations, pageMode) {
    for (const mutation of mutations) {
      if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
        if (isElementImportant(mutation.target, [], new WeakMap(), pageMode)) {
          return true;
        }
      }
      if (isMutationContentRelated(mutation, pageMode)) {
        return true;
      }
    }
    return false;
  },
  isImportantElement(element, importantElements, cache, pageMode) {
    return isElementImportant(element, importantElements, cache, pageMode);
  },
  shouldIgnoreElement(node, ignoreElements, cache, pageMode) {
    return isElementIgnored(node, ignoreElements, cache, pageMode);
  },
  isContentRelatedMutation(mutation, pageMode) {
    return isMutationContentRelated(mutation, pageMode);
  },
  handleError(operation, error) {
    const errorMessage = `[GitHub 中文翻译] ${operation}时出错: ${error.message}`;
    if (CONFIG.debugMode) {
      console.error(errorMessage, error);
    } else {
      console.error(errorMessage);
    }
    this.errorCount++;
    if (this.errorCount > (CONFIG.performance?.maxErrorCount || 5)) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 错误次数过多，尝试重启监控');
      }
      setTimeout(() => {
        this.setupDomObserver();
      }, 1000);
      this.errorCount = 0;
    }
  },
  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
};
/**
 * 翻译触发模块
 * @file pageMonitor/translationTrigger.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 管理翻译触发和节流
 */
const translationTrigger = {
  lastTranslateTimestamp: 0,
  scheduledTranslate: null,
  translateWithThrottle() {
    try {
      const now = Date.now();
      const minInterval = CONFIG.performance?.minTranslateInterval || 500;
      const useSmartThrottling = CONFIG.performance?.useSmartThrottling !== false;
      if (useSmartThrottling) {
        const complexityFactor = pageAnalyzer.isComplexPage() ? 2 : 1;
        const adjustedInterval = minInterval * complexityFactor;
        if (now - this.lastTranslateTimestamp >= adjustedInterval) {
          return this.delayedTranslate(0);
        }
        if (!this.scheduledTranslate) {
          this.scheduledTranslate = setTimeout(() => {
            this.scheduledTranslate = null;
            this.delayedTranslate(0);
          }, minInterval);
        }
        return;
      }
      if (now - this.lastTranslateTimestamp >= minInterval) {
        return this.delayedTranslate(0);
      } else if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 翻译请求被节流，距离上次翻译${now - this.lastTranslateTimestamp}ms`,
        );
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 翻译触发失败:', error);
    }
  },
  async delayedTranslate() {
    try {
      this.lastTranslateTimestamp = Date.now();
      const keyAreas = pageAnalyzer.identifyKeyTranslationAreas();
      let startTime;
      if (CONFIG.debugMode && CONFIG.performance?.logTiming) {
        startTime = Date.now();
      }
      if (keyAreas.length > 0) {
        await this.processElementsInBatches(keyAreas);
        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 已翻译关键区域: ${keyAreas.length} 个`);
        }
      } else {
        await translationCore.translate();
        if (CONFIG.debugMode) {
          console.log('[GitHub 中文翻译] 已翻译整个页面');
        }
      }
      if (CONFIG.debugMode && CONFIG.performance?.logTiming) {
        console.log(`[GitHub 中文翻译] 翻译耗时: ${Date.now() - startTime}ms`);
      }
    } catch (error) {
      this.handleTranslationError(error);
    }
  },
  async processElementsInBatches(elements) {
    const batchSize = CONFIG.performance?.batchSize || 100;
    for (let i = 0; i < elements.length; i += batchSize) {
      const batch = elements.slice(i, i + batchSize);
      await translationCore.translate(batch);
    }
  },
  async handleTranslationError(error) {
    console.error('[GitHub 中文翻译] 翻译过程出错:', error);
    if (CONFIG.performance?.enableErrorRecovery !== false) {
      try {
        await translationCore.translateCriticalElementsOnly();
        if (CONFIG.debugMode) {
          console.log('[GitHub 中文翻译] 已尝试最小化翻译恢复');
        }
      } catch (recoverError) {
        console.error('[GitHub 中文翻译] 错误恢复失败:', recoverError);
      }
    }
  },
};
/**
 * 页面监控主模块
 * @file pageMonitor/index.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 页面监控主入口，整合所有子模块
 */
const pageMonitor = {
  isPageUnloading: false,
  init() {
    try {
      this.setupPageUnloadHandler();
      pathListener.init(() => {
        translationTrigger.translateWithThrottle();
      });
      domObserver.init(() => {
        translationTrigger.translateWithThrottle();
      });
      pageMonitorCache.startCacheCleanupTimer();
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 页面监控初始化完成');
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 页面监控初始化失败:', error);
    }
  },
  setupPageUnloadHandler() {
    const unloadHandler = () => {
      this.isPageUnloading = true;
      domObserver.isPageUnloading = true;
      pageMonitorCache.isPageUnloading = true;
      this.cleanup();
    };
    pageMonitorCache.addEventListener({
      target: window,
      type: 'beforeunload',
      handler: unloadHandler,
    });
    pageMonitorCache.addEventListener({
      target: window,
      type: 'unload',
      handler: unloadHandler,
    });
    pageMonitorCache.addEventListener({
      target: window,
      type: 'pagehide',
      handler: unloadHandler,
    });
  },
  translateWithThrottle() {
    return translationTrigger.translateWithThrottle();
  },
  stop() {
    try {
      domObserver.stop();
      pageMonitorCache.stopCacheCleanupTimer();
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 页面监控已停止');
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 停止监控失败:', error);
      }
    }
  },
  cleanup() {
    try {
      this.stop();
      pageMonitorCache.cleanupNodeCheckCache();
      pageMonitorCache.cleanupEventListeners();
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 页面监控资源已完全清理');
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 清理页面监控资源失败:', error);
      }
    }
  },
  restart() {
    this.stop();
    setTimeout(() => {
      this.init();
    }, 100);
  },
};
/**
 * 通用翻译词典
 * @file common.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含所有页面共用的翻译字符串
 */
const commonDictionary = {
  common: '通用',
  search: '搜索',
  new: '新建',
  actions: '操作',
  settings: '设置',
  help: '帮助',
  sign_in: '登录',
  sign_up: '注册',
  home: '首页',
  dashboard: '仪表盘',
  explore: '探索',
  notifications: '通知',
  profile: '个人资料',
  repositories: '仓库',
  projects: '项目',
  stars: '星标',
  followers: '关注者',
  following: '关注中',
  organizations: '组织',
  codespaces: '代码空间',
  marketplace: '应用市场',
  topics: '主题',
  trending: '趋势',
  pull_requests: '拉取请求',
  issues: '问题',
  wiki: '维基',
  security: '安全',
  insights: '洞察',
  packages: '包',
  code: '代码',
  commits: '提交',
  branches: '分支',
  tags: '标签',
  releases: '发布',
  contributors_tab: '贡献者',
  compare: '比较',
  new_issue: '新建问题',
  new_pull_request: '新建拉取请求',
  clone_or_download: '克隆或下载',
  watch: '关注',
  star: '星标',
  fork: '复刻',
  create: '创建',
  delete: '删除',
  edit: '编辑',
  save: '保存',
  cancel: '取消',
  close: '关闭',
  merge: '合并',
  rebase: '变基',
  squash: '压缩',
  approve: '批准',
  comment: '评论',
  assign: '分配',
  label: '标签',
  milestone: '里程碑',
  project: '项目',
  draft: '草稿',
  ready_for_review: '准备审核',
  review_changes: '审核更改',
  add_reviewer: '添加审核者',
  add_assignee: '添加负责人',
  add_label: '添加标签',
  add_milestone: '添加里程碑',
  add_project: '添加到项目',
  open: '打开',
  closed: '已关闭',
  merged: '已合并',
  locked: '已锁定',
  unlocked: '已解锁',
  all: '全部',
  open_issues: '打开的问题',
  closed_issues: '已关闭的问题',
  open_pull_requests: '打开的拉取请求',
  closed_pull_requests: '已关闭的拉取请求',
  merged_pull_requests: '已合并的拉取请求',
  your_issues: '你的问题',
  your_pull_requests: '你的拉取请求',
  assigned_issues: '分配给你的问题',
  mentioned_issues: '提及你的问题',
  milestones: '里程碑',
  labels: '标签',
  projects_board: '项目看板',
  wiki_pages: '维基页面',
  security_alerts: '安全警报',
  insights_overview: '洞察概览',
  traffic: '流量',
  community: '社区',
  dependency_graph: '依赖图',
  code_frequency: '代码频率',
  commit_activity: '提交活动',
  pulse: '动态',
  network: '网络',
  forks: '复刻',
  package_registry: '包注册表',
  action_workflows: 'Action 工作流',
  action_runs: 'Action 运行',
  action_jobs: 'Action 任务',
  marketplace_apps: '应用市场应用',
  topic_explore: '探索主题',
  trending_repositories_list: '趋势仓库',
  trending_developers: '趋势开发者',
  trending_collections: '趋势集合',
  personal_access_tokens: '个人访问令牌',
  ssh_keys: 'SSH 密钥',
  gpg_keys: 'GPG 密钥',
  security_log: '安全日志',
  billing: '账单',
  plan: '计划',
  email_preferences: '邮件偏好设置',
  notifications_settings: '通知设置',
  profile_settings: '个人资料设置',
  repository_settings: '仓库设置',
  organization_settings: '组织设置',
  team_settings: '团队设置',
  developer_settings: '开发者设置',
  api_settings: 'API 设置',
  webhooks: 'Webhooks',
  integrations: '集成',
  oauth_applications: 'OAuth 应用',
  github_apps: 'GitHub 应用',
  marketplace_listings: '应用市场列表',
  enterprise: '企业',
  admin: '管理员',
  moderator: '版主',
  member: '成员',
  guest: '访客',
  public: '公开',
  private: '私有',
  internal: '内部',
  forked_from: '从何处复刻',
  archived: '已归档',
  template: '模板',
  mirror: '镜像',
  fork_of: '复刻自',
  parent: '父仓库',
  source: '源仓库',
  forks_count: '复刻数',
  stars_count: '星标数',
  watchers_count: '关注数',
  issues_count: '问题数',
  pull_requests_count: '拉取请求数',
  commits_count: '提交数',
  branches_count: '分支数',
  tags_count: '标签数',
  releases_count: '发布数',
  contributors_count: '贡献者数',
  language: '语言',
  size: '大小',
  created_at: '创建于',
  updated_at: '更新于',
  pushed_at: '推送于',
  last_commit: '最后提交',
  readme: 'README',
  license: '许可证',
  contributing: '贡献指南',
  code_of_conduct: '行为准则',
  security_policy: '安全政策',
  support: '支持',
  sponsor: '赞助',
  sponsors: '赞助者',
  sponsoring: '赞助中',
  sponsor_this_project: '赞助此项目',
  become_a_sponsor: '成为赞助者',
  view_sponsors: '查看赞助者',
  sponsorship_tier: '赞助等级',
  sponsorship_rewards: '赞助奖励',
  sponsorship_history: '赞助历史',
  sponsorship_settings: '赞助设置',
  about: '关于',
  contact: '联系',
  blog: '博客',
  docs: '文档',
  status: '状态',
  terms: '条款',
  privacy: '隐私',
  cookies: 'Cookie',
  site_map: '网站地图',
  language_settings: '语言设置',
  theme_settings: '主题设置',
  accessibility_settings: '无障碍设置',
  developer_overview: '开发者概览',
  developer_blog: '开发者博客',
  developer_docs: '开发者文档',
  api_reference: 'API 参考',
  graphql_api: 'GraphQL API',
  rest_api: 'REST API',
  webhooks_api: 'Webhooks API',
  oauth_authorizations_api: 'OAuth 授权 API',
  apps_api: '应用 API',
  enterprise_api: '企业 API',
  developer_program: '开发者计划',
  github_campus_program: 'GitHub 校园计划',
  github_education: 'GitHub 教育',
  classroom: '教室',
  student_developer_pack: '学生开发者包',
  teacher_toolbox: '教师工具箱',
  campus_experts: '校园专家',
  education_community: '教育社区',
  education_events: '教育活动',
  education_blog: '教育博客',
  education_docs: '教育文档',
  enterprise_cloud: '企业云',
  enterprise_server: '企业服务器',
  enterprise_managed_users: '企业托管用户',
  enterprise_support: '企业支持',
  enterprise_partners: '企业合作伙伴',
  enterprise_events: '企业活动',
  enterprise_blog: '企业博客',
  enterprise_docs: '企业文档',
  security_advisories: '安全公告',
  security_blog: '安全博客',
  security_docs: '安全文档',
  security_labs: '安全实验室',
  security_community: '安全社区',
  security_events: '安全活动',
  community_standards: '社区标准',
  community_guidelines: '社区指南',
  community_blog: '社区博客',
  community_events: '社区活动',
  community_forums: '社区论坛',
  community_teams: '社区团队',
  community_projects: '社区项目',
  community_resources: '社区资源',
  community_support: '社区支持',
  open_source_guide: '开源指南',
  open_source_blog: '开源博客',
  open_source_events: '开源活动',
  open_source_projects: '开源项目',
  open_source_resources: '开源资源',
  open_source_support: '开源支持',
  open_source_program: '开源计划',
  open_source_community: '开源社区',
  open_source_licenses: '开源许可证',
  open_source_best_practices: '开源最佳实践',
  open_source_security: '开源安全',
  open_source_governance: '开源治理',
  open_source_metrics: '开源指标',
  open_source_funding: '开源 funding',
  open_source_careers: '开源职业',
  open_source_education: '开源教育',
  open_source_research: '开源研究',
  open_source_policy: '开源政策',
  open_source_advocacy: '开源倡导',
  open_source_outreach: '开源推广',
  open_source_collaboration: '开源协作',
  open_source_inclusion: '开源包容性',
  open_source_sustainability: '开源可持续性',
  navigation_menu: '导航菜单',
  toggle_navigation: '切换导航',
  appearance_settings: '外观设置',
  sign_out: '登出',
  reload: '重新加载',
  dismiss_alert: '关闭警告',
  error_loading_page: '加载时发生错误',
  sign_in_with_passkey: '使用通行密钥登录',
  manage_cookies: '管理 Cookie',
  do_not_share_info: '不要分享我的个人信息',
  action_not_available: '您现在无法执行此操作。',
  code_review: '代码审查',
  discussions: '讨论',
  code_search: '代码搜索',
  mcp_registry: 'MCP 注册表',
  view_all_features: '查看全部功能',
  by_company_size: '按公司规模',
  small_medium_teams: '中小型团队',
  by_use_case: '按使用场景',
  app_modernization: '应用现代化',
  devops: '开发运维',
  ci_cd: '持续集成/持续部署',
  view_all_use_cases: '查看全部使用场景',
  by_industry: '按行业',
  financial_services: '金融服务',
  view_all_industries: '查看全部行业',
  view_all_solutions: '查看全部解决方案',
  ai: '人工智能',
  software_development: '软件开发',
  view_all: '查看全部',
  learning_pathways: '学习路径',
  events_webinars: '活动与网络研讨会',
  ebooks_whitepapers: '电子书与白皮书',
  customer_stories: '客户案例',
  executive_insights: '高管见解',
  open_source: '开源',
  the_readme_project: 'ReadME 项目',
  enterprise_platform: '企业平台',
  ai_powered_platform: '人工智能驱动的开发者平台',
  available_addons: '可用附加组件',
  copilot_for_business: '商业版 Copilot',
  enterprise_grade_ai: '企业级人工智能功能',
  premium_support: '高级支持',
  enterprise_247_support: '企业级 24/7 支持',
  pricing: '价格',
  search_jump_to: '搜索或跳转到...',
  clear: '清除',
  search_syntax_tips: '搜索语法提示',
  provide_feedback: '提供反馈',
  read_feedback: '我们会阅读每一条反馈，并非常重视您的意见。',
  submit_feedback: '提交反馈',
  saved_searches: '已保存的搜索',
  use_saved_searches: '使用已保存的搜索更快地筛选结果',
  name: '名称',
  query: '查询',
  see_qualifiers: '查看我们的文档了解所有可用的限定符。',
  create_saved_search: '创建已保存的搜索',
  resetting_focus: '重置焦点',
  events: '活动',
  collections: '收藏集',
  curated_lists: '精选列表和对新兴行业、主题和社区的洞察。',
  trending_repository: '热门仓库',
  updated: '更新于',
  skip_to_content: '跳转到内容',
  you_signed_in_another_tab: '您已在另一个标签页或窗口中登录。请重新加载以刷新您的会话。',
  you_signed_out_another_tab: '您已在另一个标签页或窗口中登出。请重新加载以刷新您的会话。',
  about_this_repository: '关于此仓库',
  pull_request_description: '拉取请求描述',
  issue_description: '问题描述',
  commit_message: '提交消息',
  branch_name_field: '分支名称',
  file_name: '文件名',
  folder_name: '文件夹名称',
  description: '描述',
  website: '网站',
  languages: '语言',
  view_license: '许可证',
  view_documentation: '查看文档',
  contribute: '贡献',
  report_a_bug: '报告问题',
  request_a_feature: '请求功能',
  get_help: '获取帮助',
  choose_a_branch: '选择分支',
  compare_changes: '比较更改',
  create_a_pull_request: '创建拉取请求',
  no_changes: '无更改',
  changes_files: '更改文件',
  changes_commits: '更改提交',
  file_changed: '文件已更改',
  files_changed_in_pr: '文件已更改',
  lines_changed: '行已更改',
  additions: '添加',
  deletions: '删除',
  changes: '更改',
  add_your_review: '添加您的审查',
  submit_review: '提交审查',
  approve_review: '批准审查',
  request_changes: '请求更改',
  comment_review: '评论审查',
  start_a_review: '开始审查',
  pending_review: '待审查',
  review_required: '需要审查',
  approved: '已批准',
  changes_requested: '已请求更改',
  commented: '已评论',
  dismissed: '已驳回',
  review_has_been_dismissed: '审查已被驳回',
  you_can_open_a_new_issue: '您可以开启一个新的问题',
  this_branch_has_no_conflicts: '此分支没有冲突',
  this_branch_has_conflicts: '此分支有冲突',
  resolve_conflicts: '解决冲突',
  resolving_conflicts: '正在解决冲突',
  pull_request_successfully_merged: '拉取请求已成功合并',
  pull_request_closed: '拉取请求已关闭',
  merge_button: '合并按钮',
  squash_and_merge: '压缩并合并',
  rebase_and_merge: '变基并合并',
  create_merge_commit: '创建合并提交',
  delete_branch_action: '删除分支',
  restore_branch_action: '恢复分支',
  view_all_branches_action: '查看所有分支',
  default_branch_label: '默认分支',
  protected_branch: '受保护分支',
  branch_protection_rules: '分支保护规则',
  require_reviews: '需要审查',
  require_status_checks: '需要状态检查',
  require_linear_history: '需要线性历史',
  include_admins: '包括管理员',
  dismiss_stale_reviews: '忽略过期的审查',
  conversation_tab: '对话',
  commits_tab: '提交',
  checks_tab: '检查',
  changed_files: '文件已更改',
  title: '标题',
  body: '正文',
  add_title: '添加标题',
  add_body: '添加正文',
  write: '编写',
  preview: '预览',
  leave_a_comment: '发表评论',
  write_a_review: '撰写审查意见',
  suggest_a_change: '建议更改',
  attach_files: '附加文件',
  remove_preview: '移除预览',
  writing: '编写中',
  previewing: '预览中',
  add_an_issue: '添加问题',
  label_issues: '标记问题',
  create_new_issue: '新建问题',
  open_issue_tab: '开启问题',
  close_issue_tab: '关闭问题',
  edit_issue_tab: '编辑问题',
  delete_issue_tab: '删除问题',
  assign_issue_tab: '分配问题',
  transfer_issue_tab: '转移问题',
  lock_issue_tab: '锁定问题',
  unlock_issue_tab: '解锁问题',
  pin_issue_tab: '置顶问题',
  unpin_issue_tab: '取消置顶问题',
  open_milestone_tab: '里程碑',
  assignee_tab: '负责人',
  open_labels_tab: '标签',
  no_milestone_tab: '无里程碑',
  no_assignees_tab: '无负责人',
  no_labels_tab: '无标签',
  nobody_assigned: '未分配',
  nobody_reviewed: '未审查',
  needs_review: '需要审查',
  needs_rebase: '需要变基',
  checks_failed: '检查失败',
  checks_pending: '检查待定',
  checks_passed: '检查通过',
  required_checks: '必需检查',
  optional_checks: '可选检查',
  run_checks: '运行检查',
  rerun_checks: '重新运行检查',
  cancel_checks: '取消检查',
  rerun_all_checks: '重新运行所有检查',
  success: '成功',
  failure: '失败',
  error: '错误',
  pending: '待定',
  in_progress: '进行中',
  queued: '排队中',
  running: '运行中',
  completed: '已完成',
  skipped: '已跳过',
  cancelled: '已取消',
  action_required: '需要操作',
  waiting: '等待中',
  on_hold: '暂停',
  code_owners: '代码所有者',
  review_requester: '审查请求者',
  requested_reviewers: '请求的审查者',
  suggested_reviewers: '建议的审查者',
  assignees_tab: '负责人',
  author_tab: '作者',
  contributors: '贡献者',
  maintainers: '维护者',
  viewers: '查看者',
  collaborators: '协作者',
  outside_collaborators: '外部协作者',
  billing_managers: '账单管理员',
  owners: '所有者',
  direct_members: '直接成员',
  pending_invitations: '待处理邀请',
  organization_tab: '组织',
  teams: '团队',
  people_tab: '人员',
  outside: '外部',
  invitations: '邀请',
  your_repositories: '您的仓库',
  saved_replay: '保存的回复',
  saved_replies: '保存的回复',
  your_draft_issues: '您的草稿问题',
  your_organizations: '您的组织',
  your_projects: '您的项目',
  your_stars: '您的星标',
  your_gists: '您的代码片段',
  explore_repositories: '探索仓库',
  trending_repositories: '趋势仓库',
  all_features: '所有功能',
  latest: '最新',
  preview_releases: '预览发布',
  release_notes: '发布说明',
  new_release: '新建发布',
  edit_release: '编辑发布',
  delete_release: '删除发布',
  release_title: '发布标题',
  release_body: '发布正文',
  target: '目标',
  latest_version: '最新版本',
  pre_release: '预发布',
  publish_release: '发布发布',
  cancel_draft: '取消草稿',
  upgrade: '升级',
  downgrade: '降级',
  current: '当前',
  preview_version: '预览版本',
  latest_version_with_tag: '最新版本（带标签）',
  recent_commits: '最近提交',
  commit_history: '提交历史',
  commit_details: '提交详情',
  commit_SHA: '提交 SHA',
  commit_date: '提交日期',
  commit_author: '提交作者',
  commit_message_summary: '提交消息摘要',
  files: '文件',
  file_tree: '文件树',
  file_view: '文件视图',
  directory_view: '目录视图',
  blob_view: '文件视图',
  raw: '原始',
  blame: '责备',
  history: '历史',
  view_raw: '查看原始文件',
  view_blame: '查看责备',
  view_history: '查看历史',
  copy_path: '复制路径',
  copy_file: '复制文件',
  download: '下载',
  delete_file: '删除文件',
  edit_file: '编辑文件',
  add_file: '添加文件',
  upload_files: '上传文件',
  create_new_file: '创建新文件',
  find_file: '查找文件',
  file_name_cannot_be_empty: '文件名不能为空',
  file_already_exists: '文件已存在',
  branch: '分支',
  switch_branches: '切换分支',
  find_or_create_branch: '查找或创建分支',
  create_branch_action: '创建分支',
  delete_branch: '删除分支',
  rename_branch: '重命名分支',
  switch_to_default_branch: '切换到默认分支',
  view_more_branches: '查看更多分支',
  showing_recent_branches: '显示最近的分支',
  development: '开发',
  no_branch: '无分支',
  no_commits: '无提交',
  no_description: '无描述',
  no_readme: '无 README',
  no_packages: '无包',
  no_issues: '没有问题',
  no_pull_requests: '无拉取请求',
  no_projects: '无项目',
  no_wiki: '无维基',
  no_releases: '无发布',
  no_tags: '无标签',
  no_forks: '无复刻',
  no_stars: '无星标',
  no_watchers: '无关注者',
  no_subscribers: '无订阅者',
  no_commits_found: '未找到提交',
  no_results_found: '未找到结果',
  nothing_to_show: '没有可显示的内容',
  try_a_different_search: '尝试不同的搜索',
  reset_filters: '重置筛选',
  filter_results: '筛选结果',
  sort_results: '排序结果',
  filter_by_type: '按类型筛选',
  filter_by_language: '按语言筛选',
  filter_by_label: '按标签筛选',
  filter_by_assignee: '按负责人筛选',
  filter_by_milestone: '按里程碑筛选',
  filter_by_reviewer: '按审查者筛选',
  filter_by_status: '按状态筛选',
  filter_by_author: '按作者筛选',
  filter_by_date: '按日期筛选',
  this_repository: '此仓库',
  sign_in_to_repository: '登录仓库',
  for_repository: '用于仓库',
  about_repository: '关于仓库',
  repository_name: '仓库名称',
  owner: '所有者',
  visibility: '可见性',
  private_description: '私有仓库',
  public_description: '公开仓库',
  internal_description: '内部仓库',
  create_repository: '创建仓库',
  new_repository: '新建仓库',
  import_repository: '导入仓库',
  fork_repository: '复刻仓库',
  clone_repository: '克隆仓库',
  download_repository: '下载仓库',
  archive_repository: '归档仓库',
  transfer_repository: '转移仓库',
  delete_repository: '删除仓库',
  settings_repository: '仓库设置',
  confirm_delete: '确认删除',
  are_you_sure: '您确定吗？',
  this_action_cannot_be_undone: '此操作无法撤消',
  will_delete_repository: '将删除仓库',
  delete_this_repository: '删除此仓库',
  please_type_repository_name: '请输入仓库名称',
  you_are_about_to_delete: '您将要删除',
  type_repository_name_confirm: '输入仓库名称以确认',
  type: '类型',
  blank_issue: '空白问题',
  submit_new_issue: '提交新问题',
  open_a_blank_issue: '开启空白问题',
  before_creating_an_issue: '在创建问题之前',
  search_open_issues: '搜索开放的问题',
  search_closed_issues: '搜索已关闭的问题',
  search_open_pull_requests: '搜索开放的拉取请求',
  search_closed_pull_requests: '搜索已关闭的拉取请求',
  search_all_pull_requests: '搜索所有拉取请求',
  search_all_issues: '搜索所有问题',
  filter_issues: '筛选问题',
  sort_issues: '排序问题',
  open_milestones: '开放的里程碑',
  closed_milestones: '已关闭的里程碑',
  no_milestones: '无里程碑',
  current_milestone: '当前里程碑',
  next_milestone: '下一个里程碑',
  progress: '进度',
  complete: '完成',
  incomplete: '未完成',
  due_in: '截止于',
  overdue: '已过期',
  due_today: '今日到期',
  due_tomorrow: '明日到期',
  due_this_week: '本周到期',
  due_next_week: '下周到期',
  no_due_date: '无截止日期',
  percent_complete: '完成百分比',
  open_issues_and_pull_requests: '开放的问题和拉取请求',
  closed_issues_and_pull_requests: '已关闭的问题和拉取请求',
  keep_your_scope_narrow: '保持您的范围狭窄',
  keep_your_scope_broad: '保持您的范围广泛',
  add_labels: '添加标签',
  remove_labels: '移除标签',
  filter_labels: '筛选标签',
  edit_labels: '编辑标签',
  delete_labels: '删除标签',
  create_label: '创建标签',
  label_name: '标签名称',
  label_description: '标签描述',
  label_color: '标签颜色',
  search_labels: '搜索标签',
  no_labels_found: '未找到标签',
  no_more_labels: '没有更多标签',
  select_assignees: '选择负责人',
  assign_to_people: '分配给人员',
  assign_to_no_one: '不分配给任何人',
  search_for_someone: '搜索某人',
  no_assignees_available: '没有可用的负责人',
  you_are_not_assignable: '您不可被分配',
  only_collaborators_can_be_assigned: '只有协作者可以被分配',
  you_are_not_a_collaborator: '您不是协作者',
  manage_teams: '管理团队',
  manage_access: '管理访问权限',
  manage_tags: '管理标签',
  manage_milestones: '管理里程碑',
  manage_labels: '管理标签',
  manage_projects: '管理项目',
  close_as_completed: '标记为已完成',
  close_as_not_planned: '标记为未计划',
  locked_out: '已锁定讨论',
  convert_to_issue: '转换为问题',
  convert_issue_to_discussion: '将问题转换为讨论',
  convert_to_discussion: '转换为讨论',
  copy_link: '复制链接',
  share: '分享',
  quote_reply: '引用回复',
  reference_in_new_issue: '在新问题中引用',
  reference_in_issue: '在问题中引用',
  license_permissions: '许可证权限',
  license_limitations: '许可证限制',
  license_conditions: '许可证条件',
  no_license: '无许可证',
  license_name: '许可证名称',
  license_description: '许可证描述',
  license_url: '许可证 URL',
  license_full_name: '许可证全名',
  license_spdx_id: '许可证 SPDX ID',
  'Use this template': '使用此模板',
  'Generate new repository': '生成新仓库',
  'Use this template to create a new repository': '使用此模板创建新仓库',
  'Include all branches': '包含所有分支',
  Owner: '所有者',
  'Repository name': '仓库名称',
  'Description (optional)': '描述（可选）',
  Public: '公开',
  'Anyone on the internet can see this repository. You choose who can commit.':
    '互联网上的任何人都可以看到此仓库。您选择谁可以提交。',
  Private: '私有',
  'You choose who can see and commit to this repository.': '您选择谁可以查看和提交到此仓库。',
  'Create repository': '创建仓库',
  'Import a repository': '导入仓库',
  'New organization': '新建组织',
  'New project': '新建项目',
  'New gist': '新建代码片段',
  'Your profile': '您的个人资料',
  'Your repositories': '您的仓库',
  'Your projects': '您的项目',
  'Your stars': '您的星标',
  'Your gists': '您的代码片段',
  'Sign out': '登出',
  'Set status': '设置状态',
  Available: '有空',
  Busy: '忙碌',
  'Do not disturb': '请勿打扰',
  'In a meeting': '会议中',
  Commuting: '通勤中',
  Sick: '生病',
  Vacationing: '休假中',
  'Working remotely': '远程工作中',
  Focusing: '专注中',
  Presenting: '演示中',
  'Custom status': '自定义状态',
  'What’s on your mind?': '你在想什么？',
  'Clear status': '清除状态',
  'Set status message': '设置状态消息',
  'Set status emoji': '设置状态表情',
  'Set status until': '设置状态至',
  Never: '从不',
  Today: '今天',
  'This week': '本周',
  'Custom date': '自定义日期',
  Save: '保存',
  Cancel: '取消',
  'Quick setup — if you’ve done this kind of thing before': '快速设置 — 如果您之前做过这种事',
  'Get started by creating a new file or uploading an existing file. We recommend every repository include a README, LICENSE, and .gitignore.':
    '通过创建新文件或上传现有文件开始。我们建议每个仓库都包含 README、LICENSE 和 .gitignore。',
  '…or create a new repository on the command line': '…或在命令行上创建新仓库',
  '…or push an existing repository from the command line': '…或从命令行推送现有仓库',
  '…or import code from another repository': '…或从另一个仓库导入代码',
  'You can initialize this repository with code from a Subversion, Mercurial, or TFS project.':
    '您可以使用 Subversion、Mercurial 或 TFS 项目的代码初始化此仓库。',
  'Import code': '导入代码',
  'Create new file': '创建新文件',
  'Upload files': '上传文件',
  'Find file': '查找文件',
  'Go to file': '前往文件',
  Preview: '预览',
  Code: '代码',
  'Preview changes': '预览更改',
  'No changes': '无更改',
  'Edit new file': '编辑新文件',
  'Commit changes': '提交更改',
  'Commit directly to the main branch.': '直接提交到 main 分支。',
  'Create a new branch for this commit and start a pull request.':
    '为此提交创建一个新分支并开始拉取请求。',
  'Learn more about pull requests.': '了解更多关于拉取请求的信息。',
  'Propose new file': '提议新文件',
  'Propose changes': '提议更改',
  'Create pull request': '创建拉取请求',
  'Draft pull request': '草稿拉取请求',
  'Create draft pull request': '创建草稿拉取请求',
  'You’re all set!': '一切就绪！',
  'The repository has been created.': '仓库已创建。',
  'The file has been added.': '文件已添加。',
  'The file has been updated.': '文件已更新。',
  'The file has been deleted.': '文件已删除。',
  'The pull request has been created.': '拉取请求已创建。',
  'The issue has been created.': '问题已创建。',
  'The comment has been added.': '评论已添加。',
  'The comment has been updated.': '评论已更新。',
  'The comment has been deleted.': '评论已删除。',
  'The label has been added.': '标签已添加。',
  'The label has been removed.': '标签已移除。',
  'The milestone has been added.': '里程碑已添加。',
  'The milestone has been removed.': '里程碑已移除。',
  'The assignee has been added.': '负责人已添加。',
  'The assignee has been removed.': '负责人已移除。',
  'The reviewer has been added.': '审查者已添加。',
  'The reviewer has been removed.': '审查者已移除。',
  'The project has been added.': '项目已添加。',
  'The project has been removed.': '项目已移除。',
  'The issue has been closed.': '问题已关闭。',
  'The issue has been reopened.': '问题已重新打开。',
  'The pull request has been closed.': '拉取请求已关闭。',
  'The pull request has been reopened.': '拉取请求已重新打开。',
  'The pull request has been merged.': '拉取请求已合并。',
  'The branch has been deleted.': '分支已删除。',
  'The branch has been restored.': '分支已恢复。',
  'The release has been created.': '发布已创建。',
  'The release has been published.': '发布已发布。',
  'The release has been updated.': '发布已更新。',
  'The release has been deleted.': '发布已删除。',
  'The tag has been created.': '标签已创建。',
  'The tag has been deleted.': '标签已删除。',
  'The repository has been archived.': '仓库已归档。',
  'The repository has been unarchived.': '仓库已取消归档。',
  'The repository has been transferred.': '仓库已转移。',
  'The repository has been deleted.': '仓库已删除。',
  'The organization has been created.': '组织已创建。',
  'The organization has been deleted.': '组织已删除。',
  'The team has been created.': '团队已创建。',
  'The team has been deleted.': '团队已删除。',
  'The team has been updated.': '团队已更新。',
  'The member has been added.': '成员已添加。',
  'The member has been removed.': '成员已移除。',
  'The invite has been sent.': '邀请已发送。',
  'The invite has been canceled.': '邀请已取消。',
  'The invite has been accepted.': '邀请已接受。',
  'The invite has been declined.': '邀请已拒绝。',
  'The SSH key has been added.': 'SSH 密钥已添加。',
  'The SSH key has been deleted.': 'SSH 密钥已删除。',
  'The GPG key has been added.': 'GPG 密钥已添加。',
  'The GPG key has been deleted.': 'GPG 密钥已删除。',
  'The personal access token has been created.': '个人访问令牌已创建。',
  'The personal access token has been deleted.': '个人访问令牌已删除。',
  'The personal access token has been regenerated.': '个人访问令牌已重新生成。',
  'The webhook has been added.': 'Webhook 已添加。',
  'The webhook has been deleted.': 'Webhook 已删除。',
  'The webhook has been updated.': 'Webhook 已更新。',
  'The secret has been added.': '密钥已添加。',
  'The secret has been deleted.': '密钥已删除。',
  'The secret has been updated.': '密钥已更新。',
  'The variable has been added.': '变量已添加。',
  'The variable has been deleted.': '变量已删除。',
  'The variable has been updated.': '变量已更新。',
  'The environment has been created.': '环境已创建。',
  'The environment has been deleted.': '环境已删除。',
  'The environment has been updated.': '环境已更新。',
  'The deployment has been created.': '部署已创建。',
  'The deployment has been deleted.': '部署已删除。',
  'The deployment has been updated.': '部署已更新。',
  'The workflow has been created.': '工作流已创建。',
  'The workflow has been deleted.': '工作流已删除。',
  'The workflow has been updated.': '工作流已更新。',
  'The workflow run has been started.': '工作流运行已启动。',
  'The workflow run has been canceled.': '工作流运行已取消。',
  'The workflow run has been deleted.': '工作流运行已删除。',
  'The workflow run has been re-run.': '工作流运行已重新运行。',
  'The job has been started.': '任务已启动。',
  'The job has been canceled.': '任务已取消。',
  'The job has been re-run.': '任务已重新运行。',
  'The step has been started.': '步骤已启动。',
  'The step has been completed.': '步骤已完成。',
  'The step has failed.': '步骤已失败。',
  'The step has been skipped.': '步骤已跳过。',
  'The action has been used.': '动作已使用。',
  'The action has been published.': '动作已发布。',
  'The action has been updated.': '动作已更新。',
  'The action has been deleted.': '动作已删除。',
  'The package has been published.': '包已发布。',
  'The package has been updated.': '包已更新。',
  'The package has been deleted.': '包已删除。',
  'The package has been downloaded.': '包已下载。',
  'The container has been published.': '容器已发布。',
  'The container has been updated.': '容器已更新。',
  'The container has been deleted.': '容器已删除。',
  'The container has been downloaded.': '容器已下载。',
  'The dependency has been added.': '依赖已添加。',
  'The dependency has been removed.': '依赖已移除。',
  'The dependency has been updated.': '依赖已更新。',
  'The vulnerability has been found.': '漏洞已发现。',
  'The vulnerability has been fixed.': '漏洞已修复。',
  'The vulnerability has been dismissed.': '漏洞已忽略。',
  'The alert has been created.': '警报已创建。',
  'The alert has been closed.': '警报已关闭。',
  'The alert has been reopened.': '警报已重新打开。',
  'The alert has been dismissed.': '警报已忽略。',
  'The secret scanning alert has been created.': '密钥扫描警报已创建。',
  'The secret scanning alert has been closed.': '密钥扫描警报已关闭。',
  'The secret scanning alert has been reopened.': '密钥扫描警报已重新打开。',
  'The secret scanning alert has been resolved.': '密钥扫描警报已解决。',
  'The secret scanning alert has been revoked.': '密钥扫描警报已撤销。',
  'The code scanning alert has been created.': '代码扫描警报已创建。',
  'The code scanning alert has been closed.': '代码扫描警报已关闭。',
  'The code scanning alert has been reopened.': '代码扫描警报已重新打开。',
  'The code scanning alert has been dismissed.': '代码扫描警报已忽略。',
  'The code scanning alert has been fixed.': '代码扫描警报已修复。',
  'The dependabot alert has been created.': 'Dependabot 警报已创建。',
  'The dependabot alert has been closed.': 'Dependabot 警报已关闭。',
  'The dependabot alert has been reopened.': 'Dependabot 警报已重新打开。',
  'The dependabot alert has been dismissed.': 'Dependabot 警报已忽略。',
  'The dependabot pull request has been created.': 'Dependabot 拉取请求已创建。',
  'The dependabot pull request has been merged.': 'Dependabot 拉取请求已合并。',
  'The dependabot pull request has been closed.': 'Dependabot 拉取请求已关闭。',
  'The discussion has been created.': '讨论已创建。',
  'The discussion has been closed.': '讨论已关闭。',
  'The discussion has been reopened.': '讨论已重新打开。',
  'The discussion has been locked.': '讨论已锁定。',
  'The discussion has been unlocked.': '讨论已解锁。',
  'The discussion has been pinned.': '讨论已置顶。',
  'The discussion has been unpinned.': '讨论已取消置顶。',
  'The discussion has been transferred.': '讨论已转移。',
  'The discussion has been converted to an issue.': '讨论已转换为问题。',
  'The discussion has been converted to a pull request.': '讨论已转换为拉取请求。',
  'The comment has been pinned.': '评论已置顶。',
  'The comment has been unpinned.': '评论已取消置顶。',
  'The comment has been marked as answer.': '评论已标记为答案。',
  'The comment has been unmarked as answer.': '评论已取消标记为答案。',
  'The reaction has been added.': '反应已添加。',
  'The reaction has been removed.': '反应已移除。',
  'The star has been added.': '星标已添加。',
  'The star has been removed.': '星标已移除。',
  'The watch has been added.': '关注已添加。',
  'The watch has been removed.': '关注已移除。',
  'The fork has been created.': '复刻已创建。',
  'The fork has been deleted.': '复刻已删除。',
  'The gist has been created.': '代码片段已创建。',
  'The gist has been updated.': '代码片段已更新。',
  'The gist has been deleted.': '代码片段已删除。',
  'The gist has been forked.': '代码片段已复刻。',
  'The gist has been starred.': '代码片段已加星标。',
  'The gist has been unstarred.': '代码片段已取消星标。',
  'The gist has been commented on.': '代码片段已评论。',
  'The repository has been starred.': '仓库已加星标。',
  'The repository has been unstarred.': '仓库已取消星标。',
  'The repository has been watched.': '仓库已关注。',
  'The repository has been unwatched.': '仓库已取消关注。',
  'The repository has been forked.': '仓库已复刻。',
  'The repository has been cloned.': '仓库已克隆。',
  'The repository has been downloaded.': '仓库已下载。',
  'The repository has been made public.': '仓库已公开。',
  'The repository has been made private.': '仓库已设为私有。',
  'The repository has been made internal.': '仓库已设为内部。',
  'The repository has been renamed.': '仓库已重命名。',
  'The repository has been moved.': '仓库已移动。',
  'The repository has been duplicated.': '仓库已复制。',
  'The repository has been mirrored.': '仓库已镜像。',
  'The repository has been templated.': '仓库已设为模板。',
  'The repository has been untemplated.': '仓库已取消模板。',
  'The repository has been enabled for GitHub Discussions.': '仓库已启用 GitHub 讨论。',
  'The repository has been disabled for GitHub Discussions.': '仓库已禁用 GitHub 讨论。',
  'The repository has been enabled for GitHub Actions.': '仓库已启用 GitHub Actions。',
  'The repository has been disabled for GitHub Actions.': '仓库已禁用 GitHub Actions。',
  'The repository has been enabled for GitHub Packages.': '仓库已启用 GitHub Packages。',
  'The repository has been disabled for GitHub Packages.': '仓库已禁用 GitHub Packages。',
  'The repository has been enabled for GitHub Pages.': '仓库已启用 GitHub Pages。',
  'The repository has been disabled for GitHub Pages.': '仓库已禁用 GitHub Pages。',
  'The repository has been enabled for GitHub Security.': '仓库已启用 GitHub 安全。',
  'The repository has been disabled for GitHub Security.': '仓库已禁用 GitHub 安全。',
  'The repository has been enabled for GitHub Issues.': '仓库已启用 GitHub 问题。',
  'The repository has been disabled for GitHub Issues.': '仓库已禁用 GitHub 问题。',
  'The repository has been enabled for GitHub Projects.': '仓库已启用 GitHub 项目。',
  'The repository has been disabled for GitHub Projects.': '仓库已禁用 GitHub 项目。',
  'The repository has been enabled for GitHub Wiki.': '仓库已启用 GitHub 维基。',
  'The repository has been disabled for GitHub Wiki.': '仓库已禁用 GitHub 维基。',
  'The repository has been enabled for GitHub Sponsors.': '仓库已启用 GitHub 赞助。',
  'The repository has been disabled for GitHub Sponsors.': '仓库已禁用 GitHub 赞助。',
  'The repository has been enabled for LFS.': '仓库已启用 LFS。',
  'The repository has been disabled for LFS.': '仓库已禁用 LFS。',
  'The repository has been enabled for Git Large File Storage.': '仓库已启用 Git 大文件存储。',
  'The repository has been disabled for Git Large File Storage.': '仓库已禁用 Git 大文件存储。',
  'The repository has been enabled for Dependabot.': '仓库已启用 Dependabot。',
  'The repository has been disabled for Dependabot.': '仓库已禁用 Dependabot。',
  'The repository has been enabled for Code Scanning.': '仓库已启用代码扫描。',
  'The repository has been disabled for Code Scanning.': '仓库已禁用代码扫描。',
  'The repository has been enabled for Secret Scanning.': '仓库已启用密钥扫描。',
  'The repository has been disabled for Secret Scanning.': '仓库已禁用密钥扫描。',
  'The repository has been enabled for Dependency Review.': '仓库已启用依赖审查。',
  'The repository has been disabled for Dependency Review.': '仓库已禁用依赖审查。',
  'The repository has been enabled for Pull Request Reviews.': '仓库已启用拉取请求审查。',
  'The repository has been disabled for Pull Request Reviews.': '仓库已禁用拉取请求审查。',
  'The repository has been enabled for Merge Queues.': '仓库已启用合并队列。',
  'The repository has been disabled for Merge Queues.': '仓库已禁用合并队列。',
  'The repository has been enabled for Rulesets.': '仓库已启用规则集。',
  'The repository has been disabled for Rulesets.': '仓库已禁用规则集。',
  'The repository has been enabled for Protected Branches.': '仓库已启用受保护分支。',
  'The repository has been disabled for Protected Branches.': '仓库已禁用受保护分支。',
  'The repository has been enabled for Branch Protection Rules.': '仓库已启用分支保护规则。',
  'The repository has been disabled for Branch Protection Rules.': '仓库已禁用分支保护规则。',
  'The repository has been enabled for Tag Protection Rules.': '仓库已启用标签保护规则。',
  'The repository has been disabled for Tag Protection Rules.': '仓库已禁用标签保护规则。',
  'The repository has been enabled for Required Status Checks.': '仓库已启用必需状态检查。',
  'The repository has been disabled for Required Status Checks.': '仓库已禁用必需状态检查。',
  'The repository has been enabled for Required Pull Request Reviews.':
    '仓库已启用必需拉取请求审查。',
  'The repository has been disabled for Required Pull Request Reviews.':
    '仓库已禁用必需拉取请求审查。',
  'The repository has been enabled for Required Signatures.': '仓库已启用必需签名。',
  'The repository has been disabled for Required Signatures.': '仓库已禁用必需签名。',
  'The repository has been enabled for Linear History.': '仓库已启用线性历史。',
  'The repository has been disabled for Linear History.': '仓库已禁用线性历史。',
  'The repository has been enabled for Allow Force Pushes.': '仓库已启用允许强制推送。',
  'The repository has been disabled for Allow Force Pushes.': '仓库已禁用允许强制推送。',
  'The repository has been enabled for Allow Deletions.': '仓库已启用允许删除。',
  'The repository has been disabled for Allow Deletions.': '仓库已禁用允许删除。',
  'The repository has been enabled for Allow Fork Syncing.': '仓库已启用允许复刻同步。',
  'The repository has been disabled for Allow Fork Syncing.': '仓库已禁用允许复刻同步。',
  'The repository has been enabled for Allow Merge Commits.': '仓库已启用允许合并提交。',
  'The repository has been disabled for Allow Merge Commits.': '仓库已禁用允许合并提交。',
  'The repository has been enabled for Allow Squash Merging.': '仓库已启用允许压缩合并。',
  'The repository has been disabled for Allow Squash Merging.': '仓库已禁用允许压缩合并。',
  'The repository has been enabled for Allow Rebase Merging.': '仓库已启用允许变基合并。',
  'The repository has been disabled for Allow Rebase Merging.': '仓库已禁用允许变基合并。',
  'The repository has been enabled for Allow Auto-Merge.': '仓库已启用允许自动合并。',
  'The repository has been disabled for Allow Auto-Merge.': '仓库已禁用允许自动合并。',
  'The repository has been enabled for Automatically Delete Head Branches.':
    '仓库已启用自动删除头部分支。',
  'The repository has been disabled for Automatically Delete Head Branches.':
    '仓库已禁用自动删除头部分支。',
  // GitHub 首页 / Landing Page
  'The future of building happens together': '共同构建未来',
  'Try GitHub Copilot': '尝试 GitHub Copilot',
  'GitHub features': 'GitHub 功能',
  'GitHub customers': 'GitHub 客户',
  'Accelerate your entire workflow': '加速您的工作流程',
  'Automate your path to production': '自动化您的生产之路',
  'Code instantly from anywhere': '随时随地即时编写代码',
  'Keep momentum on the go': '随时保持动力',
  'Shape your toolchain': '塑造您的工具链',
  'Built-in application security where found means fixed': '内置应用安全，发现即修复',
  'Work together, achieve more': '协作共进',
  'Millions of developers and businesses call GitHub home': '数百万开发者和企业选择 GitHub',
  Technology: '科技',
  Automotive: '汽车',
  'Figma streamlines development and strengthens security': 'Figma 简化开发并加强安全',
  'Mercedes-Benz standardizes source code and automates onboarding':
    '梅赛德斯-奔驰标准化源代码并自动化入职流程',
  'Mercado Libre cuts coding time by 50%': 'Mercado Libre 将编码时间缩短 50%',
  // 个人资料页面
  Overview: '概览',
  Pinned: '置顶',
  Achievements: '成就',
};
/**
 * Codespaces 页面翻译词典
 * @file codespaces.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含 GitHub Codespaces 页面的翻译词典
 */
const codespacesDictionary = {
  'Skip to content': '跳转到内容',
  'You signed in with another tab or window. Reload to refresh your session.':
    '您已在另一个标签页或窗口中登录。请重新加载以刷新您的会话。',
  Reload: '重新加载',
  'You signed out in another tab or window. Reload to refresh your session.':
    '您已在另一个标签页或窗口中登出。请重新加载以刷新您的会话。',
  'Dismiss alert': '关闭警告',
  'Uh oh!\n\n              There was an error while loading. Please reload this page.':
    '哎呀！\n\n              加载时发生错误。请重新加载此页面。',
  'Uh oh!': '哎呀！',
  'There was an error while loading. Please reload this page.':
    '加载时发生错误。请重新加载此页面。',
  'Please reload this page': '请重新加载此页面',
  'Sign in with a passkey': '使用通行密钥登录',
  Terms: '条款',
  Privacy: '隐私',
  Docs: '文档',
  'Manage cookies': '管理 Cookie',
  'Do not share my personal information': '不要分享我的个人信息',
  "You can't perform that action at this time.": '您现在无法执行此操作。',
};
/**
 * Explore 页面翻译词典
 * @file explore.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 包含 GitHub Explore 页面的翻译词典
 */
const exploreDictionary = {
  'Navigation Menu': '导航菜单',
  'Toggle navigation': '切换导航',
  'Sign in\n          \n              \n    \n        \n    \n\nAppearance settings':
    '登录\n          \n              \n    \n        \n    \n\n外观设置',
  'Sign in': '登录',
  'Appearance settings': '外观设置',
  New: '新建',
  'Actions\n\n        \n\n        Automate any workflow':
    'Actions\n\n        \n\n        自动化任何工作流',
  Actions: 'Actions',
  'Codespaces\n\n        \n\n        Instant dev environments':
    'Codespaces\n\n        \n\n        即时开发环境',
  'Issues\n\n        \n\n        Plan and track work':
    'Issues\n\n        \n\n        计划和跟踪工作',
  Issues: '问题',
  'Code Review\n\n        \n\n        Manage code changes':
    '代码审查\n\n        \n\n        管理代码变更',
  'Code Review': '代码审查',
  'Discussions\n\n        \n\n        Collaborate outside of code':
    '讨论\n\n        \n\n        代码外的协作',
  'Code Search\n\n        \n\n        Find more, search less':
    '代码搜索\n\n        \n\n        查找更多，搜索更少',
  'Code Search': '代码搜索',
  Explore: '探索',
  Blog: '博客',
  'MCP Registry': 'MCP 注册表',
  'View all features': '查看全部功能',
  'By company size': '按公司规模',
  'Small and medium teams': '中小型团队',
  'By use case': '按使用场景',
  'App Modernization': '应用现代化',
  DevOps: '开发运维',
  'CI/CD': '持续集成/持续部署',
  'View all use cases': '查看全部使用场景',
  'By industry': '按行业',
  'Financial services': '金融服务',
  'View all industries': '查看全部行业',
  'View all solutions': '查看全部解决方案',
  Topics: '主题',
  AI: '人工智能',
  'Software Development': '软件开发',
  'View all': '查看全部',
  'Learning Pathways': '学习路径',
  'Events & Webinars': '活动与网络研讨会',
  'Ebooks & Whitepapers': '电子书与白皮书',
  'Customer Stories': '客户案例',
  'Executive Insights': '高管见解',
  'Open Source': '开源',
  'The ReadME Project': 'ReadME 项目',
  'Enterprise platform\n\n        \n\n        AI-powered developer platform':
    '企业平台\n\n        \n\n        人工智能驱动的开发者平台',
  'Enterprise platform': '企业平台',
  'Available add-ons': '可用附加组件',
  'Copilot for business\n\n        \n\n        Enterprise-grade AI features':
    '商业版 Copilot\n\n        \n\n        企业级人工智能功能',
  'Copilot for business': '商业版 Copilot',
  'Premium Support\n\n        \n\n        Enterprise-grade 24/7 support':
    '高级支持\n\n        \n\n        企业级 24/7 支持',
  'Premium Support': '高级支持',
  Pricing: '价格',
  'Search or jump to...': '搜索或跳转到...',
  Search: '搜索',
  Clear: '清除',
  'Search syntax tips': '搜索语法提示',
  'Provide feedback': '提供反馈',
  'We read every piece of feedback, and take your input very seriously.':
    '我们会阅读每一条反馈，并非常重视您的意见。',
  'Cancel\n\n              Submit feedback': '取消\n\n              提交反馈',
  Cancel: '取消',
  'Submit feedback': '提交反馈',
  'Saved searches\n      \n        Use saved searches to filter your results more quickly':
    '已保存的搜索\n      \n        使用已保存的搜索更快地筛选结果',
  'Saved searches': '已保存的搜索',
  'Use saved searches to filter your results more quickly': '使用已保存的搜索更快地筛选结果',
  Name: '名称',
  Query: '查询',
  'To see all available qualifiers, see our documentation.': '查看我们的文档了解所有可用的限定符。',
  'Cancel\n\n              Create saved search': '取消\n\n              创建已保存的搜索',
  'Create saved search': '创建已保存的搜索',
  'Sign up': '注册',
  'Resetting focus': '重置焦点',
  Events: '活动',
  'Collections\n    Curated lists and insight into burgeoning industries, topics, and communities.':
    '收藏集\n    精选列表和对新兴行业、主题和社区的洞察。',
  'Curated lists and insight into burgeoning industries, topics, and communities.':
    '精选列表和对新兴行业、主题和社区的洞察。',
  'Pixel Art Tools': '像素艺术工具',
  'Learn to Code\n    Resources to help people learn to code':
    '学习编程\n    帮助人们学习编程的资源',
  'Learn to Code': '学习编程',
  'Resources to help people learn to code': '帮助人们学习编程的资源',
  '#\n    Game Engines\n    Frameworks for building games across multiple platforms.':
    '#\n    游戏引擎\n    用于跨平台构建游戏的框架。',
  'Game Engines': '游戏引擎',
  'Frameworks for building games across multiple platforms.': '用于跨平台构建游戏的框架。',
  'How to choose (and contribute to) your first open source project':
    '如何选择（并贡献于）您的第一个开源项目',
  'Clean code linters': '代码整洁检查工具',
  'Open journalism': '开放新闻业',
  'Design essentials': '设计基础',
  '#\n    \n\n    \n      Music\n      Drop the code bass with these musically themed repositories.':
    '#\n    \n\n    \n      音乐\n      用这些音乐主题的仓库释放代码节奏。',
  'Music\n      Drop the code bass with these musically themed repositories.':
    '音乐\n      用这些音乐主题的仓库释放代码节奏。',
  Music: '音乐',
  'Government apps': '政府应用',
  'DevOps tools': 'DevOps 工具',
  'Front-end JavaScript frameworks': '前端 JavaScript 框架',
  'Hacking Minecraft': 'Minecraft 黑客技术',
  'JavaScript Game Engines': 'JavaScript 游戏引擎',
  'Learn to Code\n      Resources to help people learn to code':
    '学习编程\n      帮助人们学习编程的资源',
  'Getting started with machine learning': '机器学习入门',
  'Made in Africa': '非洲制造',
  'Net neutrality\n      Software, research, and organizations protecting the free and open internet.':
    '网络中立性\n      保护自由开放互联网的软件、研究和组织。',
  'Net neutrality': '网络中立性',
  'Open data': '开放数据',
  'Open source organizations\n      A showcase of organizations showcasing their open source projects.':
    '开源组织\n      展示开源项目的组织展示。',
  'Open source organizations': '开源组织',
  'Software productivity tools': '软件生产力工具',
  'Load more…': '加载更多…',
  Footer: '页脚',
  'Footer navigation': '页脚导航',
  Status: '状态',
  Contact: '联系',
  'The Download': 'The Download',
  'Get the latest developer and open source news': '获取最新的开发者和开源新闻',
  'Trending repository': '热门仓库',
  'juspay          /\n          hyperswitch': 'juspay          /\n          hyperswitch',
  juspay: 'juspay',
  'Star\n          35.6k': '星标\n          35.6k',
  Star: '星标',
  '35.6k': '35.6k',
  Code: '代码',
  'Pull requests': '拉取请求',
  'An open source payments switch written in Rust to make payments fast, reliable and affordable':
    '一个用 Rust 编写的开源支付交换机，使支付变得快速、可靠且经济实惠',
  rust: 'rust',
  redis: 'redis',
  'open-source': '开源',
  finance: '金融',
  sdk: 'SDK',
  'high-performance': '高性能',
  'beginner-friendly': '对初学者友好',
  'works-with-react': '兼容 React',
  'Updated\n            Oct 4, 2025': '更新于\n            2025年10月4日',
};
/**
 * 翻译词典合并模块
 * @file index.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 整合所有页面的翻译词典
 */
/**
 * 翻译词典对象，包含所有需要翻译的字符串
 */
const translationModule = {
  common: commonDictionary,
  codespaces: codespacesDictionary,
  explore: exploreDictionary,
  // 可以根据需要添加更多页面的词典
};
/**
 * 合并所有词典为一个完整的词典对象
 * @returns {Object} 合并后的词典
 */
function mergeAllDictionaries() {
  const merged = {};
  for (const module in translationModule) {
    Object.assign(merged, translationModule[module]);
  }
  return merged;
}
/**
 * 翻译词典管理模块
 * @file translationCore/dictionaryManager.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 管理翻译词典的加载和查询
 */
const dictionaryManager = {
  dictionary: {},
  dictionaryHash: new Map(),
  dictionaryTrie: new Trie(),
  regexCache: new Map(),
  cacheManager: null,
  init() {
    try {
      let startTime;
      if (CONFIG.debugMode) {
        startTime = Date.now();
      }
      this.cacheManager = new CacheManager(CONFIG.performance?.maxDictSize || 2000);
      this.dictionary = mergeAllDictionaries();
      this.dictionaryHash.clear();
      this.dictionaryTrie.clear();
      this.regexCache.clear();
      Object.keys(this.dictionary).forEach((key) => {
        if (!this.dictionary[key].startsWith('待翻译: ')) {
          this.dictionaryHash.set(key, this.dictionary[key]);
          if (key.length <= 100) {
            this.dictionaryHash.set(key.toLowerCase(), this.dictionary[key]);
            this.dictionaryHash.set(key.toUpperCase(), this.dictionary[key]);
          }
          this.dictionaryTrie.insert(key);
        }
      });
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 词典初始化耗时: ${Date.now() - startTime}ms`);
        console.log(`[GitHub 中文翻译] 词典条目数量: ${Object.keys(this.dictionary).length}`);
        console.log(`[GitHub 中文翻译] 哈希表条目数量: ${this.dictionaryHash.size}`);
        console.log(`[GitHub 中文翻译] Trie树条目数量: ${this.dictionaryTrie.getSize()}`);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 词典初始化失败:', error);
      this.dictionary = {};
      this.dictionaryHash.clear();
      this.dictionaryTrie.clear();
      this.regexCache.clear();
    }
  },
  getTranslatedText(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text;
    }
    const normalizedText = text.trim();
    if (normalizedText.length < CONFIG.performance?.minTextLengthToTranslate) {
      return null;
    }
    if (CONFIG.performance?.enableTranslationCache) {
      const cachedResult = this.cacheManager.getFromCache(normalizedText);
      if (cachedResult !== null) {
        return cachedResult;
      }
    }
    let result = null;
    result = this.dictionaryHash.get(normalizedText);
    if (result === null && normalizedText.length <= 100) {
      const lowerCaseText = normalizedText.toLowerCase();
      const upperCaseText = normalizedText.toUpperCase();
      result = this.dictionaryHash.get(lowerCaseText) || this.dictionaryHash.get(upperCaseText);
    }
    if (result !== null) {
      result = this.sanitizeText(result);
    }
    if (
      CONFIG.performance?.enableTranslationCache &&
      normalizedText.length <= CONFIG.performance?.maxCachedTextLength
    ) {
      if (result !== null) {
        this.cacheManager.setToCache(normalizedText, result, false);
      }
    }
    return result;
  },
  sanitizeText(text) {
    let sanitizedText = text.replace(/<[^>]*>/g, '');
    sanitizedText = sanitizedText.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitizedText = sanitizedText.replace(/javascript:/gi, '');
    sanitizedText = sanitizedText.replace(/data:/gi, '');
    sanitizedText = sanitizedText.replace(/expression\([^)]*\)/gi, '');
    sanitizedText = sanitizedText.replace(/vbscript:/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*script/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*iframe/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*object/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*embed/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*link/gi, '');
    sanitizedText = sanitizedText.replace(/<\s*style/gi, '');
    return sanitizedText;
  },
  updateDictionary(newDictionary) {
    try {
      Object.assign(this.dictionary, newDictionary);
      Object.keys(newDictionary).forEach((key) => {
        if (!newDictionary[key].startsWith('待翻译: ')) {
          this.dictionaryHash.set(key, newDictionary[key]);
          if (key.length <= 100) {
            this.dictionaryHash.set(key.toLowerCase(), newDictionary[key]);
            this.dictionaryHash.set(key.toUpperCase(), newDictionary[key]);
          }
          this.dictionaryTrie.insert(key);
        }
      });
      if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 词典已更新，新增/修改${Object.keys(newDictionary).length}个条目`,
        );
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 更新词典失败:', error);
    }
  },
};
/**
 * 页面模式检测模块
 * @file translationCore/pageModeDetector.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 检测当前页面的模式
 */
const pageModeDetector = {
  currentPageMode: null,
  pageModeConfig: {
    default: {
      batchSize: CONFIG.performance?.batchSize,
      enablePartialMatch: CONFIG.performance?.enablePartialMatch,
    },
    search: { batchSize: 100, enablePartialMatch: false },
    repository: { batchSize: 50, enablePartialMatch: false },
    issues: { batchSize: 75, enablePartialMatch: true },
    pullRequests: { batchSize: 75, enablePartialMatch: true },
    explore: { batchSize: 100, enablePartialMatch: false },
    notifications: { batchSize: 60, enablePartialMatch: true },
    marketplace: { batchSize: 80, enablePartialMatch: true },
    codespaces: { batchSize: 50, enablePartialMatch: false },
    wiki: { batchSize: 120, enablePartialMatch: true },
    actions: { batchSize: 60, enablePartialMatch: false },
  },
  detectPageMode() {
    try {
      const currentPath = window.location.pathname;
      for (const [mode, pattern] of Object.entries(CONFIG.pagePatterns)) {
        if (pattern && pattern instanceof RegExp && pattern.test(currentPath)) {
          if (mode === 'repository') {
            const isSubPage = [
              'issues',
              'pullRequests',
              'projects',
              'wiki',
              'actions',
              'packages',
              'security',
              'insights',
            ].some((subMode) => CONFIG.pagePatterns[subMode]?.test(currentPath));
            if (!isSubPage) {
              this.currentPageMode = mode;
              return mode;
            }
          } else {
            this.currentPageMode = mode;
            return mode;
          }
        }
      }
      this.currentPageMode = 'default';
      return 'default';
    } catch (error) {
      if (CONFIG.debugMode) {
        console.warn('[GitHub 中文翻译] 检测页面模式失败:', error);
      }
      this.currentPageMode = 'default';
      return 'default';
    }
  },
  getCurrentPageModeConfig() {
    const mode = this.currentPageMode || this.detectPageMode();
    return this.pageModeConfig[mode] || this.pageModeConfig.default;
  },
};
/**
 * 翻译元素选择模块
 * @file translationCore/elementSelector.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 选择需要翻译的DOM元素
 */
const SKIP_TAGS = [
  'script',
  'style',
  'code',
  'pre',
  'textarea',
  'input',
  'select',
  'img',
  'svg',
  'canvas',
  'video',
  'audio',
];
const SKIP_CLASS_PATTERNS = [
  /language-\w+/,
  /highlight/,
  /token/,
  /no-translate/,
  /octicon/,
  /emoji/,
  /avatar/,
  /timestamp/,
  /numeral/,
  /filename/,
  /hash/,
  /sha/,
  /shortsha/,
  /hex-color/,
  /code/,
  /gist/,
  /language-/,
  /markdown-/,
  /monaco-editor/,
  /syntax-/,
  /highlight-/,
  /clipboard/,
  /progress-/,
  /count/,
  /size/,
  /time/,
  /date/,
  /sortable/,
  /label/,
  /badge/,
  /url/,
  /email/,
  /key/,
  /token/,
  /user-name/,
  /repo-name/,
];
const SKIP_ID_PATTERNS = [
  /\d+/,
  /-\d+/,
  /_\d+/,
  /sha-/,
  /hash-/,
  /commit-/,
  /issue-/,
  /pull-/,
  /pr-/,
  /repo-/,
  /user-/,
  /file-/,
  /blob-/,
  /tree-/,
  /branch-/,
  /tag-/,
  /release-/,
  /gist-/,
  /discussion-/,
  /comment-/,
  /review-/,
  /workflow-/,
  /action-/,
  /job-/,
  /step-/,
  /runner-/,
  /package-/,
  /registry-/,
  /marketplace-/,
  /organization-/,
  /team-/,
  /project-/,
  /milestone-/,
  /assignee-/,
  /reporter-/,
  /reviewer-/,
  /author-/,
  /committer-/,
  /contributor-/,
  /sponsor-/,
  /funding-/,
  /donation-/,
  /payment-/,
  /billing-/,
  /plan-/,
  /subscription-/,
  /license-/,
  /secret-/,
  /key-/,
  /token-/,
  /password-/,
  /credential-/,
  /certificate-/,
  /ssh-/,
  /git-/,
  /clone-/,
  /push-/,
  /pull-/,
  /fetch-/,
  /merge-/,
  /rebase-/,
  /cherry-pick-/,
  /reset-/,
  /revert-/,
  /tag-/,
  /branch-/,
  /commit-/,
  /diff-/,
  /patch-/,
  /stash-/,
  /ref-/,
  /head-/,
  /remote-/,
  /upstream-/,
  /origin-/,
  /local-/,
  /tracking-/,
  /merge-base-/,
  /conflict-/,
  /resolve-/,
  /status-/,
  /log-/,
  /blame-/,
  /bisect-/,
  /grep-/,
  /find-/,
  /filter-/,
  /archive-/,
  /submodule-/,
  /worktree-/,
  /lfs-/,
  /graphql-/,
  /rest-/,
  /api-/,
  /webhook-/,
  /event-/,
  /payload-/,
  /callback-/,
  /redirect-/,
  /oauth-/,
  /sso-/,
  /ldap-/,
  /saml-/,
  /2fa-/,
  /mfa-/,
  /security-/,
  /vulnerability-/,
  /cve-/,
  /dependency-/,
  /alert-/,
  /secret-scanning-/,
  /code-scanning-/,
  /codeql-/,
  /actions-/,
  /workflow-/,
  /job-/,
  /step-/,
  /runner-/,
  /artifact-/,
  /cache-/,
  /environment-/,
  /deployment-/,
  /app-/,
  /oauth-app-/,
  /github-app-/,
  /integration-/,
  /webhook-/,
  /marketplace-/,
  /listing-/,
  /subscription-/,
  /billing-/,
  /plan-/,
  /usage-/,
  /limits-/,
  /quota-/,
  /traffic-/,
  /analytics-/,
  /insights-/,
  /search-/,
  /explore-/,
  /trending-/,
  /stars-/,
  /forks-/,
  /watchers-/,
  /contributors-/,
  /activity-/,
  /events-/,
  /notifications-/,
  /feeds-/,
  /dashboard-/,
  /profile-/,
  /settings-/,
  /preferences-/,
  /organization-/,
  /team-/,
  /project-/,
  /milestone-/,
  /label-/,
  /\b\w+[0-9]\w*\b/,
];
function isSkipTag(tagName) {
  return SKIP_TAGS.includes(tagName.toLowerCase());
}
function hasSkipClass(className) {
  if (!className) return false;
  return SKIP_CLASS_PATTERNS.some((pattern) => pattern.test(className));
}
function hasSkipId(id) {
  if (!id) return false;
  return SKIP_ID_PATTERNS.some((pattern) => pattern.test(id));
}
function isHiddenElement(element) {
  const computedStyle = window.getComputedStyle(element);
  return (
    computedStyle.display === 'none' ||
    computedStyle.visibility === 'hidden' ||
    computedStyle.opacity === '0' ||
    (computedStyle.position === 'absolute' && computedStyle.left === '-9999px')
  );
}
function isNumericOrSpecialOnly(text) {
  return /^[0-9.,\s()[\]{}/*^$#@!~`|:;"'?>+-]+$/i.test(text);
}
const elementSelector = {
  elementCache: new WeakMap(),
  getElementsToTranslate() {
    const uniqueElements = new Set();
    const allSelectors = [...CONFIG.selectors.primary, ...CONFIG.selectors.popupMenus];
    if (allSelectors.length <= 10) {
      const combinedSelector = allSelectors.join(', ');
      try {
        const allElements = document.querySelectorAll(combinedSelector);
        Array.from(allElements).forEach((element) => {
          if (this.shouldTranslateElement(element)) {
            uniqueElements.add(element);
          }
        });
        if (CONFIG.debugMode && CONFIG.performance?.logTiming) {
          console.log(
            `[GitHub 中文翻译] 合并查询选择器: ${combinedSelector}, 结果数量: ${allElements.length}`,
          );
        }
        return Array.from(uniqueElements);
      } catch (error) {
        if (CONFIG.debugMode) {
          console.warn('[GitHub 中文翻译] 合并选择器查询失败，回退到逐个查询:', error);
        }
      }
    }
    allSelectors.forEach((selector) => {
      try {
        const matchedElements = document.querySelectorAll(selector);
        Array.from(matchedElements).forEach((element) => {
          if (this.shouldTranslateElement(element)) {
            uniqueElements.add(element);
          }
        });
      } catch (error) {
        if (CONFIG.debugMode) {
          console.warn(`[GitHub 中文翻译] 选择器 "${selector}" 解析失败:`, error);
        }
      }
    });
    return Array.from(uniqueElements).filter((element) => element instanceof HTMLElement);
  },
  shouldTranslateElement(element) {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }
    if (element.hasAttribute('data-github-zh-translated')) {
      return false;
    }
    if (!element.textContent.trim()) {
      return false;
    }
    if (isSkipTag(element.tagName)) {
      return false;
    }
    if (
      element.hasAttribute('data-no-translate') ||
      (element.hasAttribute('translate') && element.getAttribute('translate') === 'no') ||
      element.hasAttribute('aria-hidden') ||
      element.hasAttribute('hidden')
    ) {
      return false;
    }
    if (hasSkipClass(element.className)) {
      return false;
    }
    if (hasSkipId(element.id)) {
      return false;
    }
    if (isHiddenElement(element)) {
      return false;
    }
    const textContent = element.textContent.trim();
    if (!textContent || isNumericOrSpecialOnly(textContent)) {
      return false;
    }
    return true;
  },
  shouldTranslate(element) {
    return virtualDomManager.shouldTranslate(element);
  },
};
/**
 * 元素翻译模块
 * @file translationCore/elementTranslator.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 实际翻译DOM元素的模块
 */
const elementTranslator = {
  performanceData: {
    translateStartTime: 0,
    translateEndTime: 0,
    elementsProcessed: 0,
    textsTranslated: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheEvictions: 0,
    cacheCleanups: 0,
    domOperations: 0,
    domOperationTime: 0,
    networkRequests: 0,
    networkRequestTime: 0,
    dictionaryLookups: 0,
    partialMatches: 0,
    batchProcessings: 0,
    errorCount: 0,
    totalMemory: 0,
  },
  translateElement(element) {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }
    if (!elementSelector.shouldTranslate(element)) {
      return false;
    }
    if (elementSelector.elementCache.has(element)) {
      return false;
    }
    if (element.hasAttribute('data-github-zh-translated')) {
      elementSelector.elementCache.set(element, true);
      return false;
    }
    this.performanceData.elementsProcessed++;
    if (!elementSelector.shouldTranslateElement(element)) {
      return false;
    }
    const fragment = document.createDocumentFragment();
    let hasTranslation = false;
    let hasTranslatableContent = false;
    const childNodes = Array.from(element.childNodes);
    const textNodesToProcess = [];
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const trimmedText = node.nodeValue.trim();
        if (trimmedText && trimmedText.length >= CONFIG.performance?.minTextLengthToTranslate) {
          // 预先检查是否有对应的翻译
          const translatedText = dictionaryManager.getTranslatedText(trimmedText);
          if (translatedText && translatedText !== trimmedText) {
            textNodesToProcess.push({ node, originalText: node.nodeValue });
            hasTranslatableContent = true;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        try {
          element.removeChild(node);
          fragment.appendChild(node);
          const childTranslated = this.translateElement(node);
          hasTranslatableContent = hasTranslatableContent || childTranslated;
        } catch (e) {
          if (CONFIG.debugMode) {
            console.error('[GitHub 中文翻译] 处理子元素失败:', e, '元素:', node);
          }
          try {
            if (!node.parentNode) {
              element.appendChild(node);
            }
          } catch (addBackError) {
            if (CONFIG.debugMode) {
              console.error('[GitHub 中文翻译] 将子元素添加回原始位置失败:', addBackError);
            }
          }
        }
      }
    }
    // 如果没有任何可翻译的内容，直接返回false，不修改DOM
    if (!hasTranslatableContent) {
      return false;
    }
    // 只有在有可翻译内容时才进行文本节点处理
    textNodesToProcess.forEach(({ node, originalText }) => {
      const parentNode = node.parentNode;
      if (parentNode) {
        parentNode.removeChild(node);
      }
      const translatedText = dictionaryManager.getTranslatedText(originalText.trim());
      if (
        translatedText &&
        typeof translatedText === 'string' &&
        translatedText !== originalText.trim()
      ) {
        try {
          const safeTranslatedText =
            typeof translatedText === 'string'
              ? [...translatedText]
                  .filter((c) => c.charCodeAt(0) > 31 && c.charCodeAt(0) !== 127)
                  .join('')
              : String(translatedText || '');
          const translatedNode = document.createTextNode(safeTranslatedText);
          fragment.appendChild(translatedNode);
          hasTranslation = true;
          this.performanceData.textsTranslated++;
        } catch (e) {
          if (CONFIG.debugMode) {
            console.error('[GitHub 中文翻译] 创建翻译节点失败:', e, '翻译文本:', translatedText);
          }
          fragment.appendChild(node);
        }
      } else {
        fragment.appendChild(node);
      }
    });
    try {
      if (fragment && fragment.hasChildNodes()) {
        if (element.firstChild) {
          element.insertBefore(fragment, element.firstChild);
        } else {
          element.appendChild(fragment);
        }
      }
    } catch (appendError) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 添加文档片段失败:', appendError, '元素:', element);
      }
    }
    if (hasTranslation) {
      virtualDomManager.markElementAsTranslated(element);
    }
    elementSelector.elementCache.set(element, true);
    return hasTranslation;
  },
  async translateCriticalElementsOnly() {
    const criticalSelectors = ['.Header', '.repository-content', '.js-repo-pjax-container', 'main'];
    const criticalElements = [];
    let processedElements = 0;
    let failedElements = 0;
    criticalSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          Array.from(elements).forEach((el) => {
            if (el && el instanceof HTMLElement) {
              criticalElements.push(el);
            }
          });
          if (CONFIG.debugMode) {
            console.log(`[GitHub 中文翻译] 找到关键元素: ${selector}, 数量: ${elements.length}`);
          }
        }
      } catch (err) {
        ErrorHandler.handleError('查询选择器', err, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
      }
    });
    if (criticalElements.length === 0) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 没有找到关键元素需要翻译');
      }
      return;
    }
    criticalElements.forEach((element) => {
      try {
        this.translateElement(element);
        processedElements++;
      } catch (err) {
        failedElements++;
        ErrorHandler.handleError('关键元素翻译', err, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
      }
    });
    if (CONFIG.debugMode) {
      console.log(
        `[GitHub 中文翻译] 关键元素翻译完成 - 总数量: ${criticalElements.length}, 成功: ${processedElements}, 失败: ${failedElements}`,
      );
    }
  },
};
/**
 * 部分匹配翻译模块
 * @file translationCore/partialTranslator.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 使用Trie树进行部分匹配翻译
 */
const partialTranslator = {
  performPartialTranslation(text, enablePartialMatch = false) {
    if (!enablePartialMatch) {
      return null;
    }
    const textLen = text.length;
    if (textLen < 5) {
      return null;
    }
    const matches = [];
    const minKeyLength = Math.min(4, Math.floor(textLen / 2));
    const potentialMatches = dictionaryManager.dictionaryTrie.findAllMatches(text, minKeyLength);
    for (const match of potentialMatches) {
      const key = match.key;
      if (
        !Object.prototype.hasOwnProperty.call(dictionaryManager.dictionary, key) ||
        dictionaryManager.dictionary[key].startsWith('待翻译: ')
      ) {
        continue;
      }
      const value = dictionaryManager.dictionary[key];
      if (/^[0-9.,\s()[\]{}/*^$#@!~`|:;"'?>+-]+$/i.test(key)) {
        continue;
      }
      const wordRegexKey = `word_${key}`;
      let wordRegex;
      if (dictionaryManager.regexCache.has(wordRegexKey)) {
        wordRegex = dictionaryManager.regexCache.get(wordRegexKey);
      } else {
        wordRegex = utils.safeRegExp('\\b' + utils.escapeRegExp(key) + '\\b', 'gi');
        if (wordRegex) {
          dictionaryManager.regexCache.set(wordRegexKey, wordRegex);
        } else {
          continue;
        }
      }
      const wordMatches = text.match(wordRegex);
      if (wordMatches && wordMatches.length > 0) {
        matches.push({
          key,
          value,
          length: key.length,
          matches: wordMatches.length,
          regex: wordRegex,
        });
      } else {
        const nonWordRegexKey = `nonword_${key}`;
        let nonWordRegex;
        if (dictionaryManager.regexCache.has(nonWordRegexKey)) {
          nonWordRegex = dictionaryManager.regexCache.get(nonWordRegexKey);
        } else {
          nonWordRegex = utils.safeRegExp(utils.escapeRegExp(key), 'g');
          if (nonWordRegex) {
            dictionaryManager.regexCache.set(nonWordRegexKey, nonWordRegex);
          } else {
            continue;
          }
        }
        matches.push({
          key,
          value,
          length: key.length,
          matches: 1,
          regex: nonWordRegex,
        });
      }
    }
    if (matches.length === 0) {
      return null;
    }
    matches.sort((a, b) => {
      if (b.length !== a.length) {
        return b.length - a.length;
      }
      return b.matches - a.matches;
    });
    let result = text;
    let hasReplaced = false;
    const maxReplacements = Math.min(5, matches.length);
    for (let i = 0; i < maxReplacements; i++) {
      const match = matches[i];
      const newResult = result.replace(match.regex, match.value);
      if (newResult !== result) {
        result = newResult;
        hasReplaced = true;
      }
    }
    return hasReplaced ? result : null;
  },
};
/**
 * 性能监控模块
 * @file translationCore/performanceMonitor.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 监控翻译性能数据
 */
const performanceMonitor = {
  get performanceData() {
    return elementTranslator.performanceData;
  },
  resetPerformanceData() {
    elementTranslator.performanceData = {
      translateStartTime: 0,
      translateEndTime: 0,
      elementsProcessed: 0,
      textsTranslated: 0,
      cacheHits: 0,
      cacheMisses: 0,
      cacheEvictions: 0,
      cacheCleanups: 0,
      domOperations: 0,
      domOperationTime: 0,
      networkRequests: 0,
      networkRequestTime: 0,
      dictionaryLookups: 0,
      partialMatches: 0,
      batchProcessings: 0,
      errorCount: 0,
      totalMemory: 0,
    };
  },
  logPerformanceData() {
    if (CONFIG.debugMode && CONFIG.performance?.logTiming) {
      const duration = Date.now() - elementTranslator.performanceData.translateStartTime;
      console.log(`[GitHub 中文翻译] 性能数据 - 总耗时: ${duration}ms`);
      console.log(`  元素处理: ${elementTranslator.performanceData.elementsProcessed}`);
      console.log(`  文本翻译: ${elementTranslator.performanceData.textsTranslated}`);
      console.log(`  缓存命中: ${elementTranslator.performanceData.cacheHits}`);
      console.log(`  缓存未命中: ${elementTranslator.performanceData.cacheMisses}`);
    }
  },
  recordPerformanceEvent(eventType, data = {}) {
    switch (eventType) {
      case 'dom-operation':
        elementTranslator.performanceData.domOperations++;
        elementTranslator.performanceData.domOperationTime += data.duration || 0;
        break;
      case 'network-request':
        elementTranslator.performanceData.networkRequests++;
        elementTranslator.performanceData.networkRequestTime += data.duration || 0;
        break;
      case 'dictionary-lookup':
        elementTranslator.performanceData.dictionaryLookups++;
        break;
      case 'partial-match':
        elementTranslator.performanceData.partialMatches++;
        break;
      case 'batch-processing':
        elementTranslator.performanceData.batchProcessings++;
        break;
      case 'error':
        elementTranslator.performanceData.errorCount++;
        break;
    }
  },
  getPerformanceStats() {
    const stats = { ...elementTranslator.performanceData };
    if (stats.translateStartTime > 0) {
      stats.totalDuration =
        stats.translateEndTime > 0
          ? stats.translateEndTime - stats.translateStartTime
          : Date.now() - stats.translateStartTime;
    } else {
      stats.totalDuration = 0;
    }
    const totalCacheRequests = stats.cacheHits + stats.cacheMisses;
    stats.cacheHitRate =
      totalCacheRequests > 0
        ? ((stats.cacheHits / totalCacheRequests) * 100).toFixed(2) + '%'
        : '0%';
    stats.avgDomOperationTime =
      stats.domOperations > 0
        ? (stats.domOperationTime / stats.domOperations).toFixed(2) + 'ms'
        : '0ms';
    return stats;
  },
  exportPerformanceData() {
    const data = {
      timestamp: new Date().toISOString(),
      stats: this.getPerformanceStats(),
      userAgent: navigator.userAgent,
      browserLanguage: navigator.language,
    };
    return JSON.stringify(data, null, 2);
  },
};
/**
 * 翻译核心主模块
 * @file translationCore/index.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 翻译核心主入口，整合所有子模块
 */
const translationCore = {
  isPageUnloading: false,
  cacheCleanupTimer: null,
  unloadHandler: null,
  init() {
    try {
      dictionaryManager.init();
      this.setupPageUnloadHandler();
      this.startCacheCleanupTimer();
      this.warmUpCache();
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 翻译核心初始化完成');
      }
    } catch (error) {
      ErrorHandler.handleError('翻译核心初始化', error, ErrorHandler.ERROR_TYPES.INITIALIZATION);
    }
  },
  setupPageUnloadHandler() {
    const unloadHandler = () => {
      this.isPageUnloading = true;
      this.cleanup();
    };
    window.addEventListener('beforeunload', unloadHandler);
    window.addEventListener('unload', unloadHandler);
    window.addEventListener('pagehide', unloadHandler);
    this.unloadHandler = unloadHandler;
  },
  startCacheCleanupTimer() {
    this.stopCacheCleanupTimer();
    this.cacheCleanupTimer = setInterval(() => {
      if (this.isPageUnloading) {
        this.stopCacheCleanupTimer();
        return;
      }
      this.cleanCache();
    }, 120000);
  },
  stopCacheCleanupTimer() {
    if (this.cacheCleanupTimer) {
      clearInterval(this.cacheCleanupTimer);
      this.cacheCleanupTimer = null;
    }
  },
  cleanup() {
    try {
      this.stopCacheCleanupTimer();
      if (this.unloadHandler) {
        window.removeEventListener('beforeunload', this.unloadHandler);
        window.removeEventListener('unload', this.unloadHandler);
        window.removeEventListener('pagehide', this.unloadHandler);
        this.unloadHandler = null;
      }
      this.clearCache();
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 翻译核心资源清理完成');
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 翻译核心资源清理失败:', error);
      }
    }
  },
  detectPageMode() {
    return pageModeDetector.detectPageMode();
  },
  getCurrentPageModeConfig() {
    return pageModeDetector.getCurrentPageModeConfig();
  },
  async translate(targetElements = null) {
    if (!dictionaryManager.dictionary || Object.keys(dictionaryManager.dictionary).length === 0) {
      dictionaryManager.init();
    }
    const pageMode = this.detectPageMode();
    const modeConfig = this.getCurrentPageModeConfig();
    if (CONFIG.debugMode) {
      console.log(`[GitHub 中文翻译] 当前页面模式: ${pageMode}`, modeConfig);
    }
    performanceMonitor.resetPerformanceData();
    elementTranslator.performanceData.translateStartTime = Date.now();
    return new Promise((resolve, reject) => {
      try {
        let elements;
        if (Array.isArray(targetElements)) {
          elements = targetElements.filter((el) => el && el instanceof HTMLElement);
          if (CONFIG.debugMode) {
            console.log(`[GitHub 中文翻译] 翻译特定区域，目标元素数量: ${elements.length}`);
          }
        } else {
          elements = elementSelector.getElementsToTranslate();
          if (CONFIG.debugMode) {
            console.log(`[GitHub 中文翻译] 翻译整个页面，目标元素数量: ${elements.length}`);
          }
        }
        if (!elements || elements.length === 0) {
          if (CONFIG.debugMode) {
            console.log('[GitHub 中文翻译] 没有找到需要翻译的元素');
          }
          performanceMonitor.logPerformanceData();
          resolve();
          return;
        }
        this.processElementsInBatches(elements)
          .then(() => {
            elementTranslator.performanceData.translateEndTime = Date.now();
            performanceMonitor.logPerformanceData();
            resolve();
          })
          .catch((batchError) => {
            ErrorHandler.handleError(
              '批处理过程',
              batchError,
              ErrorHandler.ERROR_TYPES.TRANSLATION,
              {
                retryable: true,
                recoveryFn: () => {
                  this.translateCriticalElementsOnly()
                    .then(() => {
                      elementTranslator.performanceData.translateEndTime = Date.now();
                      performanceMonitor.logPerformanceData();
                      resolve();
                    })
                    .catch((recoverError) => {
                      ErrorHandler.handleError(
                        '错误恢复',
                        recoverError,
                        ErrorHandler.ERROR_TYPES.TRANSLATION,
                      );
                      elementTranslator.performanceData.translateEndTime = Date.now();
                      performanceMonitor.logPerformanceData();
                      reject(recoverError);
                    });
                },
                maxRetries: 2,
              },
            );
          });
      } catch (error) {
        ErrorHandler.handleError('翻译过程', error, ErrorHandler.ERROR_TYPES.TRANSLATION, {
          retryable: true,
          recoveryFn: () => {
            this.translateCriticalElementsOnly()
              .then(() => {
                performanceMonitor.logPerformanceData();
                resolve();
              })
              .catch((recoverError) => {
                ErrorHandler.handleError(
                  '错误恢复',
                  recoverError,
                  ErrorHandler.ERROR_TYPES.TRANSLATION,
                );
                performanceMonitor.logPerformanceData();
                reject(recoverError);
              });
          },
          maxRetries: 2,
        });
      }
    });
  },
  async processElementsInBatches(elements) {
    elements = virtualDomManager.processElements(elements);
    const modeConfig = this.getCurrentPageModeConfig();
    const batchSize = modeConfig.batchSize || CONFIG.performance?.batchSize || 50;
    const delay = CONFIG.performance?.batchDelay || 0;
    if (!elements || !Array.isArray(elements) || elements.length === 0) {
      return Promise.resolve();
    }
    const validElements = elements.filter((element) => element instanceof HTMLElement);
    if (validElements.length <= batchSize) {
      validElements.forEach((element) => {
        try {
          elementTranslator.translateElement(element);
        } catch (error) {
          ErrorHandler.handleError('翻译元素', error, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
        }
      });
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const processBatch = (startIndex) => {
        try {
          const endIndex = Math.min(startIndex + batchSize, validElements.length);
          const batch = validElements.slice(startIndex, endIndex);
          batch.forEach((element) => {
            try {
              elementTranslator.translateElement(element);
            } catch (error) {
              ErrorHandler.handleError('翻译元素', error, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
            }
          });
          if (
            CONFIG.performance?.logTiming &&
            (endIndex % (batchSize * 5) === 0 || endIndex === validElements.length)
          ) {
            const progress = Math.round((endIndex / validElements.length) * 100);
            console.log(
              `[GitHub 中文翻译] 翻译进度: ${progress}%, 已处理: ${endIndex}/${validElements.length} 元素`,
            );
          }
          if (endIndex < validElements.length) {
            if (delay > 0) {
              setTimeout(() => processBatch(endIndex), delay);
            } else {
              requestAnimationFrame(() => processBatch(endIndex));
            }
          } else {
            resolve();
          }
        } catch (error) {
          ErrorHandler.handleError('批处理过程', error, ErrorHandler.ERROR_TYPES.TRANSLATION);
          resolve();
        }
      };
      processBatch(0);
    });
  },
  translateCriticalElementsOnly() {
    return elementTranslator.translateCriticalElementsOnly();
  },
  cleanCache() {
    try {
      if (
        !dictionaryManager.cacheManager.translationCache ||
        !(dictionaryManager.cacheManager.translationCache instanceof Map)
      ) {
        if (CONFIG.debugMode) {
          console.warn('[GitHub 中文翻译] 缓存对象不存在或无效');
        }
        return;
      }
      dictionaryManager.cacheManager.cleanCache();
      elementTranslator.performanceData.cacheCleanups =
        (elementTranslator.performanceData.cacheCleanups || 0) + 1;
      if (CONFIG.debugMode) {
        console.log(
          `[GitHub 中文翻译] 缓存清理完成，当前大小: ${dictionaryManager.cacheManager.translationCache.size}`,
        );
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 缓存清理过程出错，使用回退策略:', error);
      }
      try {
        if (CONFIG.debugMode) {
          console.log('[GitHub 中文翻译] 执行缓存重置作为最后手段');
        }
        dictionaryManager.cacheManager.translationCache.clear();
        dictionaryManager.cacheManager.cacheStats.size = 0;
      } catch (fallbackError) {
        if (CONFIG.debugMode) {
          console.error('[GitHub 中文翻译] 缓存重置失败:', fallbackError);
        }
      }
    }
  },
  clearCache() {
    try {
      if (virtualDomManager && typeof virtualDomManager.clear === 'function') {
        virtualDomManager.clear();
      }
      if (dictionaryManager.cacheManager) {
        dictionaryManager.cacheManager.clearCache();
      }
      if (elementSelector.elementCache) {
        elementSelector.elementCache = new WeakMap();
      }
      performanceMonitor.resetPerformanceData();
      try {
        const translatedElements = document.querySelectorAll('[data-github-zh-translated]');
        translatedElements.forEach((element) => {
          element.removeAttribute('data-github-zh-translated');
        });
      } catch (domError) {
        if (CONFIG.debugMode) {
          console.warn('[GitHub 中文翻译] 清除翻译标记时出错:', domError);
        }
      }
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 翻译缓存已彻底清除');
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 清除缓存时出错:', error);
      }
      try {
        if (dictionaryManager.cacheManager) dictionaryManager.cacheManager.clearCache();
        if (elementSelector.elementCache) elementSelector.elementCache = new WeakMap();
        dictionaryManager.cacheManager.cacheStats = { hits: 0, misses: 0, evictions: 0, size: 0 };
      } catch (fallbackError) {
        if (CONFIG.debugMode) {
          console.error('[GitHub 中文翻译] 基本缓存清理也失败:', fallbackError);
        }
      }
    }
  },
  warmUpCache() {
    if (!CONFIG.performance?.enableTranslationCache) {
      return;
    }
    try {
      const commonKeys = Object.keys(dictionaryManager.dictionary)
        .filter(
          (key) => !dictionaryManager.dictionary[key].startsWith('待翻译: ') && key.length <= 50,
        )
        .slice(0, 100);
      commonKeys.forEach((key) => {
        const value = dictionaryManager.dictionary[key];
        dictionaryManager.cacheManager.setToCache(key, value, this.isPageUnloading);
      });
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 缓存预热完成，已预加载${commonKeys.length}个常用词条`);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 缓存预热失败:', error);
    }
  },
  updateDictionary(newDictionary) {
    dictionaryManager.updateDictionary(newDictionary);
  },
  // 暴露性能监控方法
  resetPerformanceData: () => performanceMonitor.resetPerformanceData(),
  logPerformanceData: () => performanceMonitor.logPerformanceData(),
  recordPerformanceEvent: (eventType, data) =>
    performanceMonitor.recordPerformanceEvent(eventType, data),
  getPerformanceStats: () => performanceMonitor.getPerformanceStats(),
  exportPerformanceData: () => performanceMonitor.exportPerformanceData(),
};
/**
 * GitHub 中文翻译配置界面模块
 * @file configUI.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 提供用户友好的配置界面，允许用户调整插件参数
 */
import {
  createPerformanceMonitoringSection,
  updatePerformanceStats,
  exportPerformanceStats,
} from './components/performanceMonitor.js';
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
  loadUserSettings() {
    try {
      const saved = localStorage.getItem('github-i18n-config');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('[GitHub 中文翻译] 加载用户配置失败:', error);
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
      localStorage.setItem('github-i18n-config', JSON.stringify(settings));
      this.userConfig = { ...settings };
      this.mergeUserConfig();
    } catch (error) {
      console.error('[GitHub 中文翻译] 保存用户配置失败:', error);
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
  createHeader() {
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
  createFooter() {
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
  createConfigSection(title, items) {
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
    localStorage.removeItem('github-i18n-config');
    this.userConfig = {};
    this.settings = {};
    this.hide();
  }
}
/**
 * 版本更新检查模块
 * @file versionChecker.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 负责检查和处理脚本更新
 */
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
    // 检查是否启用了更新检查
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
      // 记录本次检查时间
      localStorage.setItem('githubZhLastUpdateCheck', now.toString());
      // 使用带重试的获取方法
      const scriptContent = await this.fetchWithRetry(CONFIG.updateCheck.scriptUrl);
      // 提取远程版本号 - 支持多种格式
      const remoteVersion = this.extractVersion(scriptContent);
      if (!remoteVersion) {
        throw new Error('无法从远程脚本提取有效的版本号');
      }
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 当前版本: ${CONFIG.version}, 远程版本: ${remoteVersion}`);
      }
      // 比较版本号
      if (this.isNewerVersion(remoteVersion, CONFIG.version)) {
        // 显示更新通知
        this.showUpdateNotification(remoteVersion);
        // 如果启用了自动更新版本号
        if (CONFIG.updateCheck.autoUpdateVersion) {
          this.updateVersionInStorage(remoteVersion);
        }
        // 记录版本历史
        this.recordVersionHistory(remoteVersion);
        return true;
      }
      return false;
    } catch (error) {
      const errorMsg = `[GitHub 中文翻译] 检查更新时发生错误: ${error.message || error}`;
      if (CONFIG.debugMode) {
        console.error(errorMsg, error);
      }
      // 记录错误日志
      try {
        localStorage.setItem(
          'githubZhUpdateError',
          JSON.stringify({
            message: error.message,
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
        // 自定义超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8秒超时
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            Accept: 'text/javascript, text/plain, */*',
          },
          signal: controller.signal,
          credentials: 'omit', // 不发送凭证信息
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP错误! 状态码: ${response.status}`);
        }
        return await response.text();
      } catch (error) {
        lastError = error;
        // 如果是最后一次尝试，则抛出错误
        if (attempt === maxRetries) {
          throw error;
        }
        // 等待后重试
        await utils.delay(retryDelay * Math.pow(2, attempt)); // 指数退避策略
      }
    }
    throw lastError;
  },
  /**
   * 从脚本内容中提取版本号
   * 支持多种版本号格式
   * @param {string} content - 脚本内容
   * @returns {string|null} 提取的版本号或null
   */
  extractVersion(content) {
    // 尝试多种版本号格式
    const patterns = [
      // UserScript多行注释格式
      /\/\*\s*@version\s+(\d+\.\d+\.\d+)\s*\*\//i,
      // UserScript单行注释格式
      /\/\/\s*@version\s+(\d+\.\d+\.\d+)/i,
      // JavaScript注释格式
      /\/\/\s*version\s*:\s*(\d+\.\d+\.\d+)/i,
      // 变量赋值格式
      /version\s*=\s*['"](\d+\.\d+\.\d+)['"]/i,
      // 对象属性格式
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
    // 将版本号转换为数组进行比较
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);
    // 比较每个部分
    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;
      if (newPart > currentPart) {
        return true;
      } else if (newPart < currentPart) {
        return false;
      }
    }
    // 版本号相同
    return false;
  },
  /**
   * 显示更新通知
   * 使用安全的DOM操作而不是innerHTML
   * @param {string} newVersion - 新版本号
   */
  showUpdateNotification(newVersion) {
    const notificationKey = 'githubZhUpdateNotificationDismissed';
    const notificationVersionKey = 'githubZhLastNotifiedVersion';
    // 获取最后通知的版本
    const lastNotifiedVersion = localStorage.getItem(notificationVersionKey);
    // 如果用户已经关闭过通知，或者已经通知过相同版本，则不显示
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
      // 创建通知元素 - 安全的DOM操作
      const notification = document.createElement('div');
      notification.className =
        'fixed bottom-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg z-50 max-w-md transform transition-all duration-300 translate-y-0 opacity-100';
      // 生成唯一的ID
      const notificationId = `github-zh-update-${Date.now()}`;
      notification.id = notificationId;
      // 创建flex容器
      const flexContainer = document.createElement('div');
      flexContainer.className = 'flex items-start';
      notification.appendChild(flexContainer);
      // 创建图标容器
      const iconContainer = document.createElement('div');
      iconContainer.className = 'flex-shrink-0 bg-blue-100 rounded-full p-2';
      flexContainer.appendChild(iconContainer);
      // 创建SVG图标
      const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgIcon.setAttribute('class', 'h-6 w-6 text-blue-600');
      svgIcon.setAttribute('fill', 'none');
      svgIcon.setAttribute('viewBox', '0 0 24 24');
      svgIcon.setAttribute('stroke', 'currentColor');
      iconContainer.appendChild(svgIcon);
      // 创建SVG路径
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('stroke-linecap', 'round');
      pathElement.setAttribute('stroke-linejoin', 'round');
      pathElement.setAttribute('stroke-width', '2');
      pathElement.setAttribute('d', 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
      svgIcon.appendChild(pathElement);
      // 创建内容容器
      const contentContainer = document.createElement('div');
      contentContainer.className = 'ml-3 flex-1';
      flexContainer.appendChild(contentContainer);
      // 创建标题
      const titleElement = document.createElement('p');
      titleElement.className = 'text-sm font-medium text-blue-800';
      titleElement.textContent = 'GitHub 中文翻译脚本更新';
      contentContainer.appendChild(titleElement);
      // 创建消息文本 - 安全地设置文本内容
      const messageElement = document.createElement('p');
      messageElement.className = 'text-sm text-blue-700 mt-1';
      messageElement.textContent = `发现新版本 ${newVersion}，建议更新以获得更好的翻译体验。`;
      contentContainer.appendChild(messageElement);
      // 创建按钮容器
      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'mt-3 flex space-x-2';
      contentContainer.appendChild(buttonsContainer);
      // 创建更新按钮 - 安全地设置URL
      const updateButton = document.createElement('a');
      updateButton.id = `${notificationId}-update-btn`;
      updateButton.href = CONFIG.updateCheck.scriptUrl || '#';
      updateButton.target = '_blank';
      updateButton.rel = 'noopener noreferrer';
      updateButton.className =
        'inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors';
      updateButton.textContent = '立即更新';
      buttonsContainer.appendChild(updateButton);
      // 创建稍后按钮
      const laterButton = document.createElement('button');
      laterButton.id = `${notificationId}-later-btn`;
      laterButton.className =
        'inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-transparent hover:bg-blue-50 transition-colors';
      laterButton.textContent = '稍后';
      laterButton.addEventListener('click', () => {
        this.hideNotification(notification, false);
      });
      buttonsContainer.appendChild(laterButton);
      // 创建不再提醒按钮
      const dismissButton = document.createElement('button');
      dismissButton.id = `${notificationId}-dismiss-btn`;
      dismissButton.className =
        'inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors';
      dismissButton.textContent = '不再提醒';
      dismissButton.addEventListener('click', () => {
        this.hideNotification(notification, true);
      });
      buttonsContainer.appendChild(dismissButton);
      // 添加到DOM
      if (document.body) {
        document.body.appendChild(notification);
        // 记录本次通知的版本
        localStorage.setItem(notificationVersionKey, newVersion);
        // 自动隐藏（可选）
        if (CONFIG.updateCheck.autoHideNotification !== false) {
          setTimeout(() => {
            this.hideNotification(notification, false);
          }, 20000); // 20秒后自动隐藏
        }
        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 显示更新通知: 版本 ${newVersion}`);
        }
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 创建更新通知失败:', error);
    }
  },
  /**
   * 隐藏通知元素（带动画效果）
   * @param {HTMLElement} notification - 通知元素
   * @param {boolean} permanently - 是否永久隐藏
   */
  hideNotification(notification, permanently = false) {
    try {
      // 添加动画效果
      notification.style.transform = 'translateY(20px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
      // 如果是永久隐藏，记录到localStorage
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
  /**
   * 记录版本历史
   * @param {string} version - 版本号
   */
  recordVersionHistory(version) {
    try {
      const historyKey = 'githubZhVersionHistory';
      let history = utils.safeJSONParse(localStorage.getItem(historyKey), []);
      // 确保是数组
      if (!Array.isArray(history)) {
        history = [];
      }
      // 添加新版本记录
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
      const cachedData = utils.safeJSONParse(localStorage.getItem('githubZhCachedVersion'));
      return cachedData;
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
/**
 * 虚拟DOM模块
 * @file virtualDom.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 用于跟踪已翻译元素的状态，避免重复翻译和不必要的DOM操作
 */
/**
 * 虚拟DOM节点类
 * 表示一个DOM元素的虚拟映射，包含其状态和内容哈希
 */
class VirtualNode {
  /**
   * 构造函数
   * @param {HTMLElement} element - 对应的真实DOM元素
   */
  constructor(element) {
    this.element = element;
    this.elementId = null;
    this.contentHash = null;
    this.isTranslated = false;
    this.attributes = new Map();
    this.childNodes = new Map();
    this.lastUpdated = Date.now();
    // 初始化节点
    this.initialize();
  }
  /**
   * 初始化虚拟节点
   */
  initialize() {
    try {
      // 生成唯一标识符
      this.generateId();
      // 计算内容哈希
      this.updateContentHash();
      // 记录属性状态
      this.updateAttributes();
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 初始化虚拟节点失败:', error);
      }
    }
  }
  /**
   * 生成唯一标识符
   */
  generateId() {
    try {
      // 优先使用元素ID
      if (this.element.id) {
        this.elementId = `id:${this.element.id}`;
      } else if (this.element.dataset && this.element.dataset.testid) {
        // 使用testid
        this.elementId = `testid:${this.element.dataset.testid}`;
      } else {
        // 生成临时ID
        this.elementId = `temp:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
        // 保存到元素上用于跟踪
        this.element.dataset.virtualDomId = this.elementId;
      }
    } catch (_error) {
      // 生成最基本的ID
      this.elementId = `fallback:${Math.random().toString(36).substr(2, 9)}`;
    }
  }
  /**
   * 更新内容哈希
   * @returns {string} 内容哈希值
   */
  updateContentHash() {
    try {
      const content = this.element.textContent || '';
      this.contentHash = this.hashString(content);
      return this.contentHash;
    } catch (_error) {
      this.contentHash = null;
      return null;
    }
  }
  /**
   * 更新属性状态
   */
  updateAttributes() {
    try {
      // 只跟踪重要属性
      const importantAttrs = CONFIG.performance.importantAttributes || [];
      importantAttrs.forEach((attrName) => {
        if (this.element.hasAttribute(attrName)) {
          this.attributes.set(attrName, this.element.getAttribute(attrName));
        } else {
          this.attributes.delete(attrName);
        }
      });
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 更新属性状态失败:', error);
      }
    }
  }
  /**
   * 检查内容是否发生变化
   * @returns {boolean} 是否变化
   */
  hasContentChanged() {
    const newHash = this.updateContentHash();
    return newHash !== this.contentHash;
  }
  /**
   * 检查属性是否发生变化
   * @returns {boolean} 是否变化
   */
  hasAttributesChanged() {
    const originalAttributes = new Map(this.attributes);
    this.updateAttributes();
    // 检查是否有变化
    if (originalAttributes.size !== this.attributes.size) {
      return true;
    }
    // 检查每个属性的值
    for (const [key, value] of originalAttributes) {
      if (!this.attributes.has(key) || this.attributes.get(key) !== value) {
        return true;
      }
    }
    return false;
  }
  /**
   * 标记为已翻译
   */
  markAsTranslated() {
    this.isTranslated = true;
    this.lastUpdated = Date.now();
    // 更新实际DOM元素上的标记
    try {
      this.element.dataset.githubZhTranslated = 'true';
    } catch (_error) {
      // 忽略错误
    }
  }
  /**
   * 重置翻译状态
   */
  resetTranslation() {
    this.isTranslated = false;
    this.lastUpdated = Date.now();
    // 移除实际DOM元素上的标记
    try {
      delete this.element.dataset.githubZhTranslated;
    } catch (_error) {
      // 忽略错误
    }
  }
  /**
   * 简单的字符串哈希函数
   * @param {string} str - 要哈希的字符串
   * @returns {string} 哈希值
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为32位整数
    }
    return hash.toString(36);
  }
}
/**
 * 虚拟DOM管理器
 * 负责管理所有虚拟节点，提供查找、更新和清理功能
 */
class VirtualDomManager {
  /**
   * 构造函数
   */
  constructor() {
    this.nodes = new Map();
    this.nodeCache = new Map(); // 快速查找缓存
    this.lastCleanupTime = Date.now();
    this.cleanupInterval = 30000; // 30秒清理一次，提高清理频率
    this.maxNodes = 5000; // 最大节点数限制
    this.cleanupTimer = null;
    this.isPageUnloading = false;
    // 设置页面卸载处理
    this.setupPageUnloadHandler();
    // 自动清理定时器
    this.startAutoCleanup();
  }
  /**
   * 设置页面卸载处理器
   */
  setupPageUnloadHandler() {
    // 监听页面卸载事件
    const unloadHandler = () => {
      this.isPageUnloading = true;
      this.cleanup();
    };
    // 监听多种卸载事件以确保兼容性
    window.addEventListener('beforeunload', unloadHandler);
    window.addEventListener('unload', unloadHandler);
    window.addEventListener('pagehide', unloadHandler);
  }
  /**
   * 为元素获取或创建虚拟节点
   * @param {HTMLElement} element - DOM元素
   * @returns {VirtualNode|null} 虚拟节点
   */
  getOrCreateNode(element) {
    try {
      // 检查页面是否正在卸载
      if (this.isPageUnloading) {
        return null;
      }
      // 先尝试从缓存查找
      if (element.dataset && element.dataset.virtualDomId) {
        const cachedNode = this.nodeCache.get(element.dataset.virtualDomId);
        if (cachedNode && cachedNode.element === element) {
          return cachedNode;
        }
      }
      // 检查节点数量限制
      if (this.nodes.size >= this.maxNodes) {
        // 强制清理一次
        this.cleanup(true);
        // 如果清理后仍然超过限制，删除最旧的节点
        if (this.nodes.size >= this.maxNodes) {
          const nodesToRemove = Math.floor(this.maxNodes * 0.2); // 删除20%的节点
          const entries = Array.from(this.nodes.entries());
          // 按最后更新时间排序，删除最旧的
          entries.sort((a, b) => a[1].lastUpdated - b[1].lastUpdated);
          for (let i = 0; i < nodesToRemove; i++) {
            const [id] = entries[i];
            this.nodes.delete(id);
            this.nodeCache.delete(id);
          }
          if (CONFIG.debugMode) {
            console.log(`[GitHub 中文翻译] 强制清理了${nodesToRemove}个虚拟节点`);
          }
        }
      }
      // 创建新节点
      const node = new VirtualNode(element);
      this.nodes.set(node.elementId, node);
      this.nodeCache.set(node.elementId, node);
      return node;
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 获取或创建虚拟节点失败:', error);
      }
      return null;
    }
  }
  /**
   * 通过ID查找虚拟节点
   * @param {string} elementId - 元素ID
   * @returns {VirtualNode|null} 虚拟节点
   */
  findNodeById(elementId) {
    return this.nodes.get(elementId) || null;
  }
  /**
   * 检查元素是否需要翻译
   * @param {HTMLElement} element - 要检查的元素
   * @returns {boolean} 是否需要翻译
   */
  shouldTranslate(element) {
    try {
      const node = this.getOrCreateNode(element);
      if (!node) {
        return true; // 如果无法创建虚拟节点，默认需要翻译
      }
      // 检查内容是否变化
      const contentChanged = node.hasContentChanged();
      // 检查属性是否变化
      const attributesChanged = node.hasAttributesChanged();
      // 如果内容或属性变化，需要重新翻译
      if (contentChanged || attributesChanged) {
        node.resetTranslation();
        return true;
      }
      // 如果已经翻译过且内容没有变化，不需要再次翻译
      if (node.isTranslated) {
        return false;
      }
      // 其他情况需要翻译
      return true;
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 检查翻译状态失败:', error);
      }
      // 出错时默认需要翻译
      return true;
    }
  }
  /**
   * 标记元素为已翻译
   * @param {HTMLElement} element - 已翻译的元素
   */
  markElementAsTranslated(element) {
    try {
      const node = this.getOrCreateNode(element);
      if (node) {
        node.markAsTranslated();
      }
    } catch (_error) {
      // 忽略错误
    }
  }
  /**
   * 批量处理元素
   * @param {NodeList|Array} elements - 要处理的元素列表
   * @returns {Array} 需要翻译的元素列表
   */
  processElements(elements) {
    const elementsToTranslate = [];
    try {
      elements.forEach((element) => {
        if (this.shouldTranslate(element)) {
          elementsToTranslate.push(element);
        }
      });
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 批量处理元素失败:', error);
      }
      // 出错时返回原始元素列表
      elementsToTranslate.push(...elements);
    }
    return elementsToTranslate;
  }
  /**
   * 开始自动清理
   */
  startAutoCleanup() {
    this.stopAutoCleanup();
    this.cleanupTimer = setInterval(() => {
      // 如果页面正在卸载，停止清理
      if (this.isPageUnloading) {
        this.stopAutoCleanup();
        return;
      }
      this.cleanup();
    }, this.cleanupInterval);
  }
  /**
   * 停止自动清理
   */
  stopAutoCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  /**
   * 清理无效的虚拟节点
   * @param {boolean} force - 是否强制清理所有节点
   */
  cleanup(force = false) {
    try {
      const now = Date.now();
      // 如果不是强制清理且距离上次清理时间不足，则跳过
      if (!force && now - this.lastCleanupTime < this.cleanupInterval) {
        return;
      }
      this.lastCleanupTime = now;
      let removedCount = 0;
      // 如果页面正在卸载或强制清理，删除所有节点
      if (force || this.isPageUnloading) {
        removedCount = this.nodes.size;
        this.nodes.clear();
        this.nodeCache.clear();
        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 强制清理了${removedCount}个虚拟节点`);
        }
        return;
      }
      // 正常清理：删除DOM中不存在的节点或长时间未更新的节点
      const nodesToRemove = [];
      for (const [id, node] of this.nodes) {
        // 检查节点是否仍在DOM中
        if (!document.contains(node.element)) {
          nodesToRemove.push(id);
          continue;
        }
        // 检查节点是否长时间未更新
        const timeSinceUpdate = now - node.lastUpdated;
        const maxAge = 60 * 60 * 1000; // 1小时
        if (timeSinceUpdate > maxAge) {
          nodesToRemove.push(id);
        }
      }
      // 删除需要清理的节点
      for (const id of nodesToRemove) {
        this.nodes.delete(id);
        this.nodeCache.delete(id);
        removedCount++;
      }
      if (CONFIG.debugMode && removedCount > 0) {
        console.log(
          `[GitHub 中文翻译] 清理了${removedCount}个无效虚拟节点，当前节点数：${this.nodes.size}`,
        );
      }
    } catch (error) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 清理虚拟节点失败:', error);
      }
    }
  }
  /**
   * 清空所有虚拟节点
   */
  clear() {
    this.nodes.clear();
    this.nodeCache.clear();
    this.lastCleanupTime = Date.now();
  }
  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      nodeCount: this.nodes.size,
      lastCleanupTime: this.lastCleanupTime,
    };
  }
}
// 创建单例实例
const virtualDomManager = new VirtualDomManager();
virtualDomManager;
/**
 * 国际化支持框架
 * @file i18n.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 为GitHub翻译插件提供多语言支持的基础框架
 */
/**
 * 国际化管理器
 */
class I18nManager {
  constructor() {
    this.currentLocale = 'zh-CN'; // 默认中文
    this.fallbackLocale = 'en-US'; // 回退语言
    this.translations = new Map(); // 存储所有翻译
    this.loadedLocales = new Set(); // 已加载的语言
    this.observers = []; // 语言变更观察者
  }
  /**
   * 初始化国际化管理器
   * @param {string} defaultLocale - 默认语言
   * @param {string} fallbackLocale - 回退语言
   */
  init(defaultLocale = 'zh-CN', fallbackLocale = 'en-US') {
    this.currentLocale = defaultLocale;
    this.fallbackLocale = fallbackLocale;
    // 尝试从本地存储获取用户语言偏好
    if (typeof localStorage !== 'undefined') {
      const savedLocale = localStorage.getItem('github-i18n-locale');
      if (savedLocale) {
        this.currentLocale = savedLocale;
      } else {
        // 尝试从浏览器语言设置获取
        const browserLocale = navigator.language || navigator.userLanguage;
        if (browserLocale) {
          this.currentLocale = browserLocale;
        }
      }
    }
    console.log(`国际化管理器已初始化，当前语言: ${this.currentLocale}`);
  }
  /**
   * 加载翻译文件
   * @param {string} locale - 语言代码
   * @param {Object} translations - 翻译对象
   */
  loadTranslations(locale, translations) {
    if (!translations || typeof translations !== 'object') {
      console.error(`无效的翻译数据: ${locale}`);
      return false;
    }
    this.translations.set(locale, translations);
    this.loadedLocales.add(locale);
    console.log(`已加载翻译: ${locale}`);
    return true;
  }
  /**
   * 异步加载翻译文件
   * @param {string} locale - 语言代码
   * @param {string} url - 翻译文件URL
   * @returns {Promise<boolean>} 加载是否成功
   */
  async loadTranslationsAsync(locale, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const translations = await response.json();
      return this.loadTranslations(locale, translations);
    } catch (error) {
      console.error(`加载翻译失败 ${locale}:`, error);
      return false;
    }
  }
  /**
   * 获取翻译文本
   * @param {string} key - 翻译键
   * @param {Object} params - 参数对象
   * @param {string} locale - 指定语言（可选）
   * @returns {string} 翻译文本
   */
  t(key, params = {}, locale = null) {
    const targetLocale = locale || this.currentLocale;
    // 尝试获取指定语言的翻译
    let translation = this.getTranslationByKey(key, targetLocale);
    // 如果没有找到，尝试回退语言
    if (!translation && targetLocale !== this.fallbackLocale) {
      translation = this.getTranslationByKey(key, this.fallbackLocale);
    }
    // 如果仍然没有找到，返回键名
    if (!translation) {
      console.warn(`未找到翻译: ${key} (${targetLocale})`);
      return key;
    }
    // 处理参数替换
    return this.interpolate(translation, params);
  }
  /**
   * 根据键获取翻译
   * @param {string} key - 翻译键
   * @param {string} locale - 语言代码
   * @returns {string|null} 翻译文本
   */
  getTranslationByKey(key, locale) {
    const translations = this.translations.get(locale);
    if (!translations) return null;
    // 支持嵌套键，如 "menu.file.open"
    const keys = key.split('.');
    let result = translations;
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return null;
      }
    }
    return typeof result === 'string' ? result : null;
  }
  /**
   * 插值处理
   * @param {string} template - 模板字符串
   * @param {Object} params - 参数对象
   * @returns {string} 处理后的字符串
   */
  interpolate(template, params) {
    if (!template || typeof template !== 'string') return template;
    if (!params || typeof params !== 'object') return template;
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  }
  /**
   * 设置当前语言
   * @param {string} locale - 语言代码
   * @returns {boolean} 设置是否成功
   */
  setLocale(locale) {
    if (!this.loadedLocales.has(locale)) {
      console.warn(`语言未加载: ${locale}`);
      return false;
    }
    const oldLocale = this.currentLocale;
    this.currentLocale = locale;
    // 保存到本地存储
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('github-i18n-locale', locale);
    }
    // 通知观察者
    this.notifyObservers(locale, oldLocale);
    console.log(`语言已更改: ${oldLocale} -> ${locale}`);
    return true;
  }
  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  getCurrentLocale() {
    return this.currentLocale;
  }
  /**
   * 获取已加载的语言列表
   * @returns {Array<string>} 语言代码列表
   */
  getLoadedLocales() {
    return Array.from(this.loadedLocales);
  }
  /**
   * 添加语言变更观察者
   * @param {Function} observer - 观察者函数
   */
  addObserver(observer) {
    if (typeof observer === 'function') {
      this.observers.push(observer);
    }
  }
  /**
   * 移除语言变更观察者
   * @param {Function} observer - 观察者函数
   */
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
  /**
   * 通知所有观察者
   * @param {string} newLocale - 新语言
   * @param {string} oldLocale - 旧语言
   */
  notifyObservers(newLocale, oldLocale) {
    this.observers.forEach((observer) => {
      try {
        observer(newLocale, oldLocale);
      } catch (error) {
        console.error('观察者执行错误:', error);
      }
    });
  }
  /**
   * 格式化日期
   * @param {Date} date - 日期对象
   * @param {Object} options - 格式化选项
   * @param {string} locale - 语言代码（可选）
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, options = {}, locale = null) {
    const targetLocale = locale || this.currentLocale;
    // 默认选项
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const formatOptions = { ...defaultOptions, ...options };
    try {
      return new Intl.DateTimeFormat(targetLocale, formatOptions).format(date);
    } catch (error) {
      console.error('日期格式化错误:', error);
      return date.toLocaleDateString();
    }
  }
  /**
   * 格式化数字
   * @param {number} number - 数字
   * @param {Object} options - 格式化选项
   * @param {string} locale - 语言代码（可选）
   * @returns {string} 格式化后的数字字符串
   */
  formatNumber(number, options = {}, locale = null) {
    const targetLocale = locale || this.currentLocale;
    try {
      return new Intl.NumberFormat(targetLocale, options).format(number);
    } catch (error) {
      console.error('数字格式化错误:', error);
      return number.toString();
    }
  }
  /**
   * 格式化相对时间
   * @param {Date} date - 日期对象
   * @param {string} locale - 语言代码（可选）
   * @returns {string} 相对时间字符串
   */
  formatRelativeTime(date, locale = null) {
    const targetLocale = locale || this.currentLocale;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    // 定义时间单位
    const units = [
      { max: 60, unit: 'second' },
      { max: 3600, unit: 'minute' },
      { max: 86400, unit: 'hour' },
      { max: 2592000, unit: 'day' },
      { max: 31536000, unit: 'month' },
      { max: Infinity, unit: 'year' },
    ];
    for (const { max, unit } of units) {
      if (diffInSeconds < max) {
        const value = Math.floor(diffInSeconds / (max / 60));
        try {
          return new Intl.RelativeTimeFormat(targetLocale).format(-value, unit);
        } catch (error) {
          console.error('相对时间格式化错误:', error);
          break;
        }
      }
    }
    return date.toLocaleDateString();
  }
}
// 创建全局国际化管理器实例
const i18nManager = new I18nManager();
/**
 * 翻译函数快捷方式
 * @param {string} key - 翻译键
 * @param {Object} params - 参数对象
 * @returns {string} 翻译文本
 */
function t(key, params = {}) {
  return i18nManager.t(key, params);
}
/**
 * 初始化国际化支持
 * @param {string} defaultLocale - 默认语言
 * @param {string} fallbackLocale - 回退语言
 * @returns {Promise<boolean>} 初始化是否成功
 */
async function initI18n(defaultLocale = 'zh-CN', fallbackLocale = 'en-US') {
  i18nManager.init(defaultLocale, fallbackLocale);
  // 加载中文翻译
  await loadLocaleTranslations('zh-CN');
  // 加载英文翻译
  await loadLocaleTranslations('en-US');
  // 如果当前语言不是中文或英文，尝试加载对应翻译
  if (i18nManager.getCurrentLocale() !== 'zh-CN' && i18nManager.getCurrentLocale() !== 'en-US') {
    await loadLocaleTranslations(i18nManager.getCurrentLocale());
  }
  return true;
}
/**
 * 加载指定语言的翻译
 * @param {string} locale - 语言代码
 * @returns {Promise<boolean>} 加载是否成功
 */
function loadLocaleTranslations(locale) {
  // 在实际应用中，这里应该从服务器或本地文件加载翻译
  // 这里提供一些示例翻译
  const translations = {};
  if (locale === 'zh-CN') {
    // 中文翻译
    Object.assign(translations, {
      // 通用翻译
      'common.loading': '加载中...',
      'common.error': '错误',
      'common.success': '成功',
      'common.cancel': '取消',
      'common.confirm': '确认',
      'common.save': '保存',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.close': '关闭',
      // GitHub 界面翻译
      'github.pull_request': '拉取请求',
      'github.issues': '问题',
      'github.code': '代码',
      'github.actions': '操作',
      'github.projects': '项目',
      'github.security': '安全',
      'github.insights': '洞察',
      'github.settings': '设置',
      // 设置界面
      'settings.title': '设置',
      'settings.language': '语言',
      'settings.theme': '主题',
      'settings.save_success': '设置已保存',
      'settings.save_error': '保存设置失败',
      // 时间格式
      'time.now': '刚刚',
      'time.minutes_ago': '{{count}} 分钟前',
      'time.hours_ago': '{{count}} 小时前',
      'time.days_ago': '{{count}} 天前',
      'time.weeks_ago': '{{count}} 周前',
      'time.months_ago': '{{count}} 个月前',
      'time.years_ago': '{{count}} 年前',
    });
  } else if (locale === 'en-US') {
    // 英文翻译（作为回退语言）
    Object.assign(translations, {
      // 通用翻译
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.cancel': 'Cancel',
      'common.confirm': 'Confirm',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.close': 'Close',
      // GitHub 界面翻译
      'github.pull_request': 'Pull Request',
      'github.issues': 'Issues',
      'github.code': 'Code',
      'github.actions': 'Actions',
      'github.projects': 'Projects',
      'github.security': 'Security',
      'github.insights': 'Insights',
      'github.settings': 'Settings',
      // 设置界面
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.save_success': 'Settings saved',
      'settings.save_error': 'Failed to save settings',
      // 时间格式
      'time.now': 'now',
      'time.minutes_ago': '{{count}} minutes ago',
      'time.hours_ago': '{{count}} hours ago',
      'time.days_ago': '{{count}} days ago',
      'time.weeks_ago': '{{count}} weeks ago',
      'time.months_ago': '{{count}} months ago',
      'time.years_ago': '{{count}} years ago',
    });
  }
  return i18nManager.loadTranslations(locale, translations);
}
/**
 * 切换语言
 * @param {string} locale - 语言代码
 * @returns {Promise<boolean>} 切换是否成功
 */
async function switchLanguage(locale) {
  // 如果语言未加载，尝试加载
  if (!i18nManager.getLoadedLocales().includes(locale)) {
    const success = await loadLocaleTranslations(locale);
    if (!success) {
      console.error(`无法加载语言: ${locale}`);
      return false;
    }
  }
  return i18nManager.setLocale(locale);
}
// ES6模块导出
/**
 * GitHub 中文翻译主入口文件
 * @file main.js
 * @version 1.9.19
 * @date 2026-06-08
 * @author Sut
 * @description 整合所有模块并初始化脚本
 */
// 导入核心模块
/**
 * 清理资源
 * 在页面卸载时调用，防止内存泄漏
 */
function cleanup() {
  try {
    // 停止页面监控
    if (pageMonitor && typeof pageMonitor.stop === 'function') {
      pageMonitor.stop();
    }
    // 清理翻译缓存
    if (translationCore && typeof translationCore.clearCache === 'function') {
      translationCore.clearCache();
    }
    // 清理配置界面
    if (configUI && typeof configUI.cleanup === 'function') {
      configUI.cleanup();
    }
    // 移除页面卸载事件监听器
    window.removeEventListener('beforeunload', cleanup);
    window.removeEventListener('unload', cleanup);
    // 移除页面隐藏事件监听器
    if (window.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', window.visibilityChangeHandler);
      window.visibilityChangeHandler = null;
    }
    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 资源清理完成');
    }
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 资源清理失败:', error);
    }
  }
}
/**
 * 初始化脚本
 */
function init() {
  try {
    // 检查更新
    if (CONFIG.updateCheck.enabled) {
      versionChecker.checkForUpdates().catch(() => {
        // 静默失败，不影响用户体验
      });
    }
    // 初始化翻译核心功能
    if (typeof translationCore === 'undefined') {
      console.error('[GitHub 中文翻译] translationCore 未定义');
      return;
    }
    if (typeof translationCore.init !== 'function') {
      console.error('[GitHub 中文翻译] translationCore.init 不是函数');
      return;
    }
    translationCore.init();
    // 执行页面翻译
    if (typeof translationCore.translate === 'function') {
      translationCore.translate();
    } else {
      console.error('[GitHub 中文翻译] translationCore.translate 不是函数');
    }
    // 初始化页面监控
    if (typeof pageMonitor !== 'undefined' && typeof pageMonitor.init === 'function') {
      pageMonitor.init();
    }
    // 初始化配置界面
    if (typeof configUI !== 'undefined' && typeof configUI.init === 'function') {
      configUI.init();
    }
    // 添加页面卸载事件监听器
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);
    // 添加页面隐藏事件监听器（当用户切换标签页时）
    const visibilityChangeHandler = () => {
      if (document.visibilityState === 'hidden') {
        // 页面隐藏时可以清理一些缓存
        if (translationCore && typeof translationCore.cleanCache === 'function') {
          translationCore.cleanCache();
        }
      }
    };
    document.addEventListener('visibilitychange', visibilityChangeHandler);
    // 保存事件监听器引用，以便后续清理
    window.visibilityChangeHandler = visibilityChangeHandler;
  } catch (error) {
    console.error('[GitHub 中文翻译] 脚本初始化失败:', error);
  }
}
/**
 * 启动脚本
 */
function startScript() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        await init();
      } catch (error) {
        console.error('[GitHub 中文翻译] DOMContentLoaded 回调中初始化失败:', error);
      }
    });
  } else {
    try {
      init();
    } catch (error) {
      console.error('[GitHub 中文翻译] 直接初始化失败:', error);
    }
  }
}
// 导出函数供其他模块使用
// 将核心模块暴露到全局作用域，便于调试和配置界面使用
if (typeof window !== 'undefined') {
  window.translationCore = translationCore;
  window.configUI = configUI;
}
// 启动脚本
startScript();})();
