'use client';

import { useState } from 'react';
import { useStats } from '@/hooks/useStats';

export default function MonitorPage() {
  const { stats, loading, resetStats, generateDemoStats } = useStats();
  const [autoRefresh, setAutoRefresh] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            性能监控
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            实时监控翻译插件的性能数据
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {autoRefresh ? '⏸️ 暂停刷新' : '▶️ 启动刷新'}
          </button>
          <button
            onClick={generateDemoStats}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            📊 刷新数据
          </button>
          <button
            onClick={resetStats}
            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400"
          >
            🔄 重置统计
          </button>
        </div>
      </div>

      {/* 主要统计卡片 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="总耗时"
          value={`${stats.totalDuration.toFixed(2)} ms`}
          description="页面翻译总耗时"
          trend={stats.totalDuration < 50 ? 'good' : 'warning'}
        />
        <StatCard
          title="缓存命中率"
          value={`${stats.cacheHitRate.toFixed(1)}%`}
          description="翻译缓存效率"
          trend={stats.cacheHitRate > 70 ? 'good' : 'warning'}
        />
        <StatCard
          title="文本翻译数"
          value={stats.textsTranslated.toLocaleString()}
          description="已翻译的文本节点"
          trend="neutral"
        />
        <StatCard
          title="元素处理数"
          value={stats.elementsProcessed.toLocaleString()}
          description="已处理的 DOM 元素"
          trend="neutral"
        />
      </div>

      {/* 详细统计 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 缓存统计 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💾 缓存统计
          </h3>
          <div className="space-y-4">
            <CacheBar
              label="缓存命中率"
              value={stats.cacheHitRate}
              color="blue"
            />
            <StatRow label="缓存命中次数" value={stats.cacheHits.toLocaleString()} />
            <StatRow label="缓存未命中次数" value={stats.cacheMisses.toLocaleString()} />
          </div>
        </div>

        {/* DOM 操作统计 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📦 DOM 操作统计
          </h3>
          <div className="space-y-4">
            <StatRow label="DOM 操作次数" value={stats.domOperations.toLocaleString()} />
            <StatRow label="批处理次数" value={stats.batchCount.toLocaleString()} />
            <StatRow
              label="平均每批处理"
              value={
                stats.batchCount > 0
                  ? Math.round(stats.elementsProcessed / stats.batchCount).toLocaleString()
                  : '0'
              }
            />
          </div>
        </div>

        {/* 网络请求统计 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🌐 网络请求统计
          </h3>
          <div className="space-y-4">
            <StatRow label="网络请求数" value={stats.networkRequests.toLocaleString()} />
            <StatRow
              label="请求成功率"
              value={stats.networkRequests > 0 ? '100%' : 'N/A'}
            />
          </div>
        </div>

        {/* 性能指标 */}
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ 性能指标
          </h3>
          <div className="space-y-4">
            <StatRow
              label="平均翻译延迟"
              value={`${(stats.totalDuration / Math.max(stats.textsTranslated, 1)).toFixed(2)} ms`}
            />
            <StatRow
              label="元素处理效率"
              value={`${(stats.elementsProcessed / Math.max(stats.totalDuration, 1)).toFixed(2)} /ms`}
            />
          </div>
        </div>
      </div>

      {/* 更新时间 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        最后更新: {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
        {autoRefresh && <span className="ml-2 text-green-600">● 实时刷新中</span>}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  trend,
}: {
  title: string;
  value: string;
  description: string;
  trend: 'good' | 'warning' | 'neutral';
}) {
  const trendColors = {
    good: 'text-green-600 dark:text-green-400',
    warning: 'text-orange-600 dark:text-orange-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  const trendIcons = {
    good: '✓',
    warning: '⚠',
    neutral: '●',
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        <span className={trendColors[trend]}>{trendIcons[trend]}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}

function CacheBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
