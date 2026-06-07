# 项目规范

## 项目概述
GitHub 中文翻译插件是一个浏览器用户脚本，为 GitHub 提供全面的中文本地化支持。

## 目录结构
```
GitHub_i18n/
├── src/                  # 用户脚本源码
├── utils/                # 自动化工具
├── build/                # 构建产物
├── api/                  # API 配置文件
├── spec/                 # 正式规范文档
├── openspec/             # OpenSpec 工具配置
└── package.json
```

## 正式规范文档
详细的项目规范文档请参考 [spec/](../spec/) 目录：

| 文档 | 路径 | 说明 |
|------|------|------|
| 架构文档 | [spec/architecture.md](../spec/architecture.md) | 系统架构、核心模块、技术选型 |
| 开发指南 | [spec/development.md](../spec/development.md) | 分支策略、提交规范、发布流程 |
| 代码风格 | [spec/coding-style.md](../spec/coding-style.md) | 命名约定、代码格式、注释规范 |

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
- **当前版本**: 1.9.17
