// 存储管理工具

import { Config, PerformanceStats } from '@/types';

const CONFIG_KEY = 'github-i18n-config';
const STATS_KEY = 'github-i18n-stats';

export const defaultConfig: Config = {
  version: '1.9.19',
  debugMode: false,
  updateCheck: {
    enabled: true,
    intervalHours: 24,
    autoUpdateVersion: true,
  },
  performance: {
    enableTranslationCache: true,
    enableVirtualDom: true,
    enablePartialMatch: false,
    batchSize: 50,
    minTextLengthToTranslate: 3,
  },
};

export const defaultStats: PerformanceStats = {
  totalDuration: 0,
  elementsProcessed: 0,
  textsTranslated: 0,
  cacheHitRate: 0,
  cacheHits: 0,
  cacheMisses: 0,
  domOperations: 0,
  networkRequests: 0,
  batchCount: 0,
  lastUpdated: new Date().toISOString(),
};

export function loadConfig(): Config {
  if (typeof window === 'undefined') return defaultConfig;

  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) {
      return { ...defaultConfig, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
  return defaultConfig;
}

export function saveConfig(config: Config): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

export function loadStats(): PerformanceStats {
  if (typeof window === 'undefined') return defaultStats;

  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return { ...defaultStats, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
  return defaultStats;
}

export function saveStats(stats: PerformanceStats): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
}

export function exportConfig(config: Config): void {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `github-i18n-config-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importConfig(file: File): Promise<Config> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target?.result as string);
        resolve({ ...defaultConfig, ...config });
      } catch (error) {
        reject(new Error('Invalid config file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function resetConfig(): Config {
  localStorage.removeItem(CONFIG_KEY);
  return defaultConfig;
}
