import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSensors } from '@/hooks/useSensors';
import { useTanks } from '@/hooks/useTanks';
import { Droplets, TrendingUp, BarChart3, Wifi, Container, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const { sensors, isLoading: sensorsLoading } = useSensors();
  const { tanks, isLoading: tanksLoading } = useTanks();

  const isLoading = sensorsLoading || tanksLoading;
  const totalUsage = sensors.reduce((sum, s) => sum + s.today_usage, 0);
  const connectedCount = sensors.filter((s) => s.status === 'connected').length;

  return (
    <AppLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.username}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your water system</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usage Today</CardTitle>
                  <Droplets className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{totalUsage} L</div><p className="text-xs text-muted-foreground">Across all sensors</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{sensors.length}</div><p className="text-xs text-muted-foreground">{connectedCount} connected</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tanks</CardTitle>
                  <Container className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{tanks.length}</div><p className="text-xs text-muted-foreground">Water storage units</p></CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Rate</CardTitle>
                  <Wifi className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{sensors.length > 0 ? Math.round((connectedCount / sensors.length) * 100) : 0}%</div><p className="text-xs text-muted-foreground">Sensors online</p></CardContent>
              </Card>
            </div>

            {/* Sensor breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Sensor Usage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {sensors.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No sensors added yet. Add sensors to see usage data here.</p>
                ) : (
                  <div className="space-y-3">
                    {sensors.map((s) => (
                      <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Droplets className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-foreground text-sm">{s.sensor_name}</p>
                            <p className="text-xs text-muted-foreground">{s.location} · {s.sensor_code}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-foreground">{s.today_usage} L</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}
