/**
 * 函数工具模块
 * @file functionUtils.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 包含节流、防抖、延迟等函数相关工具
 */

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
function throttle(func, limit, options = {}) {
  const { leading = true, trailing = true } = options;
  let inThrottle, lastArgs, lastThis, result, timerId;

  const later = (context, args) => {
    inThrottle = false;
    if (trailing && lastArgs) {
      result = func.apply(context, args);
      lastArgs = null;
      lastThis = null;
    }
  };

  return function () {
    const args = arguments;
    // eslint-disable-next-line no-invalid-this
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
}

/**
 * 防抖函数，延迟执行函数直到停止触发一段时间
 * 支持返回Promise
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {Object} options - 配置选项
 * @param {boolean} options.leading - 是否在开始时执行一次（默认false）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay, options = {}) {
  const { leading = false } = options;
  let timeout, result;

  const later = (context, args) => {
    result = func.apply(context, args);
  };

  return function () {
    const args = arguments;
    // eslint-disable-next-line no-invalid-this
    const context = this;
    const isLeadingCall = !timeout && leading;

    clearTimeout(timeout);
    timeout = setTimeout(() => later(context, args), delay);

    if (isLeadingCall) {
      result = func.apply(context, args);
    }

    return result;
  };
}

/**
 * 延迟函数，返回Promise的setTimeout
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 安全地执行函数，捕获可能的异常
 * @param {Function} fn - 要执行的函数
 * @param {*} defaultValue - 执行失败时的默认返回值
 * @param {Object} context - 函数执行上下文
 * @param {...*} args - 函数参数
 * @returns {*} 函数返回值或默认值
 */
function safeExecute(fn, defaultValue = null, context = null, ...args) {
  try {
    if (typeof fn === 'function') {
      return fn.apply(context, args);
    }
    return defaultValue;
  } catch (error) {
    console.error('[GitHub 中文翻译] 安全执行函数失败:', error);
    return defaultValue;
  }
}

export { throttle, debounce, delay, safeExecute };
