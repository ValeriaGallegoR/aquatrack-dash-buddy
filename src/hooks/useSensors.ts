import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Sensor {
  id: string;
  user_id: string | null;
  tank_id: string | null;
  sensor_name: string;
  sensor_code: string;
  location: string;
  status: string;
  today_usage: number;
  last_updated: string;
}

export function useSensors(tankId?: string) {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSensors = useCallback(async () => {
    if (!user) { setSensors([]); setIsLoading(false); return; }
    setIsLoading(true);
    let query = supabase.from('sensors').select('*').order('sensor_code', { ascending: true });
    if (tankId) query = query.eq('tank_id', tankId);

    const { data, error } = await query;
    if (error) { toast.error('Failed to load sensors.'); console.error(error); }
    else setSensors((data ?? []) as Sensor[]);
    setIsLoading(false);
  }, [user, tankId]);

  useEffect(() => { fetchSensors(); }, [fetchSensors]);

  const addSensor = async (sensor: { sensor_name: string; sensor_code: string; location: string; status: string; tank_id?: string }) => {
    if (!user) return null;
    const { data, error } = await supabase.from('sensors').insert({
      sensor_name: sensor.sensor_name,
      sensor_code: sensor.sensor_code,
      location: sensor.location,
      status: sensor.status,
      today_usage: 0,
      user_id: user.id,
      tank_id: sensor.tank_id || null,
    }).select().single();

    if (error) { toast.error('Failed to add sensor.'); console.error(error); return null; }
    setSensors((prev) => [...prev, data as Sensor]);
    return data as Sensor;
  };

  const removeSensor = async (id: string) => {
    const { error } = await supabase.from('sensors').delete().eq('id', id);
    if (error) { toast.error('Failed to remove sensor.'); console.error(error); return false; }
    setSensors((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  return { sensors, isLoading, addSensor, removeSensor, refetch: fetchSensors };
}
