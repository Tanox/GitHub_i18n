describe('DictionaryProcessor', () => {
  let dictionaryProcessor;

  beforeEach(() => {
    jest.resetModules();
    dictionaryProcessor = require('../../utils/dictionary_processor');
  });

  describe('optimizeDictionary', () => {
    it('should remove duplicate strings within a module', () => {
      const input = {
        common: {
          'Hello': '你好',
          'World': '世界',
          'Hello': '你好',
        },
      };

      const result = dictionaryProcessor.optimizeDictionary(input);
      expect(Object.keys(result.common).length).toBe(2);
    });

    it('should skip empty or whitespace-only keys', () => {
      const input = {
        common: {
          '': 'empty',
          '   ': 'whitespace',
          'Valid': '有效',
        },
      };

      const result = dictionaryProcessor.optimizeDictionary(input);
      expect(result.common).toHaveProperty('Valid');
      expect(result.common).not.toHaveProperty('');
    });

    it('should trim whitespace from keys and values', () => {
      const input = {
        common: {
          '  Hello  ': '  你好  ',
          'World': '世界',
        },
      };

      const result = dictionaryProcessor.optimizeDictionary(input);
      expect(result.common).toHaveProperty('Hello');
      expect(result.common.Hello).toBe('你好');
    });
  });
});
