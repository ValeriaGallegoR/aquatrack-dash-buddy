import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Radio, MapPin, Droplets, Clock, Eye, Trash2, Wifi, WifiOff, Activity, Loader2, Link2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSensors, Sensor } from '@/hooks/useSensors';
import { formatDistanceToNow } from 'date-fns';

export default function Sensors() {
  const navigate = useNavigate();
  const { sensors, isLoading, addSensor, pairSensor, removeSensor } = useSensors();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPairOpen, setIsPairOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sensorToRemove, setSensorToRemove] = useState<Sensor | null>(null);
  const [pairedResult, setPairedResult] = useState<{ sensorCode: string } | null>(null);
  const [newName, setNewName] = useState('');
  const [newSensorId, setNewSensorId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState<'connected' | 'disconnected'>('connected');
  const [pairCode, setPairCode] = useState('');

  const handleRemove = async () => {
    if (!sensorToRemove) return;
    const success = await removeSensor(sensorToRemove.id);
    if (success) toast.success(`"${sensorToRemove.sensor_name}" removed.`);
    setSensorToRemove(null);
  };

  const resetForm = () => { setNewName(''); setNewSensorId(''); setNewLocation(''); setNewStatus('connected'); };

  const handleAddSensor = async () => {
    if (!newName.trim() || !newSensorId.trim() || !newLocation.trim()) { toast.error('Please fill in all fields.'); return; }
    setIsSubmitting(true);
    const sensor = await addSensor({
      sensor_name: newName.trim(),
      sensor_code: newSensorId.trim(),
      location: newLocation.trim(),
      status: newStatus,
    });
    setIsSubmitting(false);
    if (sensor) { toast.success(`Sensor "${sensor.sensor_name}" added.`); resetForm(); setIsAddOpen(false); }
  };

  const handlePairSensor = async () => {
    if (!pairCode.trim()) { toast.error('Please enter a Sensor ID.'); return; }
    setIsSubmitting(true);
    const result = await pairSensor(pairCode.trim());
    setIsSubmitting(false);
    if (result.success && result.sensor) {
      setPairedResult({ sensorCode: result.sensor.sensor_code });
      setPairCode('');
      setIsPairOpen(false);
      toast.success('Sensor paired successfully');
    } else {
      toast.error(result.error || 'Failed to pair sensor.');
    }
  };

  const formatLastUpdated = (ts: string) => {
    try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); } catch { return 'Unknown'; }
  };

  const connectedCount = sensors.filter((s) => s.status === 'connected').length;
  const disconnectedCount = sensors.filter((s) => s.status === 'disconnected').length;

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Radio className="h-5 w-5 text-primary" /></div>
              Sensors Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 ml-[52px]">Manage and monitor your connected water sensors</p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto">
            <Button variant="outline" onClick={() => setIsPairOpen(true)} className="gap-2"><Link2 className="h-4 w-4" /> Pair Sensor</Button>
            <Button onClick={() => setIsAddOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Add Sensor</Button>
          </div>
        </div>

        {sensors.length > 0 && (
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Activity className="h-4 w-4 text-primary" /><span className="font-semibold text-foreground">{sensors.length}</span> Total</div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground"><Wifi className="h-4 w-4 text-accent" /><span className="font-semibold text-foreground">{connectedCount}</span> Online</div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2 text-muted-foreground"><WifiOff className="h-4 w-4 text-destructive/60" /><span className="font-semibold text-foreground">{disconnectedCount}</span> Offline</div>
          </div>
        )}

        <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Sensor</DialogTitle>
              <DialogDescription>Fill in the details for your new water sensor.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label htmlFor="sensor-name">Sensor Name</Label><Input id="sensor-name" placeholder="e.g. Kitchen Sink" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="sensor-id">Sensor ID</Label><Input id="sensor-id" placeholder="e.g. AQ-105" value={newSensorId} onChange={(e) => setNewSensorId(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="sensor-location">Location</Label><Input id="sensor-location" placeholder="e.g. Bathroom" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as 'connected' | 'disconnected')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="disconnected">Disconnected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>Cancel</Button>
              <Button onClick={handleAddSensor} disabled={isSubmitting}>{isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Add Sensor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        ) : sensors.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6"><Radio className="h-8 w-8 text-primary" /></div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No sensors connected</h2>
              <p className="text-muted-foreground max-w-sm mb-8">Add your first sensor to start tracking water usage.</p>
              <Button onClick={() => setIsAddOpen(true)} size="lg" className="gap-2"><Plus className="h-5 w-5" /> Add Sensor</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sensors.map((sensor, index) => (
              <Card
                key={sensor.id}
                onClick={() => navigate(`/sensors/${sensor.sensor_code}`)}
                className="group relative overflow-hidden border border-border/60 card-3d animate-fade-in"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${sensor.status === 'connected' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Droplets className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold truncate">{sensor.sensor_name}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{sensor.sensor_code}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`shrink-0 gap-1.5 text-xs font-medium ${sensor.status === 'connected' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-destructive/30 bg-destructive/5 text-destructive/80'}`}>
                      {sensor.status === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                      {sensor.status === 'connected' ? 'Connected' : 'Offline'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 text-primary/70" /><span className="truncate">{sensor.location}</span></div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5 text-primary/70" /><span className="truncate">{formatLastUpdated(sensor.last_updated)}</span></div>
                  </div>
                  <div className="flex items-baseline gap-1.5 rounded-lg bg-secondary/50 px-3 py-2.5">
                    <Droplets className="h-4 w-4 text-primary mt-0.5" />
                    <span className="text-2xl font-bold text-foreground tracking-tight">{sensor.today_usage}</span>
                    <span className="text-sm text-muted-foreground">L today</span>
                  </div>
                  <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => navigate(`/sensors/${sensor.sensor_code}`)}><Eye className="h-3.5 w-3.5" /> Details</Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setSensorToRemove(sensor)}><Trash2 className="h-3.5 w-3.5" /> Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!sensorToRemove} onOpenChange={(o) => { if (!o) setSensorToRemove(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Remove Sensor</AlertDialogTitle><AlertDialogDescription>Are you sure you want to remove this sensor?</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove Sensor</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pair Sensor Dialog */}
        <Dialog open={isPairOpen} onOpenChange={(o) => { setIsPairOpen(o); if (!o) setPairCode(''); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pair Existing Sensor</DialogTitle>
              <DialogDescription>Enter the Sensor ID printed on your device to link it to your account.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="pair-code">Sensor ID</Label>
                <Input id="pair-code" placeholder="e.g. AQ-101" value={pairCode} onChange={(e) => setPairCode(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setPairCode(''); setIsPairOpen(false); }}>Cancel</Button>
              <Button onClick={handlePairSensor} disabled={isSubmitting}>{isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Pair Sensor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pair Success Dialog */}
        <Dialog open={!!pairedResult} onOpenChange={(o) => { if (!o) setPairedResult(null); }}>
          <DialogContent className="sm:max-w-sm">
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
              <DialogTitle>Sensor paired successfully</DialogTitle>
              <DialogDescription>
                Sensor <span className="font-mono font-semibold text-foreground">{pairedResult?.sensorCode}</span> is now linked to your account.
              </DialogDescription>
              <Button onClick={() => setPairedResult(null)} className="w-full">Done</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
