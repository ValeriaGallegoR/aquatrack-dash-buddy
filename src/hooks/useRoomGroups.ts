import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useOfflineCache } from './useOfflineCache';

export interface RoomGroup {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

const CACHE_KEY = 'room_groups';

export function useRoomGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<RoomGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cacheData, getCachedData } = useOfflineCache();

  const fetchGroups = useCallback(async () => {
    if (!user) { setGroups([]); setIsLoading(false); return; }
    setIsLoading(true);

    if (!navigator.onLine) {
      const cached = getCachedData<RoomGroup[]>(CACHE_KEY);
      if (cached) setGroups(cached);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('room_groups')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.error(error);
      const cached = getCachedData<RoomGroup[]>(CACHE_KEY);
      if (cached) setGroups(cached);
      else toast.error('Failed to load room groups.');
    } else {
      const result = (data ?? []) as RoomGroup[];
      setGroups(result);
      cacheData(CACHE_KEY, result);
    }
    setIsLoading(false);
  }, [user, cacheData, getCachedData]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const addGroup = async (name: string) => {
    if (!user) return null;
    const trimmed = name.trim();
    if (!trimmed) { toast.error('Group name is required.'); return null; }
    if (groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('A group with this name already exists.');
      return null;
    }
    const { data, error } = await supabase
      .from('room_groups')
      .insert({ name: trimmed, user_id: user.id })
      .select()
      .single();
    if (error) { toast.error('Failed to create group.'); console.error(error); return null; }
    const group = data as RoomGroup;
    setGroups((prev) => {
      const updated = [...prev, group];
      cacheData(CACHE_KEY, updated);
      return updated;
    });
    return group;
  };

  const renameGroup = async (id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) { toast.error('Group name is required.'); return false; }
    if (groups.some((g) => g.id !== id && g.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error('A group with this name already exists.');
      return false;
    }
    const { error } = await supabase
      .from('room_groups')
      .update({ name: trimmed })
      .eq('id', id);
    if (error) { toast.error('Failed to rename group.'); console.error(error); return false; }
    setGroups((prev) => {
      const updated = prev.map((g) => g.id === id ? { ...g, name: trimmed } : g);
      cacheData(CACHE_KEY, updated);
      return updated;
    });
    return true;
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase.from('room_groups').delete().eq('id', id);
    if (error) { toast.error('Failed to delete group.'); console.error(error); return false; }
    setGroups((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      cacheData(CACHE_KEY, updated);
      return updated;
    });
    return true;
  };

  const assignSensor = async (sensorId: string, groupId: string | null) => {
    const { error } = await supabase
      .from('sensors')
      .update({ room_group_id: groupId } as any)
      .eq('id', sensorId);
    if (error) { toast.error('Failed to update sensor group.'); console.error(error); return false; }
    return true;
  };

  return { groups, isLoading, addGroup, renameGroup, deleteGroup, assignSensor, refetch: fetchGroups };
}
