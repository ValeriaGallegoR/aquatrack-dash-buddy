import { useCallback } from 'react';

const CACHE_PREFIX = 'aquatrack_cache_';

export interface OfflineCache {
  sensors: any[];
  roomGroups: any[];
  alerts: any[];
  readings: any[];
  timestamp: number;
}

function getKey(key: string) {
  return `${CACHE_PREFIX}${key}`;
}

export function useOfflineCache() {
  const cacheData = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(getKey(key), JSON.stringify({ data, timestamp: Date.now() }));
    } catch (e) {
      console.warn('Cache write failed:', e);
    }
  }, []);

  const getCachedData = useCallback(<T = any>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(getKey(key));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed.data as T;
    } catch {
      return null;
    }
  }, []);

  const getCacheTimestamp = useCallback((key: string): number | null => {
    try {
      const raw = localStorage.getItem(getKey(key));
      if (!raw) return null;
      return JSON.parse(raw).timestamp;
    } catch {
      return null;
    }
  }, []);

  return { cacheData, getCachedData, getCacheTimestamp };
}
