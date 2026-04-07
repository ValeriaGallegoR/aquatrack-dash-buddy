import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRoomGroups } from '@/hooks/useRoomGroups';
import { useSensors } from '@/hooks/useSensors';
import { ArrowLeft, Home, Radio, Droplets } from 'lucide-react';

export default function RoomGroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { groups, isLoading: groupsLoading } = useRoomGroups();
  const { sensors, isLoading: sensorsLoading } = useSensors();

  const group = groups.find((g) => g.id === groupId);
  const groupSensors = sensors.filter((s) => s.room_group_id === groupId);
  const isLoading = groupsLoading || sensorsLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container py-8">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </AppLayout>
    );
  }

  if (!group) {
    return (
      <AppLayout>
        <div className="container py-8 text-center space-y-4">
          <p className="text-muted-foreground">Room group not found.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container py-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/12">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{group.name}</h1>
              <p className="text-sm text-muted-foreground">
                {groupSensors.length} sensor{groupSensors.length !== 1 ? 's' : ''} in this group
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sensors</p>
                <p className="text-xl font-bold text-foreground">{groupSensors.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-accent/10 p-2.5 text-accent">
                <Droplets className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Usage Today</p>
                <p className="text-xl font-bold text-foreground">
                  {groupSensors.reduce((sum, s) => sum + s.today_usage, 0)} L
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-xl font-bold text-foreground">
                  {groupSensors.filter((s) => s.status === 'connected').length} / {groupSensors.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sensor list */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Sensors</h2>
          {groupSensors.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="p-6 text-center text-muted-foreground">
                No sensors assigned to this group yet. Go to Sensors to assign devices.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {groupSensors.map((s) => (
                <Card
                  key={s.id}
                  onClick={() => navigate(`/sensors/${s.sensor_code}`)}
                  className="cursor-pointer border border-border hover:border-primary/40 hover:shadow-md transition-all group"
                >
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{s.sensor_name}</p>
                        <p className="text-xs text-muted-foreground">{s.location} · {s.sensor_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={s.status === 'connected' ? 'default' : 'secondary'}>
                        {s.status === 'connected' ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="font-semibold text-foreground text-sm">{s.today_usage} L</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
