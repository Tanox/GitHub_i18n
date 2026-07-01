# 开发指南

本文档记录了项目的开发流程、分支策略、提交规范、发布流程和测试要求。

## 目录

- [1. 分支策略](#1-分支策略)
- [2. 语义化提交规范](#2-语义化提交规范)
- [3. 版本发布流程](#3-版本发布流程)
- [4. 测试要求](#4-测试要求)

---

## 1. 分支策略

### 1.1 主要分支

| 分支名称 | 用途 | 说明 |
|---------|------|------|
| `main` | 主分支 | 稳定版本，随时可发布生产环境 |

### 1.2 功能分支

功能分支从 `main` 分支创建，开发完成后通过 Pull Request 合并回 `main`。

**命名格式**：
- `feature/<功能描述>` - 新功能开发
- `fix/<问题描述>` - Bug 修复
- `refactor/<重构内容>` - 代码重构
- `docs/<文档变更>` - 文档更新
- `chore/<杂项内容>` - 杂项变更
- `trae/solo-agent-*` - 自动化 Agent 工作分支

**示例**：
```
feature/add-github-projects-translation
fix/dropdown-menu-translation
refactor/cache-manager
docs/update-installation-guide
trae/solo-agent-avGb2v
```

### 1.3 分支工作流

```
main (稳定版本)
  ↑
  │  开发完成后通过 PR 合并
  │
feature/* (功能分支) ← 从这里开始开发
```

**流程步骤**：
1. 从 `main` 创建功能分支
2. 在功能分支上进行开发
3. 提交代码（遵循语义化提交规范）
4. 运行 `npm test` 验证代码
5. 推送分支并创建 Pull Request
6. 代码审查通过后合并到 `main`
7. 发布时，在 `main` 打标签

---

## 2. 语义化提交规范

项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 2.1 提交格式

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 2.2 类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加对 GitHub Projects 页面的翻译支持` |
| `fix` | Bug 修复 | `fix: 修复某些下拉菜单无法翻译的问题` |
| `docs` | 文档更新 | `docs: 更新安装说明` |
| `style` | 代码格式调整（不影响功能） | `style: 格式化代码` |
| `refactor` | 代码重构 | `refactor: 优化缓存管理器` |
| `perf` | 性能优化 | `perf: 提升翻译速度` |
| `test` | 测试相关 | `test: 添加缓存管理器的单元测试` |
| `chore` | 构建过程或辅助工具的变动 | `chore: 更新依赖包` |
| `ci` | CI/CD 相关 | `ci: 更新 GitHub Actions 配置` |
| `build` | 构建系统相关 | `build: 优化构建脚本` |
| `revert` | 回滚提交 | `revert: 回滚上一次提交` |

### 2.3 范围说明（可选）

范围用于标识变更影响的模块，例如：
- `translationCore` - 翻译核心模块
- `pageMonitor` - 页面监控模块
- `dictionaries` - 词典模块
- `i18n` - 国际化框架
- `utils` - 工具函数

**示例**：
```
feat(translationCore): 添加部分匹配翻译功能
fix(pageMonitor): 修复 DOM 变化监听问题
```

### 2.4 描述规范

- 使用动词开头（添加、修复、更新、优化等）
- 简洁明了，不超过 50 个字符
- 使用中文（与项目语言一致）

### 2.5 Git 钩子

项目使用 Husky 和 lint-staged 进行提交前检查：
- 自动运行 ESLint 检查
- 自动运行 Prettier 格式化
- 确保代码符合规范才能提交

---

## 3. 版本发布流程

### 3.1 版本号规范

项目遵循 [语义化版本 (SemVer)](https://semver.org/lang/zh-CN/)：

```
MAJOR.MINOR.PATCH
```

- **MAJOR**：不兼容的 API 变更
- **MINOR**：向下兼容的功能性新增
- **PATCH**：向下兼容的问题修正

### 3.2 发布流程

#### 3.2.1 准备发布

1. 确保 `develop` 分支所有代码已合并
2. 运行测试确保所有测试通过
3. 更新版本号和 CHANGELOG

#### 3.2.2 版本号更新

版本号只需要在 `src/version.js` 中更新，这是项目的单一版本源。

#### 3.2.3 CHANGELOG 更新

在 `CHANGELOG.md` 中添加新版本记录，格式如下：

```markdown
## [版本号] - 日期

### Added
- 新增功能列表

### Fixed
- 修复的问题列表

### Changed
- 变更的内容列表

### Improved
- 改进的内容列表
```

#### 3.2.4 发布步骤

1. 确保 `main` 分支代码最新
2. 在 `src/version.js` 中更新版本号
3. 运行 `npm test` 验证构建
4. 提交版本号更新
5. 创建 Git 标签：`git tag -a v<版本号> -m "Release v<版本号>"`
6. 推送标签：`git push origin v<版本号>`
7. 在 GitHub 创建 Release

### 3.3 CI/CD 发布流程

项目使用 GitHub Actions 自动化发布：

**触发条件**：
- 推送到 `main` 分支 → 运行 CI 检查
- 创建 Pull Request 到 `main` → 运行 CI 检查
- 发布 GitHub Release → 执行发布流程

**CI/CD 作业**：
1. **lint** - 代码质量检查
2. **build** - 构建项目并验证产物
3. **security** - 安全审计
4. **release** - 发布到 GitHub Releases（仅在发布时）

---

## 4. 测试要求

### 4.1 代码质量检查

项目使用 **ESLint** 和 **Prettier** 进行代码质量检查和格式化。

### 4.2 测试文件组织

测试文件放在：
- `__tests__/` 目录下，或
- 与源码文件同级，命名为 `<文件名>.test.js`

**示例**：
```
src/
├── cacheManager.js
└── __tests__/
    └── cacheManager.test.js
```

### 4.3 开发命令

```bash
# 运行完整测试流水线（lint → build → validate）
npm test

# 运行代码检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 运行 Prettier 格式化
npm run format

# 检查代码格式
npm run format:check

# 构建项目
npm run build

# 验证构建产物
npm run validate
```

### 4.4 代码质量要求

项目通过以下方式保障代码质量：
- ESLint 代码检查（0 错误）
- Prettier 代码格式化
- 构建产物验证
- 完整的测试流水线（lint → build → validate）

### 4.5 开发规范

1. **代码质量**：
   - ESLint 检查必须通过（0 错误）
   - Prettier 格式化必须通过
   - 构建必须成功

2. **提交规范**：
   - 使用语义化提交（Conventional Commits）
   - 提交信息清晰明了

3. **CI/CD 要求**：
   - 所有 CI 检查必须通过才能合并代码
   - Pull Request 必须通过 CI 检查

---

## 附录

### 开发命令速查

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run lint` | 运行 ESLint 检查 |
| `npm run lint:fix` | 自动修复 ESLint 问题 |
| `npm run format` | 运行 Prettier 格式化 |
| `npm run format:check` | 检查代码格式 |
| `npm run build` | 构建项目 |
| `npm run validate` | 验证构建产物 |
| `npm run clean` | 清理构建产物 |

### 相关文档

- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [architecture.md](./architecture.md) - 架构文档
- [openspec/project.md](../openspec/project.md) - 项目规范
