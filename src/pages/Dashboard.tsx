import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { getWaterStats, formatLiters } from '@/lib/waterData';
import { Droplets, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = useMemo(() => getWaterStats(), []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your household water consumption
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Last 30 Days"
            value={formatLiters(stats.totalLast30Days)}
            description="Total water consumption"
            icon={Droplets}
          />
          <StatCard
            title="Daily Average"
            value={formatLiters(stats.dailyAverage)}
            description="Based on last 30 days"
            icon={Calendar}
            trend="neutral"
          />
          <StatCard
            title="This Week"
            value={formatLiters(stats.weeklyTotal)}
            description="Last 7 days total"
            icon={TrendingUp}
            trend="up"
          />
          <StatCard
            title="This Month"
            value={formatLiters(stats.monthlyTotal)}
            description="Monthly consumption"
            icon={BarChart3}
          />
        </div>

        <div className="mt-8 rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">💧 Water Conservation Tips</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2">
                <span className="text-lg">🚿</span>
              </div>
              <div>
                <h3 className="font-medium">Shorter Showers</h3>
                <p className="text-sm text-muted-foreground">
                  Reducing shower time by 2 minutes can save up to 10 liters of water
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2">
                <span className="text-lg">🪥</span>
              </div>
              <div>
                <h3 className="font-medium">Turn Off While Brushing</h3>
                <p className="text-sm text-muted-foreground">
                  Save up to 6 liters per minute by turning off the tap while brushing teeth
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2">
                <span className="text-lg">🧺</span>
              </div>
              <div>
                <h3 className="font-medium">Full Loads Only</h3>
                <p className="text-sm text-muted-foreground">
                  Run washing machines and dishwashers only with full loads
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-secondary p-2">
                <span className="text-lg">🔧</span>
              </div>
              <div>
                <h3 className="font-medium">Fix Leaky Faucets</h3>
                <p className="text-sm text-muted-foreground">
                  A dripping faucet can waste up to 20 liters of water per day
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
