# GitHub 中文翻译插件架构文档

## 1. 系统整体架构概述

### 1.1 项目简介
GitHub 中文翻译插件是一个浏览器用户脚本，旨在为 GitHub 提供全面的中文本地化支持。该项目采用模块化设计，使用现代 JavaScript 技术栈，提供高性能、可扩展的 GitHub 界面翻译功能。

### 1.2 架构特点
- **模块化设计**：将功能分解为独立模块，便于维护和扩展
- **事件驱动**：采用观察者模式实现模块间通信
- **高性能优化**：使用 Trie 树、LRU 缓存、虚拟 DOM 等技术提升性能
- **智能预检查**：无匹配翻译时不修改 DOM，减少不必要操作
- **质量保障**：完善的测试覆盖和代码规范检查

### 1.3 整体架构图
```
┌─────────────────────────────────────────────────────────────┐
│                        用户脚本主入口 (main.js)              │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│   翻译核心模块    │ │   页面监控模块  │ │   配置界面     │
│ (translationCore) │ │  (pageMonitor)  │ │  (configUI)    │
└────────┬───────────┘ └────────┬───────────┘ └──────────────────┘
         │                     │
         │                     │
┌────────▼───────────┐ ┌───▼───────────┐
│   翻译词典模块      │ │   页面监控子模块│
│   (dictionaries)   │ │  (page-monitor/*)│
└─────────────────────┘ └─────────────────┘
         │
         │
┌────────▼───────────┐
│   国际化框架        │
│   (i18n)           │
└─────────────────────┘
         │
         │
┌────────▼───────────┐
│   核心工具模块      │
│   (core/*, utils/*)│
└─────────────────────┘
```

---

## 2. 核心模块说明

### 2.1 翻译核心模块 (translationCore)

#### 2.1.1 模块职责
- 协调翻译过程的核心控制模块，负责整合各子模块的初始化、翻译执行和性能监控。
- 核心特性：预检查翻译匹配，无匹配时不修改 DOM。

#### 2.1.2 子模块组成
- **dictionaryManager.js**：管理翻译词典的加载、查询和更新
- **elementSelector.js**：选择需要翻译的 DOM 元素
- **elementTranslator.js**：执行元素翻译的核心实现
  - 预检查翻译匹配优化
  - 无匹配时返回 false，不修改 DOM
- **partialTranslator.js**：使用 Trie 树进行部分匹配翻译
- **pageModeDetector.js**：检测当前页面的模式
- **performanceMonitor.js**：监控翻译性能数据
- **index.js**：翻译核心主入口

#### 2.1.3 核心功能
```javascript
// 主要接口：
- init()              // 初始化翻译核心
- translate()         // 执行翻译
- processElementsInBatches() // 批量处理元素
- translateCriticalElementsOnly() // 仅翻译关键元素
- cleanCache()       // 清理缓存
- clearCache()       // 清除所有缓存
- getPerformanceStats() // 获取性能统计数据
- exportPerformanceData() // 导出性能数据
```

### 2.2 页面监控模块 (page-monitor)

#### 2.2.1 模块职责
- 监控页面变化，包括 URL 路径变化和 DOM 变化，触发翻译更新。

#### 2.2.2 子模块组成
- **domObserver.js**：观察 DOM 变化并触发翻译
- **pathListener.js**：监听 URL 路径变化
- **translationTrigger.js**：管理翻译触发和节流
- **pageAnalyzer.js**：分析页面类型和关键区域
- **cacheManager.js**：管理页面监控中的缓存
- **index.js**：页面监控主入口

#### 2.2.3 核心功能
```javascript
// 主要接口：
- init()              // 初始化页面监控
- stop()              // 停止监控
- translateWithThrottle() // 带节流的翻译触发
- restart()           // 重启监控
```

### 2.3 翻译词典模块 (dictionaries)

#### 2.3.1 模块职责
- 提供翻译词典的组织、管理和合并。

#### 2.3.2 词典组成
- **index.js**：词典合并主模块
- **common.js**：通用翻译词典
- **codespaces.js**：GitHub Codespaces 相关词典
- **explore.js**：GitHub Explore 页面词典

#### 2.3.3 核心功能
```javascript
// 主要接口：
- 加载和合并词典
- 提供翻译词条查询
```

### 2.4 UI 模块 (ui)

#### 2.4.1 模块职责
- 提供配置界面和用户交互功能

#### 2.4.2 组件组成
- **configUI.js**：配置界面主模块
  - 浮动设置按钮 (右下角固定)
  - 配置面板 (响应式设计)
  - 性能监控面板
  - 关于信息面板

#### 2.4.3 配置面板功能
```
┌─────────────────────────────────────────────────────────────┐
│  🔧 基本设置   ⚡ 性能设置   🔄 更新设置   📊 性能监控   ℹ️ 关于  │
└─────────────────────────────────────────────────────────────┘
```

### 2.5 核心工具模块 (core)

#### 2.5.1 模块职责
- 提供核心工具类和优化功能

#### 2.5.2 组件组成
- **cacheManager.js**：LRU 缓存管理器
- **errorHandler.js**：统一错误处理
- **trie.js**：Trie 树数据结构
- **virtualDom.js**：虚拟 DOM 优化

### 2.6 主入口 (main.js)

#### 2.6.1 模块职责
- 整合所有模块，初始化脚本，处理资源清理。

#### 2.6.2 核心功能
```javascript
// 主要接口：
- init()              // 初始化脚本
- startScript()       // 启动脚本
- cleanup()           // 资源清理
```

---

## 3. 数据流和交互流程

### 3.1 初始化流程
```
1. 脚本加载
   ↓
2. DOMContentLoaded 事件触发
   ↓
3. main.js 初始化
   ├─ 检查版本更新
   ├─ 初始化翻译核心 (translationCore.init())
   │  ├─ 初始化词典管理器
   │  ├─ 设置页面卸载处理器
   │  ├─ 启动缓存清理定时器
   │  └─ 预热缓存
   ├─ 执行页面翻译 (translationCore.translate())
   ├─ 初始化页面监控 (pageMonitor.init())
   │  ├─ 初始化路径监听器
   │  ├─ 初始化 DOM 观察器
   │  └─ 启动缓存清理定时器
   └─ 初始化配置界面 (configUI.init())
      ├─ 合并用户配置
      ├─ 注册菜单命令
      └─ 创建浮动按钮
   ↓
4. 脚本运行中
```

### 3.2 翻译流程
```
1. 翻译触发 (页面加载/DOM变化/URL变化)
   ↓
2. translationCore.translate()
   ├─ 检测页面模式 (pageModeDetector)
   ├─ 获取需要翻译的元素
   │  └─ elementSelector.getElementsToTranslate()
   ├─ 批量处理元素
   │  └─ processElementsInBatches()
   │     ├─ 虚拟 DOM 优化
   │     └─ 逐元素翻译
   │        └─ elementTranslator.translateElement()
   │           ├─ 预检查翻译匹配 ⭐
   │           ├─ 无匹配? 直接返回 false, 不修改 DOM ⭐
   │           ├─ 有匹配? 继续翻译
   │           ├─ 词典查询
   │           ├─ 缓存查找
   │           └─ DOM 更新
   └─ 记录性能数据
   ↓
3. 翻译完成
```

### 3.3 页面监控流程
```
1. 页面监控初始化
   ├─ pathListener 监听 URL 变化
   └─ domObserver 监听 DOM 变化
   ↓
2. 变化检测到变化
   ↓
3. translationTrigger.translateWithThrottle()
   └─ 节流控制
   └─ 触发翻译
```

### 3.4 模块间交互
```
main.js
├── translationCore
│   ├── dictionaryManager
│   ├── elementSelector
│   ├── elementTranslator (⭐ 预检查优化)
│   ├── pageModeDetector
│   └── performanceMonitor
├── pageMonitor
│   ├── pathListener
│   ├── domObserver
│   ├── translationTrigger
│   ├── pageAnalyzer
│   └── cacheManager
├── configUI (ui/)
└── i18n
└── dictionaries
└── core (cache, trie, virtualDom, etc)
```

---

## 4. 技术选型说明

### 4.1 核心技术栈

#### 4.1.1 JavaScript (ES6+)
- **理由**：
  - 浏览器原生支持，无需额外编译
  - 现代语法特性提高开发效率
  - 广泛的生态系统支持

#### 4.1.2 ES Modules
- **理由**：
  - 原生模块化支持
  - 提高代码可维护性
  - 更好的代码组织方式

### 4.2 开发工具

#### 4.2.1 Jest
- **用途**：单元测试框架
- **理由**：
  - 简单易用的 API
  - 内置 Mock 支持
  - 完善的测试报告
  - 支持 JSDOM 环境
  - 与 Babel 集成

#### 4.2.2 ESLint
- **用途**：代码规范检查
- **理由**：
  - 自定义规则配置
  - 自动修复功能
  - 插件生态丰富
  - 与 Prettier 集成

#### 4.2.3 Prettier
- **用途**：代码格式化
- **理由**：
  - 自动化格式化
  - 配置简单
  - 与编辑器集成
  - 统一代码风格

### 4.3 性能优化技术

#### 4.3.1 Trie 树
- **用途**：高效的字符串匹配
- **应用**：partialTranslator.js 中用于部分匹配翻译

#### 4.3.2 LRU 缓存策略
- **用途**：减少重复翻译计算
- **应用**：core/cacheManager.js 中缓存翻译结果

#### 4.3.3 虚拟 DOM 优化
- **用途**：减少真实 DOM 操作
- **应用**：core/virtualDom.js 中优化元素处理

#### 4.3.4 智能节流机制
- **用途**：避免过度翻译
- **应用**：page-monitor/translationTrigger.js 中控制翻译触发频率

#### 4.3.5 批量处理
- **用途**：优化大数据量场景
- **应用**：processElementsInBatches() 中实现

#### 4.3.6 预检查翻译匹配 ⭐
- **用途**：避免对无匹配内容进行不必要的 DOM 操作
- **应用**：elementTranslator.translateElement() 中实现
- **工作原理**：
  - 遍历子节点时，先查询词典匹配
  - 记录是否存在可翻译内容
  - 如无匹配，直接返回 false，不修改 DOM

---

## 5. 目录结构

```
GitHub_i18n/
├── src/                          # 用户脚本源码
│   ├── core/                    # 核心工具模块
│   │   ├── cacheManager.js
│   │   ├── errorHandler.js
│   │   ├── trie.js
│   │   └── virtualDom.js
│   ├── dictionaries/            # 翻译词典模块
│   │   ├── index.js
│   │   ├── common.js
│   │   ├── codespaces.js
│   │   └── explore.js
│   ├── page-monitor/           # 页面监控模块
│   │   ├── index.js
│   │   ├── cacheManager.js
│   │   ├── domObserver.js
│   │   ├── pageAnalyzer.js
│   │   ├── pathListener.js
│   │   └── translationTrigger.js
│   ├── translation-core/       # 翻译核心模块
│   │   ├── index.js
│   │   ├── dictionaryManager.js
│   │   ├── elementSelector.js
│   │   ├── elementTranslator.js ⭐
│   │   ├── pageModeDetector.js
│   │   ├── partialTranslator.js
│   │   └── performanceMonitor.js
│   ├── ui/                     # UI 模块
│   │   └── configUI.js
│   ├── utils/                   # 工具模块
│   │   ├── tools.js
│   │   └── utils.js
│   ├── config.js
│   ├── i18n.js
│   ├── main.js
│   ├── version.js
│   └── versionChecker.js
├── docs/                        # 文档目录
│   ├── prototype.md            # 原型设计文档
│   ├── architecture.md
│   ├── development.md
│   └── coding-style.md
├── build/                       # 用户脚本构建产物
├── openspec/                    # OpenSpec 规范
│   ├── project.md
│   ├── architecture.md
│   ├── development.md
│   ├── coding-style.md
│   ├── config.yaml
│   └── README.md
├── build.cjs
├── jest.config.js
├── eslint.config.js
├── package.json
└── README.md
```

---

## 6. 开发规范

### 6.1 编码规范
- 使用 ES6+ 语法
- 函数级注释说明功能、参数和返回值
- 遵循 ESLint 规则
- Prettier 代码格式化

### 6.2 测试规范
- 单元测试覆盖核心功能
- 测试文件与源码文件对应
- 使用 Jest 测试框架

### 6.3 Git 提交规范
- 提交前自动运行 lint 和测试
- 使用语义化版本管理

---

## 7. 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.9.20 | 2026-06-09 | ⭐ 创建原型设计文档，完善代码架构和文档组织 |
| 1.9.19 | 2026-06-08 | 优化翻译逻辑：无匹配时不修改 DOM，更新架构文档 |
| 1.9.18 | 2026-06-07 | 版本更新和 bug 修复 |
| 1.9.17 | 2026-05-22 | 之前版本 |
| 1.9.16 | 2026-05-22 | 之前版本 |
