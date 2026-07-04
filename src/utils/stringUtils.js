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
export const stringUtils = {
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
