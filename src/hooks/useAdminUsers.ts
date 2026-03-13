import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  is_admin: boolean;
  roles: string[];
}

export interface UserDetail {
  profile: {
    id: string;
    username: string;
    email: string;
    created_at: string;
    is_active: boolean;
  };
  sensors: Array<{
    id: string;
    sensor_name: string;
    sensor_code: string;
    location: string;
    status: string;
    today_usage: number;
    last_updated: string;
  }>;
  roles: string[];
}

async function callAdminFn(action: string, params: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const resp = await supabase.functions.invoke('admin-users', {
    body: { action, ...params },
  });

  if (resp.error) throw new Error(resp.error.message);
  if (resp.data?.error) throw new Error(resp.data.error);
  return resp.data;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await callAdminFn('list_users');
      setUsers(data.users || []);
    } catch (e) {
      console.error('Failed to fetch users:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (user_id: string, username: string, email: string) => {
    await callAdminFn('update_user', { user_id, username, email });
    await fetchUsers();
  };

  const toggleActive = async (user_id: string, is_active: boolean) => {
    await callAdminFn('toggle_active', { user_id, is_active });
    await fetchUsers();
  };

  const toggleAdmin = async (user_id: string, make_admin: boolean) => {
    await callAdminFn('toggle_admin', { user_id, make_admin });
    await fetchUsers();
  };

  const deleteUser = async (user_id: string) => {
    await callAdminFn('delete_user', { user_id });
    await fetchUsers();
  };

  const getUserDetail = async (user_id: string): Promise<UserDetail> => {
    return await callAdminFn('get_user_detail', { user_id });
  };

  return { users, isLoading, fetchUsers, updateUser, toggleActive, toggleAdmin, deleteUser, getUserDetail };
}
