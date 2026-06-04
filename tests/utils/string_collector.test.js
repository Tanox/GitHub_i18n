function isValidString(text) {
  if (!text || text.length === 0) return false;
  if (text.length < 2) return false;
  if (/^[\d\s!@#$%^&*(),.?":{}|<>\[\]]+$/.test(text)) return false;
  if (/^[\s\S]*<[^>]+>[\s\S]*$/.test(text) || /^[\s\S]*{[^}]+}[\s\S]*$/.test(text)) return false;
  if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) return false;
  return true;
}

function log(level, message, details = null) {
  const levels = ['debug', 'info', 'warn', 'error'];
  const currentLevelIndex = levels.indexOf('info');
  const messageLevelIndex = levels.indexOf(level);
  if (messageLevelIndex < currentLevelIndex) {
    return;
  }
  console.log(`[${level.toUpperCase()}] ${message}`);
}

const CONFIG = {
  outputDir: '../src/dictionaries',
  temporaryDir: '../temp',
  userAgent: 'Mozilla/5.0 Test Agent',
  httpTimeout: 30000,
  maxRetries: 3,
  retryDelay: 2000,
  logLevel: 'info',
};

describe('StringCollector', () => {
  describe('isValidString', () => {
    it('should return false for empty string', () => {
      expect(isValidString('')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isValidString(null)).toBe(false);
    });

    it('should return false for single character', () => {
      expect(isValidString('a')).toBe(false);
    });

    it('should return false for pure numbers', () => {
      expect(isValidString('12345')).toBe(false);
    });

    it('should return false for special characters only', () => {
      expect(isValidString('!@#$%^&*()')).toBe(false);
    });

    it('should return false for HTML content', () => {
      expect(isValidString('<div>content</div>')).toBe(false);
    });

    it('should return false for CSS content', () => {
      expect(isValidString('{color: red}')).toBe(false);
    });

    it('should return false for URLs', () => {
      expect(isValidString('https://github.com')).toBe(false);
      expect(isValidString('http://example.com')).toBe(false);
      expect(isValidString('www.example.com')).toBe(false);
    });

    it('should return true for valid Chinese text', () => {
      expect(isValidString('你好世界')).toBe(true);
    });

    it('should return true for valid English text', () => {
      expect(isValidString('Hello World')).toBe(true);
    });

    it('should return true for mixed content', () => {
      expect(isValidString('Hello 你好')).toBe(true);
    });
  });

  describe('CONFIG', () => {
    it('should have default configuration', () => {
      expect(CONFIG).toBeDefined();
      expect(CONFIG.outputDir).toBeDefined();
      expect(CONFIG.userAgent).toBeDefined();
      expect(CONFIG.httpTimeout).toBeGreaterThan(0);
      expect(CONFIG.maxRetries).toBeGreaterThan(0);
    });
  });

  describe('log function', () => {
    it('should export log function', () => {
      expect(typeof log).toBe('function');
    });

    it('should handle different log levels', () => {
      expect(() => log('info', 'test message')).not.toThrow();
      expect(() => log('warn', 'test warning')).not.toThrow();
      expect(() => log('error', 'test error')).not.toThrow();
    });

    it('should handle null details', () => {
      expect(() => log('info', 'test', null)).not.toThrow();
    });

    it('should handle Error details', () => {
      const error = new Error('test error');
      expect(() => log('error', 'error occurred', error)).not.toThrow();
    });
  });

  describe('log level filtering', () => {
    it('should filter debug messages when level is info', () => {
      const originalLog = console.log;
      const mockLog = jest.fn();
      console.log = mockLog;

      log('debug', 'should not print');
      expect(mockLog).not.toHaveBeenCalled();

      console.log = originalLog;
    });

    it('should allow info messages when level is info', () => {
      const originalLog = console.log;
      const mockLog = jest.fn();
      console.log = mockLog;

      log('info', 'should print');
      expect(mockLog).toHaveBeenCalled();

      console.log = originalLog;
    });
  });
});
