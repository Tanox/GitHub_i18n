describe('Utils', () => {
  let utils;

  beforeEach(() => {
    jest.resetModules();
    utils = require('../../utils/utils');
  });

  describe('escapeRegExp', () => {
    it('should escape special regex characters', () => {
      expect(utils.escapeRegExp('hello.world')).toBe('hello\\.world');
      expect(utils.escapeRegExp('a+b*c?')).toBe('a\\+b\\*c\\?');
      expect(utils.escapeRegExp('(test)')).toBe('\\(test\\)');
      expect(utils.escapeRegExp('[test]')).toBe('\\[test\\]');
      expect(utils.escapeRegExp('{test}')).toBe('\\{test\\}');
      expect(utils.escapeRegExp('^test$')).toBe('\\^test\\$');
      expect(utils.escapeRegExp('test|value')).toBe('test\\|value');
      expect(utils.escapeRegExp('a/b')).toBe('a\\/b');
    });

    it('should handle empty string', () => {
      expect(utils.escapeRegExp('')).toBe('');
    });

    it('should not modify regular characters', () => {
      expect(utils.escapeRegExp('abc123')).toBe('abc123');
    });
  });

  describe('formatNumber', () => {
    it('should add thousand separators', () => {
      expect(utils.formatNumber(1000)).toBe('1,000');
      expect(utils.formatNumber(1000000)).toBe('1,000,000');
      expect(utils.formatNumber(1234567890)).toBe('1,234,567,890');
    });

    it('should handle small numbers', () => {
      expect(utils.formatNumber(0)).toBe('0');
      expect(utils.formatNumber(1)).toBe('1');
      expect(utils.formatNumber(100)).toBe('100');
    });

    it('should handle string numbers', () => {
      expect(utils.formatNumber('1000')).toBe('1,000');
    });
  });

  describe('sleep', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await utils.sleep(100);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeGreaterThanOrEqual(95);
      expect(elapsed).toBeLessThan(200);
    });

    it('should resolve without error', async () => {
      await expect(utils.sleep(50)).resolves.toBeUndefined();
    });
  });

  describe('processPagesInBatches', () => {
    it('should process items in batches', async () => {
      const items = [1, 2, 3, 4, 5];
      const processFn = jest.fn((item) => Promise.resolve(item * 2));

      const results = await utils.processPagesInBatches(items, processFn, 2);

      expect(results).toEqual([2, 4, 6, 8, 10]);
      expect(processFn).toHaveBeenCalledTimes(5);
    });

    it('should handle empty array', async () => {
      const results = await utils.processPagesInBatches([], jest.fn(), 5);
      expect(results).toEqual([]);
    });

    it('should use default batch size', async () => {
      const items = [1, 2, 3];
      const processFn = jest.fn((item) => Promise.resolve(item));

      await utils.processPagesInBatches(items, processFn);

      expect(processFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('validateConfig', () => {
    it('should return valid for correct config', () => {
      const config = {
        userScriptPath: '/path/to/script',
        backupDir: '/path/to/backup',
      };
      const result = utils.validateConfig(config);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return error for missing userScriptPath', () => {
      const config = {
        backupDir: '/path/to/backup',
      };
      const result = utils.validateConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('userScriptPath 是必填项');
    });

    it('should return error for missing backupDir', () => {
      const config = {
        userScriptPath: '/path/to/script',
      };
      const result = utils.validateConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('backupDir 是必填项');
    });

    it('should validate minStringLength', () => {
      const config = {
        userScriptPath: '/path',
        backupDir: '/path',
        minStringLength: -1,
      };
      const result = utils.validateConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('minStringLength');
    });

    it('should validate maxStringLength is greater than minStringLength', () => {
      const config = {
        userScriptPath: '/path',
        backupDir: '/path',
        minStringLength: 10,
        maxStringLength: 5,
      };
      const result = utils.validateConfig(config);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('maxStringLength');
    });
  });

  describe('updateStatsAfterRun', () => {
    it('should be defined as a function', () => {
      expect(typeof utils.updateStatsAfterRun).toBe('function');
    });

    it('should execute without error', () => {
      expect(() => {
        utils.updateStatsAfterRun({ total: 10, success: 8 });
      }).not.toThrow();
    });
  });
});
