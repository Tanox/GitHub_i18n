'use client';

import { useState } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { exportConfig, importConfig } from '@/lib/storage';

export default function ConfigPage() {
  const { config, loading, updateConfig, resetConfig } = useConfig();
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    exportConfig(config);
    setMessage('✅ 配置已导出');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const imported = await importConfig(file);
      updateConfig(imported);
      setMessage('✅ 配置已导入');
    } catch (error) {
      setMessage('❌ 导入失败：无效的配置文件');
    }
    setImporting(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    if (confirm('确定要重置所有配置为默认值吗？')) {
      resetConfig();
      setMessage('✅ 配置已重置');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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
            配置管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            管理 GitHub 中文翻译插件的设置
          </p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
            {importing ? '导入中...' : '📥 导入配置'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            📤 导出配置
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400"
          >
            🔄 重置默认
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 基本设置 */}
        <ConfigSection title="🔧 基本设置">
          <ConfigToggle
            label="调试模式"
            description="在控制台显示详细日志信息"
            checked={config.debugMode}
            onChange={(checked) => updateConfig({ debugMode: checked })}
          />
        </ConfigSection>

        {/* 性能设置 */}
        <ConfigSection title="⚡ 性能设置">
          <ConfigToggle
            label="启用翻译缓存"
            description="缓存已翻译内容，加速重复访问"
            checked={config.performance.enableTranslationCache}
            onChange={(checked) =>
              updateConfig({
                performance: { ...config.performance, enableTranslationCache: checked },
              })
            }
          />
          <ConfigToggle
            label="启用虚拟 DOM 优化"
            description="减少真实 DOM 操作，提升性能"
            checked={config.performance.enableVirtualDom}
            onChange={(checked) =>
              updateConfig({
                performance: { ...config.performance, enableVirtualDom: checked },
              })
            }
          />
          <ConfigToggle
            label="启用部分匹配"
            description="支持句子中部分词汇的翻译"
            checked={config.performance.enablePartialMatch}
            onChange={(checked) =>
              updateConfig({
                performance: { ...config.performance, enablePartialMatch: checked },
              })
            }
          />
          <ConfigInput
            label="批处理大小"
            description="每次处理的元素数量"
            type="number"
            value={config.performance.batchSize}
            onChange={(value) =>
              updateConfig({
                performance: { ...config.performance, batchSize: parseInt(value) || 50 },
              })
            }
          />
          <ConfigInput
            label="最小翻译文本长度"
            description="只有超过此长度的文本才会被翻译"
            type="number"
            value={config.performance.minTextLengthToTranslate}
            onChange={(value) =>
              updateConfig({
                performance: {
                  ...config.performance,
                  minTextLengthToTranslate: parseInt(value) || 3,
                },
              })
            }
          />
        </ConfigSection>

        {/* 更新设置 */}
        <ConfigSection title="🔄 更新设置">
          <ConfigToggle
            label="自动检查更新"
            description="定期检查并提醒新版本"
            checked={config.updateCheck.enabled}
            onChange={(checked) =>
              updateConfig({
                updateCheck: { ...config.updateCheck, enabled: checked },
              })
            }
          />
          <ConfigToggle
            label="自动更新版本"
            description="有新版本时自动更新插件"
            checked={config.updateCheck.autoUpdateVersion}
            onChange={(checked) =>
              updateConfig({
                updateCheck: { ...config.updateCheck, autoUpdateVersion: checked },
              })
            }
          />
        </ConfigSection>

        {/* 版本信息 */}
        <ConfigSection title="ℹ️ 版本信息">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">当前版本</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {config.version}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">检查频率</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {config.updateCheck.intervalHours} 小时
              </span>
            </div>
          </div>
        </ConfigSection>
      </div>
    </div>
  );
}

function ConfigSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ConfigToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function ConfigInput({
  label,
  description,
  type,
  value,
  onChange,
}: {
  label: string;
  description: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />
    </div>
  );
}
