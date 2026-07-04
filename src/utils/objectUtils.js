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
export const objectUtils = {
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
