import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOfflineCache } from './useOfflineCache';

export interface Alert {
  id: string;
  user_id: string;
  sensor_id: string | null;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const CACHE_KEY = 'alerts';

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cacheData, getCachedData } = useOfflineCache();

  const fetchAlerts = useCallback(async () => {
    if (!user) { setAlerts([]); setIsLoading(false); return; }
    setIsLoading(true);

    if (!navigator.onLine) {
      const cached = getCachedData<Alert[]>(CACHE_KEY);
      if (cached) setAlerts(cached);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      const cached = getCachedData<Alert[]>(CACHE_KEY);
      if (cached) setAlerts(cached);
    } else {
      const result = (data ?? []) as Alert[];
      setAlerts(result);
      cacheData(CACHE_KEY, result);
    }
    setIsLoading(false);
  }, [user, cacheData, getCachedData]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const markAsRead = async (id: string) => {
    await supabase.from('alerts').update({ is_read: true }).eq('id', id);
    setAlerts((prev) => {
      const updated = prev.map((a) => a.id === id ? { ...a, is_read: true } : a);
      cacheData(CACHE_KEY, updated);
      return updated;
    });
  };

  return { alerts, isLoading, markAsRead, refetch: fetchAlerts };
}
