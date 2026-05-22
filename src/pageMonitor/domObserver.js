/**
 * DOM变化观察器模块
 * @file pageMonitor/domObserver.js
 * @version 1.9.16
 * @date 2026-05-22
 * @author Sut
 * @description 观察DOM变化并触发翻译
 */
import { CONFIG } from '../config.js';
import { utils } from '../utils.js';
import { translationCore } from '../translationCore/index.js';
import { pageAnalyzer } from './pageAnalyzer.js';
import { pageMonitorCache } from './cacheManager.js';

const PAGE_MODE_THRESHOLDS = {
  issues: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  pullRequests: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  wiki: { contentWeight: 1, importantWeight: 2, minContent: 4 },
  search: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  codespaces: { contentWeight: 1, importantWeight: 2, minContent: 2 },
};

function isElementIgnored(target, ignoreElements, elementCheckCache, pageMode) {
  if (target.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const element = target;

  if (elementCheckCache && elementCheckCache.has(element)) {
    return elementCheckCache.get(element);
  }

  let shouldIgnore = ignoreElements.some((selector) => {
    try {
      return element.matches(selector);
    } catch (_e) {
      return false;
    }
  });

  if (!shouldIgnore && pageMode) {
    switch (pageMode) {
      case 'codespaces':
        shouldIgnore =
          element.classList.contains('terminal') ||
          element.tagName === 'PRE' ||
          element.classList.contains('command-input');
        break;
      case 'wiki':
        if (element.tagName === 'PRE' && element.classList.contains('codehilite')) {
          shouldIgnore = true;
        }
        break;
      case 'search':
        if (element.tagName === 'CODE' && !element.classList.contains('search-match')) {
          shouldIgnore = true;
        }
        break;
    }
  }

  if (elementCheckCache) {
    elementCheckCache.set(element, shouldIgnore);
  }

  return shouldIgnore;
}

function isElementImportant(target, importantElements, elementCheckCache, pageMode) {
  if (pageMode && pageAnalyzer.shouldSkipElementByPageMode(target, pageMode)) {
    return false;
  }

  if (elementCheckCache && elementCheckCache.has(target)) {
    return elementCheckCache.get(target);
  }

  let isImportant = importantElements.some((selector) => {
    try {
      return target.matches(selector);
    } catch (_e) {
      return false;
    }
  });

  if (!isImportant && pageMode) {
    switch (pageMode) {
      case 'issues':
      case 'pullRequests':
        isImportant =
          target.classList.contains('comment-body') ||
          target.classList.contains('timeline-comment-header');
        break;
      case 'wiki':
        isImportant =
          target.classList.contains('markdown-body') ||
          target.tagName === 'H1' ||
          target.tagName === 'H2';
        break;
      case 'search':
        isImportant = target.classList.contains('search-match') || target.classList.contains('f4');
        break;
      case 'codespaces':
        isImportant = target.classList.contains('codespace-status');
        break;
    }
  }

  if (elementCheckCache) {
    elementCheckCache.set(target, isImportant);
  }

  return isImportant;
}

function isMutationContentRelated(mutation, pageMode) {
  try {
    if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
      const oldValue = mutation.oldValue || '';
      const newValue = mutation.target.textContent || '';

      if (oldValue.trim() === newValue.trim()) {
        return false;
      }

      const minLength = pageAnalyzer.getMinTextLengthByPageMode(pageMode);
      return (
        oldValue !== newValue &&
        (newValue.length >= minLength ||
          oldValue.length >= minLength ||
          Math.abs(newValue.length - oldValue.length) >= 3)
      );
    }

    if (
      mutation.type === 'childList' &&
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    ) {
      return Array.from(mutation.addedNodes).some((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node;
          if (
            element.tagName === 'SCRIPT' ||
            element.tagName === 'STYLE' ||
            element.tagName === 'META'
          ) {
            return false;
          }
          if (pageMode) {
            switch (pageMode) {
              case 'issues':
              case 'pullRequests':
                return (
                  element.classList.contains('comment-body') ||
                  element.classList.contains('timeline-comment') ||
                  element.classList.contains('js-issue-title')
                );
              case 'wiki':
                return (
                  element.classList.contains('markdown-body') || /^H[1-6]$/.test(element.tagName)
                );
              case 'codespaces':
                if (
                  element.classList.contains('terminal') ||
                  element.classList.contains('command-input')
                ) {
                  return false;
                }
                break;
              case 'search':
                return (
                  element.classList.contains('search-result') ||
                  element.classList.contains('search-match')
                );
            }
          }
          return true;
        }
        return node.nodeType === Node.TEXT_NODE;
      });
    }

    return false;
  } catch (_error) {
    return false;
  }
}

function calculateMutationWeights(mutation, pageMode, elementCheckCache) {
  const config = PAGE_MODE_THRESHOLDS[pageMode] || PAGE_MODE_THRESHOLDS.search;
  let contentChanges = 0;
  let importantChanges = 0;
  let shouldTrigger = false;

  if (mutation.target) {
    const isIgnored = isElementIgnored(
      mutation.target,
      [],
      elementCheckCache,
      pageMode,
    );

    if (!isIgnored) {
      const isImportant = isElementImportant(
        mutation.target,
        [],
        elementCheckCache,
        pageMode,
      );

      if (isImportant) {
        shouldTrigger = true;
      }
    }

    if (mutation.type === 'attributes') {
      const importantAttributes = ['id', 'class', 'href', 'title'];
      if (importantAttributes.includes(mutation.attributeName)) {
        importantChanges++;
        if (importantChanges >= 3) {
          shouldTrigger = true;
        }
      }
    }

    if (isMutationContentRelated(mutation, pageMode)) {
      contentChanges++;
      if (contentChanges >= Math.max(5, config.minContent)) {
        shouldTrigger = true;
      }
    }
  }

  return { shouldTrigger, contentChanges, importantChanges };
}

function processMutationBatch(mutations, maxCheckCount, pageMode) {
  const elementCheckCache = new WeakMap();
  let totalContentChanges = 0;
  let totalImportantChanges = 0;

  for (let i = 0; i < maxCheckCount; i++) {
    const mutation = mutations[i];

    if (mutation.type === 'characterData' && CONFIG.performance?.ignoreCharacterDataMutations) {
      continue;
    }
    if (mutation.type === 'attributes' && CONFIG.performance?.ignoreAttributeMutations) {
      continue;
    }

    const result = calculateMutationWeights(mutation, pageMode, elementCheckCache);
    totalContentChanges += result.contentChanges;
    totalImportantChanges += result.importantChanges;

    if (result.shouldTrigger) {
      return { shouldTrigger: true, contentChanges: totalContentChanges, importantChanges: totalImportantChanges };
    }
  }

  return { shouldTrigger: false, contentChanges: totalContentChanges, importantChanges: totalImportantChanges };
}

function checkWeightedThreshold(contentChanges, importantChanges, maxCheckCount, pageMode) {
  const config = PAGE_MODE_THRESHOLDS[pageMode] || PAGE_MODE_THRESHOLDS.search;
  const minContentChanges = config.minContent;

  if (contentChanges < minContentChanges) {
    return false;
  }

  const weightedChanges = contentChanges * config.contentWeight + importantChanges * config.importantWeight;
  const threshold = pageAnalyzer.getModeSpecificThreshold(pageMode) || 0.3;

  return weightedChanges / maxCheckCount > threshold;
}

export const domObserver = {
  observer: null,
  onTranslationTrigger: null,
  isPageUnloading: false,
  errorCount: 0,

  init(translationTriggerCallback) {
    this.onTranslationTrigger = translationTriggerCallback;
    this.setupDomObserver();
  },

  setupDomObserver() {
    try {
      if (this.observer) {
        try {
          this.observer.disconnect();
          this.observer = null;
        } catch (error) {
          if (CONFIG.debugMode) {
            console.warn('[GitHub 中文翻译] 断开现有observer失败:', error);
          }
        }
      }

      const pageMode = translationCore.detectPageMode();
      const rootNode = this.selectOptimalRootNode(pageMode);
      const observerConfig = this.getOptimizedObserverConfig(pageMode);

      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 当前页面模式:', pageMode);
      }

      const handleMutations = (mutations) => {
        try {
          const pageMode = translationCore.detectPageMode();
          if (this.shouldTriggerTranslation(mutations, pageMode)) {
            if (this.onTranslationTrigger) {
              this.onTranslationTrigger();
            }
          }
        } catch (error) {
          console.error('[GitHub 中文翻译] 处理DOM变化时出错:', error);
        }
      };

      this.observer = new MutationObserver(
        utils.debounce(handleMutations, CONFIG.debounceDelay || 300),
      );

      if (rootNode) {
        try {
          this.observer.observe(rootNode, observerConfig);
          if (CONFIG.debugMode) {
            console.log(
              '[GitHub 中文翻译] DOM观察器已启动，观察范围:',
              rootNode.tagName + (rootNode.id ? '#' + rootNode.id : ''),
            );
          }
        } catch (error) {
          if (CONFIG.debugMode) {
            console.error('[GitHub 中文翻译] 启动DOM观察者失败:', error);
          }
          this.setupFallbackMonitoring();
        }
      } else {
        console.error('[GitHub 中文翻译] 无法找到合适的观察节点，回退到body');
        const domLoadedHandler = () => {
          try {
            this.setupDomObserver();
          } catch (error) {
            if (CONFIG.debugMode) {
              console.error('[GitHub 中文翻译] DOMContentLoaded后启动观察者失败:', error);
            }
          }
        };
        document.addEventListener('DOMContentLoaded', domLoadedHandler);
        pageMonitorCache.addEventListener({
          target: document,
          type: 'DOMContentLoaded',
          handler: domLoadedHandler,
        });
      }
    } catch (error) {
      console.error('[GitHub 中文翻译] 设置DOM观察器失败:', error);
      this.setupFallbackMonitoring();
    }
  },

  selectOptimalRootNode(pageMode) {
    const effectivePageMode = pageMode || translationCore.detectPageMode();
    let candidateSelectors;

    switch (effectivePageMode) {
      case 'search':
        candidateSelectors = ['.codesearch-results', '#js-pjax-container', 'main', 'body'];
        break;
      case 'issues':
      case 'pullRequests':
        candidateSelectors = [
          '.js-discussion',
          '.issue-details',
          '#js-issue-title',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'repository':
        candidateSelectors = [
          '#js-repo-pjax-container',
          '.repository-content',
          '.application-main',
          'body',
        ];
        break;
      case 'notifications':
        candidateSelectors = [
          '.notifications-list',
          '.notification-shelf',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'wiki':
        candidateSelectors = [
          '.wiki-wrapper',
          '.markdown-body',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'actions':
        candidateSelectors = [
          '.workflow-run-list',
          '.workflow-jobs',
          '.workflow-run-header',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      case 'projects':
        candidateSelectors = [
          '.project-layout',
          '.project-columns',
          '#js-pjax-container',
          'main',
          'body',
        ];
        break;
      default:
        candidateSelectors = ['#js-pjax-container', 'main', '.application-main', 'body'];
    }

    for (const selector of candidateSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim().length > 0) {
        return element;
      }
    }

    return document.body;
  },

  getOptimizedObserverConfig(pageMode) {
    pageMode = pageMode || translationCore.detectPageMode();
    const baseConfig = { childList: true };

    if (!CONFIG.performance?.ignoreCharacterDataMutations) {
      baseConfig.characterData = true;
    }

    const complexPages = ['wiki', 'issues', 'pullRequests', 'markdown'];
    const simplePages = ['search', 'codespaces', 'marketplace'];

    if (complexPages.includes(pageMode)) {
      baseConfig.subtree = CONFIG.performance?.observeSubtree;
    } else if (simplePages.includes(pageMode)) {
      baseConfig.subtree = false;
    } else {
      baseConfig.subtree = CONFIG.performance?.observeSubtree;
    }

    if (CONFIG.performance?.observeAttributes && !CONFIG.performance?.ignoreAttributeMutations) {
      baseConfig.attributes = true;
      baseConfig.attributeFilter = CONFIG.performance?.importantAttributes || [
        'id',
        'class',
        'href',
        'title',
      ];
    }

    return baseConfig;
  },

  setupFallbackMonitoring() {
    if (CONFIG.debugMode) {
      console.log('[GitHub 中文翻译] 使用降级监控方案');
    }
  },

  shouldTriggerTranslation(mutations, pageMode) {
    pageMode = pageMode || translationCore.detectPageMode();
    try {
      if (!mutations || mutations.length === 0) {
        return false;
      }

      const { mutationThreshold = 30, maxMutationProcessing = 50 } = CONFIG.performance || {};

      const quickPathThreshold = pageAnalyzer.getQuickPathThresholdByPageMode(pageMode);
      if (mutations.length <= quickPathThreshold) {
        return this.detectImportantChanges(mutations, pageMode);
      }

      const maxCheckCount = Math.min(mutations.length, Math.max(mutationThreshold, maxMutationProcessing));

      const batchResult = processMutationBatch(mutations.slice(0, maxCheckCount), maxCheckCount, pageMode);

      if (batchResult.shouldTrigger) {
        return true;
      }

      return checkWeightedThreshold(
        batchResult.contentChanges,
        batchResult.importantChanges,
        maxCheckCount,
        pageMode,
      );
    } catch (error) {
      console.error('[GitHub 中文翻译] 判断翻译触发条件时出错:', error);
      return false;
    }
  },

  detectImportantChanges(mutations, pageMode) {
    for (const mutation of mutations) {
      if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
        if (this.isImportantElement(mutation.target, [], new WeakMap(), pageMode)) {
          return true;
        }
      }
      if (this.isContentRelatedMutation(mutation, pageMode)) {
        return true;
      }
    }
    return false;
  },

  isImportantElement(element, importantElements, cache, pageMode) {
    try {
      if (pageMode && pageAnalyzer.shouldSkipElementByPageMode(element, pageMode)) {
        return false;
      }

      if (cache && cache.has(element)) {
        return cache.get(element);
      }

      let isImportant = importantElements.some((selector) => {
        try {
          return element.matches(selector);
        } catch (_e) {
          return false;
        }
      });

      if (!isImportant && pageMode) {
        switch (pageMode) {
          case 'issues':
          case 'pullRequests':
            isImportant =
              element.classList.contains('comment-body') ||
              element.classList.contains('timeline-comment-header');
            break;
          case 'wiki':
            isImportant =
              element.classList.contains('markdown-body') ||
              element.tagName === 'H1' ||
              element.tagName === 'H2';
            break;
          case 'search':
            isImportant =
              element.classList.contains('search-match') || element.classList.contains('f4');
            break;
          case 'codespaces':
            isImportant = element.classList.contains('codespace-status');
            break;
        }
      }

      if (cache) {
        cache.set(element, isImportant);
      }

      return isImportant;
    } catch (error) {
      console.error('[GitHub 中文翻译] 判断重要元素时出错:', error);
      return false;
    }
  },

  shouldIgnoreElement(node, ignoreElements, cache, pageMode) {
    try {
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
      }

      const element = node;

      if (cache && cache.has(node)) {
        return cache.get(node);
      }

      if (pageMode && pageAnalyzer.shouldSkipElementByPageMode(element, pageMode)) {
        if (cache) {
          cache.set(node, true);
        }
        return true;
      }

      let shouldIgnore = ignoreElements.some((selector) => {
        try {
          return element.matches(selector);
        } catch (_e) {
          return false;
        }
      });

      if (!shouldIgnore && pageMode) {
        switch (pageMode) {
          case 'codespaces':
            shouldIgnore =
              element.classList.contains('terminal') ||
              element.tagName === 'PRE' ||
              element.classList.contains('command-input');
            break;
          case 'wiki':
            if (element.tagName === 'PRE' && element.classList.contains('codehilite')) {
              shouldIgnore = true;
            }
            break;
          case 'search':
            if (element.tagName === 'CODE' && !element.classList.contains('search-match')) {
              shouldIgnore = true;
            }
            break;
        }
      }

      if (cache) {
        cache.set(node, shouldIgnore);
      }

      return shouldIgnore;
    } catch (error) {
      console.error('[GitHub 中文翻译] 判断忽略元素时出错:', error);
      return false;
    }
  },

  isContentRelatedMutation(mutation, pageMode) {
    try {
      if (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE) {
        const oldValue = mutation.oldValue || '';
        const newValue = mutation.target.textContent || '';

        if (oldValue.trim() === newValue.trim()) {
          return false;
        }

        const minLength = pageAnalyzer.getMinTextLengthByPageMode(pageMode);
        return (
          oldValue !== newValue &&
          (newValue.length >= minLength ||
            oldValue.length >= minLength ||
            Math.abs(newValue.length - oldValue.length) >= 3)
        );
      }

      if (
        mutation.type === 'childList' &&
        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
      ) {
        return Array.from(mutation.addedNodes).some((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node;
            if (
              element.tagName === 'SCRIPT' ||
              element.tagName === 'STYLE' ||
              element.tagName === 'META'
            ) {
              return false;
            }
            if (pageMode) {
              switch (pageMode) {
                case 'issues':
                case 'pullRequests':
                  return (
                    element.classList.contains('comment-body') ||
                    element.classList.contains('timeline-comment') ||
                    element.classList.contains('js-issue-title')
                  );
                case 'wiki':
                  return (
                    element.classList.contains('markdown-body') || /^H[1-6]$/.test(element.tagName)
                  );
                case 'codespaces':
                  if (
                    element.classList.contains('terminal') ||
                    element.classList.contains('command-input')
                  ) {
                    return false;
                  }
                  break;
                case 'search':
                  return (
                    element.classList.contains('search-result') ||
                    element.classList.contains('search-match')
                  );
              }
            }
            return true;
          }
          return node.nodeType === Node.TEXT_NODE;
        });
      }

      return false;
    } catch (error) {
      console.error('[GitHub 中文翻译] 判断内容相关变化时出错:', error);
      return false;
    }
  },

  handleError(operation, error) {
    const errorMessage = `[GitHub 中文翻译] ${operation}时出错: ${error.message}`;
    if (CONFIG.debugMode) {
      console.error(errorMessage, error);
    } else {
      console.error(errorMessage);
    }

    this.errorCount++;

    if (this.errorCount > (CONFIG.performance?.maxErrorCount || 5)) {
      if (CONFIG.debugMode) {
        console.log('[GitHub 中文翻译] 错误次数过多，尝试重启监控');
      }
      setTimeout(() => {
        this.setupDomObserver();
      }, 1000);
      this.errorCount = 0;
    }
  },

  stop() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },
};
