import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Pencil, Trash2, Home, Loader2, HelpCircle, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { RoomGroup } from '@/hooks/useRoomGroups';
import { Sensor } from '@/hooks/useSensors';

interface Props {
  groups: RoomGroup[];
  sensors: Sensor[];
  onAddGroup: (name: string) => Promise<RoomGroup | null>;
  onRenameGroup: (id: string, name: string) => Promise<boolean>;
  onDeleteGroup: (id: string) => Promise<boolean>;
  onAssignSensor: (sensorId: string, groupId: string | null) => Promise<boolean>;
  onRefetchSensors: () => void;
}

export default function RoomGroupsManager({ groups, sensors, onAddGroup, onRenameGroup, onDeleteGroup, onAssignSensor, onRefetchSensors }: Props) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [renameGroup, setRenameGroup] = useState<RoomGroup | null>(null);
  const [renameName, setRenameName] = useState('');

  const [deleteGroup, setDeleteGroup] = useState<RoomGroup | null>(null);

  const [assignOpen, setAssignOpen] = useState<RoomGroup | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState('');

  const getSensorsInGroup = (groupId: string) =>
    sensors.filter((s) => (s as any).room_group_id === groupId);

  const getUnassignedSensors = () =>
    sensors.filter((s) => !(s as any).room_group_id);

  const handleCreate = async () => {
    setIsSubmitting(true);
    const result = await onAddGroup(newGroupName);
    setIsSubmitting(false);
    if (result) { toast.success(`Group "${result.name}" created.`); setNewGroupName(''); setIsCreateOpen(false); }
  };

  const handleRename = async () => {
    if (!renameGroup) return;
    setIsSubmitting(true);
    const success = await onRenameGroup(renameGroup.id, renameName);
    setIsSubmitting(false);
    if (success) { toast.success('Group renamed.'); setRenameGroup(null); }
  };

  const handleDelete = async () => {
    if (!deleteGroup) return;
    const success = await onDeleteGroup(deleteGroup.id);
    if (success) { toast.success(`Group "${deleteGroup.name}" deleted.`); setDeleteGroup(null); onRefetchSensors(); }
  };

  const handleAssign = async () => {
    if (!assignOpen || !selectedSensorId) return;
    setIsSubmitting(true);
    const success = await onAssignSensor(selectedSensorId, assignOpen.id);
    setIsSubmitting(false);
    if (success) { toast.success('Sensor assigned to group.'); onRefetchSensors(); setAssignOpen(null); setSelectedSensorId(''); }
  };

  const handleUnassign = async (sensorId: string) => {
    const success = await onAssignSensor(sensorId, null);
    if (success) { toast.success('Sensor removed from group.'); onRefetchSensors(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" /> Room Groups
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-[260px]">
              <p>Organize your sensors into room groups for easier management. Assign sensors to rooms like Kitchen, Bathroom, etc.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="font-medium text-foreground mb-1">No room groups yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create a group to organize your sensors by room.</p>
            <Button size="sm" onClick={() => setIsCreateOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Create Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => {
            const groupSensors = getSensorsInGroup(group.id);
            return (
              <Card key={group.id} className="border border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      {group.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setAssignOpen(group); setSelectedSensorId(''); }}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setRenameGroup(group); setRenameName(group.name); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteGroup(group)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {groupSensors.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No sensors assigned</p>
                  ) : (
                    groupSensors.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-md border border-border/60 bg-secondary/30 px-3 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Droplets className="h-3.5 w-3.5 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{s.sensor_name}</p>
                            <p className="text-xs text-muted-foreground">{s.today_usage} L</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => handleUnassign(s.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {groupSensors.length} sensor{groupSensors.length !== 1 ? 's' : ''}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewGroupName(''); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Room Group</DialogTitle>
            <DialogDescription>Give your room group a name (e.g., Kitchen, Bathroom).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Group Name</Label>
              <Input placeholder="e.g. Kitchen" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNewGroupName(''); setIsCreateOpen(false); }}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting || !newGroupName.trim()}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Group Dialog */}
      <Dialog open={!!renameGroup} onOpenChange={(o) => { if (!o) setRenameGroup(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Group</DialogTitle>
            <DialogDescription>Enter a new name for "{renameGroup?.name}".</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>New Name</Label>
              <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameGroup(null)}>Cancel</Button>
            <Button onClick={handleRename} disabled={isSubmitting || !renameName.trim()}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Group Confirmation */}
      <AlertDialog open={!!deleteGroup} onOpenChange={(o) => { if (!o) setDeleteGroup(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteGroup?.name}"? Sensors in this group will become unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Sensor Dialog */}
      <Dialog open={!!assignOpen} onOpenChange={(o) => { if (!o) { setAssignOpen(null); setSelectedSensorId(''); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Assign Sensor</DialogTitle>
            <DialogDescription>Select a sensor to assign to "{assignOpen?.name}".</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {getUnassignedSensors().length === 0 ? (
              <p className="text-sm text-muted-foreground">All sensors are already assigned to groups.</p>
            ) : (
              <div className="space-y-2">
                <Label>Select Sensor</Label>
                <Select value={selectedSensorId} onValueChange={setSelectedSensorId}>
                  <SelectTrigger><SelectValue placeholder="Choose a sensor" /></SelectTrigger>
                  <SelectContent>
                    {getUnassignedSensors().map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.sensor_name} ({s.sensor_code})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAssignOpen(null); setSelectedSensorId(''); }}>Cancel</Button>
            <Button onClick={handleAssign} disabled={isSubmitting || !selectedSensorId}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
