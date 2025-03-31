
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Calendar, 
  Settings,
  Zap,
  Webhook,
  Radar,
  Bell,
  LineChart,
  ChevronUp,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const MobileNavigation: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Home', icon: <BarChart3 size={20} /> },
    { path: '/signals', label: 'Signals', icon: <Radar size={20} /> },
    { path: '/trade', label: 'Trade', icon: <Zap size={20} /> },
    { path: '/chart', label: 'Chart', icon: <LineChart size={20} /> },
    { path: '/calendar', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-background border-t border-border z-50 overflow-x-auto">
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
          
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center py-2 px-3 text-xs flex-1 text-muted-foreground">
                <ChevronUp size={20} />
                <span className="mt-1">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-72">
              <SheetHeader className="text-left mb-4">
                <SheetTitle>Trading Mode</SheetTitle>
              </SheetHeader>
              <div className="px-1">
                <TradingModeSelector />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </>
  );
};

export default MobileNavigation;
