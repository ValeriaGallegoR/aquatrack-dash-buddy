import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOfflineCache } from './useOfflineCache';

export interface SensorDailyUsage {
  [sensorId: string]: number;
}

const CACHE_KEY = 'today_usage';

export function useTodayUsage(sensorIds: string[]) {
  const { user } = useAuth();
  const [usageMap, setUsageMap] = useState<SensorDailyUsage>({});
  const [isLoading, setIsLoading] = useState(true);
  const { cacheData, getCachedData } = useOfflineCache();

  const fetchTodayUsage = useCallback(async () => {
    if (!user || sensorIds.length === 0) {
      setUsageMap({});
      setIsLoading(false);
      return;
    }

    if (!navigator.onLine) {
      const cached = getCachedData<SensorDailyUsage>(CACHE_KEY);
      if (cached) setUsageMap(cached);
      setIsLoading(false);
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('sensor_id, reading_value')
      .in('sensor_id', sensorIds)
      .gte('recorded_at', todayStart.toISOString());

    if (error) {
      console.error('Failed to fetch today usage:', error);
      const cached = getCachedData<SensorDailyUsage>(CACHE_KEY);
      if (cached) setUsageMap(cached);
      setIsLoading(false);
      return;
    }

    const map: SensorDailyUsage = {};
    for (const id of sensorIds) {
      map[id] = 0;
    }
    for (const row of data ?? []) {
      map[row.sensor_id] = (map[row.sensor_id] || 0) + Number(row.reading_value);
    }

    setUsageMap(map);
    cacheData(CACHE_KEY, map);
    setIsLoading(false);
  }, [user, sensorIds.join(','), cacheData, getCachedData]);

  useEffect(() => {
    fetchTodayUsage();
  }, [fetchTodayUsage]);

  const getTodayUsage = useCallback(
    (sensorId: string) => usageMap[sensorId] ?? 0,
    [usageMap]
  );

  const totalUsage = Object.values(usageMap).reduce((sum, v) => sum + v, 0);

  return { usageMap, totalUsage, getTodayUsage, isLoading: isLoading };
}
