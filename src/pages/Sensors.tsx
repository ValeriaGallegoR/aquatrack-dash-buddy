import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Radio, MapPin, Droplets, Clock, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Sensor {
  id: string;
  name: string;
  sensorId: string;
  location: string;
  status: 'connected' | 'disconnected';
  todayUsage: number;
  lastUpdated: string;
}

const mockSensors: Sensor[] = [
  {
    id: '1',
    name: 'Kitchen Sink',
    sensorId: 'AQ-101',
    location: 'Kitchen',
    status: 'connected',
    todayUsage: 42,
    lastUpdated: '10 minutes ago',
  },
  {
    id: '2',
    name: 'Bathroom Shower',
    sensorId: 'AQ-102',
    location: 'Bathroom',
    status: 'connected',
    todayUsage: 86,
    lastUpdated: '5 minutes ago',
  },
  {
    id: '3',
    name: 'Garden Tap',
    sensorId: 'AQ-103',
    location: 'Garden',
    status: 'disconnected',
    todayUsage: 0,
    lastUpdated: '2 hours ago',
  },
  {
    id: '4',
    name: 'Laundry Outlet',
    sensorId: 'AQ-104',
    location: 'Laundry Room',
    status: 'connected',
    todayUsage: 31,
    lastUpdated: '18 minutes ago',
  },
];

export default function Sensors() {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);

  const handleRemove = (id: string) => {
    setSensors((prev) => prev.filter((s) => s.id !== id));
    toast.success('Sensor removed successfully.');
  };

  const handleViewDetails = (sensor: Sensor) => {
    toast.info(`Viewing details for ${sensor.name} (${sensor.sensorId})`);
  };

  const handleAddSensor = () => {
    toast.info('Add Sensor functionality coming soon.');
  };

  return (
    <AppLayout>
      <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Radio className="h-7 w-7 text-primary" />
          Sensors Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor your connected water sensors
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleAddSensor} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Sensor
        </Button>
      </div>

      {sensors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No sensors connected yet.</p>
            <Button onClick={handleAddSensor} variant="outline" className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add your first sensor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sensors.map((sensor) => (
            <Card key={sensor.id} className="hover-lift transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{sensor.name}</CardTitle>
                  <Badge
                    variant={sensor.status === 'connected' ? 'default' : 'secondary'}
                    className={
                      sensor.status === 'connected'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {sensor.status === 'connected' ? 'Connected' : 'Disconnected'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{sensor.sensorId}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{sensor.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Droplets className="h-4 w-4 text-primary" />
                  <span>Today: <span className="font-semibold text-foreground">{sensor.todayUsage} L</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Updated {sensor.lastUpdated}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => handleViewDetails(sensor)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(sensor.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
