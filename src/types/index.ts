// GitHub i18n Admin 类型定义

export interface Config {
  version: string;
  debugMode: boolean;
  updateCheck: {
    enabled: boolean;
    intervalHours: number;
    autoUpdateVersion: boolean;
  };
  performance: {
    enableTranslationCache: boolean;
    enableVirtualDom: boolean;
    enablePartialMatch: boolean;
    batchSize: number;
    minTextLengthToTranslate: number;
  };
}

export interface PerformanceStats {
  totalDuration: number;
  elementsProcessed: number;
  textsTranslated: number;
  cacheHitRate: number;
  cacheHits: number;
  cacheMisses: number;
  domOperations: number;
  networkRequests: number;
  batchCount: number;
  lastUpdated: string;
}

export interface DictionaryEntry {
  key: string;
  value: string;
  category?: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description: string;
}
