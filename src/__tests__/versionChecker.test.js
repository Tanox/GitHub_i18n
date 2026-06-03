/**
 * 版本检查模块测试
 */

import { versionChecker } from '../versionChecker';

describe('versionChecker', () => {
  beforeEach(() => {
    // 清除所有 localStorage 数据
    localStorage.clear();
  });

  describe('isNewerVersion', () => {
    it('应该正确判断更高版本号', () => {
      expect(versionChecker.isNewerVersion('1.9.17', '1.9.16')).toBe(true);
      expect(versionChecker.isNewerVersion('2.0.0', '1.9.16')).toBe(true);
    });

    it('应该正确判断相同或更低版本号', () => {
      expect(versionChecker.isNewerVersion('1.9.16', '1.9.16')).toBe(false);
      expect(versionChecker.isNewerVersion('1.9.15', '1.9.16')).toBe(false);
    });
  });

  describe('extractVersion', () => {
    it('应该从用户脚本注释中提取版本号', () => {
      const content = `// ==UserScript==
// @name GitHub 中文翻译
// @version 1.9.17
// ==/UserScript==`;
      expect(versionChecker.extractVersion(content)).toBe('1.9.17');
    });

    it('当没有版本号时应返回 null', () => {
      expect(versionChecker.extractVersion('no version here')).toBeNull();
    });
  });

  describe('缓存功能', () => {
    it('应该可以更新和获取缓存版本', () => {
      versionChecker.updateVersionInStorage('2.0.0');
      const cached = versionChecker.getCachedVersion();
      expect(cached?.version).toBe('2.0.0');
    });

    it('应该可以清除通知忽略状态', () => {
      localStorage.setItem('githubZhUpdateNotificationDismissed', 'dismissed');
      expect(versionChecker.clearNotificationDismissal()).toBe(true);
      expect(localStorage.getItem('githubZhUpdateNotificationDismissed')).toBeNull();
    });
  });
});
