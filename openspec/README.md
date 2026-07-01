# 项目规范文档索引

本目录集中管理项目规范与配置文档，用于指导开发流程与协作。

## 原型与设计系统

设计系统与高保真原型已迁移至 [prototype/](../prototype/)，它是设计与开发的唯一信息源：

| 模块 | 路径 | 说明 |
|------|------|------|
| 设计系统规范 | [prototype/design-system/](../prototype/design-system/) | 色彩、字体、间距、图标、动效 |
| 组件库规范 | [prototype/components/](../prototype/components/) | 基础组件、复合组件、业务组件 |
| 交互标准 | [prototype/interaction/](../prototype/interaction/) | 交互模式、反馈、错误处理、空状态 |
| 高保真原型 | [prototype/prototypes/](../prototype/prototypes/) | 桌面端 UI、移动端 UI |

打开 [prototype/index.html](../prototype/index.html) 浏览完整的原型与设计系统。

## 目录导航

### 项目核心文档

| 文档 | 路径 | 说明 |
|------|------|------|
| 项目规范 | [project.md](./project.md) | 项目概述、目录结构、开发规范、核心模块说明等 |
| 配置文件 | [config.yaml](./config.yaml) | OpenSpec 系统配置、项目上下文和规则定义 |
| 开发指南 | [development.md](./development.md) | 分支策略、提交规范、发布流程、测试要求等 |
| 架构文档 | [architecture.md](./architecture.md) | 系统架构、核心模块、技术选型等 |
| 代码风格 | [coding-style.md](./coding-style.md) | 命名约定、代码格式、注释规范、最佳实践等 |
| 原型设计 | [prototype.md](./prototype.md) | 脚本原型图、UI 设计、流程图 |

### 规范文档说明

- **openspec/project.md**
  - 包含完整的项目概述
  - 目录结构文档
  - 核心模块详细说明
  - 开发规范和版本管理规则
  - 构建与发布流程
  - 项目信息

- **openspec/config.yaml**
  - OpenSpec 驱动架构配置
  - 项目上下文信息（技术栈、领域、版本等）
  - 提案和代码规则定义
  - 规范目录配置

- **openspec/architecture.md**
  - 系统整体架构概述
  - 核心模块详细说明
  - 数据流和交互流程
  - 技术选型说明
  - 版本历史

- **openspec/development.md**
  - 分支策略
  - 语义化提交规范
  - 版本发布流程
  - CI/CD 流程
  - 代码质量要求

- **openspec/coding-style.md**
  - 文件和目录命名规范
  - 变量和函数命名规范
  - 代码风格（Prettier/ESLint）
  - 注释规范（JSDoc）
  - 最佳实践

### 与文档相关的变更

- 旧 `docs/prototype/prototype.html` 已被 `prototype/` 替代并移除
- 所有新增的设计 / 交互规范请直接在 `prototype/` 下维护
- 版本号单一来源：`src/version.js`
