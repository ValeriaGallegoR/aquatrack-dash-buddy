import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/StatCard';
import {
  Droplets, ArrowLeft, BarChart3, TrendingDown, TrendingUp,
  Calendar, AlertTriangle, Leaf, Target, Lightbulb, Bell,
} from 'lucide-react';
import { getWaterStats, formatLiters } from '@/lib/waterData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from 'recharts';

export default function ExploreFeatures() {
  const navigate = useNavigate();
  const stats = useMemo(() => getWaterStats(), []);

  const weeklyComparison = [
    { name: 'Mon', current: 290, previous: 320 },
    { name: 'Tue', current: 265, previous: 310 },
    { name: 'Wed', current: 310, previous: 295 },
    { name: 'Thu', current: 240, previous: 330 },
    { name: 'Fri', current: 280, previous: 300 },
    { name: 'Sat', current: 350, previous: 370 },
    { name: 'Sun', current: 330, previous: 360 },
  ];

  const monthlyTrend = stats.dailyData.slice(-14).map((d) => ({
    date: d.date.slice(5),
    liters: d.liters,
  }));

  const sustainabilityScore = 72;

  const alerts = [
    { message: 'Usage spike detected on Saturday — 42% above average', level: 'warning' as const },
    { message: 'Great job! Tuesday usage was 18% below your daily target', level: 'success' as const },
    { message: 'Monthly goal progress: 68% of target met', level: 'info' as const },
  ];

  const tips = [
    { emoji: '🚿', title: 'Shorter Showers', desc: 'Reducing by 2 min saves ~10L per shower' },
    { emoji: '🌧️', title: 'Collect Rainwater', desc: 'Use rainwater for garden irrigation' },
    { emoji: '🔧', title: 'Fix Leaks Promptly', desc: 'A dripping faucet wastes 20L/day' },
    { emoji: '🧺', title: 'Full Loads Only', desc: 'Run appliances only when full' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AquaTrack
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">Demo Mode</Badge>
            <Button asChild size="sm" className="hover-lift">
              <Link to="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm hover-lift transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore AquaTrack</h1>
            <p className="text-muted-foreground">Preview our features with sample data</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Last 30 Days" value={formatLiters(stats.totalLast30Days)} description="Total water consumption" icon={Droplets} />
          <StatCard title="Daily Average" value={formatLiters(stats.dailyAverage)} description="Based on last 30 days" icon={Calendar} trend="neutral" />
          <StatCard title="This Week" value={formatLiters(stats.weeklyTotal)} description="Last 7 days total" icon={TrendingUp} trend="up" />
          <StatCard title="This Month" value={formatLiters(stats.monthlyTotal)} description="Monthly consumption" icon={BarChart3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Usage Trend Chart */}
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
                    <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="liters" stroke="hsl(199, 89%, 48%)" fill="url(#waterGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Comparison */}
          <Card className="hover-lift transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-accent" />
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
                Good! You're using water more efficiently than 68% of similar households.
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
        <Card className="hover-lift transition-all duration-300 mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Water-Saving Tips & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {tips.map((tip, i) => (
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

        {/* CTA Banner */}
        <div className="rounded-xl water-gradient p-8 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">Ready to track your water?</h2>
          <p className="mb-6 opacity-90">Create a free account to start monitoring your real consumption.</p>
          <Button asChild size="lg" variant="secondary" className="hover-lift">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
