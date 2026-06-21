/**
 * 翻译元素选择模块
 * @file translationCore/elementSelector.js
 * @version 1.9.20
 * @date 2026-06-10
 * @author Sut
 * @description 选择需要翻译的DOM元素
 */
import { CONFIG } from '../config.js';
import virtualDomManager from '../core/virtualDom.js';

const SKIP_TAGS = [
  'script',
  'style',
  'code',
  'pre',
  'textarea',
  'input',
  'select',
  'img',
  'svg',
  'canvas',
  'video',
  'audio',
];

const SKIP_CLASS_PATTERNS = [
  /language-\w+/,
  /highlight/,
  /token/,
  /no-translate/,
  /octicon/,
  /emoji/,
  /avatar/,
  /timestamp/,
  /numeral/,
  /filename/,
  /hash/,
  /sha/,
  /shortsha/,
  /hex-color/,
  /code/,
  /gist/,
  /language-/,
  /markdown-/,
  /monaco-editor/,
  /syntax-/,
  /highlight-/,
  /clipboard/,
  /progress-/,
  /count/,
  /size/,
  /time/,
  /date/,
  /sortable/,
  /label/,
  /badge/,
  /url/,
  /email/,
  /key/,
  /token/,
  /user-name/,
  /repo-name/,
];

const SKIP_ID_PATTERNS = [
  /\d+/,
  /-\d+/,
  /_\d+/,
  /sha-/,
  /hash-/,
  /commit-/,
  /issue-/,
  /pull-/,
  /pr-/,
  /repo-/,
  /user-/,
  /file-/,
  /blob-/,
  /tree-/,
  /branch-/,
  /tag-/,
  /release-/,
  /gist-/,
  /discussion-/,
  /comment-/,
  /review-/,
  /workflow-/,
  /action-/,
  /job-/,
  /step-/,
  /runner-/,
  /package-/,
  /registry-/,
  /marketplace-/,
  /organization-/,
  /team-/,
  /project-/,
  /milestone-/,
  /assignee-/,
  /reporter-/,
  /reviewer-/,
  /author-/,
  /committer-/,
  /contributor-/,
  /sponsor-/,
  /funding-/,
  /donation-/,
  /payment-/,
  /billing-/,
  /plan-/,
  /subscription-/,
  /license-/,
  /secret-/,
  /key-/,
  /token-/,
  /password-/,
  /credential-/,
  /certificate-/,
  /ssh-/,
  /git-/,
  /clone-/,
  /push-/,
  /pull-/,
  /fetch-/,
  /merge-/,
  /rebase-/,
  /cherry-pick-/,
  /reset-/,
  /revert-/,
  /tag-/,
  /branch-/,
  /commit-/,
  /diff-/,
  /patch-/,
  /stash-/,
  /ref-/,
  /head-/,
  /remote-/,
  /upstream-/,
  /origin-/,
  /local-/,
  /tracking-/,
  /merge-base-/,
  /conflict-/,
  /resolve-/,
  /status-/,
  /log-/,
  /blame-/,
  /bisect-/,
  /grep-/,
  /find-/,
  /filter-/,
  /archive-/,
  /submodule-/,
  /worktree-/,
  /lfs-/,
  /graphql-/,
  /rest-/,
  /api-/,
  /webhook-/,
  /event-/,
  /payload-/,
  /callback-/,
  /redirect-/,
  /oauth-/,
  /sso-/,
  /ldap-/,
  /saml-/,
  /2fa-/,
  /mfa-/,
  /security-/,
  /vulnerability-/,
  /cve-/,
  /dependency-/,
  /alert-/,
  /secret-scanning-/,
  /code-scanning-/,
  /codeql-/,
  /actions-/,
  /workflow-/,
  /job-/,
  /step-/,
  /runner-/,
  /artifact-/,
  /cache-/,
  /environment-/,
  /deployment-/,
  /app-/,
  /oauth-app-/,
  /github-app-/,
  /integration-/,
  /webhook-/,
  /marketplace-/,
  /listing-/,
  /subscription-/,
  /billing-/,
  /plan-/,
  /usage-/,
  /limits-/,
  /quota-/,
  /traffic-/,
  /analytics-/,
  /insights-/,
  /search-/,
  /explore-/,
  /trending-/,
  /stars-/,
  /forks-/,
  /watchers-/,
  /contributors-/,
  /activity-/,
  /events-/,
  /notifications-/,
  /feeds-/,
  /dashboard-/,
  /profile-/,
  /settings-/,
  /preferences-/,
  /organization-/,
  /team-/,
  /project-/,
  /milestone-/,
  /label-/,
  /\b\w+[0-9]\w*\b/,
];

function isSkipTag(tagName) {
  return SKIP_TAGS.includes(tagName.toLowerCase());
}

function hasSkipClass(className) {
  if (!className) return false;
  return SKIP_CLASS_PATTERNS.some((pattern) => pattern.test(className));
}

function hasSkipId(id) {
  if (!id) return false;
  return SKIP_ID_PATTERNS.some((pattern) => pattern.test(id));
}

function isHiddenElement(element) {
  const computedStyle = window.getComputedStyle(element);
  return (
    computedStyle.display === 'none' ||
    computedStyle.visibility === 'hidden' ||
    computedStyle.opacity === '0' ||
    (computedStyle.position === 'absolute' && computedStyle.left === '-9999px')
  );
}

function isNumericOrSpecialOnly(text) {
  return /^[0-9.,\s()[\]{}/*^$#@!~`|:;"'?>+-]+$/i.test(text);
}

export const elementSelector = {
  elementCache: new WeakMap(),

  getElementsToTranslate() {
    const uniqueElements = new Set();
    const allSelectors = [...CONFIG.selectors.primary, ...CONFIG.selectors.popupMenus];

    if (allSelectors.length <= 10) {
      const combinedSelector = allSelectors.join(', ');
      try {
        const allElements = document.querySelectorAll(combinedSelector);
        Array.from(allElements).forEach((element) => {
          if (this.shouldTranslateElement(element)) {
            uniqueElements.add(element);
          }
        });
        if (CONFIG.debugMode && CONFIG.performance?.logTiming) {
          console.log(
            `[GitHub 中文翻译] 合并查询选择器: ${combinedSelector}, 结果数量: ${allElements.length}`,
          );
        }
        return Array.from(uniqueElements);
      } catch (error) {
        if (CONFIG.debugMode) {
          console.warn('[GitHub 中文翻译] 合并选择器查询失败，回退到逐个查询:', error);
        }
      }
    }

    allSelectors.forEach((selector) => {
      try {
        const matchedElements = document.querySelectorAll(selector);
        Array.from(matchedElements).forEach((element) => {
          if (this.shouldTranslateElement(element)) {
            uniqueElements.add(element);
          }
        });
      } catch (error) {
        if (CONFIG.debugMode) {
          console.warn(`[GitHub 中文翻译] 选择器 "${selector}" 解析失败:`, error);
        }
      }
    });

    return Array.from(uniqueElements).filter((element) => element instanceof HTMLElement);
  },

  shouldTranslateElement(element) {
    if (!element || !(element instanceof HTMLElement)) {
      return false;
    }

    if (element.hasAttribute('data-github-zh-translated')) {
      return false;
    }

    if (!element.textContent.trim()) {
      return false;
    }

    if (isSkipTag(element.tagName)) {
      return false;
    }

    if (
      element.hasAttribute('data-no-translate') ||
      (element.hasAttribute('translate') && element.getAttribute('translate') === 'no') ||
      element.hasAttribute('aria-hidden') ||
      element.hasAttribute('hidden')
    ) {
      return false;
    }

    if (hasSkipClass(element.className)) {
      return false;
    }

    if (hasSkipId(element.id)) {
      return false;
    }

    if (isHiddenElement(element)) {
      return false;
    }

    const textContent = element.textContent.trim();
    if (!textContent || isNumericOrSpecialOnly(textContent)) {
      return false;
    }

    return true;
  },

  shouldTranslate(element) {
    return virtualDomManager.shouldTranslate(element);
  },
};
