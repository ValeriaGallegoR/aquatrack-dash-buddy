import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Radio, MapPin, Droplets, Clock, Eye, Trash2, Wifi, WifiOff, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface Sensor {
  id: string;
  name: string;
  sensorId: string;
  location: string;
  status: 'connected' | 'disconnected';
  todayUsage: number;
  lastUpdated: string;
}

const mockSensors: Sensor[] = [
  {
    id: '1',
    name: 'Kitchen Sink',
    sensorId: 'AQ-101',
    location: 'Kitchen',
    status: 'connected',
    todayUsage: 42,
    lastUpdated: '10 minutes ago',
  },
  {
    id: '2',
    name: 'Bathroom Shower',
    sensorId: 'AQ-102',
    location: 'Bathroom',
    status: 'connected',
    todayUsage: 86,
    lastUpdated: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Garden Tap',
    sensorId: 'AQ-103',
    location: 'Garden',
    status: 'disconnected',
    todayUsage: 0,
    lastUpdated: '2 hours ago',
  },
  {
    id: '4',
    name: 'Laundry Outlet',
    sensorId: 'AQ-104',
    location: 'Laundry Room',
    status: 'connected',
    todayUsage: 31,
    lastUpdated: '18 minutes ago',
  },
];

export default function Sensors() {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sensorToRemove, setSensorToRemove] = useState<Sensor | null>(null);
  const [newName, setNewName] = useState('');
  const [newSensorId, setNewSensorId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState<'connected' | 'disconnected'>('connected');

  const handleRemove = () => {
    if (!sensorToRemove) return;
    setSensors((prev) => prev.filter((s) => s.id !== sensorToRemove.id));
    toast.success(`"${sensorToRemove.name}" removed successfully.`);
    setSensorToRemove(null);
  };

  const handleViewDetails = (sensor: Sensor) => {
    navigate(`/sensors/${sensor.sensorId}`);
  };

  const resetForm = () => {
    setNewName('');
    setNewSensorId('');
    setNewLocation('');
    setNewStatus('connected');
  };

  const handleAddSensor = () => {
    if (!newName.trim() || !newSensorId.trim() || !newLocation.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    const sensor: Sensor = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      sensorId: newSensorId.trim(),
      location: newLocation.trim(),
      status: newStatus,
      todayUsage: 0,
      lastUpdated: 'Just now',
    };
    setSensors((prev) => [...prev, sensor]);
    toast.success(`Sensor "${sensor.name}" added successfully.`);
    resetForm();
    setIsAddOpen(false);
  };

  const connectedCount = sensors.filter((s) => s.status === 'connected').length;
  const disconnectedCount = sensors.filter((s) => s.status === 'disconnected').length;

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Radio className="h-5 w-5 text-primary" />
              </div>
              Sensors Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 ml-[52px]">
              Manage and monitor your connected water sensors
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add Sensor
          </Button>
        </div>

        {/* Summary Stats */}
        {sensors.length > 0 && (
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">{sensors.length}</span> Total
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wifi className="h-4 w-4 text-accent" />
              <span className="font-semibold text-foreground">{connectedCount}</span> Online
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <WifiOff className="h-4 w-4 text-destructive/60" />
              <span className="font-semibold text-foreground">{disconnectedCount}</span> Offline
            </div>
          </div>
        )}

        {/* Add Sensor Dialog */}
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Sensor</DialogTitle>
              <DialogDescription>Fill in the details for your new water sensor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="sensor-name">Sensor Name</Label>
                <Input id="sensor-name" placeholder="e.g. Kitchen Sink" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-id">Sensor ID</Label>
                <Input id="sensor-id" placeholder="e.g. AQ-105" value={newSensorId} onChange={(e) => setNewSensorId(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sensor-location">Location</Label>
                <Input id="sensor-location" placeholder="e.g. Bathroom" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Connection Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as 'connected' | 'disconnected')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>Cancel</Button>
              <Button onClick={handleAddSensor}>Add Sensor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sensor Grid or Empty State */}
        {sensors.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Radio className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No sensors connected</h2>
              <p className="text-muted-foreground max-w-sm mb-8">
                Add your first sensor to start tracking water usage.
              </p>
              <Button onClick={() => setIsAddOpen(true)} size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Sensor
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sensors.map((sensor, index) => (
              <Card
                key={sensor.id}
                className="group relative overflow-hidden border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        sensor.status === 'connected'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Droplets className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold truncate">{sensor.name}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{sensor.sensorId}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 gap-1.5 text-xs font-medium ${
                        sensor.status === 'connected'
                          ? 'border-accent/40 bg-accent/10 text-accent'
                          : 'border-destructive/30 bg-destructive/5 text-destructive/80'
                      }`}
                    >
                      {sensor.status === 'connected' ? (
                        <Wifi className="h-3 w-3" />
                      ) : (
                        <WifiOff className="h-3 w-3" />
                      )}
                      {sensor.status === 'connected' ? 'Connected' : 'Offline'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      <span className="truncate">{sensor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      <span className="truncate">{sensor.lastUpdated}</span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 rounded-lg bg-secondary/50 px-3 py-2.5">
                    <Droplets className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-2xl font-bold text-foreground tracking-tight">{sensor.todayUsage}</span>
                    <span className="text-sm text-muted-foreground">L today</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => handleViewDetails(sensor)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setSensorToRemove(sensor)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Remove Confirmation */}
        <AlertDialog open={!!sensorToRemove} onOpenChange={(open) => { if (!open) setSensorToRemove(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Sensor</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this sensor from your dashboard?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove Sensor
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
