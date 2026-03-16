import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import WaterAnalyticsBackground from '@/components/WaterAnalyticsBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Droplets, MapPin, Clock, Wifi, WifiOff, Radio, TrendingUp, TrendingDown, BarChart3, Activity, Gauge } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useSensors } from '@/hooks/useSensors';
import { formatDistanceToNow } from 'date-fns';

type TimeRange = 'daily' | 'weekly' | 'monthly';

function generateMockData(sensorCode: string, range: TimeRange) {
  const seed = sensorCode.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;

  if (range === 'daily') {
    const hours = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
    return hours.map((h, i) => ({ label: h, current: Math.round(rand(i) * 18 + 2), previous: Math.round(rand(i + 100) * 18 + 2) }));
  }
  if (range === 'weekly') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d, i) => ({ label: d, current: Math.round(rand(i) * 55 + 15), previous: Math.round(rand(i + 50) * 55 + 15) }));
  }
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map((w, i) => ({ label: w, current: Math.round(rand(i) * 350 + 100), previous: Math.round(rand(i + 70) * 350 + 100) }));
}

function computeMetrics(data: { current: number }[]) {
  const values = data.map((d) => d.current);
  const total = values.reduce((a, b) => a + b, 0);
  return { total, avg: Math.round(total / values.length), max: Math.max(...values), min: Math.min(...values), latest: values[values.length - 1] };
}

function pctChange(curr: number, prev: number) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

const timeRangeLabels: Record<TimeRange, { current: string; previous: string }> = {
  daily: { current: 'Today', previous: 'Yesterday' },
  weekly: { current: 'This Week', previous: 'Last Week' },
  monthly: { current: 'This Month', previous: 'Last Month' },
};

const CHART_LABEL_COLOR = 'hsl(var(--chart-label))';
const CHART_GRID_COLOR = 'hsl(var(--chart-grid))';
const CHART_PRIMARY = 'hsl(var(--primary))';
const CHART_SECONDARY = 'hsl(var(--chart-secondary))';

export default function SensorDetails() {
  const { sensorId } = useParams<{ sensorId: string }>();
  const navigate = useNavigate();
  const { sensors, isLoading } = useSensors();
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');

  const sensor = sensors.find((s) => s.sensor_code === sensorId || s.id === sensorId);
  const mockData = useMemo(() => generateMockData(sensorId || 'default', timeRange), [sensorId, timeRange]);
  const metrics = useMemo(() => computeMetrics(mockData), [mockData]);
  const prevMetrics = useMemo(() => {
    const vals = mockData.map((d) => d.previous);
    const t = vals.reduce((a, b) => a + b, 0);
    return { total: t, avg: Math.round(t / vals.length) };
  }, [mockData]);

  const totalPct = pctChange(metrics.total, prevMetrics.total);
  const labels = timeRangeLabels[timeRange];

  const tickStyle = { fill: CHART_LABEL_COLOR, fontSize: 12, fontWeight: 500 };
  const tooltipStyle = { borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' };

  if (isLoading) {
    return (
      <AppLayout>
        <WaterAnalyticsBackground />
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!sensor) {
    return (
      <AppLayout>
        <WaterAnalyticsBackground />
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Sensor Not Found</h1>
          <p className="text-muted-foreground">The sensor "{sensorId}" could not be found.</p>
          <Button variant="outline" onClick={() => navigate('/sensors')}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Sensors</Button>
        </div>
      </AppLayout>
    );
  }

  const isConnected = sensor.status === 'connected';
  const formatTs = (ts: string) => { try { return formatDistanceToNow(new Date(ts), { addSuffix: true }); } catch { return 'Unknown'; } };

  const metricCards = [
    { title: 'Total Usage', value: `${metrics.total} L`, icon: Droplets, change: totalPct },
    { title: 'Average Usage', value: `${metrics.avg} L`, icon: Activity, change: pctChange(metrics.avg, prevMetrics.avg) },
    { title: 'Maximum', value: `${metrics.max} L`, icon: TrendingUp, change: null },
    { title: 'Minimum', value: `${metrics.min} L`, icon: TrendingDown, change: null },
    { title: 'Current Value', value: `${metrics.latest} L`, icon: Gauge, change: null },
  ];

  return (
    <AppLayout>
      <WaterAnalyticsBackground />
      <div className="relative p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => navigate('/sensors')}>
          <ArrowLeft className="h-4 w-4" /> Back to Sensors
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${isConnected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{sensor.sensor_name}</h1>
              <p className="text-sm text-muted-foreground font-mono">{sensor.sensor_code}</p>
            </div>
          </div>
          <Badge variant="outline" className={`self-start gap-1.5 text-sm font-medium px-3 py-1 ${isConnected ? 'border-primary/40 bg-primary/10 text-primary' : 'border-destructive/30 bg-destructive/5 text-destructive/80'}`}>
            {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: MapPin, label: 'Location', val: sensor.location },
            { icon: Droplets, label: "Today's Usage", val: `${sensor.today_usage} L` },
            { icon: Clock, label: 'Last Updated', val: formatTs(sensor.last_updated) },
          ].map((c) => (
            <Card key={c.label} className="hover-glow border border-border bg-card shadow-sm">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12"><c.icon className="h-5 w-5 text-primary" /></div>
                <div><p className="text-sm text-muted-foreground">{c.label}</p><p className="font-semibold text-foreground">{c.val}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-2">
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map((r) => (
            <Button key={r} size="sm" variant={timeRange === r ? 'default' : 'outline'} onClick={() => setTimeRange(r)} className="capitalize">{r}</Button>
          ))}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {metricCards.map((m) => (
            <Card key={m.title} className="card-3d border border-border bg-card shadow-sm">
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{m.title}</p>
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/12"><m.icon className="h-3.5 w-3.5 text-primary" /></div>
                </div>
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                {m.change !== null && (
                  <p className={`text-xs font-medium ${m.change >= 0 ? 'text-destructive' : 'text-accent'}`}>
                    {m.change >= 0 ? '↑' : '↓'} {Math.abs(m.change)}% vs {labels.previous}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Usage Trend Line Chart */}
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Usage Trend — {labels.current}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                <XAxis dataKey="label" tick={tickStyle} />
                <YAxis unit=" L" tick={tickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="current" name={labels.current} stroke={CHART_PRIMARY} strokeWidth={2.5} dot={{ r: 4, fill: CHART_PRIMARY }} activeDot={{ r: 6, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Distribution Bar Chart */}
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /> Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                <XAxis dataKey="label" tick={tickStyle} />
                <YAxis unit=" L" tick={tickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="current" name={labels.current} fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> {labels.current} vs {labels.previous}</CardTitle>
              <Badge variant="outline" className={`text-xs ${totalPct >= 0 ? 'border-destructive/30 text-destructive' : 'border-accent/30 text-accent'}`}>
                {totalPct >= 0 ? '↑' : '↓'} {Math.abs(totalPct)}% overall
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={mockData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
                <XAxis dataKey="label" tick={tickStyle} />
                <YAxis unit=" L" tick={tickStyle} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 13, fontWeight: 500, color: CHART_LABEL_COLOR }} />
                <Bar dataKey="current" name={labels.current} fill={CHART_PRIMARY} radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" name={labels.previous} fill={CHART_SECONDARY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Period Comparison Summary */}
        <Card className="border border-border bg-card shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Period Comparison Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockData.slice(0, 4).map((d) => {
                const change = pctChange(d.current, d.previous);
                return (
                  <div key={d.label} className="rounded-lg bg-secondary/50 p-4 text-center space-y-1">
                    <p className="text-sm text-muted-foreground">{d.label}</p>
                    <p className="text-lg font-bold text-foreground">{d.current} L</p>
                    <p className={`text-xs font-medium ${change >= 0 ? 'text-destructive' : 'text-accent'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
