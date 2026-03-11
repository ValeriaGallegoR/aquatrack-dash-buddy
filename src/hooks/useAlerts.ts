import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Alert {
  id: string;
  user_id: string;
  sensor_id: string | null;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    if (!user) { setAlerts([]); setIsLoading(false); return; }
    setIsLoading(true);
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setAlerts((data ?? []) as Alert[]);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const markAsRead = async (id: string) => {
    await supabase.from('alerts').update({ is_read: true }).eq('id', id);
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, is_read: true } : a));
  };

  return { alerts, isLoading, markAsRead, refetch: fetchAlerts };
}
