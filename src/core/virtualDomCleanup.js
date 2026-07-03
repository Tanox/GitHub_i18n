/**
 * 虚拟DOM清理模块
 * @file virtualDomCleanup.js
 * @version 1.9.21
 * @date 2026-07-03
 * @author Sut
 * @description 提供虚拟DOM管理器的清理、定时器和页面卸载处理功能
 */
import { CONFIG } from '../config.js';

/**
 * 设置页面卸载处理器
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function setupVdomUnloadHandler(manager) {
  // 保存卸载处理器引用，便于后续 removeEventListener
  manager.unloadHandler = () => {
    manager.isPageUnloading = true;
    manager.cleanup();
  };

  // 监听多种卸载事件以确保兼容性
  window.addEventListener('beforeunload', manager.unloadHandler);
  window.addEventListener('unload', manager.unloadHandler);
  window.addEventListener('pagehide', manager.unloadHandler);
}

/**
 * 开始自动清理
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function startVdomAutoCleanup(manager) {
  stopVdomAutoCleanup(manager);
  manager.cleanupTimer = setInterval(() => {
    // 如果页面正在卸载，停止清理
    if (manager.isPageUnloading) {
      stopVdomAutoCleanup(manager);
      return;
    }

    manager.cleanup();
  }, manager.cleanupInterval);
}

/**
 * 停止自动清理
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function stopVdomAutoCleanup(manager) {
  if (manager.cleanupTimer) {
    clearInterval(manager.cleanupTimer);
    manager.cleanupTimer = null;
  }
}

/**
 * 清理无效的虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 * @param {boolean} force - 是否强制清理所有节点
 */
function cleanupVdomNodes(manager, force = false) {
  try {
    const now = Date.now();

    // 如果不是强制清理且距离上次清理时间不足，则跳过
    if (!force && now - manager.lastCleanupTime < manager.cleanupInterval) {
      return;
    }

    manager.lastCleanupTime = now;
    let removedCount = 0;

    // 如果页面正在卸载或强制清理，删除所有节点
    if (force || manager.isPageUnloading) {
      removedCount = manager.nodes.size;
      manager.nodes.clear();
      manager.nodeCache.clear();

      if (CONFIG.debugMode) {
        console.log(`[GitHub 中文翻译] 强制清理了${removedCount}个虚拟节点`);
      }
      return;
    }

    // 正常清理：删除DOM中不存在的节点或长时间未更新的节点
    const nodesToRemove = [];

    for (const [id, node] of manager.nodes) {
      // 检查节点是否仍在DOM中
      if (!document.contains(node.element)) {
        nodesToRemove.push(id);
        continue;
      }

      // 检查节点是否长时间未更新
      const timeSinceUpdate = now - node.lastUpdated;
      const maxAge = 60 * 60 * 1000; // 1小时

      if (timeSinceUpdate > maxAge) {
        nodesToRemove.push(id);
      }
    }

    // 删除需要清理的节点
    for (const id of nodesToRemove) {
      manager.nodes.delete(id);
      manager.nodeCache.delete(id);
      removedCount++;
    }

    if (CONFIG.debugMode && removedCount > 0) {
      console.log(
        `[GitHub 中文翻译] 清理了${removedCount}个无效虚拟节点，当前节点数：${manager.nodes.size}`,
      );
    }
  } catch (error) {
    if (CONFIG.debugMode) {
      console.error('[GitHub 中文翻译] 清理虚拟节点失败:', error);
    }
  }
}

/**
 * 清空所有虚拟节点
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function clearVdomNodes(manager) {
  manager.nodes.clear();
  manager.nodeCache.clear();
  manager.lastCleanupTime = Date.now();
}

/**
 * 销毁管理器，移除所有事件监听器和定时器，防止内存泄漏
 * @param {Object} manager - 虚拟DOM管理器实例
 */
function destroyVdomManager(manager) {
  stopVdomAutoCleanup(manager);
  if (manager.unloadHandler) {
    window.removeEventListener('beforeunload', manager.unloadHandler);
    window.removeEventListener('unload', manager.unloadHandler);
    window.removeEventListener('pagehide', manager.unloadHandler);
    manager.unloadHandler = null;
  }
  manager.clear();
}

export {
  setupVdomUnloadHandler,
  startVdomAutoCleanup,
  stopVdomAutoCleanup,
  cleanupVdomNodes,
  clearVdomNodes,
  destroyVdomManager,
};
