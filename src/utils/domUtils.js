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
export const domUtils = {
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
