import { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showOnlineBanner, setShowOnlineBanner] = useState(false);
  const [visible, setVisible] = useState(!navigator.onLine);
  const wasOffline = useRef(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => {
      setIsOffline(true);
      setVisible(true);
      wasOffline.current = true;
      setShowOnlineBanner(false);
    };
    const goOnline = () => {
      setIsOffline(false);
      if (wasOffline.current) {
        setShowOnlineBanner(true);
        setVisible(true);
        // Auto-hide online banner after 5 seconds
        setTimeout(() => {
          setShowOnlineBanner(false);
          setVisible(false);
        }, 5000);
      }
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!visible && !isOffline) return null;

  if (isOffline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down">
        <div className="mx-auto max-w-screen-xl px-4 py-0">
          <div className="flex items-center justify-center gap-3 rounded-b-xl bg-destructive px-6 py-3 shadow-lg shadow-destructive/20 animate-pulse-subtle">
            <WifiOff className="h-5 w-5 text-destructive-foreground flex-shrink-0" />
            <p className="text-sm font-medium text-destructive-foreground">
              You are offline. Showing your last saved data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showOnlineBanner) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] animate-slide-down">
        <div className="mx-auto max-w-screen-xl px-4 py-0">
          <div className="flex items-center justify-center gap-3 rounded-b-xl bg-accent px-6 py-3 shadow-lg shadow-accent/20">
            <Wifi className="h-5 w-5 text-accent-foreground flex-shrink-0" />
            <p className="text-sm font-medium text-accent-foreground">
              Connection restored. Your dashboard is now synced.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
