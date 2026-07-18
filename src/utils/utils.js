/**
 * 工具函数模块
 * @file utils.js
 * @version 1.9.21
 * @date 2026-06-10
 * @author Sut
 * @description 包含各种通用的辅助函数，从子模块整合导出
 */

import { throttle, debounce, delay, safeExecute } from './functionUtils.js';
import {
  escapeRegExp,
  safeJSONParse,
  safeJSONStringify,
  isSafeRegex,
  safeRegExp,
  getNestedProperty,
  deepClone,
  sanitizeErrorMessage,
} from './stringUtils.js';
import { collectTextNodes } from './domUtils.js';
import {
  getCurrentPath,
  getCurrentUrl,
  isCurrentPathMatch,
  getQueryParam,
  getAllQueryParams,
} from './urlUtils.js';
import {
  base64Encode,
  base64Decode,
  obfuscateData,
  deobfuscateData,
  sha256Hash,
} from './securityUtils.js';

export const utils = {
  throttle,
  debounce,
  delay,
  safeExecute,
  escapeRegExp,
  safeJSONParse,
  safeJSONStringify,
  isSafeRegex,
  safeRegExp,
  getNestedProperty,
  deepClone,
  sanitizeErrorMessage,
  collectTextNodes,
  getCurrentPath,
  getCurrentUrl,
  isCurrentPathMatch,
  getQueryParam,
  getAllQueryParams,
  base64Encode,
  base64Decode,
  obfuscateData,
  deobfuscateData,
  sha256Hash,
};
