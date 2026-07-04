/**
 * 虚拟DOM处理器模块
 * @file virtualDomProcessor.js
 * @version 1.9.22
 * @date 2026-07-04
 * @author Sut
 * @description 提供虚拟DOM节点的创建、查找、翻译状态检查和批量处理功能
 */
import { CONFIG } from '../config.js';
import { VirtualNode } from './virtualNode.js';

/**
 * 为元素获取或创建虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - DOM元素
 * @returns {VirtualNode|null} 虚拟节点
 */
function getOrCreateVdomNode(manager, element) {
  try {
    // 检查页面是否正在卸载
    if (manager.isPageUnloading) {
      return null;
    }

    // 先尝试从缓存查找
    if (element.dataset && element.dataset.virtualDomId) {
      const cachedNode = manager.nodeCache.get(element.dataset.virtualDomId);
      if (cachedNode && cachedNode.element === element) {
        return cachedNode;
      }
    }

    // 检查节点数量限制
    if (manager.nodes.size >= manager.maxNodes) {
      // 强制清理一次
      manager.cleanup(true);

      // 如果清理后仍然超过限制，删除最旧的节点
      if (manager.nodes.size >= manager.maxNodes) {
        const nodesToRemove = Math.floor(manager.maxNodes * 0.2); // 删除20%的节点
        const entries = Array.from(manager.nodes.entries());

        // 按最后更新时间排序，删除最旧的
        entries.sort((a, b) => a[1].lastUpdated - b[1].lastUpdated);

        for (let i = 0; i < nodesToRemove; i++) {
          const [id] = entries[i];
          manager.nodes.delete(id);
          manager.nodeCache.delete(id);
        }

        if (CONFIG.debugMode) {
          console.log(`[GitHub 中文翻译] 强制清理了${nodesToRemove}个虚拟节点`);
        }
      }
    }

    // 创建新节点
    const node = new VirtualNode(element);
    manager.nodes.set(node.elementId, node);
    manager.nodeCache.set(node.elementId, node);

    return node;
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 获取或创建虚拟节点失败:', error);
    }
    return null;
  }
}

/**
 * 通过ID查找虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {string} elementId - 元素ID
 * @returns {VirtualNode|null} 虚拟节点
 */
function findVdomNodeById(manager, elementId) {
  return manager.nodes.get(elementId) || null;
}

/**
 * 检查元素是否需要翻译
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - 要检查的元素
 * @returns {boolean} 是否需要翻译
 */
function shouldTranslateVdom(manager, element) {
  try {
    const node = getOrCreateVdomNode(manager, element);

    if (!node) {
      return true; // 如果无法创建虚拟节点，默认需要翻译
    }

    // 检查内容是否变化
    const contentChanged = node.hasContentChanged();
    // 检查属性是否变化
    const attributesChanged = node.hasAttributesChanged();

    // 如果内容或属性变化，需要重新翻译
    if (contentChanged || attributesChanged) {
      node.resetTranslation();
      return true;
    }

    // 如果已经翻译过且内容没有变化，不需要再次翻译
    if (node.isTranslated) {
      return false;
    }

    // 其他情况需要翻译
    return true;
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 检查翻译状态失败:', error);
    }
    // 出错时默认需要翻译
    return true;
  }
}

/**
 * 标记元素为已翻译
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {HTMLElement} element - 已翻译的元素
 */
function markVdomTranslated(manager, element) {
  try {
    const node = getOrCreateVdomNode(manager, element);
    if (node) {
      node.markAsTranslated();
    }
  } catch (_error) {
    // 忽略错误
  }
}

/**
 * 批量处理元素
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {NodeList|Array} elements - 要处理的元素列表
 * @returns {Array} 需要翻译的元素列表
 */
function processVdomElements(manager, elements) {
  const elementsToTranslate = [];

  try {
    elements.forEach((element) => {
      if (shouldTranslateVdom(manager, element)) {
        elementsToTranslate.push(element);
      }
    });
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 批量处理元素失败:', error);
    }
    // 出错时返回原始元素列表
    elementsToTranslate.push(...elements);
  }

  return elementsToTranslate;
}

export {
  getOrCreateVdomNode,
  findVdomNodeById,
  shouldTranslateVdom,
  markVdomTranslated,
  processVdomElements,
};
