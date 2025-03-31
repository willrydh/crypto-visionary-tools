
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Settings,
  Zap,
  Radar,
  LineChart,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import CollapsibleNavMenu from './CollapsibleNavMenu';

const MobileNavigation: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Home', icon: <BarChart3 size={20} /> },
    { path: '/signals', label: 'Signals', icon: <Radar size={20} /> },
    { path: '/trade', label: 'Trade', icon: <Zap size={20} /> },
    { path: '/chart', label: 'Chart', icon: <LineChart size={20} /> },
    { path: '/calendar', label: 'Events', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full md:hidden bg-background border-t border-border z-50">
      <nav className="flex justify-between">
        {navItems.map((item, index) => (
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
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center py-2 px-3 text-xs flex-1 text-muted-foreground">
              <Menu size={20} />
              <span className="mt-1">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh]">
            <div className="space-y-4 py-4">
              <h3 className="text-lg font-medium">Trading Tools</h3>
              <CollapsibleNavMenu />
              <NavLink
                to="/settings"
                className={({ isActive }) => 
                  cn(
                    "flex items-center gap-2 mt-4 px-4 py-2 rounded-md transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )
                }
              >
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default MobileNavigation;
