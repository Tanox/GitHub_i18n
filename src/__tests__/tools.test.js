/**
 * 开发工具模块测试
 */

import { stringExtractor, AutoStringUpdater, DictionaryProcessor, loadTools } from '../utils/tools.js';
import { translationModule } from '../dictionaries/index.js';

describe('tools', () => {
  describe('loadTools', () => {
    it('应该加载所有工具', () => {
      const tools = loadTools();
      expect(tools.stringExtractor).toBeDefined();
      expect(tools.AutoStringUpdater).toBeDefined();
      expect(tools.DictionaryProcessor).toBeDefined();
    });
  });

  describe('stringExtractor', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div>
          <p>Hello World</p>
          <span>Test String</span>
        </div>
      `;
    });

    it('应该能收集字符串', () => {
      const strings = stringExtractor.collectStrings(false);
      expect(strings).toBeInstanceOf(Set);
      expect(strings.size).toBeGreaterThan(0);
    });

    it('应该能找到未翻译的字符串', () => {
      const untranslated = stringExtractor.findUntranslatedStrings(false);
      expect(untranslated).toBeInstanceOf(Set);
    });
  });

  describe('AutoStringUpdater', () => {
    it('应该能创建实例', () => {
      const updater = new AutoStringUpdater();
      expect(updater).toBeDefined();
    });

    it('应该有findStringsToAdd方法', () => {
      const updater = new AutoStringUpdater();
      expect(typeof updater.findStringsToAdd).toBe('function');
    });

    it('应该有generateUpdateReport方法', () => {
      const updater = new AutoStringUpdater();
      expect(typeof updater.generateUpdateReport).toBe('function');
    });
  });

  describe('DictionaryProcessor', () => {
    it('应该能创建实例', () => {
      const processor = new DictionaryProcessor();
      expect(processor).toBeDefined();
    });

    it('应该能合并词典', () => {
      const processor = new DictionaryProcessor();
      const merged = processor.mergeDictionaries();
      expect(typeof merged).toBe('object');
    });

    it('应该能验证词典', () => {
      const processor = new DictionaryProcessor();
      const result = processor.validateDictionary();
      expect(typeof result.totalEntries).toBe('number');
      expect(typeof result.translatedEntries).toBe('number');
      expect(typeof result.completionRate).toBe('string');
    });
  });
});
