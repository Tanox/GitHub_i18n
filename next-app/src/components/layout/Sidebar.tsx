'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types';

const navigationItems: NavigationItem[] = [
  {
    name: '首页',
    href: '/',
    icon: '🏠',
    description: '概览和快速访问',
  },
  {
    name: '配置管理',
    href: '/config',
    icon: '⚙️',
    description: '插件设置',
  },
  {
    name: '性能监控',
    href: '/monitor',
    icon: '📊',
    description: '翻译统计',
  },
  {
    name: '词典管理',
    href: '/dictionary',
    icon: '📖',
    description: '翻译词典',
  },
  {
    name: '关于',
    href: '/about',
    icon: 'ℹ️',
    description: '项目信息',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-6 dark:border-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white text-xl font-bold">
            G
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              GitHub i18n
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              v1.9.19
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2026 GitHub i18n
          </p>
        </div>
      </div>
    </aside>
  );
}
