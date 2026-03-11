import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Droplets, MapPin, Loader2, Trash2, Eye, Container } from 'lucide-react';
import { toast } from 'sonner';
import { useTanks, Tank } from '@/hooks/useTanks';
import { formatDistanceToNow } from 'date-fns';

export default function Tanks() {
  const navigate = useNavigate();
  const { tanks, isLoading, addTank, removeTank } = useTanks();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tankToRemove, setTankToRemove] = useState<Tank | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('1000');

  const resetForm = () => { setName(''); setLocation(''); setCapacity('1000'); };

  const handleAdd = async () => {
    if (!name.trim() || !location.trim()) { toast.error('Please fill in all fields.'); return; }
    setIsSubmitting(true);
    const tank = await addTank({ tank_name: name.trim(), location: location.trim(), capacity: Number(capacity) || 1000 });
    setIsSubmitting(false);
    if (tank) { toast.success(`Tank "${tank.tank_name}" created.`); resetForm(); setIsAddOpen(false); }
  };

  const handleRemove = async () => {
    if (!tankToRemove) return;
    const ok = await removeTank(tankToRemove.id);
    if (ok) toast.success(`"${tankToRemove.tank_name}" removed.`);
    setTankToRemove(null);
  };

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Container className="h-5 w-5 text-primary" />
              </div>
              Tanks
            </h1>
            <p className="text-muted-foreground mt-2 ml-[52px]">Create and manage your water tanks</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Tank
          </Button>
        </div>

        <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Tank</DialogTitle>
              <DialogDescription>Fill in the details for your water tank.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="tank-name">Tank Name</Label>
                <Input id="tank-name" placeholder="e.g. Main Tank" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tank-location">Location</Label>
                <Input id="tank-location" placeholder="e.g. Rooftop" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tank-capacity">Capacity (Liters)</Label>
                <Input id="tank-capacity" type="number" placeholder="1000" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetForm(); setIsAddOpen(false); }}>Cancel</Button>
              <Button onClick={handleAdd} disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Add Tank
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : tanks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Container className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No tanks yet</h2>
              <p className="text-muted-foreground max-w-sm mb-8">Add your first tank to start organizing your water system.</p>
              <Button onClick={() => setIsAddOpen(true)} size="lg" className="gap-2"><Plus className="h-5 w-5" /> Add Tank</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {tanks.map((tank, i) => (
              <Card key={tank.id} className="group relative overflow-hidden border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 75}ms`, animationFillMode: 'backwards' }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Container className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base font-semibold truncate">{tank.tank_name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(tank.created_at), { addSuffix: true })}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      <span className="truncate">{tank.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Droplets className="h-3.5 w-3.5 text-primary/70" />
                      <span>{tank.capacity} L</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => navigate(`/tanks/${tank.id}`)}>
                      <Eye className="h-3.5 w-3.5" /> Details
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setTankToRemove(tank)}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!tankToRemove} onOpenChange={(o) => { if (!o) setTankToRemove(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Tank</AlertDialogTitle>
              <AlertDialogDescription>Are you sure? This will also remove all linked sensors and logs.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove Tank</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
