/**
 * DOM观察器工具函数模块
 * @file domObserver.utils.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description DOM变化观察的工具函数集合
 */

import { CONFIG } from '../config.js';
import { pageAnalyzer } from './pageAnalyzer.js';

const PAGE_MODE_THRESHOLDS = {
  issues: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  pullRequests: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  wiki: { contentWeight: 1, importantWeight: 2, minContent: 4 },
  search: { contentWeight: 1, importantWeight: 2, minContent: 3 },
  codespaces: { contentWeight: 1, importantWeight: 2, minContent: 2 },
};

export function isElementIgnored(target, ignoreElements, elementCheckCache, pageMode) {
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
      default:
        // 未知页面模式
        break;
    }
  }

  if (elementCheckCache) {
    elementCheckCache.set(element, shouldIgnore);
  }

  return shouldIgnore;
}

export function isElementImportant(target, importantElements, elementCheckCache, pageMode) {
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
      default:
        // 未知页面模式
        break;
    }
  }

  if (elementCheckCache) {
    elementCheckCache.set(target, isImportant);
  }

  return isImportant;
}

export function isMutationContentRelated(mutation, pageMode) {
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
              default:
                // 未知页面模式
                return false;
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

export function calculateMutationWeights(mutation, pageMode, elementCheckCache) {
  const config = PAGE_MODE_THRESHOLDS[pageMode] || PAGE_MODE_THRESHOLDS.search;
  let contentChanges = 0;
  let importantChanges = 0;
  let shouldTrigger = false;

  if (mutation.target) {
    const isIgnored = isElementIgnored(mutation.target, [], elementCheckCache, pageMode);

    if (!isIgnored) {
      const isImportant = isElementImportant(mutation.target, [], elementCheckCache, pageMode);

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

export function processMutationBatch(mutations, maxCheckCount, pageMode) {
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
      return {
        shouldTrigger: true,
        contentChanges: totalContentChanges,
        importantChanges: totalImportantChanges,
      };
    }
  }

  return {
    shouldTrigger: false,
    contentChanges: totalContentChanges,
    importantChanges: totalImportantChanges,
  };
}

export function checkWeightedThreshold(contentChanges, importantChanges, maxCheckCount, pageMode) {
  const config = PAGE_MODE_THRESHOLDS[pageMode] || PAGE_MODE_THRESHOLDS.search;
  const minContentChanges = config.minContent;

  if (contentChanges < minContentChanges) {
    return false;
  }

  const weightedChanges =
    contentChanges * config.contentWeight + importantChanges * config.importantWeight;
  const threshold = pageAnalyzer.getModeSpecificThreshold(pageMode) || 0.3;

  return weightedChanges / maxCheckCount > threshold;
}
