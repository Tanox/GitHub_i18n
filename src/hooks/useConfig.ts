'use client';

import { useState, useEffect, useCallback } from 'react';
import { Config } from '@/types';
import { loadConfig, saveConfig, defaultConfig } from '@/lib/storage';

export function useConfig() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setConfig(loadConfig());
    setLoading(false);
  }, []);

  const updateConfig = useCallback((updates: Partial<Config>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      saveConfig(newConfig);
      return newConfig;
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    saveConfig(defaultConfig);
  }, []);

  return {
    config,
    loading,
    updateConfig,
    resetConfig,
  };
}
