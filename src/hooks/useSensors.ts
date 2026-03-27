import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
}

export function useSensors() {
  const { user } = useAuth();
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSensors = useCallback(async () => {
    if (!user) { setSensors([]); setIsLoading(false); return; }
    setIsLoading(true);
    const { data, error } = await supabase.from('sensors').select('*').order('sensor_code', { ascending: true });
    if (error) { toast.error('Failed to load sensors.'); console.error(error); }
    else setSensors((data ?? []) as Sensor[]);
    setIsLoading(false);
  }, [user]);

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
    setSensors((prev) => [...prev, data as Sensor]);
    return data as Sensor;
  };

  const pairSensor = async (sensorCode: string): Promise<{ success: boolean; sensor?: Sensor; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated.' };

    // Find sensor by code
    const { data: existing, error: fetchError } = await supabase
      .from('sensors')
      .select('*')
      .eq('sensor_code', sensorCode)
      .maybeSingle();

    if (fetchError) { console.error(fetchError); return { success: false, error: 'Failed to look up sensor.' }; }
    if (!existing) return { success: false, error: 'Sensor ID not found. Please check the code and try again.' };
    if (existing.user_id === user.id) return { success: false, error: 'This sensor is already paired to your account.' };
    if (existing.user_id) return { success: false, error: 'This sensor is already paired with another user.' };

    // Pair it
    const { data: updated, error: updateError } = await supabase
      .from('sensors')
      .update({ user_id: user.id })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) { console.error(updateError); return { success: false, error: 'Failed to pair sensor.' }; }
    const paired = updated as Sensor;
    setSensors((prev) => [...prev, paired]);
    return { success: true, sensor: paired };
  };

  const removeSensor = async (id: string) => {
    const { error } = await supabase.from('sensors').delete().eq('id', id);
    if (error) { toast.error('Failed to remove sensor.'); console.error(error); return false; }
    setSensors((prev) => prev.filter((s) => s.id !== id));
    return true;
  };

  return { sensors, isLoading, addSensor, pairSensor, removeSensor, refetch: fetchSensors };
}
