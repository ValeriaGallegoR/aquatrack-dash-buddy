import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import WaterAnalyticsBackground from '@/components/WaterAnalyticsBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useSensors } from '@/hooks/useSensors';
import { Droplets, TrendingUp, BarChart3, Wifi } from 'lucide-react';

export default function Dashboard() {
  const { profile } = useAuth();
  const { sensors, isLoading } = useSensors();
  const navigate = useNavigate();

  const totalUsage = sensors.reduce((sum, s) => sum + s.today_usage, 0);
  const connectedCount = sensors.filter((s) => s.status === 'connected').length;

  return (
    <AppLayout>
      <WaterAnalyticsBackground />
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {profile?.username}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your water system</p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card className="hover-glow bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usage Today</CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Droplets className="h-4 w-4 text-primary" /></div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{totalUsage} L</div><p className="text-xs text-muted-foreground">Across all sensors</p></CardContent>
              </Card>
              <Card className="hover-glow bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><BarChart3 className="h-4 w-4 text-primary" /></div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{sensors.length}</div><p className="text-xs text-muted-foreground">{connectedCount} connected</p></CardContent>
              </Card>
              <Card className="hover-glow bg-card shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Rate</CardTitle>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Wifi className="h-4 w-4 text-primary" /></div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{sensors.length > 0 ? Math.round((connectedCount / sensors.length) * 100) : 0}%</div><p className="text-xs text-muted-foreground">Sensors online</p></CardContent>
              </Card>
            </div>

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
                      <div
                        key={s.id}
                        onClick={() => navigate(`/sensors/${s.sensor_code}`)}
                        className="flex items-center justify-between rounded-lg border p-3 card-3d"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10"><Droplets className="h-4 w-4 text-primary" /></div>
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
