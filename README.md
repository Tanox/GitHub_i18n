# GitHub 中文翻译插件

让 GitHub 界面变成中文，提升使用体验！

[![GitHub license](https://img.shields.io/github/license/Tanox/GitHub_i18n?color=blue)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/Tanox/GitHub_i18n?display_name=tag&color=green)](https://github.com/Tanox/GitHub_i18n/releases)
[![Userscript](https://img.shields.io/badge/Install-Tampermonkey-green?logo=tampermonkey)](https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js)

## 功能特点

- ✅ **全站翻译**：仓库、仪表盘、设置、通知、Codespaces、Explore 等页面都能翻译
- ✅ **布局稳定**：只翻译文字，不会破坏页面布局
- ✅ **快速响应**：本地词典，无需联网，瞬间生效
- ✅ **动态适配**：支持页面跳转、加载更多、下拉菜单等动态内容
- ✅ **自动更新**：Tampermonkey 会自动检测并更新新版本
- ✅ **性能友好**：智能优化，不会拖慢页面速度

## 安装使用

### 第一步：安装 Tampermonkey

首先需要在浏览器中安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展程序，支持 Chrome、Edge、Firefox 等主流浏览器。

### 第二步：安装脚本

点击 [一键安装](https://github.com/Tanox/GitHub_i18n/raw/refs/heads/main/build/GitHub_i18n.user.js)，Tampermonkey 会自动弹出安装确认页面，点击「安装」即可。

### 第三步：开始使用

刷新 GitHub 页面，你会看到界面已经变成中文了！

## 常见问题

**Q：有些文字没翻译？**

A：本插件主要翻译界面文字，不会翻译用户内容（如仓库标题、代码、评论等）。如果有漏翻的界面文字，欢迎反馈。

**Q：页面布局乱了？**

A：请确保使用最新版本，并避免同时启用其他翻译插件。如果还有问题，请提交 Issue。

**Q：如何关闭插件？**

A：点击浏览器工具栏的 Tampermonkey 图标，在菜单中取消勾选「GitHub 中文翻译插件」即可。

**Q：如何贡献翻译？**

A：欢迎提交 PR！直接修改 `src/dictionaries/` 目录下的词典文件即可。

## 项目说明

这是一个开源项目，使用以下技术构建：

- 翻译数据存储在 `src/dictionaries/` 目录
- 核心代码位于 `src/` 目录
- 构建产物在 `build/GitHub_i18n.user.js`

### 开发指南

如果你想参与开发：

```bash
# 克隆项目
git clone https://github.com/Tanox/GitHub_i18n.git
cd GitHub_i18n

# 安装依赖
npm install

# 构建脚本
npm run build

# 运行测试
npm run test

# 代码检查
npm run lint
```

更多开发细节请查看 [docs/development.md](docs/development.md)。

## 许可证

[GNU General Public License v2.0](LICENSE)

---

Made with ❤️ by [Sut](https://github.com/Tanox)
