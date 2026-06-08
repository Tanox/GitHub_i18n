'use client';

import { useStats } from '@/hooks/useStats';

export default function DashboardPage() {
  const { stats, loading, generateDemoStats } = useStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 欢迎卡片 */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">欢迎使用 GitHub i18n</h2>
        <p className="text-blue-100 text-lg">
          为 GitHub 提供全面的中文本地化支持
        </p>
        <div className="mt-6 flex gap-4">
          <a
            href="https://github.com/Tanox/GitHub_i18n"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            🌐 访问项目主页
          </a>
          <button
            onClick={generateDemoStats}
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition-colors"
          >
            📊 生成演示数据
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总耗时"
          value={`${stats.totalDuration.toFixed(1)} ms`}
          icon="⏱️"
          color="blue"
        />
        <StatCard
          title="元素处理"
          value={stats.elementsProcessed.toLocaleString()}
          icon="📦"
          color="green"
        />
        <StatCard
          title="文本翻译"
          value={stats.textsTranslated.toLocaleString()}
          icon="📝"
          color="purple"
        />
        <StatCard
          title="缓存命中率"
          value={`${stats.cacheHitRate.toFixed(1)}%`}
          icon="💾"
          color="orange"
        />
      </div>

      {/* 详细信息 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 性能指标 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            性能指标
          </h3>
          <div className="space-y-4">
            <MetricRow label="缓存命中" value={stats.cacheHits.toLocaleString()} />
            <MetricRow label="缓存未命中" value={stats.cacheMisses.toLocaleString()} />
            <MetricRow label="DOM 操作" value={stats.domOperations.toLocaleString()} />
            <MetricRow label="网络请求" value={stats.networkRequests.toLocaleString()} />
            <MetricRow label="批处理次数" value={stats.batchCount.toLocaleString()} />
          </div>
        </div>

        {/* 快速操作 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            快速操作
          </h3>
          <div className="space-y-3">
            <QuickAction
              title="配置管理"
              description="调整翻译插件设置"
              href="/config"
              icon="⚙️"
            />
            <QuickAction
              title="性能监控"
              description="查看详细统计信息"
              href="/monitor"
              icon="📊"
            />
            <QuickAction
              title="词典管理"
              description="管理和编辑翻译词典"
              href="/dictionary"
              icon="📖"
            />
          </div>
        </div>
      </div>

      {/* 最后更新 */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        最后更新: {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function QuickAction({
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
      className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </a>
  );
}
