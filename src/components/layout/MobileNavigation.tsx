
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  CandlestickChart, 
  Calendar, 
  Layers, 
  Settings,
  Zap,
  HelpCircle,
  Webhook
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavigation: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: <BarChart3 size={20} /> },
    { path: '/chart', label: 'Chart', icon: <CandlestickChart size={20} /> },
    { path: '/trade-suggestion', label: 'Trade', icon: <Zap size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/levels', label: 'Levels', icon: <Layers size={20} /> },
    { path: '/miner', label: 'Miner', icon: <Webhook size={20} /> },
    { path: '/faq', label: 'FAQ', icon: <HelpCircle size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden bg-background border-t border-border z-50 overflow-x-auto">
      <nav className="flex">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              cn(
                "flex flex-col items-center py-2 px-3 text-xs flex-shrink-0",
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
