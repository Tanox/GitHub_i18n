# GitHub 中文翻译

[![GitHub stars](https://img.shields.io/github/stars/Tanox/GitHub_i18n?style=social&label=Stars)](https://github.com/Tanox/GitHub_i18n/stargazers)
[![GitHub license](https://img.shields.io/github/license/Tanox/GitHub_i18n?color=blue)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/Tanox/GitHub_i18n?display_name=tag&color=green)](https://github.com/Tanox/GitHub_i18n/releases)
[![Userscript](https://img.shields.io/badge/Install-Tampermonkey-green?logo=tampermonkey)](https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js)

让 GitHub 界面变成中文，提升使用体验！

## 功能特性

- 🚀 **快速翻译**：本地词典，无需联网，瞬间生效
- 📦 **覆盖全面**：仓库、Issues、PR、设置、通知、Codespaces、Explore 等页面
- 🎯 **不破坏布局**：只翻译文字内容，保持页面原有样式
- 🔄 **实时更新**：支持动态加载的内容翻译
- ⚡ **性能优化**：智能缓存，不会拖慢页面速度
- 🔔 **自动升级**：Tampermonkey 自动检测新版本
- 🛠️ **管理界面**：基于 Next.js 的开发和词典管理工具

## 快速开始

### 安装用户脚本

1. 安装 Tampermonkey 或其他用户脚本管理器
   - Chrome/Edge: [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
   - Safari: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

2. 点击 [一键安装](https://github.com/Tanox/GitHub_i18n/raw/refs/heads/main/build/GitHub_i18n.user.js)，然后在 Tampermonkey 中点击「安装」

3. 刷新 GitHub 页面，界面就会变成中文啦！

### 开发工具

项目使用 Next.js 提供开发和管理界面：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建 Next.js 应用
npm run build

# 构建用户脚本
npm run build:userscript
```

访问 [http://localhost:3000](http://localhost:3000) 查看开发界面。

## 项目结构

```
.
├── src/              # Next.js 应用源码
│   ├── app/          # App Router 页面
│   ├── components/   # React 组件
│   ├── hooks/        # 自定义 Hooks
│   ├── lib/          # 工具库
│   └── types/        # TypeScript 类型定义
├── scripts/          # 用户脚本源码
│   ├── core/         # 核心模块
│   ├── dictionaries/ # 翻译词典
│   ├── page-monitor/ # 页面监控
│   ├── translation-core/ # 翻译核心
│   └── ui/           # 用户界面
├── build/            # 构建产物目录
├── public/           # 静态资源
└── build.cjs         # 用户脚本构建工具
```

## 使用技巧

### 快速配置

点击页面右下角的「设置」按钮，可以：
- 开启/关闭调试模式
- 查看翻译性能统计
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

A：欢迎提交 Pull Request！直接修改 `scripts/dictionaries/` 下的词典文件就行。

## 参与开发

如果你想参与开发：

```bash
git clone https://github.com/Tanox/GitHub_i18n.git
cd GitHub_i18n
npm install
npm run dev
```

## 版本

当前版本：v1.9.19

## 许可证

[GNU General Public License v2.0](LICENSE)

---

Made with ❤️ by [Sut](https://github.com/Tanox)
