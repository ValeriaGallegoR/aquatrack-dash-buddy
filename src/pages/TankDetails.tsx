import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Droplets, MapPin, Container, Wifi, WifiOff, Clock, Loader2 } from 'lucide-react';
import { useSensors } from '@/hooks/useSensors';
import { useTankLogs } from '@/hooks/useTankLogs';
import { useTanks } from '@/hooks/useTanks';
import { formatDistanceToNow } from 'date-fns';

export default function TankDetails() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const { tanks, isLoading: tanksLoading } = useTanks();
  const { sensors, isLoading: sensorsLoading } = useSensors(tankId);
  const { logs, isLoading: logsLoading } = useTankLogs(tankId);

  const tank = tanks.find((t) => t.id === tankId);
  const isLoading = tanksLoading || sensorsLoading || logsLoading;

  if (isLoading) {
    return <AppLayout><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout>;
  }

  if (!tank) {
    return (
      <AppLayout>
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Tank Not Found</h1>
          <Button variant="outline" onClick={() => navigate('/tanks')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Tanks</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => navigate('/tanks')}>
          <ArrowLeft className="h-4 w-4" /> Back to Tanks
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Container className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tank.tank_name}</h1>
            <p className="text-sm text-muted-foreground">{tank.location} · {tank.capacity} L capacity</p>
          </div>
        </div>

        {/* Sensors in this tank */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" /> Sensors ({sensors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sensors.length === 0 ? (
              <p className="text-muted-foreground text-sm">No sensors linked to this tank yet. Add sensors from the Sensors page.</p>
            ) : (
              <div className="space-y-3">
                {sensors.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.status === 'connected' ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
                        <Droplets className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{s.sensor_name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-mono">{s.sensor_code}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {s.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{s.today_usage} L</span>
                      <Badge variant="outline" className={`gap-1 text-xs ${s.status === 'connected' ? 'border-accent/40 bg-accent/10 text-accent' : 'border-destructive/30 bg-destructive/5 text-destructive/80'}`}>
                        {s.status === 'connected' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                        {s.status === 'connected' ? 'Connected' : 'Offline'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tank Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm border-b last:border-0 pb-2 last:pb-0">
                    <span className="text-muted-foreground whitespace-nowrap">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</span>
                    <Separator orientation="vertical" className="h-4 mt-0.5" />
                    <div>
                      <span className="font-medium text-foreground capitalize">{log.action}</span>
                      {log.details && <span className="text-muted-foreground ml-1">— {log.details}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
