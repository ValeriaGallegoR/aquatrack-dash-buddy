import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useOfflineCache } from './useOfflineCache';

export interface Sensor {
  id: string;
  user_id: string | null;
  sensor_name: string;
  sensor_code: string;
  location: string;
  status: string;
  today_usage: number;
  last_updated: string;
  outlet_type: string | null;
  room_group_id: string | null;
}

const CACHE_KEY = 'sensors';

export function useSensors() {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cacheData, getCachedData } = useOfflineCache();

  const fetchSensors = useCallback(async () => {
    if (!user) { setSensors([]); setIsLoading(false); return; }
    setIsLoading(true);

    if (!navigator.onLine) {
      const cached = getCachedData<Sensor[]>(CACHE_KEY);
      if (cached) setSensors(cached);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.from('sensors').select('*').order('sensor_code', { ascending: true });
    if (error) {
      console.error(error);
      // Fallback to cache on error
      const cached = getCachedData<Sensor[]>(CACHE_KEY);
      if (cached) {
        setSensors(cached);
      } else {
        toast.error('Failed to load sensors.');
      }
    } else {
      const result = (data ?? []) as Sensor[];
      setSensors(result);
      cacheData(CACHE_KEY, result);
    }
    setIsLoading(false);
  }, [user, cacheData, getCachedData]);

  useEffect(() => { fetchSensors(); }, [fetchSensors]);

  const addSensor = async (sensor: { sensor_name: string; sensor_code: string; location: string; status: string; outlet_type?: string }) => {
    if (!user) return null;
    const { data, error } = await supabase.from('sensors').insert({
      sensor_name: sensor.sensor_name,
      sensor_code: sensor.sensor_code,
      location: sensor.location,
      status: sensor.status,
      outlet_type: sensor.outlet_type || null,
      today_usage: 0,
      user_id: user.id,
    }).select().single();

    if (error) { toast.error('Failed to add sensor.'); console.error(error); return null; }
    const newSensor = data as Sensor;
    setSensors((prev) => {
      const updated = [...prev, newSensor];
      cacheData(CACHE_KEY, updated);
      return updated;
    });
    return newSensor;
  };

  const removeSensor = async (id: string) => {
    const { error } = await supabase.from('sensors').delete().eq('id', id);
    if (error) { toast.error('Failed to remove sensor.'); console.error(error); return false; }
    setSensors((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      cacheData(CACHE_KEY, updated);
      return updated;
    });
    return true;
  };

  const updateSensor = async (id: string, updates: Partial<Pick<Sensor, 'outlet_type'>>) => {
    const { data, error } = await supabase.from('sensors').update(updates).eq('id', id).select().single();
    if (error) { toast.error('Failed to update sensor.'); console.error(error); return null; }
    const updated = data as Sensor;
    setSensors((prev) => {
      const result = prev.map((s) => s.id === id ? updated : s);
      cacheData(CACHE_KEY, result);
      return result;
    });
    return updated;
  };

  return { sensors, isLoading, addSensor, removeSensor, updateSensor, refetch: fetchSensors };
}
