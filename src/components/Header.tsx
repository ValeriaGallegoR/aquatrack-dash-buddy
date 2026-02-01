import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Droplets, LogOut, LayoutDashboard, Users } from 'lucide-react';

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <Droplets className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AquaTrack
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </Button>
          )}

          <div className="ml-2 flex items-center gap-3 border-l pl-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Logout</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
