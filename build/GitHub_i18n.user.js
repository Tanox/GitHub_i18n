// ==UserScript==
// @name         GitHub 中文翻译
// @namespace    https://github.com/Tanox/GitHub_i18n
// @version      1.9.22
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 统一管理GitHub自动化字符串更新工具的版本信息
 */
/**
 * 当前工具版本号
 * @type {string}
 * @description 这是项目的单一版本源，所有其他版本号引用都应从此处获取
 */
const VERSION = '1.9.22';
/**
 * GitHub 中文翻译配置文件
 * @file config.js
 * @version 1.9.22
 * @date 2026-07-04
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
 * 函数控制工具模块
 * @file functionUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含节流、防抖、延迟、安全执行等函数控制相关辅助函数
 */
/**
 * 函数控制工具集合
 */
const functionUtils = {
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
 * 字符串与正则工具模块
 * @file stringUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含正则转义、安全正则、JSON安全解析与序列化等辅助函数
 */
/**
 * 字符串与正则工具集合
 */
const stringUtils = {
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
};
/**
 * URL与页面路径工具模块
 * @file urlUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含页面路径获取、URL匹配、查询参数解析等辅助函数
 */
/**
 * URL与页面路径工具集合
 */
const urlUtils = {
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
};
/**
 * DOM文本节点工具模块
 * @file domUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含DOM文本节点收集、可收集文本判断等辅助函数
 */
/**
 * DOM文本节点工具集合
 */
const domUtils = {
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
          if (this.isCollectibleText(text, maxLength)) {
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
  // 判断文本是否可收集：非空、未超长、非纯数字、非纯标点符号
  isCollectibleText(text, maxLength) {
    if (!text || text.length === 0 || text.length >= maxLength) {
      return false;
    }
    if (/^\d+$/.test(text)) {
      return false;
    }
    // 使用基础字符类替代 Unicode 属性转义，避免构建过程中的解析问题
    if (/^[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u00A1-\u00BF\u2000-\u206F\u3000-\u303F]+$/.test(text)) {
      return false;
    }
    return true;
  },
};
/**
 * 对象操作工具模块
 * @file objectUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含嵌套属性安全访问、深拷贝等辅助函数
 */
/**
 * 对象操作工具集合
 */
const objectUtils = {
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
};
/**
 * 编码与加密工具模块
 * @file cryptoUtils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含Base64编解码、数据混淆还原、SHA-256哈希、错误信息脱敏等辅助函数
 */
/**
 * 编码与加密工具集合
 */
const cryptoUtils = {
  /**
   * 对数据进行Base64编码（用于轻量级数据混淆，非加密）
   * @param {string} data - 要编码的数据
   * @returns {string} Base64编码后的字符串
   */
  base64Encode(data) {
    try {
      return btoa(unescape(encodeURIComponent(data)));
    } catch (_error) {
      return data;
    }
  },
  /**
   * 对Base64编码的数据进行解码
   * @param {string} encodedData - Base64编码的字符串
   * @returns {string|null} 解码后的字符串或null
   */
  base64Decode(encodedData) {
    try {
      return decodeURIComponent(escape(atob(encodedData)));
    } catch (_error) {
      return null;
    }
  },
  /**
   * 混淆敏感配置数据（轻量级保护）
   * 使用XOR加密配合Base64编码
   * @param {string} data - 要混淆的数据
   * @param {string} key - 混淆密钥
   * @returns {string} 混淆后的数据
   */
  obfuscateData(data, key = 'github-i18n-secure') {
    try {
      const encoded = this.base64Encode(data);
      let result = '';
      for (let i = 0; i < encoded.length; i++) {
        const charCode = encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return this.base64Encode(result);
    } catch (_error) {
      return data;
    }
  },
  /**
   * 还原被混淆的配置数据
   * @param {string} obfuscatedData - 被混淆的数据
   * @param {string} key - 混淆密钥
   * @returns {string|null} 还原后的数据或null
   */
  deobfuscateData(obfuscatedData, key = 'github-i18n-secure') {
    try {
      const decoded = this.base64Decode(obfuscatedData);
      if (!decoded) return null;
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode);
      }
      return this.base64Decode(result);
    } catch (_error) {
      return null;
    }
  },
  /**
   * 计算字符串的SHA-256哈希值
   * @param {string} data - 要计算哈希的数据
   * @returns {Promise<string>} SHA-256哈希值（十六进制格式）
   */
  async sha256Hash(data) {
    try {
      const msgUint8 = new TextEncoder().encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (_error) {
      return '';
    }
  },
  /**
   * 脱敏错误信息，移除敏感路径和内部细节
   * @param {string|Error} error - 错误对象或错误消息
   * @returns {string} 脱敏后的错误消息
   */
  sanitizeErrorMessage(error) {
    try {
      let message = typeof error === 'string' ? error : error.message || String(error);
      // 移除文件路径信息
      message = message.replace(/\/[a-zA-Z0-9_/.-]+:[0-9]+:[0-9]+/g, '[位置]');
      message = message.replace(/\/workspace\//g, '');
      message = message.replace(/at\s+[a-zA-Z0-9_.]+\s+[<(]/g, 'at [函数]');
      // 移除可能的敏感数据
      message = message.replace(/(password|token|secret|key)\s*[=:]\s*['"][^'"]*['"]/gi, '$1=[已隐藏]');
      message = message.replace(/['"][a-zA-Z0-9+/=]{20,}['"]/g, '[已隐藏]');
      // 限制错误消息长度
      if (message.length > 200) {
        message = message.substring(0, 200) + '...';
      }
      return message;
    } catch (_error) {
      return '[未知错误]';
    }
  },
};
/**
 * 工具函数模块（门面模式）
 * @file utils.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 工具函数统一入口，委托给各子模块，保持 utils 对象 API 不变
 */
/**
 * 工具函数集合（门面）
 * 通过展开各子模块，保持 utils.methodName() 调用方式不变
 * this 引用在合并后仍指向 utils，跨方法调用可正常解析
 */
const utils = {
  ...functionUtils,
  ...stringUtils,
  ...urlUtils,
  ...domUtils,
  ...objectUtils,
  ...cryptoUtils,
};
/**
 * LRU缓存管理模块
 * @file cacheManager.js
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责统一管理所有错误处理和恢复机制
 */
const ErrorHandler = {
  // 错误计数器
  errorCounts: new Map(),
  // 错误类型定义
  ERROR_TYPES: {
    INITIALIZATION: 'initialization',
    TRANSLATION: 'translation',
    DOM_OPERATION: 'dom_operation',
    DICTIONARY: 'dictionary',
    NETWORK: 'network',
    PERFORMANCE: 'performance',
    OTHER: 'other',
  },
  // 词典恢复回调（由上层模块通过 setDictionaryRecoveryHandler 注册）
  _dictionaryRecoveryFn: null,
  /**
   * 注册词典恢复处理函数
   * 由 translationCore 在初始化时注册，避免 core 层反向依赖 translation-core 层
   * @param {Function} fn - 恢复函数
   */
  setDictionaryRecoveryHandler(fn) {
    if (typeof fn === 'function') {
      this._dictionaryRecoveryFn = fn;
    }
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
    const sanitizedMessage = utils.sanitizeErrorMessage(error);
    const errorMessage = `[GitHub 中文翻译] ${context}时出错 (${type}): ${sanitizedMessage}`;
    if (CONFIG.debugMode) {
      // 调试模式下输出简化错误信息，不输出敏感堆栈
      console.error(errorMessage);
    } else {
      // 生产环境只输出简短错误消息
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
      [this.ERROR_TYPES.INITIALIZATION]: CONFIG.performance?.maxInitializationErrorCount || 3,
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
        // 通过注册的恢复回调重新初始化词典
        if (this._dictionaryRecoveryFn) {
          try {
            this._dictionaryRecoveryFn();
          } catch (recoveryError) {
            if (CONFIG.debugMode) {
              console.error('[GitHub 中文翻译] 词典恢复失败:', recoveryError);
            }
          }
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
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 监听URL路径变化
 */
const pathListener = {
  lastPath: '',
  onPathChange: null,
  originalPushState: null,
  originalReplaceState: null,
  popstateHandler: null,
  init(pathChangeCallback) {
    this.onPathChange = pathChangeCallback;
    this.lastPath = window.location.pathname + window.location.search;
    this.setupPathListener();
  },
  setupPathListener() {
    this.popstateHandler = utils.debounce(() => {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== this.lastPath) {
        this.handlePathChange();
      }
    }, CONFIG.routeChangeDelay || 500);
    // 仅通过 pageMonitorCache 注册一次，避免重复绑定
    pageMonitorCache.addEventListener({
      target: window,
      type: 'popstate',
      handler: this.popstateHandler,
    });
    // 保存原始引用，便于 cleanup 还原
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;
    history.pushState = function (...args) {
      pathListener.originalPushState.apply(this, args);
      pathListener.handlePathChange();
    };
    history.replaceState = function (...args) {
      pathListener.originalReplaceState.apply(this, args);
      pathListener.handlePathChange();
    };
  },
  /**
   * 还原 history 方法并清理，防止脚本卸载后仍触发翻译
   */
  cleanup() {
    if (this.originalPushState) {
      history.pushState = this.originalPushState;
      this.originalPushState = null;
    }
    if (this.originalReplaceState) {
      history.replaceState = this.originalReplaceState;
      this.originalReplaceState = null;
    }
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 观察DOM变化并触发翻译
 */
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
      // 缓存页面模式到闭包，避免每次 mutation 都重新检测；
      // 路由变化由 pathListener 处理，会触发 observer 重建。
      const cachedPageMode = pageMode;
      const handleMutations = (mutations) => {
        try {
          if (this.shouldTriggerTranslation(mutations, cachedPageMode)) {
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
        // 仅通过 pageMonitorCache 注册一次，避免重复绑定
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
    // 透传 CONFIG 中配置的重要元素选择器，避免传入空数组导致配置失效
    const importantElements = CONFIG.performance?.importantElements || [];
    const elementCheckCache = new WeakMap();
    for (const mutation of mutations) {
      if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
        if (isElementImportant(mutation.target, importantElements, elementCheckCache, pageMode)) {
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 管理翻译触发和节流
 */
const translationTrigger = {
  lastTranslateTimestamp: 0,
  scheduledTranslate: null,
  /**
   * 清理定时器，防止页面卸载后定时器仍触发操作已销毁的 DOM
   */
  cleanup() {
    if (this.scheduledTranslate) {
      clearTimeout(this.scheduledTranslate);
      this.scheduledTranslate = null;
    }
  },
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
 * @version 1.9.22
 * @date 2026-07-04
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
      translationTrigger.cleanup();
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
      // 还原 history.pushState/replaceState，移除 popstate 监听器
      pathListener.cleanup();
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含所有页面共用的翻译字符串，使用 GitHub 实际界面文本作为键
 */
const commonDictionary = {
  // ===== 导航和菜单 =====
  'Navigation Menu': '导航菜单',
  'Toggle navigation': '切换导航',
  'Skip to content': '跳转到内容',
  // ===== 用户操作 =====
  'Sign in': '登录',
  'Sign up': '注册',
  'Sign out': '登出',
  'Sign in with a passkey': '使用通行密钥登录',
  'Set status': '设置状态',
  'Clear status': '清除状态',
  'Set status message': '设置状态消息',
  'Set status emoji': '设置状态表情',
  'Set status until': '设置状态至',
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
  "What's on your mind?": '你在想什么？',
  Never: '从不',
  Today: '今天',
  'This week': '本周',
  'Custom date': '自定义日期',
  // ===== 用户下拉菜单 =====
  'Your profile': '您的个人资料',
  'Your repositories': '您的仓库',
  'Your projects': '您的项目',
  'Your stars': '您的星标',
  'Your gists': '您的代码片段',
  'Feature preview': '功能预览',
  Help: '帮助',
  Settings: '设置',
  // ===== 新建菜单 =====
  New: '新建',
  'New repository': '新建仓库',
  'Import repository': '导入仓库',
  'New organization': '新建组织',
  'New project': '新建项目',
  'New gist': '新建代码片段',
  // ===== 顶部导航 =====
  'Pull requests': '拉取请求',
  Issues: '问题',
  Codespaces: '代码空间',
  Explore: '探索',
  Marketplace: '应用市场',
  // ===== 搜索 =====
  'Search or jump to...': '搜索或跳转到...',
  Search: '搜索',
  Clear: '清除',
  'Search syntax tips': '搜索语法提示',
  'Provide feedback': '提供反馈',
  'We read every piece of feedback, and take your input very seriously.':
    '我们会阅读每一条反馈，并非常重视您的意见。',
  'Submit feedback': '提交反馈',
  'Saved searches': '已保存的搜索',
  'Use saved searches to filter your results more quickly': '使用已保存的搜索更快地筛选结果',
  Name: '名称',
  Query: '查询',
  'To see all available qualifiers, see our documentation.': '查看我们的文档了解所有可用的限定符。',
  'Create saved search': '创建已保存的搜索',
  'Resetting focus': '重置焦点',
  // ===== 仓库页面 =====
  Code: '代码',
  Discussions: '讨论',
  Actions: 'Actions',
  Wiki: '维基',
  Security: '安全',
  Insights: '洞察',
  Projects: '项目',
  // ===== 仓库操作 =====
  'Use this template': '使用此模板',
  'Generate new repository': '生成新仓库',
  'Use this template to create a new repository': '使用此模板创建新仓库',
  'Include all branches': '包含所有分支',
  Star: '星标',
  Unstar: '取消星标',
  Fork: '复刻',
  Watch: '关注',
  Unwatch: '取消关注',
  // ===== 仓库信息 =====
  Owner: '所有者',
  'Repository name': '仓库名称',
  'Description (optional)': '描述（可选）',
  Public: '公开',
  'Anyone on the internet can see this repository. You choose who can commit.':
    '互联网上的任何人都可以看到此仓库。您选择谁可以提交。',
  Private: '私有',
  'You choose who can see and commit to this repository.': '您选择谁可以查看和提交到此仓库。',
  'Create repository': '创建仓库',
  'Add a README file': '添加 README 文件',
  'Add .gitignore': '添加 .gitignore',
  'Choose a license': '选择许可证',
  // ===== 文件操作 =====
  'Add file': '添加文件',
  'Create new file': '创建新文件',
  'Upload files': '上传文件',
  'Find file': '查找文件',
  'Go to file': '前往文件',
  'Add directory': '添加目录',
  'Edit file': '编辑文件',
  'Delete file': '删除文件',
  'Copy path': '复制路径',
  'Copy file': '复制文件',
  Download: '下载',
  'View raw': '查看原始文件',
  Blame: '责备',
  History: '历史',
  Preview: '预览',
  'Preview changes': '预览更改',
  'No changes': '无更改',
  'Edit new file': '编辑新文件',
  // ===== 分支操作 =====
  Branch: '分支',
  'Switch branches': '切换分支',
  'Find or create branch': '查找或创建分支',
  'Create branch': '创建分支',
  'Delete branch': '删除分支',
  'Rename branch': '重命名分支',
  'Switch to default branch': '切换到默认分支',
  'View more branches': '查看更多分支',
  'Showing recent branches': '显示最近的分支',
  'Default branch': '默认分支',
  // ===== 提交 =====
  'Commit changes': '提交更改',
  'Commit directly to the main branch.': '直接提交到 main 分支。',
  'Create a new branch for this commit and start a pull request.':
    '为此提交创建一个新分支并开始拉取请求。',
  'Learn more about pull requests.': '了解更多关于拉取请求的信息。',
  'Propose new file': '提议新文件',
  'Propose changes': '提议更改',
  Commit: '提交',
  Commits: '提交',
  'Commit history': '提交历史',
  'Recent commits': '最近提交',
  // ===== 拉取请求 =====
  'Create pull request': '创建拉取请求',
  'Draft pull request': '草稿拉取请求',
  'Create draft pull request': '创建草稿拉取请求',
  'Pull request': '拉取请求',
  'Open a pull request': '创建拉取请求',
  'Compare changes': '比较更改',
  'Choose a branch': '选择分支',
  'base:': '基础分支:',
  'compare:': '比较分支:',
  'Ability to merge': '合并能力',
  'This branch has no conflicts with the base branch': '此分支与基础分支没有冲突',
  'This branch has conflicts that must be resolved': '此分支有必须解决的冲突',
  'Resolve conflicts': '解决冲突',
  'Merging can be performed automatically.': '可以自动执行合并。',
  'Merge pull request': '合并拉取请求',
  'Squash and merge': '压缩并合并',
  'Rebase and merge': '变基并合并',
  'Create merge commit': '创建合并提交',
  'Confirm merge': '确认合并',
  'Restore branch': '恢复分支',
  // ===== PR 审查 =====
  Conversation: '对话',
  'Files changed': '文件已更改',
  Checks: '检查',
  'Review required': '需要审查',
  Write: '编写',
  'Leave a comment': '发表评论',
  'Write a review': '撰写审查意见',
  'Suggest a change': '建议更改',
  'Attach files by dragging & dropping, selecting or pasting them.':
    '通过拖放、选择或粘贴来附加文件。',
  'Styling with Markdown is supported': '支持 Markdown 样式',
  'Start a review': '开始审查',
  'Add your review': '添加您的审查',
  'Submit review': '提交审查',
  Approve: '批准',
  'Request changes': '请求更改',
  Comment: '评论',
  Approved: '已批准',
  'Changes requested': '已请求更改',
  Commented: '已评论',
  'Pending review': '待审查',
  'Review has been dismissed': '审查已被驳回',
  // ===== 问题 =====
  'New issue': '新建问题',
  'Open a blank issue': '开启空白问题',
  'Get started': '开始',
  'Submit new issue': '提交新问题',
  Title: '标题',
  'Add title': '添加标题',
  Body: '正文',
  'Add body': '添加正文',
  Assignees: '负责人',
  Labels: '标签',
  Milestone: '里程碑',
  'No milestone': '无里程碑',
  'No assignees': '无负责人',
  'No labels': '无标签',
  'Nobody assigned': '未分配',
  'Add labels': '添加标签',
  'Set milestone': '设置里程碑',
  'Set assignees': '设置负责人',
  'Set project': '设置项目',
  // ===== 问题状态 =====
  Open: '打开',
  Closed: '已关闭',
  'Closed as completed': '已关闭（已完成）',
  'Closed as not planned': '已关闭（未计划）',
  'Close issue': '关闭问题',
  'Close as completed': '标记为已完成',
  'Close as not planned': '标记为未计划',
  'Reopen issue': '重新打开问题',
  'Edit issue': '编辑问题',
  'Delete issue': '删除问题',
  'Transfer issue': '转移问题',
  'Pin issue': '置顶问题',
  'Unpin issue': '取消置顶问题',
  'Lock conversation': '锁定对话',
  'Unlock conversation': '解锁对话',
  // ===== 标签类型 =====
  bug: '错误',
  documentation: '文档',
  duplicate: '重复',
  enhancement: '增强',
  'good first issue': '适合新手',
  'help wanted': '需要帮助',
  invalid: '无效',
  question: '问题',
  wontfix: '不予修复',
  // ===== 组织和团队 =====
  Organization: '组织',
  People: '人员',
  Teams: '团队',
  Repositories: '仓库',
  Members: '成员',
  'Outside collaborators': '外部协作者',
  'Pending invitations': '待处理邀请',
  'Invite member': '邀请成员',
  'Invite outside collaborator': '邀请外部协作者',
  // ===== 探索页面 =====
  Topics: '主题',
  Trending: '趋势',
  Collections: '收藏集',
  Events: '活动',
  'Trending repositories': '趋势仓库',
  'Trending developers': '趋势开发者',
  'Explore repositories': '探索仓库',
  'Curated lists and insight into burgeoning industries, topics, and communities.':
    '精选列表和对新兴行业、主题和社区的洞察。',
  'Load more…': '加载更多…',
  // ===== 通知 =====
  Notifications: '通知',
  'Mark all as read': '全部标记为已读',
  'Mark as read': '标记为已读',
  'Mark as unread': '标记为未读',
  Unread: '未读',
  Read: '已读',
  'All notifications': '所有通知',
  Watching: '关注中',
  Participating: '参与中',
  Done: '完成',
  'No new notifications': '没有新通知',
  // ===== 页脚 =====
  Terms: '条款',
  Privacy: '隐私',
  Docs: '文档',
  Contact: '联系',
  Blog: '博客',
  Status: '状态',
  'Manage cookies': '管理 Cookie',
  'Do not share my personal information': '不要分享我的个人信息',
  About: '关于',
  API: 'API',
  Training: '培训',
  Shop: '商店',
  // ===== 提示信息 =====
  'You signed in with another tab or window. Reload to refresh your session.':
    '您已在另一个标签页或窗口中登录。请重新加载以刷新您的会话。',
  'You signed out in another tab or window. Reload to refresh your session.':
    '您已在另一个标签页或窗口中登出。请重新加载以刷新您的会话。',
  Reload: '重新加载',
  'Dismiss alert': '关闭警告',
  "You can't perform that action at this time.": '您现在无法执行此操作。',
  'Uh oh!': '哎呀！',
  'There was an error while loading. Please reload this page.': '加载时发生错误。请重新加载此页面。',
  'Please reload this page': '请重新加载此页面',
  "You're all set!": '一切就绪！',
  'The repository has been created.': '仓库已创建。',
  'The file has been added.': '文件已添加。',
  'The file has been updated.': '文件已更新。',
  'The file has been deleted.': '文件已删除。',
  'The pull request has been created.': '拉取请求已创建。',
  'The issue has been created.': '问题已创建。',
  'The comment has been added.': '评论已添加。',
  'The issue has been closed.': '问题已关闭。',
  'The issue has been reopened.': '问题已重新打开。',
  'The pull request has been closed.': '拉取请求已关闭。',
  'The pull request has been reopened.': '拉取请求已重新打开。',
  'The pull request has been merged.': '拉取请求已合并。',
  'The branch has been deleted.': '分支已删除。',
  'The branch has been restored.': '分支已恢复。',
  'Copied!': '已复制！',
  // ===== 空仓库提示 =====
  'Quick setup — if you\'ve done this kind of thing before':
    '快速设置 — 如果您之前做过这种事',
  'Get started by creating a new file or uploading an existing file. We recommend every repository include a README, LICENSE, and .gitignore.':
    '通过创建新文件或上传现有文件开始。我们建议每个仓库都包含 README、LICENSE 和 .gitignore。',
  '…or create a new repository on the command line': '…或在命令行上创建新仓库',
  '…or push an existing repository from the command line': '…或从命令行推送现有仓库',
  '…or import code from another repository': '…或从另一个仓库导入代码',
  'You can initialize this repository with code from a Subversion, Mercurial, or TFS project.':
    '您可以使用 Subversion、Mercurial 或 TFS 项目的代码初始化此仓库。',
  'Import code': '导入代码',
  // ===== 个人资料 =====
  Overview: '概览',
  Stars: '星标',
  Followers: '关注者',
  Following: '关注中',
  Achievements: '成就',
  Pinned: '置顶',
  'Contribution settings': '贡献设置',
  'Contribution activity': '贡献活动',
  'Yearly contributions': '年度贡献',
  'Contribution graph': '贡献图',
  // ===== GitHub 首页 =====
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
  // ===== 产品特性 =====
  'Automate any workflow': '自动化任何工作流',
  Packages: '包',
  'Host and manage packages': '托管和管理包',
  'Find and fix vulnerabilities': '查找和修复漏洞',
  'Instant dev environments': '即时开发环境',
  Copilot: 'Copilot',
  'Write better code with AI': '用 AI 写出更好的代码',
  'Code review': '代码审查',
  'Manage code changes': '管理代码变更',
  'Plan and track work': '计划和跟踪工作',
  'Collaborate outside of code': '代码外的协作',
  // ===== 企业版 =====
  'Enterprise platform': '企业平台',
  'AI-powered developer platform': '人工智能驱动的开发者平台',
  'Available add-ons': '可用附加组件',
  'Copilot for business': '商业版 Copilot',
  'Enterprise-grade AI features': '企业级人工智能功能',
  'Premium Support': '高级支持',
  'Enterprise-grade 24/7 support': '企业级 24/7 支持',
  Pricing: '价格',
  // ===== 解决方案 =====
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
  // ===== MCP =====
  'MCP Registry': 'MCP 注册表',
  // ===== 保存按钮 =====
  Save: '保存',
  Cancel: '取消',
  Edit: '编辑',
  Delete: '删除',
  Create: '创建',
  Update: '更新',
  Submit: '提交',
  Confirm: '确认',
  Close: '关闭',
  'Save changes': '保存更改',
  'Cancel changes': '取消更改',
  // ===== 状态 =====
  Success: '成功',
  Failure: '失败',
  Error: '错误',
  Pending: '待定',
  'In progress': '进行中',
  Queued: '排队中',
  Running: '运行中',
  Completed: '已完成',
  Skipped: '已跳过',
  Cancelled: '已取消',
  'Action required': '需要操作',
  Waiting: '等待中',
  'On hold': '暂停',
  // ===== 其他常见文本 =====
  'About this repository': '关于此仓库',
  Readme: 'README',
  License: '许可证',
  Contributing: '贡献指南',
  'Code of conduct': '行为准则',
  'Security policy': '安全政策',
  Website: '网站',
  Languages: '语言',
  'View license': '查看许可证',
  'View documentation': '查看文档',
  Contribute: '贡献',
  'Report a bug': '报告问题',
  'Request a feature': '请求功能',
  'Get help': '获取帮助',
  Sponsor: '赞助',
  Sponsors: '赞助者',
  'Sponsor this project': '赞助此项目',
  'Become a sponsor': '成为赞助者',
  'View sponsors': '查看赞助者',
};
/**
 * Codespaces 页面翻译词典
 * @file codespaces.js
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
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
 * Issues 页面翻译词典
 * @file issues.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Issues 页面的翻译词条
 */
const issuesDictionary = {
  // ===== 页面标题与筛选 =====
  Issues: '问题',
  'New issue': '新建问题',
  'Open issue': '打开问题',
  'Close issue': '关闭问题',
  'Closed issue': '已关闭的问题',
  'Reopen issue': '重新打开问题',
  'Issue title': '问题标题',
  'Add issue title': '添加问题标题',
  // ===== 筛选与排序 =====
  Filters: '筛选条件',
  'Open issues': '打开的问题',
  'Closed issues': '已关闭的问题',
  'Your issues': '您的问题',
  'Your pull requests': '您的拉取请求',
  'Assigned to you': '分配给您',
  'Created by you': '由您创建',
  'Mentioning you': '提及您',
  'Sort by': '排序方式',
  'Newest': '最新',
  'Oldest': '最旧',
  'Most commented': '评论最多',
  'Least commented': '评论最少',
  'Recently updated': '最近更新',
  'Least recently updated': '最久未更新',
  // ===== 标签与里程碑 =====
  Labels: '标签',
  'No label': '无标签',
  Milestones: '里程碑',
  'No milestone': '无里程碑',
  'Create a new label': '创建新标签',
  'Create a new milestone': '创建新里程碑',
  'Label name': '标签名称',
  'Label description': '标签描述',
  'Milestone title': '里程碑标题',
  'Due date': '截止日期',
  'Milestone description': '里程碑描述',
  // ===== 评论与回复 =====
  'Write a comment': '撰写评论',
  'Add comment': '添加评论',
  'Submit new issue': '提交新问题',
  Comment: '评论',
  Comments: '评论',
  'Comment on this issue': '对此问题发表评论',
  'Reply to this comment': '回复此评论',
  'Edit comment': '编辑评论',
  'Delete comment': '删除评论',
  'Hide comment': '隐藏评论',
  'Copy link': '复制链接',
  'Quote reply': '引用回复',
  // ===== 状态管理 =====
  'Open': '打开',
  'Closed': '已关闭',
  'Close with comment': '评论并关闭',
  'Reopen': '重新打开',
  'Reopen with comment': '评论并重新打开',
  'Close as completed': '以已完成关闭',
  'Close as not planned': '以未计划关闭',
  'Close as duplicate': '以重复关闭',
  // ===== 分配与关联 =====
  Assignees: '负责人',
  'Assign yourself': '分配给自己',
  'No assignees': '无负责人',
  'No one assigned': '未分配任何人',
  'Linked issues': '关联的问题',
  'Linked pull requests': '关联的拉取请求',
  'Development': '开发',
  'Successfully linked': '成功关联',
  'Create a branch': '创建分支',
  'Check out locally': '在本地检出',
  // ===== 通知与订阅 =====
  Notifications: '通知',
  'Notifications menu': '通知菜单',
  'Subscribe to notifications': '订阅通知',
  'Unsubscribe from notifications': '取消订阅通知',
  'You are receiving this because you': '您收到此通知是因为您',
  // ===== 项目关联 =====
  Projects: '项目',
  'No projects': '无项目',
  'Add to project': '添加到项目',
  'Remove from project': '从项目移除',
  // ===== 侧边栏操作 =====
  'About this issue': '关于此问题',
  'No description provided': '未提供描述',
  'Edit description': '编辑描述',
  // ===== 时间与活动 =====
  Activity: '活动',
  'Show all activity': '显示全部活动',
  'Show conversation only': '仅显示对话',
  'Show history only': '仅显示历史',
  'This issue was closed by': '此问题由关闭',
  'This issue was reopened by': '此问题由重新打开',
};
/**
 * Pull Requests 页面翻译词典
 * @file pullRequests.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Pull Requests 页面的翻译词条
 */
const pullRequestsDictionary = {
  // ===== 页面标题 =====
  'Pull requests': '拉取请求',
  'New pull request': '新建拉取请求',
  'Create pull request': '创建拉取请求',
  'Open pull request': '打开拉取请求',
  'Close pull request': '关闭拉取请求',
  'Merged pull request': '已合并的拉取请求',
  'Draft pull request': '草稿拉取请求',
  // ===== 筛选与排序 =====
  'Open pull requests': '打开的拉取请求',
  'Closed pull requests': '已关闭的拉取请求',
  'Merged pull requests': '已合并的拉取请求',
  'Draft pull requests': '草稿拉取请求',
  'Your pull requests': '您的拉取请求',
  'Pull request title': '拉取请求标题',
  'Add pull request title': '添加拉取请求标题',
  // ===== 状态标签 =====
  Open: '打开',
  Closed: '已关闭',
  Merged: '已合并',
  Draft: '草稿',
  'Ready for review': '可审查',
  'Review required': '需要审查',
  'Changes requested': '要求修改',
  Approved: '已批准',
  'Review in progress': '审查中',
  'Commented': '已评论',
  'Awaiting review': '等待审查',
  // ===== 合并 =====
  'Merge pull request': '合并拉取请求',
  'Merge': '合并',
  'Confirm merge': '确认合并',
  'Squash and merge': '压缩并合并',
  'Rebase and merge': '变基并合并',
  'Create a merge commit': '创建合并提交',
  'Merged successfully': '合并成功',
  'This branch has no conflicts with the base branch': '此分支与基础分支无冲突',
  'This branch has conflicts that must be resolved': '此分支存在必须解决的冲突',
  'Merge conflict': '合并冲突',
  'Resolve conflicts': '解决冲突',
  'View merge conflicts': '查看合并冲突',
  // ===== 代码审查 =====
  Reviewers: '审查者',
  'Request review': '请求审查',
  'Review changes': '审查变更',
  'Add review': '添加审查',
  'Submit review': '提交审查',
  'Review summary': '审查摘要',
  'Finish your review': '完成您的审查',
  'Comment': '评论',
  'Approve': '批准',
  'Request changes': '请求修改',
  'Change requested': '请求的修改',
  'Files changed': '变更的文件',
  'Conversation': '对话',
  Commits: '提交',
  Checks: '检查',
  'All checks have passed': '所有检查已通过',
  'Some checks were not successful': '部分检查未成功',
  'Checks have not completed yet': '检查尚未完成',
  // ===== 分支 =====
  'base:': '基础：',
  'compare:': '比较：',
  'base branch': '基础分支',
  'compare branch': '比较分支',
  'head branch': '头部分支',
  'Choose base branch': '选择基础分支',
  'Choose head branch': '选择头部分支',
  'Able to merge': '可合并',
  'Can\'t be merged': '无法合并',
  // ===== 提交与变更 =====
  'No commits': '无提交',
  'Showing': '显示',
  'of': '共',
  'Commit message': '提交信息',
  'Verified': '已验证',
  'Unverified': '未验证',
  // ===== 评论 =====
  'Write a comment': '撰写评论',
  'Add comment': '添加评论',
  'Review comment': '审查评论',
  'File comment': '文件评论',
  'Line comment': '行内评论',
  'Start a review': '开始审查',
  'Comment on this pull request': '对此拉取请求发表评论',
  'Reply to this review': '回复此审查',
  // ===== 指派与标签 =====
  Assignees: '负责人',
  'Assign yourself': '分配给自己',
  Labels: '标签',
  Milestones: '里程碑',
  Projects: '项目',
  'Linked issues': '关联的问题',
  'Development': '开发',
  // ===== 通知 =====
  Notifications: '通知',
  'Subscribe to notifications': '订阅通知',
  'Unsubscribe from notifications': '取消订阅通知',
  // ===== 操作按钮 =====
  'Edit': '编辑',
  'Reopen pull request': '重新打开拉取请求',
  'Mark as draft': '标记为草稿',
  'Convert to draft': '转换为草稿',
  // ===== 描述区 =====
  'About this pull request': '关于此拉取请求',
  'No description provided': '未提供描述',
  'Edit description': '编辑描述',
};
/**
 * Actions 页面翻译词典
 * @file actions.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Actions 页面的翻译词条
 */
const actionsDictionary = {
  // ===== 页面标题 =====
  Actions: 'Actions',
  'All workflows': '所有工作流',
  'New workflow': '新建工作流',
  'Actions documentation': 'Actions 文档',
  // ===== 工作流 =====
  Workflows: '工作流',
  Workflow: '工作流',
  'Workflow runs': '工作流运行',
  'Workflow file': '工作流文件',
  'Workflow name': '工作流名称',
  'No workflows found': '未找到工作流',
  'Create workflow': '创建工作流',
  'Configure': '配置',
  'Set up this workflow': '设置此工作流',
  'Start commit': '开始提交',
  'Commit new file': '提交新文件',
  // ===== 运行状态 =====
  Status: '状态',
  'All statuses': '所有状态',
  Success: '成功',
  Failed: '失败',
  Cancelled: '已取消',
  'In progress': '进行中',
  Queued: '排队中',
  Skipped: '已跳过',
  'Waiting': '等待中',
  'Completed': '已完成',
  // ===== 运行详情 =====
  'Run details': '运行详情',
  'Run ID': '运行 ID',
  'Workflow run': '工作流运行',
  'Triggered by': '触发者',
  'Triggered': '已触发',
  'Trigger': '触发器',
  'Manual workflow': '手动工作流',
  'Push': '推送',
  'Pull request': '拉取请求',
  Schedule: '定时',
  'Workflow dispatch': '工作流调度',
  'Branch': '分支',
  'Commit': '提交',
  'Event': '事件',
  'Duration': '持续时间',
  'Started': '开始时间',
  // ===== 作业与步骤 =====
  Jobs: '作业',
  Job: '作业',
  Steps: '步骤',
  Step: '步骤',
  'Run step': '运行步骤',
  'No jobs': '无作业',
  'No steps': '无步骤',
  'Set up job': '设置作业',
  'Complete job': '完成作业',
  'Checkout': '检出',
  'Build': '构建',
  Test: '测试',
  Deploy: '部署',
  'Post': '后置',
  'Set up': '设置',
  'Clean up': '清理',
  // ===== 日志 =====
  Logs: '日志',
  'View logs': '查看日志',
  'Download logs': '下载日志',
  'Search logs': '搜索日志',
  'Expand all': '全部展开',
  'Collapse all': '全部折叠',
  'Raw logs': '原始日志',
  'Annotate': '注释',
  'Annotation': '注释',
  'Notice': '提示',
  Warning: '警告',
  Error: '错误',
  Errors: '错误',
  Warnings: '警告',
  Notices: '提示',
  // ===== 操作按钮 =====
  'Re-run jobs': '重新运行作业',
  'Re-run all jobs': '重新运行所有作业',
  'Re-run failed jobs': '重新运行失败的作业',
  'Cancel workflow': '取消工作流',
  'Delete workflow run': '删除工作流运行',
  'Rerun': '重新运行',
  'Cancel': '取消',
  'Delete': '删除',
  // ===== 速率与使用量 =====
  'Billing & usage': '账单与使用量',
  'Usage': '使用量',
  'Storage usage': '存储使用量',
  'Minutes used': '已用分钟数',
  'Total minutes': '总分钟数',
  'Included minutes': '包含分钟数',
  'Paid minutes': '付费分钟数',
  'Free minutes': '免费分钟数',
  'Estimated spending': '预估花费',
  // ===== 构件与产物 =====
  Artifacts: '构件',
  'Artifact name': '构件名称',
  'No artifacts': '无构件',
  'Download': '下载',
  'Expired': '已过期',
  'Expires': '过期',
  'Size': '大小',
  // ===== 环境 =====
  Environments: '环境',
  Environment: '环境',
  'Deployment': '部署',
  'Deployments': '部署',
  'Production': '生产环境',
  Staging: '预发布环境',
  Development: '开发环境',
  // ===== 缓存 =====
  Caches: '缓存',
  'Cache list': '缓存列表',
  'Cache size': '缓存大小',
  'Clear all caches': '清除所有缓存',
  'No caches found': '未找到缓存',
};
/**
 * Wiki 页面翻译词典
 * @file wiki.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Wiki 页面的翻译词条
 */
const wikiDictionary = {
  // ===== 页面标题 =====
  Wiki: 'Wiki',
  Wikis: 'Wikis',
  'Home': '首页',
  'Wiki Home': 'Wiki 首页',
  'New Page': '新建页面',
  'New page': '新建页面',
  'Create new page': '创建新页面',
  'Edit Page': '编辑页面',
  'Edit page': '编辑页面',
  // ===== 页面操作 =====
  'Page title': '页面标题',
  'Page content': '页面内容',
  'No wiki pages': '无 Wiki 页面',
  'No content yet': '暂无内容',
  'This page has no content yet.': '此页面暂无内容。',
  'You must be logged in to edit wiki pages': '您必须登录才能编辑 Wiki 页面',
  // ===== 编辑 =====
  'Write': '编写',
  'Preview': '预览',
  'Save': '保存',
  'Save page': '保存页面',
  'Cancel': '取消',
  'Edit mode': '编辑模式',
  'Edit message': '编辑说明',
  'Edit summary': '编辑摘要',
  'Describe this change': '描述此变更',
  'Save changes': '保存变更',
  // ===== 历史与版本 =====
  'Page History': '页面历史',
  'Page history': '页面历史',
  'View history': '查看历史',
  'Revision history': '修订历史',
  'View revision': '查看修订版本',
  'Show changes': '显示变更',
  'No revisions yet': '暂无修订版本',
  'Last edited': '最后编辑',
  'Edited by': '编辑者',
  'Edited': '已编辑',
  // ===== 侧边栏 =====
  Pages: '页面',
  'Pages in this wiki': '此 Wiki 中的页面',
  'All pages': '全部页面',
  'Recently updated': '最近更新',
  'Oldest': '最旧',
  'Newest': '最新',
  // ===== 搜索 =====
  'Search': '搜索',
  'Search pages': '搜索页面',
  'Search this wiki': '搜索此 Wiki',
  'No results': '无结果',
  'No results found': '未找到结果',
  // ===== 格式 =====
  Format: '格式',
  'Markdown': 'Markdown',
  'Markdown is a lightweight and easy-to-use syntax for styling your writing.':
    'Markdown 是一种轻量级且易于使用的语法，用于为您的写作设置样式。',
  'Formatting help': '格式帮助',
  'Styling with Markdown is supported': '支持使用 Markdown 设置样式',
  'Attach files by dragging & dropping or': '通过拖放或附加文件',
  'selecting them': '选择它们',
  // ===== 页面列表 =====
  'Home Page': '首页',
  'Table of Contents': '目录',
  'Table of contents': '目录',
  'Back to home': '返回首页',
  'Back to Home': '返回首页',
  // ===== 操作菜单 =====
  'More': '更多',
  'Delete page': '删除页面',
  'Delete this page': '删除此页面',
  'Are you sure?': '确定吗？',
  'This action cannot be undone.': '此操作无法撤销。',
  'Clone this wiki locally': '在本地克隆此 Wiki',
  'Clone repository': '克隆仓库',
  // ===== 克隆与访问 =====
  'Clone': '克隆',
  'HTTPS': 'HTTPS',
  SSH: 'SSH',
  'Copy URL': '复制 URL',
  'Copy clone URL': '复制克隆 URL',
};
/**
 * Notifications 页面翻译词典
 * @file notifications.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Notifications 页面的翻译词条
 */
const notificationsDictionary = {
  // ===== 页面标题 =====
  Notifications: '通知',
  'Your notifications': '您的通知',
  'Notification settings': '通知设置',
  'Notification inbox': '通知收件箱',
  // ===== 筛选 =====
  Inbox: '收件箱',
  'All notifications': '所有通知',
  'Unread notifications': '未读通知',
  'Participating': '参与的',
  'Participating and @mentions': '参与的和提及的',
  'Saved for later': '稍后保存',
  'Done': '已完成',
  'Done notifications': '已完成通知',
  // ===== 分类筛选 =====
  Filter: '筛选',
  'Filter by': '筛选方式',
  'All activity': '所有活动',
  'Repositories you watch': '您关注的仓库',
  'Participating mentions': '参与的提及',
  'Your work': '您的工作',
  // ===== 通知类型 =====
  Issue: '问题',
  'Pull request': '拉取请求',
  Release: '发布',
  Discussion: '讨论',
  Commit: '提交',
  'Security alert': '安全提醒',
  'Workflow run': '工作流运行',
  'Repository invitation': '仓库邀请',
  'Team mention': '团队提及',
  'GitHub Sponsors': 'GitHub Sponsors',
  // ===== 操作按钮 =====
  'Mark as read': '标记为已读',
  'Mark as done': '标记为已完成',
  'Mark as unread': '标记为未读',
  'Save for later': '稍后保存',
  'Unsave': '取消保存',
  'Unsubscribe': '取消订阅',
  'Mute this conversation': '静音此对话',
  'Muted': '已静音',
  // ===== 批量操作 =====
  'Select all': '全选',
  'Deselect all': '取消全选',
  'Mark selected as read': '将选中的标记为已读',
  'Mark selected as done': '将选中的标记为已完成',
  'Save selected for later': '保存选中的供稍后查看',
  'Unsubscribe selected': '取消选中的订阅',
  'Delete selected': '删除选中的',
  // ===== 排序与视图 =====
  'Sort by': '排序方式',
  'Newest first': '最新优先',
  'Oldest first': '最旧优先',
  'Most recent': '最近的',
  'Least recent': '最久的',
  'Group by date': '按日期分组',
  'Group by repository': '按仓库分组',
  'List view': '列表视图',
  'Dense view': '紧凑视图',
  // ===== 通知状态 =====
  Unread: '未读',
  Read: '已读',
  New: '新',
  'New notification': '新通知',
  'No new notifications': '无新通知',
  'No notifications': '无通知',
  'You are all caught up!': '您已全部查看！',
  'You have no unread notifications': '您没有未读通知',
  // ===== 通知内容 =====
  'mentioned you': '提到了您',
  'assigned you to': '分配给您',
  'requested your review': '请求您审查',
  'commented on': '评论了',
  'closed this': '关闭了此',
  'merged this': '合并了此',
  'opened this': '打开了此',
  'reopened this': '重新打开了此',
  // ===== 仓库筛选 =====
  'All repositories': '所有仓库',
  'Current repository': '当前仓库',
  'Search repositories': '搜索仓库',
  'No repositories found': '未找到仓库',
  // ===== 页面底部 =====
  'Older notifications': '较早的通知',
  'Newer notifications': '较新的通知',
  'Load more': '加载更多',
  'Loading': '加载中',
  // ===== 设置相关 =====
  'Customize your notification preferences': '自定义您的通知偏好',
  'Notification preferences': '通知偏好',
  'Watch settings': '关注设置',
  'Email preferences': '电子邮件偏好',
  'Web notifications': '网页通知',
};
/**
 * Settings 页面翻译词典
 * @file settings.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Settings 页面的翻译词条
 */
const settingsDictionary = {
  // ===== 页面标题 =====
  Settings: '设置',
  'Account settings': '账户设置',
  'User settings': '用户设置',
  'Repository settings': '仓库设置',
  'Organization settings': '组织设置',
  // ===== 侧边栏菜单 =====
  Profile: '个人资料',
  Account: '账户',
  'Account security': '账户安全',
  'Accessibility': '辅助功能',
  Notifications: '通知',
  Appearance: '外观',
  'Billing and plans': '账单与方案',
  'Billing & plans': '账单与方案',
  'Codespaces': 'Codespaces',
  'Developer settings': '开发者设置',
  'Security': '安全',
  'SSH and GPG keys': 'SSH 和 GPG 密钥',
  'Password and authentication': '密码与身份验证',
  'Two-factor authentication': '双因素认证',
  'Personal access tokens': '个人访问令牌',
  'OAuth applications': 'OAuth 应用程序',
  'GitHub Apps': 'GitHub Apps',
  'Organizations': '组织',
  'Repositories': '仓库',
  'Starred repositories': '收藏的仓库',
  // ===== 个人资料 =====
  'Public profile': '公开个人资料',
  'Profile picture': '个人头像',
  'Upload new picture': '上传新头像',
  'Edit': '编辑',
  Name: '名称',
  'Public email': '公开邮箱',
  'Don\'t show my email address': '不显示我的邮箱地址',
  Bio: '个人简介',
  'Add a bio': '添加简介',
  URL: '网址',
  'Add your website URL': '添加您的网站网址',
  Company: '公司',
  'Add your company name': '添加您的公司名称',
  Location: '位置',
  'Add your location': '添加您的位置',
  'Social accounts': '社交账户',
  'Add social accounts': '添加社交账户',
  // ===== 外观 =====
  'Theme preferences': '主题偏好',
  'Light': '浅色',
  Dark: '深色',
  'System default': '系统默认',
  'Theme': '主题',
  'Sync with system': '与系统同步',
  // ===== 通知设置 =====
  'Notification settings': '通知设置',
  'Email notification preferences': '电子邮件通知偏好',
  'Web notification preferences': '网页通知偏好',
  'Participating notifications': '参与通知',
  'Watching notifications': '关注通知',
  'Email': '电子邮件',
  'Web and Mobile': '网页和移动端',
  'GitHub Mobile': 'GitHub 移动端',
  // ===== 安全设置 =====
  'Password': '密码',
  'Change password': '修改密码',
  'Current password': '当前密码',
  'New password': '新密码',
  'Confirm new password': '确认新密码',
  'Update password': '更新密码',
  '2FA': '双因素认证',
  'Enable 2FA': '启用双因素认证',
  'Disable 2FA': '禁用双因素认证',
  'Recovery codes': '恢复代码',
  // ===== SSH 和 GPG 密钥 =====
  'SSH keys': 'SSH 密钥',
  'GPG keys': 'GPG 密钥',
  'New SSH key': '新建 SSH 密钥',
  'New GPG key': '新建 GPG 密钥',
  'Add SSH key': '添加 SSH 密钥',
  'Add GPG key': '添加 GPG 密钥',
  'Key': '密钥',
  'Title': '标题',
  'Key type': '密钥类型',
  'Created': '创建时间',
  'Last used': '最后使用',
  'Delete': '删除',
  // ===== 开发者设置 =====
  'Generate new token': '生成新令牌',
  'Token name': '令牌名称',
  'Expiration': '过期时间',
  'Select scopes': '选择权限范围',
  'Generate token': '生成令牌',
  // ===== 组织与仓库 =====
  'Your organizations': '您的组织',
  'Your repositories': '您的仓库',
  'General': '常规',
  'Collaborators': '协作者',
  'Branches': '分支',
  'Tags': '标签',
  'Actions': 'Actions',
  'Pages': 'Pages',
  'Webhooks': 'Webhook',
  'Deploy keys': '部署密钥',
  'Secrets and variables': '密钥和变量',
  // ===== 保存操作 =====
  'Update profile': '更新个人资料',
  'Save changes': '保存更改',
  'Cancel': '取消',
  'Save': '保存',
  'Confirm': '确认',
  'Danger Zone': '危险区',
  'Delete account': '删除账户',
  'Delete this repository': '删除此仓库',
  'Transfer ownership': '转让所有权',
};
/**
 * Search 页面翻译词典
 * @file search.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Search 页面的翻译词条
 */
const searchDictionary = {
  // ===== 搜索框 =====
  'Search': '搜索',
  'Search or jump to...': '搜索或跳转到...',
  'Search GitHub': '搜索 GitHub',
  'Search results': '搜索结果',
  'No results': '无结果',
  'No results matched your search.': '没有匹配您搜索的结果。',
  'Search syntax tips': '搜索语法提示',
  // ===== 搜索类型 =====
  'All': '全部',
  'Repositories': '仓库',
  'Code': '代码',
  'Commits': '提交',
  'Issues': '问题',
  'Pull requests': '拉取请求',
  'Discussions': '讨论',
  'Packages': '包',
  'Topics': '主题',
  'Wikis': 'Wikis',
  'Users': '用户',
  // ===== 筛选器 =====
  Filters: '筛选条件',
  'Filter by': '筛选方式',
  'Language': '语言',
  'All languages': '所有语言',
  'Most stars': '最多星标',
  'Fewest stars': '最少星标',
  'Most forks': '最多 Fork',
  'Fewest forks': '最少 Fork',
  'Recently updated': '最近更新',
  'Least recently updated': '最久未更新',
  'Newest': '最新',
  'Oldest': '最旧',
  'Best match': '最佳匹配',
  'Sort by': '排序方式',
  // ===== 仓库搜索结果 =====
  'repository results': '个仓库结果',
  'result': '个结果',
  'results': '个结果',
  'Showing': '显示',
  'of': '共',
  'Page': '页',
  'Previous': '上一页',
  'Next': '下一页',
  // ===== 代码搜索 =====
  'Code search': '代码搜索',
  'Search code': '搜索代码',
  'Search code, issues, pull requests': '搜索代码、问题、拉取请求',
  'Matching lines': '匹配行',
  'Matching repositories': '匹配仓库',
  'in this repository': '在此仓库中',
  'in this organization': '在此组织中',
  // ===== 高级搜索 =====
  'Advanced search': '高级搜索',
  'Advanced search options': '高级搜索选项',
  'From these owners': '来自这些所有者',
  'In these repositories': '在这些仓库中',
  'Written in this language': '使用此语言编写',
  'With this many stars': '拥有这么多星标',
  'With this many forks': '拥有这么多 Fork',
  'Pushed within': '推送时间在',
  'Created within': '创建时间在',
  'State': '状态',
  'Open': '打开',
  'Closed': '已关闭',
  // ===== 搜索建议 =====
  'Saved searches': '已保存的搜索',
  'Use saved searches to filter your results more quickly': '使用已保存的搜索更快地筛选结果',
  'Recent searches': '最近搜索',
  'Clear recent searches': '清除最近搜索',
  'Suggestions': '建议',
  // ===== 空状态 =====
  'We couldn\'t find any code matching': '我们找不到任何匹配的代码',
  'Try modifying your search or filters.': '尝试修改您的搜索或筛选条件。',
  'There aren\'t any repositories matching': '没有匹配的仓库',
  'Try adjusting your search to find what you\'re looking for.': '尝试调整搜索以找到您要找的内容。',
  // ===== 仓库筛选 =====
  'In:': '范围：',
  'Stars:': '星标数：',
  'Forks:': 'Fork 数：',
  'Topics:': '主题：',
  'License:': '许可证：',
  'Any license': '任何许可证',
  'Issues:': '问题：',
  'Has issues': '有问题',
  'No issues': '无问题',
};
/**
 * Profile 页面翻译词典
 * @file profile.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Profile 页面的翻译词条
 */
const profileDictionary = {
  // ===== 个人信息 =====
  'Overview': '概览',
  'Repositories': '仓库',
  'Projects': '项目',
  'Packages': '包',
  'Stars': '星标',
  'Followers': '关注者',
  'Following': '关注中',
  'Follow': '关注',
  'Unfollow': '取消关注',
  'Followers count': '关注者数量',
  'Following count': '关注中数量',
  // ===== 个人资料详情 =====
  'Bio': '个人简介',
  'No bio provided': '未提供简介',
  'Location': '位置',
  'No location provided': '未提供位置',
  'Company': '公司',
  'No company provided': '未提供公司',
  'Website': '网站',
  'No website provided': '未提供网站',
  'Email': '电子邮件',
  'No public email': '无公开邮箱',
  'Social accounts': '社交账户',
  'Twitter': 'Twitter',
  'LinkedIn': 'LinkedIn',
  'Mastodon': 'Mastodon',
  'YouTube': 'YouTube',
  'Hireable': '可雇佣',
  'Not hireable': '暂不接受工作邀请',
  // ===== 统计信息 =====
  'Contribution activity': '贡献活动',
  'Contributions': '贡献',
  'Total contributions': '总贡献数',
  'Contribution graph': '贡献图',
  'Contribution calendar': '贡献日历',
  'Less': '少',
  'More': '多',
  'No contributions': '无贡献',
  'Contribution activity overview': '贡献活动概览',
  // ===== 年度贡献 =====
  'Contributions in the last year': '过去一年的贡献',
  'This year': '今年',
  'Last year': '去年',
  'Yearly contributions': '年度贡献',
  'Current streak': '当前连续',
  'Longest streak': '最长连续',
  'Public contributions': '公开贡献',
  'Private contributions': '私有贡献',
  // ===== 仓库标签页 =====
  'Pinned': '置顶',
  'Popular': '热门',
  'All': '全部',
  'Type': '类型',
  'All types': '所有类型',
  'Source': '源代码',
  'Forks': 'Fork',
  'Archived': '已归档',
  'Templates': '模板',
  'Mirrors': '镜像',
  'Language': '语言',
  'All languages': '所有语言',
  'Sort by': '排序方式',
  'Last updated': '最近更新',
  // ===== 项目标签页 =====
  'Projects overview': '项目概览',
  'No projects yet': '暂无项目',
  'Create project': '创建项目',
  // ===== 星标标签页 =====
  'Starred repositories': '已收藏的仓库',
  'Starred by': '收藏者',
  'No starred repositories': '无收藏的仓库',
  'List view': '列表视图',
  'Grid view': '网格视图',
  // ===== 编辑资料 =====
  'Edit profile': '编辑个人资料',
  'Edit bio': '编辑简介',
  'Save': '保存',
  'Cancel': '取消',
  'Profile picture': '个人头像',
  'Upload new picture': '上传新头像',
  'Pronouns': '代词',
  'Set pronouns': '设置代词',
  // ===== 成就 =====
  'Achievements': '成就',
  'Achievements overview': '成就概览',
  'No achievements yet': '暂无成就',
  'Showcase': '展示',
  // ===== 高亮 =====
  Highlights: '亮点',
  'Developer Program Member': '开发者计划成员',
  'Pro': 'Pro',
  'Team': '团队',
  'Enterprise': '企业版',
  'Campus Expert': '校园专家',
  'Security Bug Bounty': '安全漏洞赏金',
  // ===== 组织 =====
  'Organizations': '组织',
  'No organizations': '无组织',
  'Member of': '成员于',
  // ===== 仓库卡片 =====
  'Updated': '更新',
  'stars': '星标',
  'forks': 'Fork',
  'Contributors': '贡献者',
  'License': '许可证',
};
/**
 * Dashboard 页面翻译词典
 * @file dashboard.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Dashboard（首页）的翻译词条
 */
const dashboardDictionary = {
  // ===== 页面标题 =====
  'Dashboard': '仪表盘',
  'Home': '首页',
  'GitHub': 'GitHub',
  'Your dashboard': '您的仪表盘',
  'Personal dashboard': '个人仪表盘',
  // ===== 顶部导航 =====
  'Pull requests': '拉取请求',
  Issues: '问题',
  Codespaces: 'Codespaces',
  Explore: '探索',
  Marketplace: '应用市场',
  // ===== 侧边栏 - 仓库列表 =====
  'Top repositories': '热门仓库',
  'Recent activity': '最近活动',
  'Your repositories': '您的仓库',
  'No repositories': '无仓库',
  'Find a repository': '查找仓库',
  'Filter by name': '按名称筛选',
  'View all': '查看全部',
  'New repository': '新建仓库',
  // ===== 侧边栏 - 最新动态 =====
  'Latest changes': '最新变更',
  'Latest activity': '最新活动',
  'Activity from': '活动来自',
  'Following feed': '关注动态',
  'Your feed': '您的动态',
  'For you': '为您推荐',
  'Following': '关注中',
  // ===== 动态内容 =====
  'pushed to': '推送到',
  'opened this': '打开了此',
  'closed this': '关闭了此',
  'merged this': '合并了此',
  'commented on': '评论了',
  'starred': '收藏了',
  'forked': 'Fork 了',
  'created a repository': '创建了一个仓库',
  'created a branch': '创建了一个分支',
  'deleted a branch': '删除了一个分支',
  'added a comment': '添加了一条评论',
  'edited': '编辑了',
  'deleted': '删除了',
  'renamed': '重命名了',
  // ===== 发现新内容 =====
  'Discover interesting projects and people to populate your personal news feed.':
    '发现有趣的项目和人，填充您的个人新闻动态。',
  'Explore more on Explore': '在 Explore 上发现更多',
  'Get started': '开始使用',
  'New to GitHub?': 'GitHub 新用户？',
  'Create your first repository': '创建您的第一个仓库',
  // ===== 全局通知 =====
  'All GitHub features': '所有 GitHub 功能',
  'Feature previews': '功能预览',
  'New feature announcements': '新功能公告',
  'What\'s new': '最新动态',
  // ===== 组织切换 =====
  'Switch dashboard context': '切换仪表盘上下文',
  'Your personal dashboard': '您的个人仪表盘',
  'Organization dashboard': '组织仪表盘',
  // ===== 推荐仓库 =====
  'Recommended for you': '为您推荐',
  'Explore repositories': '探索仓库',
  'See more': '查看更多',
  'Trending': '趋势',
  // ===== 快捷操作 =====
  'Quick links': '快捷链接',
  'Create an issue': '创建问题',
  'Create a pull request': '创建拉取请求',
  'Create a project': '创建项目',
  'Import repository': '导入仓库',
  'New gist': '新建代码片段',
  'New organization': '新建组织',
  // ===== 团队/组织 =====
  'Your teams': '您的团队',
  'Your organizations': '您的组织',
  'No teams': '无团队',
  'No organizations': '无组织',
  'Create organization': '创建组织',
  // ===== 底部 =====
  'All of GitHub': '全部 GitHub',
  'Show more activity': '显示更多活动',
  'Load more': '加载更多',
  'Loading': '加载中',
};
/**
 * Marketplace 页面翻译词典
 * @file marketplace.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 包含 GitHub Marketplace 页面的翻译词条
 */
const marketplaceDictionary = {
  // ===== 页面标题 =====
  Marketplace: '应用市场',
  'GitHub Marketplace': 'GitHub 应用市场',
  'Apps': '应用',
  'Actions': 'Actions',
  'Explore GitHub Apps': '探索 GitHub Apps',
  'Explore Actions': '探索 Actions',
  // ===== 分类导航 =====
  'Categories': '分类',
  'All categories': '全部分类',
  'Code quality': '代码质量',
  'Code review': '代码审查',
  'Continuous integration': '持续集成',
  'Deployment': '部署',
  'Monitoring': '监控',
  'Security': '安全',
  'Publishing': '发布',
  'Project management': '项目管理',
  'Chat': '聊天',
  'Support': '支持',
  'Mobile': '移动端',
  'Utilities': '工具',
  // ===== 搜索和筛选 =====
  Search: '搜索',
  'Search Marketplace': '搜索应用市场',
  'Search results': '搜索结果',
  'No results found': '未找到结果',
  Filter: '筛选',
  'Filter by': '筛选方式',
  'Sort by': '排序方式',
  'Most popular': '最热门',
  'Highest rated': '评分最高',
  'Most recently added': '最新添加',
  'Most recent release': '最近发布',
  // ===== 应用卡片 =====
  'Install': '安装',
  'Install it for free': '免费安装',
  'Free': '免费',
  'Free trial': '免费试用',
  'Paid': '付费',
  'Pricing': '定价',
  'See plans': '查看方案',
  'View details': '查看详情',
  'Categories:': '分类：',
  'Developer:': '开发者：',
  // ===== 评分 =====
  Rating: '评分',
  'No ratings yet': '暂无评分',
  'Ratings': '评分',
  stars: '星',
  Reviews: '评论',
  'Write a review': '写评论',
  'Your review': '您的评论',
  // ===== 应用详情页 =====
  'About this app': '关于此应用',
  'How it works': '工作原理',
  'Screenshots': '截图',
  'Screenshot': '截图',
  'Privacy and security': '隐私与安全',
  'Documentation': '文档',
  'Developer site': '开发者网站',
  'Report abuse': '举报滥用',
  // ===== 安装流程 =====
  'Install app': '安装应用',
  'Installing app': '正在安装应用',
  'Install for free': '免费安装',
  'Start free trial': '开始免费试用',
  'Choose a plan': '选择方案',
  'Upgrade to install': '升级以安装',
  'Configure': '配置',
  'Configuration': '配置',
  'Authorize': '授权',
  'Authorization': '授权',
  // ===== 仓库选择 =====
  'Select repositories': '选择仓库',
  'All repositories': '所有仓库',
  'Only select repositories': '仅选择仓库',
  'Select repositories to install this app on': '选择要安装此应用的仓库',
  'Install & Authorize': '安装并授权',
  // ===== Actions 相关 =====
  'Actions on GitHub Marketplace': 'GitHub 应用市场上的 Actions',
  'New to GitHub Actions?': 'GitHub Actions 新用户？',
  'Learn more': '了解更多',
  'Get started with GitHub Actions': '开始使用 GitHub Actions',
  'Latest commit': '最新提交',
  'Publisher': '发布者',
  'Used by': '使用者',
  'Repository': '仓库',
  // ===== 验证信息 =====
  'Verified creator': '已验证创作者',
  'Verified': '已验证',
  'Unverified': '未验证',
  'GitHub has verified this publisher\'s identity': 'GitHub 已验证此发布者的身份',
  // ===== 定价方案 =====
  Plan: '方案',
  'Price': '价格',
  'per month': '每月',
  'per year': '每年',
  'per seat': '每席位',
  'Free plan': '免费方案',
  'Pro plan': '专业方案',
  'Team plan': '团队方案',
  'Enterprise plan': '企业方案',
  'Includes:': '包含：',
  'View full pricing details': '查看完整定价详情',
  // ===== 版本与发布 =====
  'Latest version': '最新版本',
  'Version': '版本',
  'Released': '发布时间',
  'Last updated': '最后更新',
  'All versions': '所有版本',
  'Change log': '变更日志',
};
/**
 * 翻译词典合并模块
 * @file index.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 整合所有页面的翻译词典
 */
/**
 * 翻译词典对象，包含所有页面的翻译词典
 */
const translationModule = {
  common: commonDictionary,
  codespaces: codespacesDictionary,
  explore: exploreDictionary,
  issues: issuesDictionary,
  pullRequests: pullRequestsDictionary,
  actions: actionsDictionary,
  wiki: wikiDictionary,
  notifications: notificationsDictionary,
  settings: settingsDictionary,
  search: searchDictionary,
  profile: profileDictionary,
  dashboard: dashboardDictionary,
  marketplace: marketplaceDictionary,
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
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 管理翻译词典的加载和查询
 */
const dictionaryManager = {
  dictionary: {},
  dictionaryHash: new Map(),
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
      // 构建哈希表，支持大小写不敏感查询
      Object.keys(this.dictionary).forEach((key) => {
        const value = this.dictionary[key];
        if (value && !value.startsWith('待翻译: ')) {
          // 原始键
          this.dictionaryHash.set(key, value);
          // 小写键（用于大小写不敏感匹配）
          if (key.length <= 100) {
            this.dictionaryHash.set(key.toLowerCase(), value);
            this.dictionaryHash.set(key.toUpperCase(), value);
          }
        }
      });
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 词典初始化耗时: ${Date.now() - startTime}ms`);
        console.log(`[GitHub 中文翻译] 词典条目数量: ${Object.keys(this.dictionary).length}`);
        console.log(`[GitHub 中文翻译] 哈希表条目数量: ${this.dictionaryHash.size}`);
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 词典初始化失败:', error);
      this.dictionary = {};
      this.dictionaryHash.clear();
    }
  },
  getTranslatedText(text) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return text;
    }
    const normalizedText = text.trim();
    // 检查最小文本长度
    if (normalizedText.length < (CONFIG.performance?.minTextLengthToTranslate || 3)) {
      return null;
    }
    // 检查缓存
    if (CONFIG.performance?.enableTranslationCache) {
      const cachedResult = this.cacheManager.getFromCache(normalizedText);
      if (cachedResult !== null) {
        return cachedResult;
      }
    }
    // 查询哈希表
    let result = this.dictionaryHash.get(normalizedText);
    // 如果没有找到，尝试大小写不敏感查询
    if (result === null && normalizedText.length <= 100) {
      const lowerCaseText = normalizedText.toLowerCase();
      const upperCaseText = normalizedText.toUpperCase();
      result = this.dictionaryHash.get(lowerCaseText) || this.dictionaryHash.get(upperCaseText);
    }
    // 清理文本中的潜在危险内容
    if (result !== null) {
      result = this.sanitizeText(result);
    }
    // 缓存结果
    if (
      CONFIG.performance?.enableTranslationCache &&
      normalizedText.length <= (CONFIG.performance?.maxCachedTextLength || 100)
    ) {
      if (result !== null) {
        this.cacheManager.setToCache(normalizedText, result, false);
      }
    }
    return result;
  },
  sanitizeText(text) {
    // 移除 HTML 标签
    let sanitizedText = text.replace(/<[^>]*>/g, '');
    // 移除事件处理器
    sanitizedText = sanitizedText.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    // 移除危险协议
    sanitizedText = sanitizedText.replace(/javascript:/gi, '');
    sanitizedText = sanitizedText.replace(/data:/gi, '');
    sanitizedText = sanitizedText.replace(/vbscript:/gi, '');
    // 移除危险元素
    sanitizedText = sanitizedText.replace(/expression\([^)]*\)/gi, '');
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
        const value = newDictionary[key];
        if (value && !value.startsWith('待翻译: ')) {
          this.dictionaryHash.set(key, value);
          if (key.length <= 100) {
            this.dictionaryHash.set(key.toLowerCase(), value);
            this.dictionaryHash.set(key.toUpperCase(), value);
          }
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
 * @version 1.9.22
 * @date 2026-07-04
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
    dashboard: { batchSize: 40, enablePartialMatch: false },
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
    settings: { batchSize: 80, enablePartialMatch: false },
    profile: { batchSize: 60, enablePartialMatch: false },
    organizations: { batchSize: 70, enablePartialMatch: false },
    projects: { batchSize: 55, enablePartialMatch: true },
    packages: { batchSize: 90, enablePartialMatch: false },
    security: { batchSize: 50, enablePartialMatch: false },
    insights: { batchSize: 65, enablePartialMatch: false },
    topics: { batchSize: 90, enablePartialMatch: false },
    stars: { batchSize: 80, enablePartialMatch: false },
    trending: { batchSize: 100, enablePartialMatch: false },
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
 * @version 1.9.22
 * @date 2026-07-04
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
  // 快速路径：offsetParent 为 null 表示 display:none 或祖先隐藏
  // （position:fixed 元素 offsetParent 也为 null，需进一步检查）
  if (element.offsetParent === null) {
    // 仅对非 fixed 元素可直接判定为隐藏
    if (element.style.position !== 'fixed') {
      return true;
    }
  }
  // 检查 hidden 属性和 style 内联隐藏（避免强制布局回流的 getComputedStyle 调用）
  if (
    element.style.display === 'none' ||
    element.style.visibility === 'hidden' ||
    element.style.opacity === '0'
  ) {
    return true;
  }
  // 检查 rect 是否为零尺寸（同样避免 getComputedStyle 的开销）
  if (element.getClientRects().length === 0) {
    return true;
  }
  return false;
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
 * @version 1.9.22
 * @date 2026-07-04
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
    if (!this.shouldProcessElement(element)) {
      return false;
    }
    this.performanceData.elementsProcessed++;
    if (!elementSelector.shouldTranslateElement(element)) {
      return false;
    }
    const fragment = document.createDocumentFragment();
    const { textNodesToProcess, hasTranslatableContent } = this.collectChildNodes(
      element,
      fragment,
    );
    // 如果没有任何可翻译的内容，直接返回false，不修改DOM
    if (!hasTranslatableContent) {
      return false;
    }
    const hasTranslation = this.applyTextTranslations(textNodesToProcess, fragment);
    this.appendFragmentToElement(fragment, element);
    if (hasTranslation) {
      virtualDomManager.markElementAsTranslated(element);
    }
    elementSelector.elementCache.set(element, true);
    return hasTranslation;
  },
  // 检查元素是否需要处理（缓存/标记/类型校验）
  shouldProcessElement(element) {
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
    return true;
  },
  // 遍历子节点：收集可翻译文本节点，并将元素节点移入 fragment
  collectChildNodes(element, fragment) {
    const textNodesToProcess = [];
    let hasTranslatableContent = false;
    const minLen = CONFIG.performance?.minTextLengthToTranslate;
    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const trimmed = node.nodeValue.trim();
        if (trimmed && trimmed.length >= minLen) {
          // 预检查翻译匹配，无匹配则跳过，避免不必要的 DOM 操作
          const translated = dictionaryManager.getTranslatedText(trimmed);
          if (translated && translated !== trimmed) {
            textNodesToProcess.push({ node, originalText: node.nodeValue });
            hasTranslatableContent = true;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const moved = this.moveChildToFragment(element, node, fragment);
        hasTranslatableContent = hasTranslatableContent || moved;
      }
    }
    return { textNodesToProcess, hasTranslatableContent };
  },
  // 将子元素移入 fragment 并递归翻译
  moveChildToFragment(parent, node, fragment) {
    try {
      parent.removeChild(node);
      fragment.appendChild(node);
      return this.translateElement(node);
    } catch (e) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 处理子元素失败:', e, '元素:', node);
      }
      try {
        if (!node.parentNode) {
          parent.appendChild(node);
        }
      } catch (addBackError) {
        if (CONFIG.debugMode) {
          console.error('[GitHub 中文翻译] 将子元素添加回原始位置失败:', addBackError);
        }
      }
      return false;
    }
  },
  // 处理文本节点翻译并追加到 fragment
  applyTextTranslations(textNodesToProcess, fragment) {
    let hasTranslation = false;
    textNodesToProcess.forEach(({ node, originalText }) => {
      // 先从父节点移除原文本节点，避免重复残留
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
      const trimmed = originalText.trim();
      const translatedText = dictionaryManager.getTranslatedText(trimmed);
      if (this.isValidTranslation(translatedText, trimmed)) {
        const translatedNode = this.createTranslatedNode(translatedText);
        if (translatedNode) {
          fragment.appendChild(translatedNode);
          hasTranslation = true;
          this.performanceData.textsTranslated++;
          return;
        }
      }
      fragment.appendChild(node);
    });
    return hasTranslation;
  },
  // 校验翻译结果是否可用
  isValidTranslation(translatedText, originalText) {
    return (
      translatedText &&
      typeof translatedText === 'string' &&
      translatedText !== originalText
    );
  },
  // 创建翻译后的文本节点（过滤控制字符），失败时返回 null
  createTranslatedNode(translatedText) {
    try {
      const safeText = [...translatedText]
        .filter((c) => c.charCodeAt(0) > 31 && c.charCodeAt(0) !== 127)
        .join('');
      return document.createTextNode(safeText);
    } catch (e) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 创建翻译节点失败:', e, '翻译文本:', translatedText);
      }
      return null;
    }
  },
  // 将文档片段插入回元素
  appendFragmentToElement(fragment, element) {
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
 * 性能监控模块
 * @file translationCore/performanceMonitor.js
 * @version 1.9.22
 * @date 2026-07-04
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
 * @version 1.9.22
 * @date 2026-07-04
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
      // 注册词典恢复回调，供 ErrorHandler 在词典错误超阈值时调用
      ErrorHandler.setDictionaryRecoveryHandler(() => {
        dictionaryManager.init();
      });
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
 * GitHub 中文翻译配置界面样式模块
 * @file configUI.styles.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 配置界面的CSS样式定义，遵循原型设计系统的深色主题规范
 */
// 配置面板容器与主体样式
function getPanelContainerStyles() {
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
  `;
}
// 面板头部与关闭按钮样式
function getHeaderStyles() {
  return `
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
  `;
}
// 内容区与滚动条样式
function getContentAreaStyles() {
  return `
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
  `;
}
// 配置分组与配置项样式
function getConfigItemStyles() {
  return `
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
  `;
}
// 面板底部按钮样式
function getFooterStyles() {
  return `
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
  `;
}
// 性能监控网格与操作按钮样式
function getPerformanceAndActionStyles() {
  return `
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
// 浮动按钮样式（对齐 prototype.md 规范）
function getFloatingButtonStyles() {
  return `
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
    /* ========== 浮动设置按钮（对齐 prototype.md 规范） ========== */
    .github-i18n-floating-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background-color: #161b22;
      border: 1px solid #30363d;
      color: #e6edf3;
      font-size: 20px;
      line-height: 1;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
      z-index: 2147483000;
      transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.15s ease;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
    }
    .github-i18n-floating-btn:hover {
      background-color: #30363d;
      transform: scale(1.1);
    }
    .github-i18n-floating-btn:active {
      transform: scale(0.98);
    }
  `;
}
/**
 * 获取配置界面的完整样式
 * @returns {string} CSS样式字符串
 */
function getConfigUIStyles() {
  return [
    getPanelContainerStyles(),
    getHeaderStyles(),
    getContentAreaStyles(),
    getConfigItemStyles(),
    getFooterStyles(),
    getPerformanceAndActionStyles(),
    getFloatingButtonStyles(),
  ].join('\n');
}
/**
 * 将样式添加到页面
 */
function addConfigUIStyles() {
  const style = document.createElement('style');
  style.textContent = getConfigUIStyles();
  document.head.appendChild(style);
}
/**
 * GitHub 中文翻译性能监控组件
 * @file performanceMonitor.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 性能监控区域组件
 */
/**
 * 创建性能监控区域
 * @returns {HTMLElement} 性能监控区域元素
 */
function createPerformanceMonitoringSection() {
  const section = document.createElement('div');
  section.className = 'github-i18n-config-section';
  const sectionTitle = document.createElement('h4');
  // 使用安全的 DOM 操作构建标题，避免 innerHTML 引入 XSS 风险
  const iconSpan = document.createElement('span');
  iconSpan.style.color = '#d29922';
  iconSpan.textContent = '📊';
  sectionTitle.appendChild(iconSpan);
  sectionTitle.appendChild(document.createTextNode(' 性能监控'));
  section.appendChild(sectionTitle);
  const perfGrid = document.createElement('div');
  perfGrid.className = 'github-i18n-perf-grid';
  perfGrid.id = 'github-i18n-performance-stats';
  const stats = [
    { key: 'duration', label: '总耗时', unit: 'ms', id: 'github-i18n-stat-duration' },
    { key: 'elements', label: '翻译项', unit: '', id: 'github-i18n-stat-elements' },
    { key: 'cacheRate', label: '命中率', unit: '%', id: 'github-i18n-stat-cache-rate' },
  ];
  stats.forEach((stat) => {
    const statDiv = document.createElement('div');
    statDiv.className = 'github-i18n-perf-stat';
    const k = document.createElement('div');
    k.className = 'k';
    k.textContent = stat.label;
    const v = document.createElement('div');
    v.className = 'v';
    v.id = stat.id;
    v.textContent = '-';
    statDiv.appendChild(k);
    statDiv.appendChild(v);
    perfGrid.appendChild(statDiv);
  });
  section.appendChild(perfGrid);
  const advancedStatsDiv = document.createElement('div');
  advancedStatsDiv.className = 'github-i18n-advanced-stats';
  const advancedStats = [
    { label: '缓存命中:', id: 'github-i18n-stat-cache-hits' },
    { label: '缓存未命中:', id: 'github-i18n-stat-cache-misses' },
    { label: 'DOM操作:', id: 'github-i18n-stat-dom' },
    { label: '网络请求:', id: 'github-i18n-stat-network' },
    { label: '批处理次数:', id: 'github-i18n-stat-batches' },
  ];
  advancedStats.forEach((stat) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'github-i18n-config-item';
    const label = document.createElement('span');
    label.className = 'github-i18n-config-label';
    label.textContent = stat.label;
    const value = document.createElement('span');
    value.id = stat.id;
    value.style.fontFamily = '"JetBrains Mono", "SF Mono", SFMono-Regular, Menlo, Consolas, "Courier New", monospace';
    value.style.color = '#8b949e';
    value.textContent = '-';
    itemDiv.appendChild(label);
    itemDiv.appendChild(value);
    advancedStatsDiv.appendChild(itemDiv);
  });
  section.appendChild(advancedStatsDiv);
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'github-i18n-config-actions';
  const refreshBtn = document.createElement('button');
  refreshBtn.id = 'github-i18n-refresh-stats';
  refreshBtn.textContent = '刷新性能数据';
  const exportBtn = document.createElement('button');
  exportBtn.id = 'github-i18n-export-stats';
  exportBtn.textContent = '导出性能数据';
  actionsDiv.appendChild(refreshBtn);
  actionsDiv.appendChild(exportBtn);
  section.appendChild(actionsDiv);
  return section;
}
/**
 * 更新性能统计数据显示
 */
function updatePerformanceStats() {
  // 直接通过模块引用获取 translationCore，避免依赖 window 全局变量
  // （CONFIG.debugMode 为 false 时 main.js 不会将 translationCore 挂到 window）
  if (translationCore.isPageUnloading) return;
  if (translationCore && typeof translationCore.getPerformanceStats === 'function') {
    const stats = translationCore.getPerformanceStats();
    const durationEl = document.getElementById('github-i18n-stat-duration');
    if (durationEl) durationEl.textContent = `${stats.totalDuration} ms`;
    const elementsEl = document.getElementById('github-i18n-stat-elements');
    if (elementsEl) elementsEl.textContent = stats.elementsProcessed;
    const textsEl = document.getElementById('github-i18n-stat-texts');
    if (textsEl) textsEl.textContent = stats.textsTranslated;
    const cacheRateEl = document.getElementById('github-i18n-stat-cache-rate');
    if (cacheRateEl) cacheRateEl.textContent = `${stats.cacheHitRate}%`;
    const cacheHitsEl = document.getElementById('github-i18n-stat-cache-hits');
    if (cacheHitsEl) cacheHitsEl.textContent = stats.cacheHits;
    const cacheMissesEl = document.getElementById('github-i18n-stat-cache-misses');
    if (cacheMissesEl) cacheMissesEl.textContent = stats.cacheMisses;
    const domOpsEl = document.getElementById('github-i18n-stat-dom');
    if (domOpsEl) domOpsEl.textContent = stats.domOperations;
    const networkEl = document.getElementById('github-i18n-stat-network');
    if (networkEl) networkEl.textContent = stats.networkRequests;
    const batchesEl = document.getElementById('github-i18n-stat-batches');
    if (batchesEl) batchesEl.textContent = stats.batchProcessings;
  }
}
/**
 * 导出性能数据
 * @returns {Object} 性能数据对象
 */
function exportPerformanceStats() {
  if (translationCore && typeof translationCore.getPerformanceStats === 'function') {
    const stats = translationCore.getPerformanceStats();
    const exportData = {
      timestamp: new Date().toISOString(),
      version: VERSION,
      ...stats,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `github-i18n-performance-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return exportData;
  }
  return null;
}
/**
 * GitHub 中文翻译配置面板渲染模块
 * @file configPanelRenderer.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责渲染配置面板的 UI 结构（容器、头部、内容、底部、配置项）
 */
/** 创建配置面板整体 UI 结构，读写 instance.container 状态 */
function createConfigUI(instance) {
  if (instance.container) return;
  instance.container = document.createElement('div');
  instance.container.className = 'github-i18n-config-container';
  const configPanel = document.createElement('div');
  configPanel.className = 'github-i18n-config-panel';
  const header = createConfigHeader();
  const content = createConfigContent(instance);
  const footer = createConfigFooter();
  configPanel.appendChild(header);
  configPanel.appendChild(content);
  configPanel.appendChild(footer);
  instance.container.appendChild(configPanel);
  addConfigUIStyles();
  instance.addEventListeners();
}
/** 创建面板头部（标题 + 版本徽章 + 关闭按钮） */
function createConfigHeader() {
  const header = document.createElement('div');
  header.className = 'github-i18n-config-header';
  const title = document.createElement('h3');
  title.textContent = 'GitHub 中文翻译';
  const versionBadge = document.createElement('span');
  versionBadge.style.fontFamily = '"JetBrains Mono", "SF Mono", SFMono-Regular, Menlo, Consolas, "Courier New", monospace';
  versionBadge.style.fontSize = '11px';
  versionBadge.style.color = '#6e7681';
  versionBadge.style.padding = '2px 8px';
  versionBadge.style.borderRadius = '4px';
  versionBadge.style.background = '#010409';
  versionBadge.style.border = '1px solid #21262d';
  versionBadge.textContent = `v${VERSION}`;
  const headerLeft = document.createElement('div');
  headerLeft.style.display = 'flex';
  headerLeft.style.alignItems = 'center';
  headerLeft.style.gap = '10px';
  headerLeft.appendChild(title);
  headerLeft.appendChild(versionBadge);
  const closeBtn = document.createElement('button');
  closeBtn.className = 'github-i18n-config-close';
  closeBtn.textContent = '×';
  header.appendChild(headerLeft);
  header.appendChild(closeBtn);
  return header;
}
/** 创建面板内容区（基本/更新/性能/监控分区），读取 instance.config */
function createConfigContent(instance) {
  const content = document.createElement('div');
  content.className = 'github-i18n-config-content';
  const basicSection = createConfigSection('基本设置', [
    {
      type: 'checkbox',
      id: 'github-i18n-debug-mode',
      label: '启用调试模式',
      checked: instance.config.debugMode,
    },
    {
      type: 'checkbox',
      id: 'github-i18n-enable-partial-match',
      label: '启用部分匹配',
      checked: instance.config.performance.enablePartialMatch,
    },
  ]);
  const updateSection = createConfigSection('更新设置', [
    {
      type: 'checkbox',
      id: 'github-i18n-auto-update',
      label: '自动检查更新',
      checked: instance.config.updateCheck.enabled,
    },
  ]);
  const performanceSection = createConfigSection('性能设置', [
    {
      type: 'checkbox',
      id: 'github-i18n-translation-cache',
      label: '启用翻译缓存',
      checked: instance.config.performance.enableTranslationCache,
    },
    {
      type: 'checkbox',
      id: 'github-i18n-virtual-dom',
      label: '启用虚拟DOM优化',
      checked: instance.config.performance.enableVirtualDom,
    },
  ]);
  const monitoringSection = createPerformanceMonitoringSection();
  content.appendChild(basicSection);
  content.appendChild(updateSection);
  content.appendChild(performanceSection);
  content.appendChild(monitoringSection);
  return content;
}
/** 创建面板底部（重置/取消/保存按钮） */
function createConfigFooter() {
  const footer = document.createElement('div');
  footer.className = 'github-i18n-config-footer';
  const resetBtn = document.createElement('button');
  resetBtn.className = 'github-i18n-config-reset';
  resetBtn.textContent = '重置默认';
  const footerRight = document.createElement('div');
  footerRight.className = 'github-i18n-config-footer-right';
  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'github-i18n-config-cancel';
  cancelBtn.textContent = '取消';
  const saveBtn = document.createElement('button');
  saveBtn.className = 'github-i18n-config-save';
  saveBtn.textContent = '保存配置';
  footerRight.appendChild(cancelBtn);
  footerRight.appendChild(saveBtn);
  footer.appendChild(resetBtn);
  footer.appendChild(footerRight);
  return footer;
}
/** 创建单个配置分区（标题 + 多个配置项） */
function createConfigSection(title, items) {
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
/**
 * GitHub 中文翻译配置管理模块
 * @file configManager.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责用户配置的加载、保存、合并与重置逻辑
 */
// 配置存储键名
const CONFIG_STORAGE_KEY = 'github-i18n-config';
/** 从 localStorage 加载用户设置（带混淆解码，兼容旧格式） */
function loadUserSettings() {
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
function saveUserSettings(instance, settings) {
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
function mergeUserConfig(instance) {
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
function handleSave(instance) {
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
function handleReset(instance) {
  localStorage.removeItem(CONFIG_STORAGE_KEY);
  instance.userConfig = {};
  instance.settings = {};
  instance.hide();
}
/**
 * GitHub 中文翻译配置面板事件模块
 * @file configPanelEvents.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责配置面板的事件绑定与清理
 */
/** 为配置面板绑定关闭/保存/重置/取消/刷新/导出/容器点击事件 */
function addConfigPanelEventListeners(instance) {
  if (!instance.container) return;
  const closeBtn = instance.container.querySelector('.github-i18n-config-close');
  const saveBtn = instance.container.querySelector('.github-i18n-config-save');
  const resetBtn = instance.container.querySelector('.github-i18n-config-reset');
  const cancelBtn = instance.container.querySelector('.github-i18n-config-cancel');
  const refreshBtn = instance.container.querySelector('#github-i18n-refresh-stats');
  const exportBtn = instance.container.querySelector('#github-i18n-export-stats');
  const handleClose = () => instance.hide();
  const handleSaveClick = () => instance.handleSave();
  const handleResetClick = () => instance.handleReset();
  const handleRefresh = () => updatePerformanceStats();
  const handleExport = () => exportPerformanceStats();
  const handleContainerClick = (e) => {
    if (e.target === instance.container) {
      instance.hide();
    }
  };
  closeBtn?.addEventListener('click', handleClose);
  saveBtn?.addEventListener('click', handleSaveClick);
  resetBtn?.addEventListener('click', handleResetClick);
  cancelBtn?.addEventListener('click', handleClose);
  refreshBtn?.addEventListener('click', handleRefresh);
  exportBtn?.addEventListener('click', handleExport);
  instance.container?.addEventListener('click', handleContainerClick);
  instance.eventListeners.push(
    { element: closeBtn, event: 'click', handler: handleClose },
    { element: saveBtn, event: 'click', handler: handleSaveClick },
    { element: resetBtn, event: 'click', handler: handleResetClick },
    { element: cancelBtn, event: 'click', handler: handleClose },
    { element: refreshBtn, event: 'click', handler: handleRefresh },
    { element: exportBtn, event: 'click', handler: handleExport },
    { element: instance.container, event: 'click', handler: handleContainerClick },
  );
}
/** 清理已绑定的事件监听器 */
function cleanupConfigPanelEventListeners(instance) {
  instance.eventListeners.forEach(({ element, event, handler }) => {
    element?.removeEventListener(event, handler);
  });
  instance.eventListeners = [];
}
/**
 * GitHub 中文翻译配置界面模块
 * @file configUI.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 提供用户友好的配置界面，允许用户调整插件参数
 */
class ConfigUI {
  constructor() {
    this.config = CONFIG;
    this.userConfig = {};
    this.isOpen = false;
    this.container = null;
    this.floatingButton = null;
    this.settings = this.loadUserSettings();
    this.isPageUnloading = false;
    this.eventListeners = [];
    this.initialized = false;
    this.setupPageUnloadHandler();
  }
  /**
   * 初始化配置界面
   * 合并用户配置、创建浮动按钮、注册 Tampermonkey 菜单命令
   */
  init() {
    if (this.initialized) return;
    this.mergeUserConfig();
    this.createFloatingButton();
    this.registerMenuCommands();
    this.initialized = true;
    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 配置界面已初始化');
    }
  }
  /**
   * 创建右下角浮动设置按钮（对齐 prototype.md 规范）
   */
  createFloatingButton() {
    if (this.floatingButton) return;
    const btn = document.createElement('button');
    btn.className = 'github-i18n-floating-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'GitHub 中文翻译设置');
    btn.textContent = '⚙';
    btn.addEventListener('click', () => {
      this.toggle();
    });
    addConfigUIStyles();
    if (document.body) {
      document.body.appendChild(btn);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(btn);
      });
    }
    this.floatingButton = btn;
  }
  /**
   * 注册 Tampermonkey 菜单命令（对齐 prototype.md 规范）
   */
  registerMenuCommands() {
    if (typeof GM_registerMenuCommand === 'function') {
      try {
        GM_registerMenuCommand('⚙ 打开 GitHub 中文翻译设置', () => this.show());
        GM_registerMenuCommand('🔄 立即翻译当前页面', () => {
          if (typeof window !== 'undefined' && window.translationCore) {
            window.translationCore.translate();
          }
        });
      } catch (_error) {
        // 非 GM 环境下静默忽略
      }
    }
  }
  loadUserSettings() {
    return loadUserSettings();
  }
  saveUserSettings(settings) {
    saveUserSettings(this, settings);
  }
  mergeUserConfig() {
    mergeUserConfig(this);
  }
  createUI() {
    createConfigUI(this);
  }
  createHeader() {
    return createConfigHeader();
  }
  createContent() {
    return createConfigContent(this);
  }
  createFooter() {
    return createConfigFooter();
  }
  createConfigSection(title, items) {
    return createConfigSection(title, items);
  }
  addEventListeners() {
    addConfigPanelEventListeners(this);
  }
  cleanupEventListeners() {
    cleanupConfigPanelEventListeners(this);
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
    if (this.floatingButton && this.floatingButton.parentNode) {
      this.floatingButton.parentNode.removeChild(this.floatingButton);
    }
    this.floatingButton = null;
    this.container = null;
    this.initialized = false;
  }
  handleSave() {
    handleSave(this);
  }
  handleReset() {
    handleReset(this);
  }
}
// 创建单例实例，供 main.js 直接导入使用
const configUI = new ConfigUI();
configUI;
/**
 * 更新通知 UI 模块
 * @file updateNotification.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责渲染和隐藏脚本更新通知（安全 DOM 操作，不使用 innerHTML）
 */
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
/**
 * 版本存储模块
 * @file versionStorage.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 版本检查相关的本地存储读写（历史记录、缓存版本、通知状态）
 */
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
/**
 * 版本更新检查模块
 * @file versionChecker.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 负责检查和处理脚本更新，UI 与存储委托给独立模块
 */
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
/**
 * 虚拟DOM节点模块
 * @file virtualNode.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 虚拟DOM节点类，表示一个DOM元素的虚拟映射，包含其状态和内容哈希
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
 * 虚拟DOM清理模块
 * @file virtualDomCleanup.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 提供虚拟DOM管理器的清理、定时器和页面卸载处理功能
 */
/**
 * 设置页面卸载处理器
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function setupVdomUnloadHandler(manager) {
  // 保存卸载处理器引用，便于后续 removeEventListener
  manager.unloadHandler = () => {
    manager.isPageUnloading = true;
    manager.cleanup();
  };
  // 监听多种卸载事件以确保兼容性
  window.addEventListener('beforeunload', manager.unloadHandler);
  window.addEventListener('unload', manager.unloadHandler);
  window.addEventListener('pagehide', manager.unloadHandler);
}
/**
 * 开始自动清理
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function startVdomAutoCleanup(manager) {
  stopVdomAutoCleanup(manager);
  manager.cleanupTimer = setInterval(() => {
    // 如果页面正在卸载，停止清理
    if (manager.isPageUnloading) {
      stopVdomAutoCleanup(manager);
      return;
    }
    manager.cleanup();
  }, manager.cleanupInterval);
}
/**
 * 停止自动清理
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function stopVdomAutoCleanup(manager) {
  if (manager.cleanupTimer) {
    clearInterval(manager.cleanupTimer);
    manager.cleanupTimer = null;
  }
}
/**
 * 清理无效的虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {boolean} force - 是否强制清理所有节点
 */
function cleanupVdomNodes(manager, force = false) {
  try {
    const now = Date.now();
    // 如果不是强制清理且距离上次清理时间不足，则跳过
    if (!force && now - manager.lastCleanupTime < manager.cleanupInterval) {
      return;
    }
    manager.lastCleanupTime = now;
    let removedCount = 0;
    // 如果页面正在卸载或强制清理，删除所有节点
    if (force || manager.isPageUnloading) {
      removedCount = manager.nodes.size;
      manager.nodes.clear();
      manager.nodeCache.clear();
      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 强制清理了${removedCount}个虚拟节点`);
      }
      return;
    }
    // 正常清理：删除DOM中不存在的节点或长时间未更新的节点
    const nodesToRemove = [];
    for (const [id, node] of manager.nodes) {
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
      manager.nodes.delete(id);
      manager.nodeCache.delete(id);
      removedCount++;
    }
    if (CONFIG.debugMode && removedCount > 0) {
      console.log(
        `[GitHub 中文翻译] 清理了${removedCount}个无效虚拟节点，当前节点数：${manager.nodes.size}`,
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
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function clearVdomNodes(manager) {
  manager.nodes.clear();
  manager.nodeCache.clear();
  manager.lastCleanupTime = Date.now();
}
/**
 * 销毁管理器，移除所有事件监听器和定时器，防止内存泄漏
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function destroyVdomManager(manager) {
  stopVdomAutoCleanup(manager);
  if (manager.unloadHandler) {
    window.removeEventListener('beforeunload', manager.unloadHandler);
    window.removeEventListener('unload', manager.unloadHandler);
    window.removeEventListener('pagehide', manager.unloadHandler);
    manager.unloadHandler = null;
  }
  manager.clear();
}
/**
 * 虚拟DOM处理器模块
 * @file virtualDomProcessor.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 提供虚拟DOM节点的创建、查找、翻译状态检查和批量处理功能
 */
/**
 * 为元素获取或创建虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - DOM元素
 * @returns {VirtualNode|null} 虚拟节点
 */
function getOrCreateVdomNode(manager, element) {
  try {
    // 检查页面是否正在卸载
    if (manager.isPageUnloading) {
      return null;
    }
    // 先尝试从缓存查找
    if (element.dataset && element.dataset.virtualDomId) {
      const cachedNode = manager.nodeCache.get(element.dataset.virtualDomId);
      if (cachedNode && cachedNode.element === element) {
        return cachedNode;
      }
    }
    // 检查节点数量限制
    if (manager.nodes.size >= manager.maxNodes) {
      // 强制清理一次
      manager.cleanup(true);
      // 如果清理后仍然超过限制，删除最旧的节点
      if (manager.nodes.size >= manager.maxNodes) {
        const nodesToRemove = Math.floor(manager.maxNodes * 0.2); // 删除20%的节点
        const entries = Array.from(manager.nodes.entries());
        // 按最后更新时间排序，删除最旧的
        entries.sort((a, b) => a[1].lastUpdated - b[1].lastUpdated);
        for (let i = 0; i < nodesToRemove; i++) {
          const [id] = entries[i];
          manager.nodes.delete(id);
          manager.nodeCache.delete(id);
        }
        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 强制清理了${nodesToRemove}个虚拟节点`);
        }
      }
    }
    // 创建新节点
    const node = new VirtualNode(element);
    manager.nodes.set(node.elementId, node);
    manager.nodeCache.set(node.elementId, node);
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
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {string} elementId - 元素ID
 * @returns {VirtualNode|null} 虚拟节点
 */
function findVdomNodeById(manager, elementId) {
  return manager.nodes.get(elementId) || null;
}
/**
 * 检查元素是否需要翻译
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} 是否需要翻译
 */
function shouldTranslateVdom(manager, element) {
  try {
    const node = getOrCreateVdomNode(manager, element);
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
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - 已翻译的元素
 */
function markVdomTranslated(manager, element) {
  try {
    const node = getOrCreateVdomNode(manager, element);
    if (node) {
      node.markAsTranslated();
    }
  } catch (_error) {
    // 忽略错误
  }
}
/**
 * 批量处理元素
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {NodeList|Array} elements - 要处理的元素列表
 * @returns {Array} 需要翻译的元素列表
 */
function processVdomElements(manager, elements) {
  const elementsToTranslate = [];
  try {
    elements.forEach((element) => {
      if (shouldTranslateVdom(manager, element)) {
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
 * 虚拟DOM模块
 * @file virtualDom.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 用于跟踪已翻译元素的状态，避免重复翻译和不必要的DOM操作
 */
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
    this.unloadHandler = null; // 保存卸载处理器引用，便于 cleanup 移除
    this.isPageUnloading = false;
    // 设置页面卸载处理
    setupVdomUnloadHandler(this);
    // 自动清理定时器
    startVdomAutoCleanup(this);
  }
  /**
   * 为元素获取或创建虚拟节点
   * @param {HTMLElement} element - DOM元素
   * @returns {VirtualNode|null} 虚拟节点
   */
  getOrCreateNode(element) {
    return getOrCreateVdomNode(this, element);
  }
  /**
   * 通过ID查找虚拟节点
   * @param {string} elementId - 元素ID
   * @returns {VirtualNode|null} 虚拟节点
   */
  findNodeById(elementId) {
    return findVdomNodeById(this, elementId);
  }
  /**
   * 检查元素是否需要翻译
   * @param {HTMLElement} element - 要检查的元素
   * @returns {boolean} 是否需要翻译
   */
  shouldTranslate(element) {
    return shouldTranslateVdom(this, element);
  }
  /**
   * 标记元素为已翻译
   * @param {HTMLElement} element - 已翻译的元素
   */
  markElementAsTranslated(element) {
    markVdomTranslated(this, element);
  }
  /**
   * 批量处理元素
   * @param {NodeList|Array} elements - 要处理的元素列表
   * @returns {Array} 需要翻译的元素列表
   */
  processElements(elements) {
    return processVdomElements(this, elements);
  }
  /**
   * 开始自动清理
   */
  startAutoCleanup() {
    startVdomAutoCleanup(this);
  }
  /**
   * 停止自动清理
   */
  stopAutoCleanup() {
    stopVdomAutoCleanup(this);
  }
  /**
   * 清理无效的虚拟节点
   * @param {boolean} force - 是否强制清理所有节点
   */
  cleanup(force = false) {
    cleanupVdomNodes(this, force);
  }
  /**
   * 清空所有虚拟节点
   */
  clear() {
    clearVdomNodes(this);
  }
  /**
   * 销毁管理器，移除所有事件监听器和定时器，防止内存泄漏
   */
  destroy() {
    destroyVdomManager(this);
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
 * GitHub 中文翻译主入口文件
 * @file main.js
 * @version 1.9.22
 * @date 2026-07-04
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
    // 销毁虚拟 DOM 管理器，移除事件监听器和定时器
    if (virtualDomManager && typeof virtualDomManager.destroy === 'function') {
      virtualDomManager.destroy();
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
// 将核心模块暴露到全局作用域 - 仅在调试模式下
if (typeof window !== 'undefined' && CONFIG.debugMode) {
  window.translationCore = translationCore;
  window.configUI = configUI;
}
// 启动脚本
startScript();})();
