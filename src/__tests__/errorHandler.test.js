/**
 * 错误处理模块测试
 */

import { ErrorHandler } from '../core/errorHandler';
import { CONFIG } from '../config.js';

describe('ErrorHandler', () => {
  beforeEach(() => {
    ErrorHandler.init();
  });

  describe('init', () => {
    it('应该初始化所有错误类型的计数为0', () => {
      ErrorHandler.init();
      const stats = ErrorHandler.getErrorStats();
      Object.values(ErrorHandler.ERROR_TYPES).forEach((type) => {
        expect(stats[type]).toBe(0);
      });
    });
  });

  describe('handleError', () => {
    it('应该增加对应类型的错误计数', () => {
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);

      const stats = ErrorHandler.getErrorStats();
      expect(stats[ErrorHandler.ERROR_TYPES.TRANSLATION]).toBe(1);
    });

    it('应该使用默认的错误类型', () => {
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试', testError);

      const stats = ErrorHandler.getErrorStats();
      expect(stats[ErrorHandler.ERROR_TYPES.OTHER]).toBe(1);
    });

    it('应该记录错误日志', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试', testError);
      expect(console.error).toHaveBeenCalled();
      console.error.mockRestore();
    });

    it('应该尝试执行恢复函数', () => {
      const recoveryFn = jest.fn();
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试', testError, ErrorHandler.ERROR_TYPES.OTHER, {
        recoveryFn,
      });
    });
  });

  describe('getErrorStats', () => {
    it('应该返回正确的错误统计', () => {
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试1', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);
      ErrorHandler.handleError('测试2', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);
      ErrorHandler.handleError('测试3', testError, ErrorHandler.ERROR_TYPES.DOM_OPERATION);

      const stats = ErrorHandler.getErrorStats();
      expect(stats[ErrorHandler.ERROR_TYPES.TRANSLATION]).toBe(2);
      expect(stats[ErrorHandler.ERROR_TYPES.DOM_OPERATION]).toBe(1);
    });
  });

  describe('resetErrorCounts', () => {
    it('应该重置所有错误计数', () => {
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);

      ErrorHandler.resetErrorCounts();
      const stats = ErrorHandler.getErrorStats();
      expect(stats[ErrorHandler.ERROR_TYPES.TRANSLATION]).toBe(0);
    });

    it('应该重置指定类型的错误计数', () => {
      const testError = new Error('Test error');
      ErrorHandler.handleError('测试1', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);
      ErrorHandler.handleError('测试2', testError, ErrorHandler.ERROR_TYPES.DOM_OPERATION);

      ErrorHandler.resetErrorCounts(ErrorHandler.ERROR_TYPES.TRANSLATION);
      const stats = ErrorHandler.getErrorStats();
      expect(stats[ErrorHandler.ERROR_TYPES.TRANSLATION]).toBe(0);
      expect(stats[ErrorHandler.ERROR_TYPES.DOM_OPERATION]).toBe(1);
    });
  });

  describe('checkErrorThreshold', () => {
    it('应该在错误超过阈值时采取措施', () => {
      const originalEnableFullTranslation = CONFIG.performance.enableFullTranslation;

      // 添加多个翻译错误直到超过阈值
      const testError = new Error('Test error');
      for (let i = 0; i < 15; i++) {
        ErrorHandler.handleError('测试', testError, ErrorHandler.ERROR_TYPES.TRANSLATION);
      }

      // 验证 CONFIG.performance.enableFullTranslation 被设置为 false
      expect(CONFIG.performance.enableFullTranslation).toBe(false);

      // 恢复原始值
      CONFIG.performance.enableFullTranslation = originalEnableFullTranslation;
    });
  });
});
