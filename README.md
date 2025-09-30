# GitHub 中文翻译脚本

> 🌐 一款轻量、安全、高性能的油猴（Tampermonkey）脚本，为 GitHub 全站高频 UI 提供精准中文翻译，**不破坏任何布局**，尤其修复了菜单垂直排列等常见问题。

[![GitHub license](https://img.shields.io/github/license/sutchan/GitHub_i18n?color=blue)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/sutchan/GitHub_i18n?display_name=tag&color=green)](https://github.com/sutchan/GitHub_i18n/releases)
[![Userscript](https://img.shields.io/badge/Install-Tampermonkey-green?logo=tampermonkey)](https://github.com/sutchan/GitHub_i18n/raw/main/GitHub_zh-CN.userjs)

---

## ✨ 特性亮点

- ✅ **全站覆盖**：支持仓库、仪表盘、设置、组织、通知、Codespaces、Issues、PR 等所有页面  
- 🧱 **布局安全**：仅替换文本节点，**绝不修改 DOM 结构**，彻底避免菜单错位、按钮堆叠、垂直排列等问题  
- ⚡ **零延迟加载**：无网络请求，本地词典即时生效，页面秒级翻译  
- 🔁 **动态兼容**：完美支持 GitHub 的 SPA 路由、AJAX 内容、下拉菜单和懒加载区域  
- 📚 **完整词典**：内置 200+ 高频术语，覆盖导航、操作、设置、安全、账单等核心场景  
- 🔄 **自动更新**：安装后可自动检测并提示新版本（需 Tampermonkey 支持）
- 🚀 **性能优化**：采用 LRU 缓存策略、模块化设计和按需加载，确保流畅的用户体验
- 🎯 **精准匹配**：智能的正则表达式处理和安全转义，避免翻译错误
- 📊 **统计分析**：内置缓存统计功能，可追踪缓存命中率和性能表现

---

## 🚀 安装方法

### 前提条件
- 已安装 [Tampermonkey](https://www.tampermonkey.net/)（支持 Chrome / Edge / Firefox / Safari）

### 一键安装
点击下方链接，Tampermonkey 将自动提示安装脚本：

👉 [**安装最新版脚本**](https://github.com/sutchan/GitHub_i18n/raw/main/GitHub_zh-CN.userjs)

> 💡 安装后刷新任意 GitHub 页面（如 `https://github.com`），即可看到中文界面。

---

## 📖 支持范围（部分示例）

| 类别 | 英文原文 | 中文翻译 |
|------|--------|--------|
| 导航栏 | `Pull requests`, `Issues`, `Actions` | 拉取请求、问题、操作 |
| 仓库页 | `Commits`, `Branches`, `Releases` | 提交、分支、发布 |
| 设置页 | `SSH and GPG keys`, `Personal access tokens` | SSH 和 GPG 密钥、个人访问令牌 |
| 通知中心 | `Unread`, `Mark all as read` | 未读、全部标记为已读 |
| Codespaces | `Start`, `Stop`, `Port forwarding` | 启动、停止、端口转发 |
| 通用操作 | `Save changes`, `Delete`, `Cancel` | 保存更改、删除、取消 |

> 📝 完整词典请查看脚本源码中的 `TRANSLATION_DICT`。

---

## 🛠️ 核心技术优化

### 模块化设计
- 采用面向对象的模块化结构，将功能划分为 `utils`、`regexModule`、`translationCache` 等模块
- 提高代码可维护性和扩展性，便于后续功能更新

### 按需加载
- 按页面模块（core、dashboard、notifications、codespaces、search 等）组织翻译项
- 根据当前页面路径智能加载所需的翻译词典，减少内存占用

### 智能缓存
- 实现 LRU（最近最少使用）缓存策略，优先保留最近访问的翻译项
- 缓存正则表达式编译结果，避免重复创建开销
- 添加缓存统计功能，追踪缓存命中率和性能表现
- 支持缓存过期清理，自动移除长时间未使用的缓存项

### 正则表达式优化
- 预编译常用正则表达式，提高匹配效率
- 增强安全转义和错误处理机制，避免正则表达式注入风险
- 支持多种标志和模式，满足不同场景的匹配需求

---

## ❓ 常见问题

### Q：为什么有些文字没翻译？
A：本脚本仅翻译**高频 UI 文本**，不翻译用户内容（如 Issue 标题、代码、README、评论等），以避免误翻。

### Q：菜单变成竖排 / 布局错乱了？
A：本脚本已专门修复此问题。若仍出现，请确保：
- 使用的是最新版脚本
- 未同时启用其他 GitHub 翻译插件（冲突可能导致异常）

### Q：如何关闭翻译？
A：在 Tampermonkey 面板中**禁用或删除**本脚本即可，无需重启浏览器。

### Q：如何调整性能设置？
A：可以在脚本的 `CONFIG.performance` 部分修改以下配置：
- `enableDeepObserver`: 控制是否启用深度 DOM 监听
- `enablePartialMatch`: 控制是否启用部分匹配翻译
- `enableTranslationCache`: 控制是否启用翻译缓存
- `maxCacheSize`: 设置翻译缓存的最大大小
- `regexCacheSize`: 设置正则表达式缓存的大小

---

## 🛠️ 开发与贡献

欢迎提交 Issue 或 PR！  
- 如发现**漏翻**或**误翻**，请在 [问题](https://github.com/sutchan/GitHub_i18n/issues) 中反馈  
- 如需**新增术语**，可直接修改 `TRANSLATION_DICT` 并提交 PR

> 📌 脚本文件：[`GitHub_zh-CN.userjs`](GitHub_zh-CN.userjs)

---

## 📜 许可证

本项目基于 [MIT License](LICENSE) 开源，免费用于个人及商业用途。

---

Made with ❤️ by [SutChan](https://github.com/sutchan)  
如果你觉得有用，欢迎 ⭐ Star 支持！
