import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TankLog {
  id: string;
  tank_id: string;
  action: string;
  details: string;
  created_at: string;
}

export function useTankLogs(tankId?: string) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<TankLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!user) { setLogs([]); setIsLoading(false); return; }
    setIsLoading(true);
    let query = supabase.from('tank_logs').select('*').order('created_at', { ascending: false });
    if (tankId) query = query.eq('tank_id', tankId);

    const { data, error } = await query;
    if (error) console.error(error);
    else setLogs((data ?? []) as TankLog[]);
    setIsLoading(false);
  }, [user, tankId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { logs, isLoading, refetch: fetchLogs };
}
