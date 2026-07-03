/**
 * 工具函数模块（门面模式）
 * @file utils.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 工具函数统一入口，委托给各子模块，保持 utils 对象 API 不变
 */

import { functionUtils } from './functionUtils.js';
import { stringUtils } from './stringUtils.js';
import { urlUtils } from './urlUtils.js';
import { domUtils } from './domUtils.js';
import { objectUtils } from './objectUtils.js';
import { cryptoUtils } from './cryptoUtils.js';

/**
 * 工具函数集合（门面）
 * 通过展开各子模块，保持 utils.methodName() 调用方式不变
 * this 引用在合并后仍指向 utils，跨方法调用可正常解析
 */
export const utils = {
  ...functionUtils,
  ...stringUtils,
  ...urlUtils,
  ...domUtils,
  ...objectUtils,
  ...cryptoUtils,
};
