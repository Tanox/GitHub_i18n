/**
 * 工具函数模块测试
 */

import { utils } from '../../src/utils/utils';

describe('utils', () => {
  describe('safeJSONParse', () => {
    it('应该正确解析有效的JSON字符串', () => {
      expect(utils.safeJSONParse('{"a": 1}')).toEqual({ a: 1 });
    });

    it('当JSON无效时应返回默认值', () => {
      expect(utils.safeJSONParse('invalid json', { default: true })).toEqual({ default: true });
    });

    it('当没有指定默认值时应返回null', () => {
      expect(utils.safeJSONParse('invalid json')).toBeNull();
    });
  });

  describe('safeJSONStringify', () => {
    it('应该正确序列化对象', () => {
      expect(utils.safeJSONStringify({ a: 1 })).toBe('{"a":1}');
    });
  });

  describe('escapeRegExp', () => {
    it('应该正确转义正则表达式特殊字符', () => {
      expect(utils.escapeRegExp('test.*+?^${}()|[]\\/')).toBe(
        'test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\\\/',
      );
    });
  });

  describe('getNestedProperty', () => {
    it('应该正确获取嵌套属性', () => {
      const obj = { a: { b: { c: 'test' } } };
      expect(utils.getNestedProperty(obj, 'a.b.c')).toBe('test');
      expect(utils.getNestedProperty(obj, ['a', 'b', 'c'])).toBe('test');
    });

    it('当路径不存在时应返回默认值', () => {
      const obj = { a: { b: {} } };
      expect(utils.getNestedProperty(obj, 'a.b.c.d', 'default')).toBe('default');
    });
  });

  describe('deepClone', () => {
    it('应该正确深拷贝对象', () => {
      const obj = { a: 1, b: { c: [1, 2, 3] }, date: new Date() };
      const cloned = utils.deepClone(obj);
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });
  });
});
