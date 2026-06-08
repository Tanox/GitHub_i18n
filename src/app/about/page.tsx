'use client';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      {/* 项目介绍 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">GitHub i18n</h2>
        <p className="text-xl text-blue-100 mb-6">
          为 GitHub 提供全面的中文本地化支持
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Tanox/GitHub_i18n"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            🌐 GitHub 项目主页
          </a>
          <a
            href="https://github.com/Tanox/GitHub_i18n/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            🐛 报告问题
          </a>
        </div>
      </div>

      {/* 版本信息 */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ℹ️ 版本信息
          </h3>
          <div className="space-y-3">
            <InfoRow label="当前版本" value="1.9.19" />
            <InfoRow label="发布日期" value="2026-06-08" />
            <InfoRow label="许可证" value="GPL-2.0" />
            <InfoRow label="Node.js" value=">=18.0.0" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🛠️ 技术栈
          </h3>
          <div className="space-y-3">
            <InfoRow label="前端框架" value="Next.js 14+" />
            <InfoRow label="样式" value="Tailwind CSS" />
            <InfoRow label="用户脚本" value="JavaScript ES6+" />
            <InfoRow label="测试框架" value="Jest" />
          </div>
        </div>
      </div>

      {/* 功能特性 */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ✨ 功能特性
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FeatureItem
            icon="🌐"
            title="全面的中文翻译"
            description="覆盖 GitHub 各个页面的中文本地化"
          />
          <FeatureItem
            icon="⚡"
            title="高性能优化"
            description="使用 Trie 树、LRU 缓存、虚拟 DOM 等技术"
          />
          <FeatureItem
            icon="🎯"
            title="智能预检查"
            description="无匹配翻译时不修改 DOM，减少不必要的操作"
          />
          <FeatureItem
            icon="🔧"
            title="灵活配置"
            description="支持自定义配置和实时调整"
          />
          <FeatureItem
            icon="📊"
            title="性能监控"
            description="实时监控翻译效果和性能数据"
          />
          <FeatureItem
            icon="📖"
            title="词典管理"
            description="支持自定义翻译词库"
          />
        </div>
      </div>

      {/* 更新日志 */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📝 更新日志
        </h3>
        <div className="space-y-4">
          <ChangelogItem
            version="1.9.19"
            date="2026-06-08"
            changes={[
              '优化翻译逻辑：无匹配时不修改 DOM',
              '更新架构文档和原型设计',
            ]}
          />
          <ChangelogItem
            version="1.9.18"
            date="2026-06-07"
            changes={['版本更新和 bug 修复']}
          />
          <ChangelogItem
            version="1.9.17"
            date="2026-05-22"
            changes={['之前版本']}
          />
        </div>
      </div>

      {/* 相关链接 */}
      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🔗 相关链接
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <LinkCard
            title="GitHub 项目"
            description="查看源码和文档"
            href="https://github.com/Tanox/GitHub_i18n"
            icon="🐙"
          />
          <LinkCard
            title="问题反馈"
            description="报告 bug 或提出建议"
            href="https://github.com/Tanox/GitHub_i18n/issues"
            icon="🐛"
          />
          <LinkCard
            title="用户脚本安装"
            description="安装或更新脚本"
            href="https://github.com/Tanox/GitHub_i18n/raw/main/build/GitHub_i18n.user.js"
            icon="📜"
          />
        </div>
      </div>

      {/* 贡献者 */}
      <div className="rounded-xl bg-gray-100 p-6 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          👥 贡献者
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          感谢所有为 GitHub i18n 项目做出贡献的开发者！
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-2xl">💪</span>
          <span className="font-medium text-gray-900 dark:text-white">Sut</span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function ChangelogItem({
  version,
  date,
  changes,
}: {
  version: string;
  date: string;
  changes: string[];
}) {
  return (
    <div className="border-l-2 border-blue-500 pl-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
          v{version}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{date}</span>
      </div>
      <ul className="space-y-1">
        {changes.map((change, index) => (
          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
            • {change}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LinkCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
    >
      <span className="text-2xl">{icon}</span>
      <p className="mt-2 font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </a>
  );
}
