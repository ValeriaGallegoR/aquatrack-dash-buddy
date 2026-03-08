import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Droplets, MapPin, Clock, Wifi, WifiOff, Radio } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sensorData: Record<string, {
  name: string; sensorId: string; location: string; status: 'connected' | 'disconnected'; todayUsage: number; lastUpdated: string;
}> = {
  'AQ-101': { name: 'Kitchen Sink', sensorId: 'AQ-101', location: 'Kitchen', status: 'connected', todayUsage: 42, lastUpdated: '10 minutes ago' },
  'AQ-102': { name: 'Bathroom Shower', sensorId: 'AQ-102', location: 'Bathroom', status: 'connected', todayUsage: 86, lastUpdated: '5 minutes ago' },
  'AQ-103': { name: 'Garden Tap', sensorId: 'AQ-103', location: 'Garden', status: 'disconnected', todayUsage: 0, lastUpdated: '2 hours ago' },
  'AQ-104': { name: 'Laundry Outlet', sensorId: 'AQ-104', location: 'Laundry Room', status: 'connected', todayUsage: 31, lastUpdated: '18 minutes ago' },
};

const dailyTrend = [
  { hour: '6am', liters: 3 }, { hour: '8am', liters: 12 }, { hour: '10am', liters: 8 },
  { hour: '12pm', liters: 5 }, { hour: '2pm', liters: 4 }, { hour: '4pm', liters: 6 },
  { hour: '6pm', liters: 14 }, { hour: '8pm', liters: 9 }, { hour: '10pm', liters: 2 },
];

const weeklyComparison = [
  { day: 'Mon', liters: 38 }, { day: 'Tue', liters: 45 }, { day: 'Wed', liters: 32 },
  { day: 'Thu', liters: 50 }, { day: 'Fri', liters: 42 }, { day: 'Sat', liters: 58 }, { day: 'Sun', liters: 55 },
];

const monthlySummary = { totalLiters: 1240, avgDaily: 41, peakDay: 'Saturday', peakUsage: 68 };

export default function SensorDetails() {
  const { sensorId } = useParams<{ sensorId: string }>();
  const navigate = useNavigate();
  const sensor = sensorId ? sensorData[sensorId] : null;

  if (!sensor) {
    return (
      <AppLayout>
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Sensor Not Found</h1>
          <Button variant="outline" onClick={() => navigate('/sensors')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sensors
          </Button>
        </div>
      </AppLayout>
    );
  }

  const isConnected = sensor.status === 'connected';

  return (
    <AppLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        {/* Back */}
        <Button variant="ghost" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => navigate('/sensors')}>
          <ArrowLeft className="h-4 w-4" /> Back to Sensors
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${isConnected ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'}`}>
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{sensor.name}</h1>
              <p className="text-sm text-muted-foreground font-mono">{sensor.sensorId}</p>
            </div>
          </div>
          <Badge variant="outline" className={`self-start gap-1.5 text-sm font-medium px-3 py-1 ${isConnected ? 'border-accent/40 bg-accent/10 text-accent' : 'border-destructive/30 bg-destructive/5 text-destructive/80'}`}>
            {isConnected ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="flex items-center gap-3 p-5">
              <MapPin className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold text-foreground">{sensor.location}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="flex items-center gap-3 p-5">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Usage</p>
                <p className="font-semibold text-foreground">{sensor.todayUsage} L</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="flex items-center gap-3 p-5">
              <Clock className="h-5 w-5 text-primary/70" />
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-semibold text-foreground">{sensor.lastUpdated}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Usage Trend */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Daily Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis unit=" L" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="liters" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Weekly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis unit=" L" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Bar dataKey="liters" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Summary */}
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-base">Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Usage', value: `${monthlySummary.totalLiters} L` },
                { label: 'Daily Average', value: `${monthlySummary.avgDaily} L` },
                { label: 'Peak Day', value: monthlySummary.peakDay },
                { label: 'Peak Usage', value: `${monthlySummary.peakUsage} L` },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-secondary/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-lg font-bold text-foreground mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
