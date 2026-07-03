/**
 * 编码与加密工具模块
 * @file cryptoUtils.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 包含Base64编解码、数据混淆还原、SHA-256哈希、错误信息脱敏等辅助函数
 */

/**
 * 编码与加密工具集合
 */
export const cryptoUtils = {
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
