
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Settings,
  Zap,
  Radar,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavigation: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: <BarChart3 size={20} /> },
    { path: '/signals', label: 'Signals', icon: <Radar size={20} /> },
    { path: '/trade', label: 'Trade', icon: <Zap size={20} /> },
    { path: '/chart', label: 'Chart', icon: <LineChart size={20} /> },
    { path: '/calendar', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden bg-background border-t border-border z-50">
      <nav className="flex justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center py-2 px-3 text-xs flex-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )
            }
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
