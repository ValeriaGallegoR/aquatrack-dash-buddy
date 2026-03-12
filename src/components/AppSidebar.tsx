import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, Radio, LogOut, Droplets, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navItems = [
  { title: 'Home', url: '/home', icon: Home },
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Sensors', url: '/sensors', icon: Radio },
  { title: 'Alerts', url: '/alerts', icon: Bell },
];

export function AppSidebar() {
  const { profile, logout } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out');
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Droplets className="h-6 w-6 shrink-0 text-primary" />
          {!collapsed && <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AquaTrack</span>}
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url || location.pathname.startsWith(item.url + '/')} tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === '/home'} className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        {!collapsed && (
          <div className="px-2 py-1">
            <p className="text-xs text-muted-foreground truncate">{profile?.username ?? profile?.email}</p>
          </div>
        )}
        <Button variant="ghost" size={collapsed ? 'icon' : 'sm'} className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
