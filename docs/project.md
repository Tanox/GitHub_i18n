# 项目规范

## 项目概述
GitHub 中文翻译插件是一个浏览器用户脚本，为 GitHub 提供全面的中文本地化支持。

## 目录结构
```
GitHub_i18n/
├── src/                  # 用户脚本源码
│   ├── core/             # 核心工具模块（缓存、Trie树、虚拟DOM）
│   ├── dictionaries/     # 翻译词典模块
│   ├── page-monitor/     # 页面监控模块
│   ├── translation-core/ # 翻译核心模块
│   ├── ui/               # UI 界面模块
│   ├── utils/            # 工具函数
│   ├── config.js         # 配置管理
│   ├── i18n.js           # 国际化框架
│   ├── main.js           # 主入口
│   └── version.js        # 版本管理
├── build/                # 构建产物
├── docs/                 # 项目文档（规范、架构、开发指南等）
├── openspec/             # OpenSpec 工具配置和规范
├── package.json          # 项目配置
├── eslint.config.js      # 代码规范配置
├── jest.config.js        # 测试配置
├── build.cjs             # 构建脚本
└── CHANGELOG.md          # 版本变更记录
```

## 正式规范文档
详细的项目规范文档请参考 [docs/](./) 目录：

| 文档 | 路径 | 说明 |
|------|------|------|
| 项目规范 | [project.md](./project.md) | 项目概述、目录结构、项目信息 |
| 架构文档 | [architecture.md](./architecture.md) | 系统架构、核心模块、技术选型 |
| 开发指南 | [development.md](./development.md) | 分支策略、提交规范、发布流程 |
| 代码风格 | [coding-style.md](./coding-style.md) | 命名约定、代码格式、注释规范 |
| 原型设计 | [prototype.md](./prototype.md) | 系统原型设计、流程图、UI 设计 |

## OpenSpec 职责
`openspec/` 目录作为 OpenSpec 工具的工作区，负责：
- OpenSpec 系统配置 ([config.yaml](./config.yaml))
- 提案管理
- 变更记录
- 项目规范索引

## 项目信息
- **项目名称**: GitHub 中文翻译插件
- **项目 URL**: https://github.com/Tanox/GitHub_i18n
- **主语言**: JavaScript
- **目标平台**: 浏览器用户脚本
- **默认署名**: Sut
- **当前版本**: 1.9.20
