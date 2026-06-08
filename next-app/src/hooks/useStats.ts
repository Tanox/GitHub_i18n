'use client';

import { useState, useEffect, useCallback } from 'react';
import { PerformanceStats } from '@/types';
import { loadStats, saveStats, defaultStats } from '@/lib/storage';

export function useStats() {
  const [stats, setStats] = useState<PerformanceStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStats(loadStats());
    setLoading(false);
  }, []);

  const updateStats = useCallback((updates: Partial<PerformanceStats>) => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };
      saveStats(newStats);
      return newStats;
    });
  }, []);

  const resetStats = useCallback(() => {
    const reset = {
      ...defaultStats,
      lastUpdated: new Date().toISOString(),
    };
    setStats(reset);
    saveStats(reset);
  }, []);

  const generateDemoStats = useCallback(() => {
    const demoStats: PerformanceStats = {
      totalDuration: Math.random() * 100 + 10,
      elementsProcessed: Math.floor(Math.random() * 1000 + 100),
      textsTranslated: Math.floor(Math.random() * 5000 + 500),
      cacheHitRate: Math.random() * 40 + 60,
      cacheHits: Math.floor(Math.random() * 10000 + 1000),
      cacheMisses: Math.floor(Math.random() * 2000 + 200),
      domOperations: Math.floor(Math.random() * 500 + 50),
      networkRequests: Math.floor(Math.random() * 10),
      batchCount: Math.floor(Math.random() * 20 + 5),
      lastUpdated: new Date().toISOString(),
    };
    setStats(demoStats);
    saveStats(demoStats);
  }, []);

  return {
    stats,
    loading,
    updateStats,
    resetStats,
    generateDemoStats,
  };
}
