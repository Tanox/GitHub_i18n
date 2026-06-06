/**
 * LRU缓存管理模块测试
 */

import { CacheManager } from '../core/cacheManager';

describe('CacheManager', () => {
  let cacheManager;

  beforeEach(() => {
    cacheManager = new CacheManager(10);
  });

  describe('constructor', () => {
    it('应该使用默认的最大容量初始化缓存', () => {
      const cache = new CacheManager();
      expect(cache.maxSize).toBe(2000);
    });

    it('应该使用指定的最大容量初始化缓存', () => {
      const cache = new CacheManager(50);
      expect(cache.maxSize).toBe(50);
    });
  });

  describe('setToCache 和 getFromCache', () => {
    it('应该能够设置和获取缓存值', () => {
      cacheManager.setToCache('key1', 'value1');
      expect(cacheManager.getFromCache('key1')).toBe('value1');
    });

    it('获取不存在的键应该返回null', () => {
      expect(cacheManager.getFromCache('nonexistent')).toBeNull();
    });

    it('页面卸载时不应该设置缓存', () => {
      cacheManager.setToCache('key1', 'value1', true);
      expect(cacheManager.getFromCache('key1')).toBeNull();
    });
  });

  describe('缓存统计', () => {
    it('应该正确记录缓存命中', () => {
      cacheManager.setToCache('key1', 'value1');
      cacheManager.getFromCache('key1');
      const stats = cacheManager.getStats();
      expect(stats.hits).toBe(1);
    });

    it('应该正确记录缓存未命中', () => {
      cacheManager.getFromCache('nonexistent');
      const stats = cacheManager.getStats();
      expect(stats.misses).toBe(1);
    });

    it('应该正确记录缓存大小', () => {
      cacheManager.setToCache('key1', 'value1');
      cacheManager.setToCache('key2', 'value2');
      const stats = cacheManager.getStats();
      expect(stats.size).toBe(2);
    });
  });

  describe('LRU缓存策略', () => {
    it('应该在超过容量时执行LRU淘汰', () => {
      // 设置15个缓存项，容量为10
      for (let i = 0; i < 15; i++) {
        cacheManager.setToCache(`key${i}`, `value${i}`);
      }

      // 应该有淘汰发生
      const stats = cacheManager.getStats();
      expect(stats.evictions).toBeGreaterThan(0);
    });

    it('被访问的项应该更不容易被淘汰', () => {
      for (let i = 0; i < 10; i++) {
        cacheManager.setToCache(`key${i}`, `value${i}`);
      }

      // 访问key0多次
      cacheManager.getFromCache('key0');
      cacheManager.getFromCache('key0');
      cacheManager.getFromCache('key0');

      // 添加新项触发淘汰
      cacheManager.setToCache('newKey', 'newValue');

      // key0应该还在缓存中
      expect(cacheManager.getFromCache('key0')).toBe('value0');
    });
  });

  describe('clearCache', () => {
    it('应该清空缓存并重置统计', () => {
      cacheManager.setToCache('key1', 'value1');
      cacheManager.setToCache('key2', 'value2');
      cacheManager.clearCache();

      const stats = cacheManager.getStats();
      expect(stats.size).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(cacheManager.getFromCache('key1')).toBeNull();
    });
  });

  describe('cleanCache', () => {
    it('应该执行缓存清理', () => {
      for (let i = 0; i < 15; i++) {
        cacheManager.setToCache(`key${i}`, `value${i}`);
      }

      // 清理之前有一些淘汰
      const statsBefore = cacheManager.getStats();

      cacheManager.cleanCache();

      const statsAfter = cacheManager.getStats();
      // 大小应该保持在容量限制内
      expect(statsAfter.size).toBeLessThanOrEqual(cacheManager.maxSize);
    });
  });

  describe('getStats', () => {
    it('应该返回统计信息的副本', () => {
      const stats1 = cacheManager.getStats();
      const stats2 = cacheManager.getStats();

      expect(stats1).toEqual(stats2);
      expect(stats1).not.toBe(stats2); // 应该是不同的对象
    });
  });
});
