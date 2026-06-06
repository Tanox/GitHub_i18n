/**
 * Trie树数据结构模块测试
 */

import { Trie, TrieNode } from '../core/trie';

describe('Trie', () => {
  let trie;

  beforeEach(() => {
    trie = new Trie();
  });

  describe('TrieNode', () => {
    it('应该正确初始化TrieNode', () => {
      const node = new TrieNode();
      expect(node.children).toBeInstanceOf(Map);
      expect(node.isEndOfWord).toBe(false);
      expect(node.value).toBeNull();
      expect(node.length).toBe(0);
    });
  });

  describe('constructor', () => {
    it('应该正确初始化Trie', () => {
      expect(trie.root).toBeInstanceOf(TrieNode);
      expect(trie.size).toBe(0);
    });
  });

  describe('insert', () => {
    it('应该正确插入单个单词', () => {
      trie.insert('hello', '你好');
      expect(trie.size).toBe(1);
    });

    it('应该正确插入多个单词', () => {
      trie.insert('hello', '你好');
      trie.insert('world', '世界');
      expect(trie.size).toBe(2);
    });

    it('不应该插入空字符串', () => {
      trie.insert('', '空');
      expect(trie.size).toBe(0);
    });

    it('不应该插入非字符串值', () => {
      trie.insert(null, '空');
      trie.insert(undefined, '未定义');
      trie.insert(123, '数字');
      expect(trie.size).toBe(0);
    });

    it('应该正确处理相同前缀的单词', () => {
      trie.insert('app', '应用');
      trie.insert('apple', '苹果');
      expect(trie.size).toBe(2);
    });
  });

  describe('findAllMatches', () => {
    beforeEach(() => {
      trie.clear();
      trie.insert('hello', '你好');
      trie.insert('world', '世界');
    });

    it('应该正确找到所有匹配', () => {
      trie.insert('hi', '嗨');
      const matches = trie.findAllMatches('hello world hi');
      expect(matches.length).toBe(3);
    });

    it('应该返回正确的匹配信息', () => {
      const matches = trie.findAllMatches('hello');
      expect(matches[0].key).toBe('hello');
      expect(matches[0].value).toBe('你好');
      expect(matches[0].start).toBe(0);
      expect(matches[0].end).toBe(4);
      expect(matches[0].length).toBe(5);
    });

    it('应该正确处理最小长度限制', () => {
      trie.insert('a', '一');
      trie.insert('ab', '二');
      const matches = trie.findAllMatches('a ab', 2);
      expect(matches.length).toBe(1);
      expect(matches[0].key).toBe('ab');
    });

    it('应该在空文本时返回空数组', () => {
      const matches = trie.findAllMatches('');
      expect(matches).toEqual([]);
    });

    it('应该在无匹配时返回空数组', () => {
      const matches = trie.findAllMatches('nothing matches here');
      expect(matches).toEqual([]);
    });

    it('应该正确找到重叠的匹配', () => {
      trie.insert('app', '应用');
      trie.insert('apple', '苹果');
      const matches = trie.findAllMatches('apple');
      expect(matches.length).toBe(2);
    });
  });

  describe('clear', () => {
    it('应该清空Trie', () => {
      trie.insert('hello', '你好');
      trie.clear();
      expect(trie.size).toBe(0);
      expect(trie.findAllMatches('hello').length).toBe(0);
    });
  });

  describe('getSize', () => {
    it('应该返回正确的大小', () => {
      expect(trie.getSize()).toBe(0);
      trie.insert('hello', '你好');
      expect(trie.getSize()).toBe(1);
      trie.insert('world', '世界');
      expect(trie.getSize()).toBe(2);
    });
  });
});
