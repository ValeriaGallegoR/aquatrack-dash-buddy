import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import WaterAnalyticsBackground from '@/components/WaterAnalyticsBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { useSensors } from '@/hooks/useSensors';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets, TrendingUp, BarChart3, Activity, Info, HelpCircle, Clock, ArrowUpRight, Sun, Lightbulb, FileDown } from 'lucide-react';

type TimeRange = 'daily' | 'weekly' | 'monthly';

const CHART_LABEL_COLOR = 'hsl(var(--chart-label))';
const CHART_GRID_COLOR = 'hsl(var(--chart-grid))';
const CHART_PRIMARY = 'hsl(var(--primary))';
const CHART_SECONDARY = 'hsl(var(--chart-secondary))';

function generateMockUsageData(range: TimeRange) {
  const rand = (i: number) => ((i * 9301 + 49297) % 233280) / 233280;
  if (range === 'daily') {
    const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
    return hours.map((h, i) => ({ label: h, usage: Math.round(rand(i) * 25 + 5) }));
  }
  if (range === 'weekly') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d, i) => ({ label: d, usage: Math.round(rand(i + 10) * 80 + 40) }));
  }
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map((w, i) => ({ label: w, usage: Math.round(rand(i + 20) * 400 + 200) }));
}

export default function TrackUsage() {
  const { user } = useAuth();
  const { sensors, isLoading: sensorsLoading } = useSensors();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [readings, setReadings] = useState<any[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(true);

  const hasSensors = sensors.length > 0;

  useEffect(() => {
    async function fetchReadings() {
      if (!user || !hasSensors) { setReadingsLoading(false); return; }
      setReadingsLoading(true);
      const sensorIds = sensors.map((s) => s.id);
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .in('sensor_id', sensorIds)
        .order('recorded_at', { ascending: true });
      if (!error && data) setReadings(data);
      setReadingsLoading(false);
    }
    if (!sensorsLoading) fetchReadings();
  }, [user, sensors, sensorsLoading, hasSensors]);

  const realData = useMemo(() => {
    if (!hasSensors || readings.length === 0) return null;
    const now = new Date();
    const filtered = readings.filter((r) => {
      const d = new Date(r.recorded_at);
      if (timeRange === 'daily') return d.toDateString() === now.toDateString();
      if (timeRange === 'weekly') {
        const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      const monthAgo = new Date(now); monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });

    if (filtered.length === 0) return null;

    if (timeRange === 'daily') {
      const byHour: Record<string, number> = {};
      filtered.forEach((r) => {
        const h = new Date(r.recorded_at).getHours();
        const label = h >= 12 ? `${h === 12 ? 12 : h - 12}pm` : `${h === 0 ? 12 : h}am`;
        byHour[label] = (byHour[label] || 0) + Number(r.reading_value);
      });
      return Object.entries(byHour).map(([label, usage]) => ({ label, usage: Math.round(usage) }));
    }
    if (timeRange === 'weekly') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const byDay: Record<string, number> = {};
      filtered.forEach((r) => {
        const label = days[new Date(r.recorded_at).getDay()];
        byDay[label] = (byDay[label] || 0) + Number(r.reading_value);
      });
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        .filter((d) => byDay[d])
        .map((label) => ({ label, usage: Math.round(byDay[label]) }));
    }
    // monthly - by week
    const byWeek: Record<string, number> = {};
    filtered.forEach((r) => {
      const d = new Date(r.recorded_at);
      const weekNum = Math.ceil(d.getDate() / 7);
      const label = `Week ${weekNum}`;
      byWeek[label] = (byWeek[label] || 0) + Number(r.reading_value);
    });
    return Object.entries(byWeek).map(([label, usage]) => ({ label, usage: Math.round(usage) }));
  }, [readings, timeRange, hasSensors]);

  const chartData = realData || generateMockUsageData(timeRange);
  const isUsingMock = !realData;
  const totalUsage = chartData.reduce((sum, d) => sum + d.usage, 0);
  const avgUsage = chartData.length > 0 ? Math.round(totalUsage / chartData.length) : 0;

  const tickStyle = { fill: CHART_LABEL_COLOR, fontSize: 12, fontWeight: 500 };
  const tooltipStyle = { borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' };

  const loading = sensorsLoading || readingsLoading;

  return (
    <AppLayout>
      <WaterAnalyticsBackground />
      <div className="relative container py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              Track Usage
            </h1>
            <div className="flex items-center gap-2 mt-2 ml-[52px]">
              <p className="text-muted-foreground">Analyze your water consumption patterns</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px]">
                  <p>View your water usage data across daily, weekly, and monthly timeframes. Connect sensors to see real data instead of samples.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {isUsingMock && !loading && (
          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>This is sample data.</strong> Connect your sensors to see real water usage tracking.
              {hasSensors && readings.length === 0 && ' Your sensors are connected but no readings have been recorded yet.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((r) => (
            <Button key={r} size="sm" variant={timeRange === r ? 'default' : 'outline'} onClick={() => setTimeRange(r)} className="capitalize">{r}</Button>
          ))}
          {!isUsingMock && (
            <Badge variant="secondary" className="ml-2 text-xs gap-1">
              <Activity className="h-3 w-3" /> Live Data
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
            </div>
            <Skeleton className="h-64 rounded-xl" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="hover-glow bg-card shadow-sm">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Total Usage</p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12"><Droplets className="h-3.5 w-3.5 text-primary" /></div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{totalUsage} L</p>
                </CardContent>
              </Card>
              <Card className="hover-glow bg-card shadow-sm">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12"><Activity className="h-3.5 w-3.5 text-primary" /></div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{avgUsage} L</p>
                </CardContent>
              </Card>
              <Card className="hover-glow bg-card shadow-sm">
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Sensors</p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12"><TrendingUp className="h-3.5 w-3.5 text-primary" /></div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{sensors.length}</p>
                </CardContent>
              </Card>
            </div>

            {/* Usage Trend Area Chart */}
            <Card className="border border-border bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Usage Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_PRIMARY} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_PRIMARY} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                    <XAxis dataKey="label" tick={tickStyle} />
                    <YAxis unit=" L" tick={tickStyle} />
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="usage" name="Usage" stroke={CHART_PRIMARY} strokeWidth={2.5} fill="url(#usageGradient)" dot={{ r: 4, fill: CHART_PRIMARY }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution Bar Chart */}
            <Card className="border border-border bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                    <XAxis dataKey="label" tick={tickStyle} />
                    <YAxis unit=" L" tick={tickStyle} />
                    <RechartsTooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="usage" name="Usage" fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Per-Sensor Breakdown (real data only) */}
            {hasSensors && !isUsingMock && (
              <Card className="border border-border bg-card shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" /> Per-Sensor Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sensors.map((s) => {
                      const sensorTotal = readings
                        .filter((r) => r.sensor_id === s.id)
                        .reduce((sum: number, r: any) => sum + Number(r.reading_value), 0);
                      return (
                        <div key={s.id} className="flex items-center justify-between rounded-lg border p-3 bg-secondary/30">
                          <div className="flex items-center gap-3">
                            <Droplets className="h-4 w-4 text-primary" />
                            <div>
                              <p className="font-medium text-foreground text-sm">{s.sensor_name}</p>
                              <p className="text-xs text-muted-foreground">{s.location}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-foreground">{Math.round(sensorTotal)} L</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Usage Insights Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Usage Insights
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="hover-glow bg-card shadow-sm">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Total Usage</p>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12">
                        <Droplets className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">306 L</p>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </CardContent>
                </Card>
                <Card className="hover-glow bg-card shadow-sm">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Avg Daily Usage</p>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12">
                        <Activity className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">18 L</p>
                    <p className="text-xs text-muted-foreground">Per day</p>
                  </CardContent>
                </Card>
                <Card className="hover-glow bg-card shadow-sm">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Peak Usage Time</p>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">9–10 PM</p>
                    <p className="text-xs text-muted-foreground">Evening hours</p>
                  </CardContent>
                </Card>
                <Card className="hover-glow bg-card shadow-sm">
                  <CardContent className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">Weekly Change</p>
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12">
                        <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">+27%</p>
                    <p className="text-xs text-muted-foreground">vs last week (240 L)</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-border bg-card shadow-md">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sun className="h-5 w-5 text-primary" /> Smart Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Your water usage increased by 27% compared to last week.',
                      'Peak usage occurs during evening hours (9–10 PM).',
                      'Usage steadily increases throughout the day.',
                      'Your highest consumption happens after 6 PM.',
                    ].map((insight, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Lightbulb className="h-3 w-3 text-primary" />
                        </div>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
