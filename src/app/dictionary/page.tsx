'use client';

import { useState } from 'react';

interface DictionaryEntry {
  key: string;
  value: string;
  category: string;
}

// 示例词典数据
const sampleDictionaries = {
  common: [
    { key: 'Issues', value: '问题', category: 'navigation' },
    { key: 'Pull Requests', value: '拉取请求', category: 'navigation' },
    { key: 'Code', value: '代码', category: 'navigation' },
    { key: 'Settings', value: '设置', category: 'navigation' },
    { key: 'Repository', value: '仓库', category: 'general' },
    { key: 'Branch', value: '分支', category: 'git' },
    { key: 'Commit', value: '提交', category: 'git' },
    { key: 'Merge', value: '合并', category: 'git' },
  ],
  codespaces: [
    { key: 'Codespaces', value: '代码空间', category: 'navigation' },
    { key: 'New codespace', value: '新建代码空间', category: 'action' },
    { key: 'Running', value: '运行中', category: 'status' },
    { key: 'Stopped', value: '已停止', category: 'status' },
  ],
  explore: [
    { key: 'Explore', value: '探索', category: 'navigation' },
    { key: 'Trending', value: '热门', category: 'page' },
    { key: 'Collections', value: '精选集', category: 'page' },
  ],
};

export default function DictionaryPage() {
  const [activeTab, setActiveTab] = useState<'common' | 'codespaces' | 'explore'>('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [entries, setEntries] = useState<DictionaryEntry[]>(sampleDictionaries.common);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);

  const tabs = [
    { id: 'common' as const, label: '📖 常用词典', count: sampleDictionaries.common.length },
    { id: 'codespaces' as const, label: '💻 Codespaces', count: sampleDictionaries.codespaces.length },
    { id: 'explore' as const, label: '🔍 Explore', count: sampleDictionaries.explore.length },
  ];

  const handleTabChange = (tabId: 'common' | 'codespaces' | 'explore') => {
    setActiveTab(tabId);
    setEntries(sampleDictionaries[tabId]);
    setSearchQuery('');
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dictionary-${activeTab}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            词典管理
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            管理和编辑翻译词典
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            📤 导出词典
          </button>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          placeholder="搜索词典条目..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* 词典列表 */}
      <div className="rounded-xl bg-white shadow-sm dark:bg-gray-900 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                原文
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                译文
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                分类
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEntries.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {entry.key}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {entry.value}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {entry.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingEntry(entry)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    编辑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEntries.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            没有找到匹配的词典条目
          </div>
        )}
      </div>

      {/* 分页信息 */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        显示 {filteredEntries.length} / {entries.length} 条记录
      </div>

      {/* 编辑模态框 */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              编辑词典条目
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  原文
                </label>
                <input
                  type="text"
                  value={editingEntry.key}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, key: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  译文
                </label>
                <input
                  type="text"
                  value={editingEntry.value}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, value: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  分类
                </label>
                <input
                  type="text"
                  value={editingEntry.category}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingEntry(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 保存逻辑
                  setEditingEntry(null);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
