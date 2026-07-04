/**
 * 虚拟DOM节点模块
 * @file virtualNode.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 虚拟DOM节点类，表示一个DOM元素的虚拟映射，包含其状态和内容哈希
 */
import { CONFIG } from '../config.js';

/**
 * 虚拟DOM节点类
 * 表示一个DOM元素的虚拟映射，包含其状态和内容哈希
 */
export class VirtualNode {
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
