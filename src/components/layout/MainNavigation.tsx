
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Settings,
  Zap,
  Radar,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/assets/logo.svg';
import CollapsibleNavMenu from './CollapsibleNavMenu';

// Navigation items for the sidebar
const navItems = [
  { path: '/', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { path: '/signals', label: 'Signals', icon: <Radar className="h-5 w-5" /> },
  { path: '/trade', label: 'Trade', icon: <Zap className="h-5 w-5" /> },
  { path: '/calendar', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
  { path: '/chart', label: 'Chart', icon: <LineChart className="h-5 w-5" /> },
  { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

const MainNavigation: React.FC = () => {
  return (
    <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 border-r border-border bg-background z-50">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="ProfitPilot" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="font-bold text-lg">ProfitPilot</span>
            <span className="text-xs text-muted-foreground">Profits on Autopilot</span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="mt-4 px-3">
          <CollapsibleNavMenu />
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          © 2025 ProfitPilot by Zentra LLC
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
