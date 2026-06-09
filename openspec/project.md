# 项目规范

## 项目概述
GitHub 中文翻译插件是一个浏览器用户脚本，为 GitHub 提供全面的中文本地化支持。

## 目录结构
```
GitHub_i18n/
├── src/                  # 用户脚本源码
│   ├── core/            # 核心模块 (cache, trie, virtualDom等)
│   ├── dictionaries/    # 翻译词典模块
│   ├── page-monitor/    # 页面监控模块
│   ├── translation-core/# 翻译核心模块
│   ├── ui/              # UI 模块 (configUI)
│   ├── utils/           # 工具模块
│   ├── config.js        # 配置文件
│   ├── i18n.js          # 国际化
│   ├── main.js          # 主入口
│   ├── version.js       # 版本信息
│   └── versionChecker.js # 版本检查
├── docs/                # 文档目录
│   ├── prototype.md     # 原型设计文档
│   ├── architecture.md
│   ├── development.md
│   ├── coding-style.md
│   ├── config.yaml
│   └── ...
├── build/               # 构建产物
├── openspec/            # OpenSpec 工具配置
├── package.json
└── build.cjs           # 构建脚本
```

## 正式规范文档
详细的项目规范文档请参考 [docs/](../docs/) 目录和 [openspec/](./) 目录：

| 文档 | 路径 | 说明 |
|------|------|------|
| 原型设计 | [docs/prototype.md](../docs/prototype.md) | 脚本原型图、UI设计、流程图等 |
| 架构文档 | [openspec/architecture.md](./architecture.md) | 系统架构、核心模块、技术选型 |
| 开发指南 | [openspec/development.md](./development.md) | 分支策略、提交规范、发布流程 |
| 代码风格 | [openspec/coding-style.md](./coding-style.md) | 命名约定、代码格式、注释规范 |
| 项目规范 | [openspec/project.md](./project.md) | 本文档 |

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
- **最后更新**: 2026-06-09
