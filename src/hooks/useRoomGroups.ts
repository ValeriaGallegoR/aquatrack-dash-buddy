import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface RoomGroup {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export function useRoomGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<RoomGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    if (!user) { setGroups([]); setIsLoading(false); return; }
    setIsLoading(true);
    const { data, error } = await supabase
      .from('room_groups')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) { toast.error('Failed to load room groups.'); console.error(error); }
    else setGroups((data ?? []) as RoomGroup[]);
    setIsLoading(false);
  }, [user]);

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
    setGroups((prev) => [...prev, group]);
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
    setGroups((prev) => prev.map((g) => g.id === id ? { ...g, name: trimmed } : g));
    return true;
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase.from('room_groups').delete().eq('id', id);
    if (error) { toast.error('Failed to delete group.'); console.error(error); return false; }
    setGroups((prev) => prev.filter((g) => g.id !== id));
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
