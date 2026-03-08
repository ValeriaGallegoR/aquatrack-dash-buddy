import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets, LayoutDashboard, Radio, Leaf, Wifi, BarChart3 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back to AquaTrack
          </h1>
          <p className="mt-1 text-muted-foreground max-w-xl">
            Monitor your water usage, manage your sensors, and stay on track with your sustainability goals.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer border border-border hover:border-primary/40 hover:shadow-md transition-all group"
            onClick={() => navigate('/dashboard')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Go to Dashboard</p>
                <p className="text-sm text-muted-foreground">View charts, trends &amp; insights</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border border-border hover:border-accent/40 hover:shadow-md transition-all group"
            onClick={() => navigate('/sensors')}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-accent/10 p-3 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <Radio className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Go to Sensors</p>
                <p className="text-sm text-muted-foreground">Manage &amp; monitor your devices</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overview Stats */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Water This Month</p>
                  <p className="text-xl font-bold text-foreground">8,240 L</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
                  <Wifi className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connected Sensors</p>
                  <p className="text-xl font-bold text-foreground">4</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-lg bg-secondary p-2.5 text-secondary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sustainability Score</p>
                  <p className="text-xl font-bold text-foreground">82 / 100</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
