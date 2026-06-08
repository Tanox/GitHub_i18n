'use client';

import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/': '仪表盘',
  '/config': '配置管理',
  '/monitor': '性能监控',
  '/dictionary': '词典管理',
  '/about': '关于项目',
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || 'GitHub i18n';

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-800">
      <div className="flex h-16 items-center px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>
    </header>
  );
}
