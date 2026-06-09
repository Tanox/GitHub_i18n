# GitHub 中文翻译插件

让 GitHub 界面变成中文，提升使用体验！

[![GitHub license](https://img.shields.io/github/license/Tanox/GitHub_i18n?color=blue)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/Tanox/GitHub_i18n?display_name=tag&color=green)](https://github.com/Tanox/GitHub_i18n/releases)
[![Userscript](https://img.shields.io/badge/Install-Tampermonkey-green?logo=tampermonkey)](https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js)

## 功能介绍

- 🚀 **快速翻译**：本地词典，无需联网，瞬间生效
- 📦 **覆盖全面**：仓库、Issues、PR、设置、通知、Codespaces、Explore、Wiki、Actions、Projects 等页面
- 🎯 **不破坏布局**：只翻译文字内容，保持页面原有样式
- 🔄 **实时更新**：支持动态加载的内容翻译，自动检测页面变化
- ⚡ **性能优化**：智能缓存、虚拟DOM优化、批量处理，不会拖慢页面速度
- 🛠️ **配置面板**：内置配置界面，可调整翻译行为
- 📊 **性能监控**：实时查看翻译统计数据
- 🔔 **自动升级**：Tampermonkey 自动检测新版本

## 安装说明

### 1. 安装浏览器扩展

- Chrome/Edge: 安装 [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Firefox: 安装 [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- Safari: 安装 [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

### 2. 安装脚本

点击 [一键安装](https://github.com/Tanox/GitHub_i18n/raw/refs/heads/main/build/GitHub_i18n.user.js)，然后在 Tampermonkey 中点击「安装」。

### 3. 开始使用

刷新 GitHub 页面，界面就会变成中文啦！

## 使用技巧

### 快速配置

点击页面右下角的「设置」按钮，可以：
- 开启/关闭调试模式
- 启用/禁用部分匹配翻译
- 启用/禁用自动更新检查
- 启用/禁用翻译缓存
- 启用/禁用虚拟DOM优化
- 查看实时性能统计
- 导出性能数据
- 重置为默认设置

### 通过油猴菜单操作

点击浏览器工具栏的 Tampermonkey 图标，可以：
- 打开插件设置
- 立即翻译当前页面

## 常见问题

**Q：有些文字没翻译？**

A：插件只翻译 GitHub 的界面文字，不会翻译用户写的内容（比如仓库名、代码、评论等）。如果发现有漏翻的界面文字，欢迎反馈。

**Q：页面显示乱了？**

A：请使用最新版本，并避免同时使用其他翻译插件。如果还有问题，请告诉我。

**Q：怎么关闭插件？**

A：点击 Tampermonkey 图标，取消勾选「GitHub 中文翻译插件」即可。

**Q：如何帮着改进翻译？**

A：欢迎提交 Pull Request！直接修改 `src/dictionaries/` 下的词典文件就行。

## 项目结构

```
GitHub_i18n/
├── src/                  # 用户脚本源码
│   ├── core/            # 核心模块（缓存、错误处理、Trie树、虚拟DOM）
│   ├── dictionaries/    # 翻译词典（通用、Codespaces、Explore）
│   ├── page-monitor/    # 页面监控（DOM观察、路径监听、翻译触发）
│   ├── translation-core/ # 翻译核心（词典管理、元素选择器、翻译器）
│   ├── ui/              # 配置界面（浮动按钮、配置面板）
│   ├── utils/           # 工具函数
│   ├── config.js        # 配置文件
│   ├── i18n.js         # 国际化
│   ├── main.js          # 主入口
│   ├── version.js       # 版本信息
│   └── versionChecker.js # 版本检查
├── docs/                 # 文档目录
│   ├── prototype/       # 高保真原型设计（HTML）
│   ├── prototype.md     # 原型设计文档
│   ├── architecture.md # 架构文档
│   ├── development.md   # 开发指南
│   ├── coding-style.md  # 代码风格
│   ├── project.md       # 项目规范
│   └── config.yaml      # 配置
├── build/               # 构建产物（用户脚本）
├── package.json
├── build.cjs           # 构建脚本
├── eslint.config.js    # ESLint 配置
└── README.md
```

## 参与开发

如果你想参与开发：

```bash
git clone https://github.com/Tanox/GitHub_i18n.git
cd GitHub_i18n
npm install
npm run build
```

### 开发命令

```bash
npm run lint          # 代码检查
npm run format        # 代码格式化
npm run build         # 构建用户脚本
npm run validate      # 验证构建产物
```

## 许可证

[GNU General Public License v2.0](LICENSE)

---

Made with ❤️ by [Sut](https://github.com/Tanox)