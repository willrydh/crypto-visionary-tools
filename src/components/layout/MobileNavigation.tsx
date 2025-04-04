
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Gauge, LineChart, CalendarDays, BarChart3, Bell, Settings } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  
  // Don't show mobile navigation on certain routes
  const hideOnRoutes = ['/welcome', '/pricing', '/forgot-password', '/reset-password', '/thank-you', '/sorry'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t pb-safe">
      <div className="grid grid-cols-5 gap-1 p-1">
        <NavItem 
          to="/" 
          icon={<Gauge className="h-5 w-5" />} 
          label="Dashboard"
          isActive={location.pathname === '/' || location.pathname === '/dashboard'} 
        />
        <NavItem 
          to="/signals" 
          icon={<LineChart className="h-5 w-5" />} 
          label="Signals"
          isActive={location.pathname === '/signals'} 
        />
        <NavItem 
          to="/calendar" 
          icon={<CalendarDays className="h-5 w-5" />} 
          label="Calendar"
          isActive={location.pathname === '/calendar'} 
        />
        <NavItem 
          to="/notifications" 
          icon={<Bell className="h-5 w-5" />} 
          label="Alerts"
          isActive={location.pathname === '/notifications'} 
        />
        <NavItem 
          to="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings"
          isActive={location.pathname === '/settings'} 
        />
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center py-2 px-1 rounded-md ${
        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

export default MobileNavigation;
