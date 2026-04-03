import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSensors } from '@/hooks/useSensors';
import { useAlerts } from '@/hooks/useAlerts';
import { Droplets, LayoutDashboard, Radio, Bell, Wifi, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { sensors } = useSensors();
  const { alerts } = useAlerts();

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isAdmin) return null;

  const connectedCount = sensors.filter((s) => s.status === 'connected').length;
  const unreadAlerts = alerts.filter((a) => !a.is_read).length;

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {profile?.username ?? 'User'}! 👋
          </h1>
          <p className="mt-1 text-muted-foreground max-w-xl">
            Monitor your water usage, manage your sensors, and stay on track with your sustainability goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="cursor-pointer border border-border hover:border-primary/40 hover:shadow-md transition-all group" onClick={() => navigate('/dashboard')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><LayoutDashboard className="h-6 w-6" /></div>
              <div><p className="font-semibold text-foreground">Dashboard</p><p className="text-sm text-muted-foreground">View charts, trends &amp; insights</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border border-border hover:border-accent/40 hover:shadow-md transition-all group" onClick={() => navigate('/sensors')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-accent/10 p-3 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors"><Radio className="h-6 w-6" /></div>
              <div><p className="font-semibold text-foreground">Sensors</p><p className="text-sm text-muted-foreground">Manage &amp; monitor devices</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border border-border hover:border-primary/40 hover:shadow-md transition-all group" onClick={() => navigate('/alerts')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><Bell className="h-6 w-6" /></div>
              <div><p className="font-semibold text-foreground">Alerts</p><p className="text-sm text-muted-foreground">{unreadAlerts} unread notifications</p></div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer border border-primary/30 hover:border-primary hover:shadow-md transition-all group sm:col-span-3" onClick={() => navigate('/track-usage')}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg water-gradient p-3 text-primary-foreground"><BarChart3 className="h-6 w-6" /></div>
              <div><p className="font-semibold text-foreground">Track Usage</p><p className="text-sm text-muted-foreground">View charts, graphs &amp; analytics of your water consumption</p></div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-accent/10 p-2.5 text-accent"><Wifi className="h-5 w-5" /></div>
                <div><p className="text-sm text-muted-foreground">Connected Sensors</p><p className="text-xl font-bold text-foreground">{connectedCount} / {sensors.length}</p></div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary"><Droplets className="h-5 w-5" /></div>
                <div><p className="text-sm text-muted-foreground">Total Usage Today</p><p className="text-xl font-bold text-foreground">{sensors.reduce((sum, s) => sum + s.today_usage, 0)} L</p></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
