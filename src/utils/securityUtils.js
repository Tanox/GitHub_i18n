/**
 * 编码安全工具模块
 * @file securityUtils.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 包含编码、加密、数据混淆等安全相关工具
 */

const RADIX_16 = 16;
const PAD_LENGTH_2 = 2;
const PAD_CHAR = '0';

/**
 * 对数据进行Base64编码（用于轻量级数据混淆，非加密）
 * @param {string} data - 要编码的数据
 * @returns {string} Base64编码后的字符串
 */
function base64Encode(data) {
  try {
    return btoa(unescape(encodeURIComponent(data)));
  } catch (_error) {
    return data;
  }
}

/**
 * 对Base64编码的数据进行解码
 * @param {string} encodedData - Base64编码的字符串
 * @returns {string|null} 解码后的字符串或null
 */
function base64Decode(encodedData) {
  try {
    return decodeURIComponent(escape(atob(encodedData)));
  } catch (_error) {
    return null;
  }
}

/**
 * 混淆敏感配置数据（轻量级保护）
 * 使用XOR加密配合Base64编码
 * @param {string} data - 要混淆的数据
 * @param {string} key - 混淆密钥
 * @returns {string} 混淆后的数据
 */
function obfuscateData(data, key = 'github-i18n-secure') {
  try {
    const encoded = base64Encode(data);
    let result = '';
    for (let i = 0; i < encoded.length; i++) {
      // eslint-disable-next-line no-bitwise
      const charCode = encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return base64Encode(result);
  } catch (_error) {
    return data;
  }
}

/**
 * 还原被混淆的配置数据
 * @param {string} obfuscatedData - 被混淆的数据
 * @param {string} key - 混淆密钥
 * @returns {string|null} 还原后的数据或null
 */
function deobfuscateData(obfuscatedData, key = 'github-i18n-secure') {
  try {
    const decoded = base64Decode(obfuscatedData);
    if (!decoded) return null;
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      // eslint-disable-next-line no-bitwise
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return base64Decode(result);
  } catch (_error) {
    return null;
  }
}

/**
 * 计算字符串的SHA-256哈希值
 * @param {string} data - 要计算哈希的数据
 * @returns {Promise<string>} SHA-256哈希值（十六进制格式）
 */
async function sha256Hash(data) {
  try {
    const msgUint8 = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(RADIX_16).padStart(PAD_LENGTH_2, PAD_CHAR)).join('');
  } catch (_error) {
    return '';
  }
}

export { base64Encode, base64Decode, obfuscateData, deobfuscateData, sha256Hash };
