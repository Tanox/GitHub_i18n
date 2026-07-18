/**
 * 字符串工具模块
 * @file stringUtils.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 包含字符串处理、正则表达式、JSON等工具函数
 */

// 工具函数常量
const MAX_REGEX_LENGTH = 100;
const MAX_REPETITION_COUNT = 5;

/**
 * 转义正则表达式中的特殊字符
 * @param {string} string - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

/**
 * 安全地解析JSON字符串
 * @param {string} jsonString - JSON字符串
 * @param {*} defaultValue - 解析失败时的默认值
 * @returns {*} 解析结果或默认值
 */
function safeJSONParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('[GitHub 中文翻译] JSON解析失败:', error);
    return defaultValue;
  }
}

/**
 * 安全地序列化对象为JSON字符串
 * @param {*} obj - 要序列化的对象
 * @param {string} defaultValue - 序列化失败时的默认值
 * @returns {string} JSON字符串或默认值
 */
function safeJSONStringify(obj, defaultValue = '{}') {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('[GitHub 中文翻译] JSON序列化失败:', error);
    return defaultValue;
  }
}

/**
 * 检查正则表达式是否存在潜在的ReDoS风险
 * @param {string|RegExp} pattern - 正则表达式模式
 * @returns {boolean} - 是否安全
 */
function isSafeRegex(pattern) {
  let patternObj = pattern;
  if (typeof patternObj === 'string') {
    patternObj = new RegExp(patternObj);
  }

  const source = patternObj.source;
  let depth = 0;
  let hasNestedRepetition = false;

  for (let i = 0; i < source.length; i++) {
    const char = source[i];

    if (char === '(' && source[i - 1] !== '\\') {
      depth++;
    } else if (char === ')' && source[i - 1] !== '\\') {
      depth--;
    } else if (depth > 0 && /[*+?]/.test(char) && source[i - 1] !== '\\') {
      hasNestedRepetition = true;
      break;
    }
  }

  const longPatternWarning = source.length > MAX_REGEX_LENGTH;
  const hasMultipleRepetitions = (source.match(/[*+?]/g) || []).length > MAX_REPETITION_COUNT;

  return !hasNestedRepetition && !longPatternWarning && !hasMultipleRepetitions;
}

/**
 * 安全地创建正则表达式，防止ReDoS攻击
 * @param {string} pattern - 正则表达式模式
 * @param {string} flags - 正则表达式标志
 * @returns {RegExp|null} - 安全的正则表达式或null
 */
function safeRegExp(pattern, flags = '') {
  try {
    const regex = new RegExp(pattern, flags);
    if (isSafeRegex(regex)) {
      return regex;
    }
    console.warn('[GitHub 中文翻译] 检测到可能存在ReDoS风险的正则表达式:', pattern);
    return null;
  } catch (error) {
    console.warn('[GitHub 中文翻译] 创建正则表达式失败:', error);
    return null;
  }
}

/**
 * 安全地访问对象属性，避免嵌套属性访问出错
 * @param {Object} obj - 目标对象
 * @param {string|string[]} path - 属性路径，如'a.b.c'或['a','b','c']
 * @param {*} defaultValue - 获取失败时的默认值
 * @returns {*} 属性值或默认值
 */
function getNestedProperty(obj, path, defaultValue = null) {
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
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone(obj) {
  try {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => deepClone(item));
    if (obj instanceof Object) {
      const clonedObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  } catch (error) {
    console.warn('[GitHub 中文翻译] 深拷贝失败:', error);
    return obj;
  }
  return null;
}

/**
 * 脱敏错误信息，移除敏感路径和内部细节
 * @param {string|Error} error - 错误对象或错误消息
 * @returns {string} 脱敏后的错误消息
 */
function sanitizeErrorMessage(error) {
  try {
    let message = typeof error === 'string' ? error : error.message || String(error);

    message = message.replace(/\/[a-zA-Z0-9_/.-]+:[0-9]+:[0-9]+/g, '[位置]');
    message = message.replace(/\/workspace\//g, '');
    message = message.replace(/at\s+[a-zA-Z0-9_.]+\s+[<(]/g, 'at [函数]');

    message = message.replace(
      /(password|token|secret|key)\s*[=:]\s*['"][^'"]*['"]/gi,
      '$1=[已隐藏]',
    );
    message = message.replace(/['"][a-zA-Z0-9+/=]{20,}['"]/g, '[已隐藏]');

    if (message.length > 200) {
      message = message.substring(0, 200) + '...';
    }

    return message;
  } catch (_error) {
    return '[未知错误]';
  }
}

export {
  escapeRegExp,
  safeJSONParse,
  safeJSONStringify,
  isSafeRegex,
  safeRegExp,
  getNestedProperty,
  deepClone,
  sanitizeErrorMessage,
};
