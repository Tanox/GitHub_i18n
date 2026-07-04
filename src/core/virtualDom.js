/**
 * 虚拟DOM模块
 * @file virtualDom.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 用于跟踪已翻译元素的状态，避免重复翻译和不必要的DOM操作
 */
import { VirtualNode } from './virtualNode.js';
import { setupVdomUnloadHandler, startVdomAutoCleanup, stopVdomAutoCleanup, cleanupVdomNodes, clearVdomNodes, destroyVdomManager } from './virtualDomCleanup.js';
import { getOrCreateVdomNode, findVdomNodeById, shouldTranslateVdom, markVdomTranslated, processVdomElements } from './virtualDomProcessor.js';

/**
 * 虚拟DOM管理器
 * 负责管理所有虚拟节点，提供查找、更新和清理功能
 */
class VirtualDomManager {
  /**
   * 构造函数
   */
  constructor() {
    this.nodes = new Map();
    this.nodeCache = new Map(); // 快速查找缓存
    this.lastCleanupTime = Date.now();
    this.cleanupInterval = 30000; // 30秒清理一次，提高清理频率
    this.maxNodes = 5000; // 最大节点数限制
    this.cleanupTimer = null;
    this.unloadHandler = null; // 保存卸载处理器引用，便于 cleanup 移除
    this.isPageUnloading = false;

    // 设置页面卸载处理
    setupVdomUnloadHandler(this);

    // 自动清理定时器
    startVdomAutoCleanup(this);
  }

  /**
   * 为元素获取或创建虚拟节点
   * @param {HTMLElement} element - DOM元素
   * @returns {VirtualNode|null} 虚拟节点
   */
  getOrCreateNode(element) {
    return getOrCreateVdomNode(this, element);
  }

  /**
   * 通过ID查找虚拟节点
   * @param {string} elementId - 元素ID
   * @returns {VirtualNode|null} 虚拟节点
   */
  findNodeById(elementId) {
    return findVdomNodeById(this, elementId);
  }

  /**
   * 检查元素是否需要翻译
   * @param {HTMLElement} element - 要检查的元素
   * @returns {boolean} 是否需要翻译
   */
  shouldTranslate(element) {
    return shouldTranslateVdom(this, element);
  }

  /**
   * 标记元素为已翻译
   * @param {HTMLElement} element - 已翻译的元素
   */
  markElementAsTranslated(element) {
    markVdomTranslated(this, element);
  }

  /**
   * 批量处理元素
   * @param {NodeList|Array} elements - 要处理的元素列表
   * @returns {Array} 需要翻译的元素列表
   */
  processElements(elements) {
    return processVdomElements(this, elements);
  }

  /**
   * 开始自动清理
   */
  startAutoCleanup() {
    startVdomAutoCleanup(this);
  }

  /**
   * 停止自动清理
   */
  stopAutoCleanup() {
    stopVdomAutoCleanup(this);
  }

  /**
   * 清理无效的虚拟节点
   * @param {boolean} force - 是否强制清理所有节点
   */
  cleanup(force = false) {
    cleanupVdomNodes(this, force);
  }

  /**
   * 清空所有虚拟节点
   */
  clear() {
    clearVdomNodes(this);
  }

  /**
   * 销毁管理器，移除所有事件监听器和定时器，防止内存泄漏
   */
  destroy() {
    destroyVdomManager(this);
  }

  /**
   * 获取统计信息
   * @returns {Object} 统计信息
   */
  getStats() {
    return {
      nodeCount: this.nodes.size,
      lastCleanupTime: this.lastCleanupTime,
    };
  }
}

// 创建单例实例
const virtualDomManager = new VirtualDomManager();

export default virtualDomManager;
export { VirtualNode, VirtualDomManager };
