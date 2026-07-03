/**
 * 元素翻译模块
 * @file translationCore/elementTranslator.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 实际翻译DOM元素的模块
 */
import { CONFIG } from '../config.js';
import virtualDomManager from '../core/virtualDom.js';
import { ErrorHandler } from '../core/errorHandler.js';
import { dictionaryManager } from './dictionaryManager.js';
import { elementSelector } from './elementSelector.js';

export const elementTranslator = {
  performanceData: {
    translateStartTime: 0,
    translateEndTime: 0,
    elementsProcessed: 0,
    textsTranslated: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheEvictions: 0,
    cacheCleanups: 0,
    domOperations: 0,
    domOperationTime: 0,
    networkRequests: 0,
    networkRequestTime: 0,
    dictionaryLookups: 0,
    partialMatches: 0,
    batchProcessings: 0,
    errorCount: 0,
    totalMemory: 0,
  },

  translateElement(element) {
    if (!this.shouldProcessElement(element)) {
      return false;
    }

    this.performanceData.elementsProcessed++;

    if (!elementSelector.shouldTranslateElement(element)) {
      return false;
    }

    const fragment = document.createDocumentFragment();
    const { textNodesToProcess, hasTranslatableContent } = this.collectChildNodes(
      element,
      fragment,
    );

    // 如果没有任何可翻译的内容，直接返回false，不修改DOM
    if (!hasTranslatableContent) {
      return false;
    }

    const hasTranslation = this.applyTextTranslations(textNodesToProcess, fragment);
    this.appendFragmentToElement(fragment, element);

    if (hasTranslation) {
      virtualDomManager.markElementAsTranslated(element);
    }

    elementSelector.elementCache.set(element, true);

    return hasTranslation;
  },

  // 检查元素是否需要处理（缓存/标记/类型校验）
  shouldProcessElement(element) {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }
    if (!elementSelector.shouldTranslate(element)) {
      return false;
    }
    if (elementSelector.elementCache.has(element)) {
      return false;
    }
    if (element.hasAttribute('data-github-zh-translated')) {
      elementSelector.elementCache.set(element, true);
      return false;
    }
    return true;
  },

  // 遍历子节点：收集可翻译文本节点，并将元素节点移入 fragment
  collectChildNodes(element, fragment) {
    const textNodesToProcess = [];
    let hasTranslatableContent = false;
    const minLen = CONFIG.performance?.minTextLengthToTranslate;

    for (const node of Array.from(element.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        const trimmed = node.nodeValue.trim();
        if (trimmed && trimmed.length >= minLen) {
          // 预检查翻译匹配，无匹配则跳过，避免不必要的 DOM 操作
          const translated = dictionaryManager.getTranslatedText(trimmed);
          if (translated && translated !== trimmed) {
            textNodesToProcess.push({ node, originalText: node.nodeValue });
            hasTranslatableContent = true;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const moved = this.moveChildToFragment(element, node, fragment);
        hasTranslatableContent = hasTranslatableContent || moved;
      }
    }

    return { textNodesToProcess, hasTranslatableContent };
  },

  // 将子元素移入 fragment 并递归翻译
  moveChildToFragment(parent, node, fragment) {
    try {
      parent.removeChild(node);
      fragment.appendChild(node);
      return this.translateElement(node);
    } catch (e) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 处理子元素失败:', e, '元素:', node);
      }
      try {
        if (!node.parentNode) {
          parent.appendChild(node);
        }
      } catch (addBackError) {
        if (CONFIG.debugMode) {
          console.error('[GitHub 中文翻译] 将子元素添加回原始位置失败:', addBackError);
        }
      }
      return false;
    }
  },

  // 处理文本节点翻译并追加到 fragment
  applyTextTranslations(textNodesToProcess, fragment) {
    let hasTranslation = false;

    textNodesToProcess.forEach(({ node, originalText }) => {
      // 先从父节点移除原文本节点，避免重复残留
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }

      const trimmed = originalText.trim();
      const translatedText = dictionaryManager.getTranslatedText(trimmed);

      if (this.isValidTranslation(translatedText, trimmed)) {
        const translatedNode = this.createTranslatedNode(translatedText);
        if (translatedNode) {
          fragment.appendChild(translatedNode);
          hasTranslation = true;
          this.performanceData.textsTranslated++;
          return;
        }
      }
      fragment.appendChild(node);
    });

    return hasTranslation;
  },

  // 校验翻译结果是否可用
  isValidTranslation(translatedText, originalText) {
    return (
      translatedText &&
      typeof translatedText === 'string' &&
      translatedText !== originalText
    );
  },

  // 创建翻译后的文本节点（过滤控制字符），失败时返回 null
  createTranslatedNode(translatedText) {
    try {
      const safeText = [...translatedText]
        .filter((c) => c.charCodeAt(0) > 31 && c.charCodeAt(0) !== 127)
        .join('');
      return document.createTextNode(safeText);
    } catch (e) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 创建翻译节点失败:', e, '翻译文本:', translatedText);
      }
      return null;
    }
  },

  // 将文档片段插入回元素
  appendFragmentToElement(fragment, element) {
    try {
      if (fragment && fragment.hasChildNodes()) {
        if (element.firstChild) {
          element.insertBefore(fragment, element.firstChild);
        } else {
          element.appendChild(fragment);
        }
      }
    } catch (appendError) {
      if (CONFIG.debugMode) {
        console.error('[GitHub 中文翻译] 添加文档片段失败:', appendError, '元素:', element);
      }
    }
  },

  async translateCriticalElementsOnly() {
    const criticalSelectors = ['.Header', '.repository-content', '.js-repo-pjax-container', 'main'];

    const criticalElements = [];
    let processedElements = 0;
    let failedElements = 0;

    criticalSelectors.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements && elements.length > 0) {
          Array.from(elements).forEach((el) => {
            if (el && el instanceof HTMLElement) {
              criticalElements.push(el);
            }
          });

          if (CONFIG.debugMode) {
            console.log(`[GitHub 中文翻译] 找到关键元素: ${selector}, 数量: ${elements.length}`);
          }
        }
      } catch (err) {
        ErrorHandler.handleError('查询选择器', err, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
      }
    });

    if (criticalElements.length === 0) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 没有找到关键元素需要翻译');
      }
      return;
    }

    criticalElements.forEach((element) => {
      try {
        this.translateElement(element);
        processedElements++;
      } catch (err) {
        failedElements++;
        ErrorHandler.handleError('关键元素翻译', err, ErrorHandler.ERROR_TYPES.DOM_OPERATION);
      }
    });

    if (CONFIG.debugMode) {
      console.log(
        `[GitHub 中文翻译] 关键元素翻译完成 - 总数量: ${criticalElements.length}, 成功: ${processedElements}, 失败: ${failedElements}`,
      );
    }
  },
};
