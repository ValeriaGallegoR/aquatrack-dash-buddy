import { useState, useEffect, useCallback } from 'react';

const CACHE_KEY = 'aquatrack_offline_readings';

export interface CachedReading {
  sensor_id: string;
  reading_value: number;
  recorded_at: string;
}

export function useOfflineSync() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  const getCachedReadings = useCallback((): CachedReading[] => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const cacheReading = useCallback((reading: CachedReading) => {
    const existing = getCachedReadings();
    existing.push(reading);
    localStorage.setItem(CACHE_KEY, JSON.stringify(existing));
  }, [getCachedReadings]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const syncCachedReadings = useCallback(async () => {
    const cached = getCachedReadings();
    if (cached.length === 0) return { synced: 0 };

    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase.from('sensor_readings').insert(cached);
    if (error) {
      console.error('Sync failed:', error);
      return { synced: 0, error };
    }
    clearCache();
    return { synced: cached.length };
  }, [getCachedReadings, clearCache]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOffline) {
      syncCachedReadings().then((result) => {
        if (result.synced > 0) {
          console.log(`Synced ${result.synced} cached readings`);
        }
      });
    }
  }, [isOffline, syncCachedReadings]);

  return { isOffline, cacheReading, getCachedReadings, syncCachedReadings, clearCache };
}
