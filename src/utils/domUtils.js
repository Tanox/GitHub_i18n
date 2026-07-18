/**
 * DOM工具模块
 * @file domUtils.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 包含DOM操作相关的工具函数
 */

/**
 * 收集DOM树中的所有文本节点内容
 * @param {HTMLElement} element - 要收集文本的起始元素
 * @param {Set<string>} resultSet - 用于存储结果的Set集合
 * @param {Object} options - 配置选项
 * @param {number} options.maxLength - 最大文本长度（默认200）
 * @param {string[]} options.skipTags - 跳过的标签名数组
 */
function collectTextNodes(element, resultSet, options = {}) {
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
    if (element.tagName && skipTags.includes(element.tagName.toLowerCase())) {
      return;
    }

    if (element.classList && element.classList.contains('sr-only')) {
      return;
    }

    const childNodes = Array.from(element.childNodes || []);
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue ? node.nodeValue.trim() : '';
        if (
          text &&
          text.length > 0 &&
          text.length < maxLength &&
          !/^\d+$/.test(text) &&
          !/^[\s\u0021-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u007E\u00A1-\u00BF\u2000-\u206F\u3000-\u303F]+$/.test(
            text,
          )
        ) {
          resultSet.add(text);
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        collectTextNodes(node, resultSet, options);
      }
    }
  } catch (error) {
    console.error('[GitHub 中文翻译] 收集文本节点时出错:', error);
  }
}

export { collectTextNodes };
