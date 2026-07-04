/**
 * 翻译词典合并模块
 * @file index.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 整合所有页面的翻译词典
 */
import { commonDictionary } from './common.js';
import { codespacesDictionary } from './codespaces.js';
import { exploreDictionary } from './explore.js';
import { issuesDictionary } from './issues.js';
import { pullRequestsDictionary } from './pullRequests.js';
import { actionsDictionary } from './actions.js';
import { wikiDictionary } from './wiki.js';
import { notificationsDictionary } from './notifications.js';
import { settingsDictionary } from './settings.js';
import { searchDictionary } from './search.js';
import { profileDictionary } from './profile.js';
import { dashboardDictionary } from './dashboard.js';
import { marketplaceDictionary } from './marketplace.js';

/**
 * 翻译词典对象，包含所有页面的翻译词典
 */
export const translationModule = {
  common: commonDictionary,
  codespaces: codespacesDictionary,
  explore: exploreDictionary,
  issues: issuesDictionary,
  pullRequests: pullRequestsDictionary,
  actions: actionsDictionary,
  wiki: wikiDictionary,
  notifications: notificationsDictionary,
  settings: settingsDictionary,
  search: searchDictionary,
  profile: profileDictionary,
  dashboard: dashboardDictionary,
  marketplace: marketplaceDictionary,
};

/**
 * 合并所有词典为一个完整的词典对象
 * @returns {Object} 合并后的词典
 */
export function mergeAllDictionaries() {
  const merged = {};
  for (const module in translationModule) {
    Object.assign(merged, translationModule[module]);
  }
  return merged;
}
