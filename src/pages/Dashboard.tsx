import { useMemo } from 'react';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getWaterStats, formatLiters } from '@/lib/waterData';
import {
  Droplets, Calendar, TrendingUp, BarChart3, Leaf, Target,
  AlertTriangle, Bell, Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar,
} from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = useMemo(() => getWaterStats(), []);

  const monthlyTrend = stats.dailyData.slice(-14).map((d) => ({
    date: d.date.slice(5),
    liters: d.liters,
  }));

  const weeklyComparison = [
    { name: 'Mon', current: 290, previous: 320 },
    { name: 'Tue', current: 265, previous: 310 },
    { name: 'Wed', current: 310, previous: 295 },
    { name: 'Thu', current: 240, previous: 330 },
    { name: 'Fri', current: 280, previous: 300 },
    { name: 'Sat', current: 350, previous: 370 },
    { name: 'Sun', current: 330, previous: 360 },
  ];

  const sustainabilityScore = 72;

  const alerts = [
    { message: 'Usage spike detected on Saturday — 42% above average', level: 'warning' as const },
    { message: 'Great job! Tuesday usage was 18% below your daily target', level: 'success' as const },
    { message: 'Monthly goal progress: 68% of target met', level: 'info' as const },
  ];

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

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Last 30 Days" value={formatLiters(stats.totalLast30Days)} description="Total water consumption" icon={Droplets} />
          <StatCard title="Daily Average" value={formatLiters(stats.dailyAverage)} description="Based on last 30 days" icon={Calendar} trend="neutral" />
          <StatCard title="This Week" value={formatLiters(stats.weeklyTotal)} description="Last 7 days total" icon={TrendingUp} trend="up" />
          <StatCard title="This Month" value={formatLiters(stats.monthlyTotal)} description="Monthly consumption" icon={BarChart3} />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Daily Usage Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="dashWaterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="liters" stroke="hsl(199, 89%, 48%)" fill="url(#dashWaterGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                This Week vs Last Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="previous" fill="hsl(200, 20%, 88%)" radius={[4, 4, 0, 0]} name="Last Week" />
                  <Bar dataKey="current" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="This Week" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Sustainability Score */}
          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-accent" />
                Sustainability Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-foreground">{sustainabilityScore}</span>
                <span className="text-muted-foreground mb-1">/100</span>
              </div>
              <Progress value={sustainabilityScore} className="h-3" />
              <p className="text-sm text-muted-foreground">
                You're using water more efficiently than 68% of similar households.
              </p>
            </CardContent>
          </Card>

          {/* Smart Alerts */}
          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Smart Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-sm border ${
                    alert.level === 'warning'
                      ? 'bg-destructive/5 border-destructive/20 text-destructive'
                      : alert.level === 'success'
                      ? 'bg-accent/5 border-accent/20 text-accent'
                      : 'bg-primary/5 border-primary/20 text-primary'
                  }`}
                >
                  {alert.level === 'warning' && <AlertTriangle className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
                  {alert.message}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goal Tracking */}
          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Monthly Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target: 7,500 L</span>
                  <span className="font-medium text-foreground">68%</span>
                </div>
                <Progress value={68} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Days remaining</span>
                  <span className="font-medium text-foreground">12 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily budget left</span>
                  <span className="font-medium text-foreground">~200 L/day</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="hover-lift transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Personalized Water-Saving Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { emoji: '🚿', title: 'Shorter Showers', desc: 'Reducing shower time by 2 minutes can save up to 10 liters of water' },
                { emoji: '🪥', title: 'Turn Off While Brushing', desc: 'Save up to 6 liters per minute by turning off the tap while brushing teeth' },
                { emoji: '🧺', title: 'Full Loads Only', desc: 'Run washing machines and dishwashers only with full loads' },
                { emoji: '🔧', title: 'Fix Leaky Faucets', desc: 'A dripping faucet can waste up to 20 liters of water per day' },
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/20 transition-all duration-300">
                  <div className="rounded-full bg-secondary p-2 text-lg">{tip.emoji}</div>
                  <div>
                    <h3 className="font-medium text-foreground">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
