import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Tank {
  id: string;
  user_id: string;
  tank_name: string;
  location: string;
  capacity: number;
  created_at: string;
}

export function useTanks() {
  const { user } = useAuth();
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTanks = useCallback(async () => {
    if (!user) { setTanks([]); setIsLoading(false); return; }
    setIsLoading(true);
    const { data, error } = await supabase.from('tanks').select('*').order('created_at', { ascending: false });
    if (error) { toast.error('Failed to load tanks.'); console.error(error); }
    else setTanks((data ?? []) as Tank[]);
    setIsLoading(false);
  }, [user]);

  useEffect(() => { fetchTanks(); }, [fetchTanks]);

  const addTank = async (tank: { tank_name: string; location: string; capacity: number }) => {
    if (!user) return null;
    const { data, error } = await supabase.from('tanks').insert({
      tank_name: tank.tank_name,
      location: tank.location,
      capacity: tank.capacity,
      user_id: user.id,
    }).select().single();

    if (error) { toast.error('Failed to add tank.'); console.error(error); return null; }

    // Log the creation
    await supabase.from('tank_logs').insert({
      tank_id: (data as Tank).id,
      action: 'created',
      details: `Tank "${tank.tank_name}" created at ${tank.location}`,
    });

    setTanks((prev) => [data as Tank, ...prev]);
    return data as Tank;
  };

  const removeTank = async (id: string) => {
    const { error } = await supabase.from('tanks').delete().eq('id', id);
    if (error) { toast.error('Failed to remove tank.'); console.error(error); return false; }
    setTanks((prev) => prev.filter((t) => t.id !== id));
    return true;
  };

  return { tanks, isLoading, addTank, removeTank, refetch: fetchTanks };
}
