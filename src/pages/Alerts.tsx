import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { formatDistanceToNow } from 'date-fns';

const alertIcons: Record<string, React.ReactNode> = {
  warning: <AlertTriangle className="h-4 w-4 text-destructive" />,
  info: <Info className="h-4 w-4 text-primary" />,
  success: <CheckCircle className="h-4 w-4 text-accent" />,
};

export default function Alerts() {
  const { alerts, isLoading, markAsRead } = useAlerts();

  return (
    <AppLayout>
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            Alerts
          </h1>
          <p className="text-muted-foreground mt-2 ml-[52px]">View your system alerts and notifications</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : alerts.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No alerts</h2>
              <p className="text-muted-foreground max-w-sm">You're all caught up! Alerts will appear here when something needs your attention.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className={`transition-all ${alert.is_read ? 'opacity-60' : ''}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {alertIcons[alert.alert_type] || alertIcons.info}
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.is_read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>Mark read</Button>
                    )}
                    <Badge variant="outline" className="capitalize">{alert.alert_type}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
