import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers, AdminUser, UserDetail } from '@/hooks/useAdminUsers';
import { Pencil, UserCheck, UserX, Users, Trash2, Shield, ShieldOff, Eye, Loader2, Radio, Wifi, WifiOff, MapPin, Droplets, ArrowLeft } from 'lucide-react';

export default function Admin() {
  const { user: currentUser } = useAuth();
  const { users, isLoading, updateUser, toggleActive, toggleAdmin, deleteUser, getUserDetail } = useAdminUsers();

  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [detailData, setDetailData] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const openEdit = (u: AdminUser) => {
    setEditUser(u);
    setEditUsername(u.username);
    setEditEmail(u.email);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setActionLoading('edit');
    try {
      await updateUser(editUser.id, editUsername, editEmail);
      toast.success('User updated');
      setEditUser(null);
    } catch (err: any) { toast.error(err.message); }
    setActionLoading(null);
  };

  const handleToggleActive = async (u: AdminUser) => {
    setActionLoading(u.id);
    try {
      await toggleActive(u.id, !u.is_active);
      toast.success(`User ${u.is_active ? 'deactivated' : 'activated'}`);
    } catch (err: any) { toast.error(err.message); }
    setActionLoading(null);
  };

  const handleToggleAdmin = async (u: AdminUser) => {
    setActionLoading(u.id);
    try {
      await toggleAdmin(u.id, !u.is_admin);
      toast.success(`Admin role ${u.is_admin ? 'removed' : 'granted'}`);
    } catch (err: any) { toast.error(err.message); }
    setActionLoading(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    setActionLoading('delete');
    try {
      await deleteUser(userToDelete.id);
      toast.success('User deleted');
      setUserToDelete(null);
    } catch (err: any) { toast.error(err.message); }
    setActionLoading(null);
  };

  const openDetail = async (u: AdminUser) => {
    setDetailLoading(true);
    setDetailData(null);
    try {
      const data = await getUserDetail(u.id);
      setDetailData(data);
    } catch (err: any) { toast.error(err.message); }
    setDetailLoading(false);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const adminCount = users.filter(u => u.is_admin).length;

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Manage platform users and permissions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3 text-primary"><Users className="h-6 w-6" /></div>
            <div><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold text-foreground">{totalUsers}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-accent/10 p-3 text-accent"><UserCheck className="h-6 w-6" /></div>
            <div><p className="text-sm text-muted-foreground">Active Users</p><p className="text-2xl font-bold text-foreground">{activeUsers}</p></div>
          </CardContent></Card>
          <Card><CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-lg bg-primary/10 p-3 text-primary"><Shield className="h-6 w-6" /></div>
            <div><p className="text-sm text-muted-foreground">Admins</p><p className="text-2xl font-bold text-foreground">{adminCount}</p></div>
          </CardContent></Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.is_admin ? 'default' : 'secondary'}>{u.is_admin ? 'Admin' : 'User'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.is_active ? 'outline' : 'destructive'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openDetail(u)} title="View details"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleActive(u)} title={u.is_active ? 'Deactivate' : 'Activate'} disabled={u.id === currentUser?.id || actionLoading === u.id}>
                          {u.is_active ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-accent" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleToggleAdmin(u)} title={u.is_admin ? 'Remove admin' : 'Make admin'} disabled={u.id === currentUser?.id || actionLoading === u.id}>
                          {u.is_admin ? <ShieldOff className="h-4 w-4 text-destructive" /> : <Shield className="h-4 w-4 text-primary" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setUserToDelete(u)} title="Delete" disabled={u.id === currentUser?.id}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editUser} onOpenChange={(o) => { if (!o) setEditUser(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label>Username</Label><Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required /></div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
                <Button type="submit" disabled={actionLoading === 'edit'}>{actionLoading === 'edit' ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={!!userToDelete} onOpenChange={(o) => { if (!o) setUserToDelete(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>This will permanently delete the user account and all associated data. This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUserToDelete(null)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={actionLoading === 'delete'}>{actionLoading === 'delete' ? 'Deleting...' : 'Delete User'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* User Detail Dialog */}
        <Dialog open={!!detailData || detailLoading} onOpenChange={(o) => { if (!o) { setDetailData(null); setDetailLoading(false); } }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {detailLoading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : detailData ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg text-foreground">{detailData.profile.username}</p>
                    <div className="flex gap-2">
                      <Badge variant={detailData.roles.includes('admin') ? 'default' : 'secondary'}>{detailData.roles.includes('admin') ? 'Admin' : 'User'}</Badge>
                      <Badge variant={detailData.profile.is_active ? 'outline' : 'destructive'}>{detailData.profile.is_active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Email: {detailData.profile.email}</p>
                    <p>Joined: {new Date(detailData.profile.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Radio className="h-4 w-4 text-primary" /> Sensors ({detailData.sensors.length})</h3>
                  {detailData.sensors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No sensors assigned.</p>
                  ) : (
                    <div className="space-y-2">
                      {detailData.sensors.map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <Droplets className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{s.sensor_name}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location} · {s.sensor_code}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-foreground">{s.today_usage} L</span>
                            <Badge variant="outline" className={`gap-1 text-xs ${s.status === 'connected' ? 'border-accent/40 text-accent' : 'border-destructive/30 text-destructive/80'}`}>
                              {s.status === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                              {s.status === 'connected' ? 'Online' : 'Offline'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
