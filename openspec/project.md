# 项目规范

## 项目概述

GitHub_i18n 是一个浏览器用户脚本项目，为 GitHub 网站提供中文本地化翻译支持。

### 核心功能
- **静态文本翻译**：将 GitHub 界面的英文文本翻译为中文
- **动态内容监控**：监听 DOM 变化，自动翻译新增内容
- **多模式支持**：支持 Issue、PR、Code 等不同页面的智能翻译
- **性能优化**：采用 Trie 树和 LRU 缓存提升翻译效率
- **预检查优化**：无匹配翻译时不修改 DOM，减少不必要操作

### 技术栈
- **用户脚本引擎**：Tampermonkey / Greasemonkey
- **核心语言**：JavaScript (ES6+)
- **模块系统**：ES Modules
- **构建工具**：Node.js 自定义构建脚本
- **代码规范**：ESLint + Prettier

---

## 目录结构

```
GitHub_i18n/
├── src/                          # 用户脚本源码（核心代码）
│   ├── core/                     # 核心工具模块
│   │   ├── cacheManager.js       # LRU 缓存管理器
│   │   ├── errorHandler.js       # 统一错误处理
│   │   └── virtualDom.js         # 虚拟 DOM 优化
│   ├── dictionaries/             # 翻译词典目录
│   │   ├── codespaces.js         # Codespaces 相关翻译
│   │   ├── common.js             # 通用词汇翻译
│   │   ├── explore.js            # Explore 页面翻译
│   │   └── index.js              # 词典导出入口
│   ├── page-monitor/             # 页面监控模块
│   │   ├── cacheManager.js       # 页面级缓存管理
│   │   ├── domObserver.js        # DOM 变化观察器
│   │   ├── domObserver.utils.js  # DOM 工具函数
│   │   ├── index.js              # 页面监控入口
│   │   ├── pageAnalyzer.js       # 页面分析器
│   │   ├── pathListener.js       # 路由变化监听
│   │   └── translationTrigger.js # 翻译触发器
│   ├── translation-core/         # 翻译核心模块
│   │   ├── dictionaryManager.js  # 词典管理器
│   │   ├── elementSelector.js    # 元素选择器
│   │   ├── elementTranslator.js  # 元素翻译器
│   │   ├── index.js              # 翻译核心入口
│   │   ├── pageModeDetector.js   # 页面模式检测
│   │   ├── partialTranslator.js  # 部分翻译器
│   │   └── performanceMonitor.js # 性能监控
│   ├── ui/                       # 用户界面模块
│   │   ├── components/           # UI 组件
│   │   │   └── performanceMonitor.js # 性能监控 UI
│   │   ├── styles/               # UI 样式
│   │   │   └── configUI.styles.js    # 配置界面样式
│   │   └── configUI.js           # 配置界面入口
│   ├── utils/                    # 通用工具
│   │   ├── tools.js              # 工具函数集合
│   │   └── utils.js              # 基础工具函数
│   ├── config.js                 # 全局配置
│   ├── main.js                   # 主入口脚本
│   ├── version.js                # 版本信息（单一版本源）
│   └── versionChecker.js         # 版本检查器
├── prototype/                    # 设计系统与高保真原型
│   ├── assets/                   # 共享资源
│   ├── design-system/            # 设计系统规范
│   ├── components/               # 组件库规范
│   ├── interaction/              # 交互标准
│   ├── prototypes/               # 高保真原型
│   └── index.html                # 原型入口
├── build/                        # 构建产物目录
│   └── GitHub_i18n.user.js       # 编译后的用户脚本
├── openspec/                     # 项目规范文档
│   ├── project.md                # 项目规范（本文档）
│   ├── architecture.md           # 架构文档
│   ├── development.md            # 开发指南
│   ├── coding-style.md           # 代码风格
│   ├── prototype.md              # 原型设计
│   ├── config.yaml               # OpenSpec 配置
│   └── README.md                 # 规范文档索引
├── collect-dict.cjs              # 词典收集脚本
├── package.json                  # NPM 包配置
├── build.cjs                     # 构建脚本
├── eslint.config.js              # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── CONTRIBUTING.md               # 贡献指南
├── CHANGELOG.md                  # 变更日志
├── README.md                     # 项目说明
└── .gitignore                    # Git 忽略配置
```

---

## 核心模块说明

### 1. page-monitor（页面监控）
负责监听 GitHub 页面变化，检测新内容并触发翻译。
- `domObserver.js`：使用 MutationObserver 监听 DOM 变化
- `pathListener.js`：监听路由变化，检测页面切换
- `pageAnalyzer.js`：分析页面类型，确定翻译策略
- `translationTrigger.js`：管理翻译触发和节流

### 2. translation-core（翻译核心）
执行实际翻译工作的核心引擎。
- `elementTranslator.js`：翻译单个 DOM 元素的文本内容
  - 预检查翻译匹配优化
  - 无匹配时返回 false，不修改 DOM
- `dictionaryManager.js`：管理多个翻译词典的加载和查询
- `pageModeDetector.js`：检测当前页面模式（Issue/PR/Code 等）
- `performanceMonitor.js`：监控翻译性能数据

### 3. core（核心工具）
提供基础设施支持。
- `cacheManager.js`：LRU 缓存，减少重复翻译
- `errorHandler.js`：统一错误处理和日志记录
- `virtualDom.js`：虚拟 DOM 优化

### 4. ui（用户界面）
提供用户配置界面和状态展示。
- `configUI.js`：设置面板，支持用户自定义词典和选项
  - 浮动设置按钮（右下角固定）
  - 配置面板（深色主题，响应式设计）
  - 性能监控面板
- `performanceMonitor.js`：显示翻译性能统计

### 5. dictionaries（翻译词典）
提供翻译词条数据。
- `common.js`：通用翻译词典
- `codespaces.js`：GitHub Codespaces 相关词典
- `explore.js`：GitHub Explore 页面词典

---

## 开发规范

### 分支策略
- `main`：稳定发布分支
- `feature/*`：功能分支
- `fix/*`：Bug 修复分支
- `refactor/*`：重构分支
- `docs/*`：文档更新分支
- `trae/solo-agent-*`：自动化 Agent 工作分支

### 提交规范
遵循 Conventional Commits 规范：
```
<type>(<scope>): <description>

feat(core): 添加新的翻译词典查询优化
fix(ui): 修复配置界面样式问题
docs: 更新项目文档
```

### 版本号管理
- **版本号格式**：SemVer（主版本.次版本.修订号）
- **当前版本**：1.9.20（定义于 `src/version.js`）
- **单一版本源**：`src/version.js` 是项目的唯一版本源
- **更新时机**：
  - 修订号：文档完善、代码注释更新、Bug 修复
  - 次版本：新功能添加
  - 主版本：破坏性变更

### 代码质量
- ESLint 代码检查
- Prettier 格式化
- 复杂度限制：函数不超过 20
- 函数行数限制：单函数不超过 100 行
- 参数数量限制：单函数不超过 4 个参数

---

## 构建与发布

### 构建命令
```bash
npm run build      # 构建用户脚本
npm run validate   # 验证构建产物
npm run lint       # 代码检查
npm run format     # 代码格式化
npm test           # 完整测试流水线（lint → build → validate）
```

### 发布流程
1. 在 `src/version.js` 更新版本号
2. 运行 `npm test` 验证构建
3. 创建 Git Tag：`git tag v1.9.20`
4. 推送 Tag 触发 CI/CD 发布流程

---

## 项目信息

| 属性 | 值 |
|------|------|
| **项目名称** | GitHub_i18n |
| **项目 URL** | https://github.com/Tanox/GitHub_i18n |
| **当前版本** | 1.9.20 |
| **核心语言** | JavaScript (ES6+) |
| **模块系统** | ES Modules |
| **目标平台** | 浏览器用户脚本 |
| **默认署名** | Sut |
| **许可证** | GPL-2.0 |

---

## 规范文档索引

| 文档 | 说明 |
|------|------|
| [architecture.md](./architecture.md) | 系统架构设计、模块关系、技术选型 |
| [development.md](./development.md) | 开发流程、分支策略、发布规范 |
| [coding-style.md](./coding-style.md) | 命名规范、代码格式、注释要求 |
| [prototype.md](./prototype.md) | 原型设计、UI 规范、流程图 |
| [config.yaml](./config.yaml) | OpenSpec 配置、项目上下文 |
| [README.md](./README.md) | 规范文档索引 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 贡献指南 |
