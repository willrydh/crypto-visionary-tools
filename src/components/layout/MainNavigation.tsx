import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  CandlestickChart, 
  Calendar, 
  Settings,
  Zap,
  Webhook,
  Radar,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Navigation items for the sidebar
const navItems = [
  { path: '/', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { path: '/signals', label: 'Signals', icon: <Radar className="h-5 w-5" /> },
  { path: '/trade-suggestion', label: 'Trade', icon: <Zap className="h-5 w-5" /> },
  { path: '/calendar', label: 'Events', icon: <Calendar className="h-5 w-5" /> },
  { path: '/miner', label: 'Miner', icon: <Webhook className="h-5 w-5" /> },
  { path: '/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

const MainNavigation: React.FC = () => {
  return (
    <>
      {/* Desktop Sidebar - visible on medium screens and larger */}
      <div className="hidden md:flex h-screen w-64 flex-col fixed left-0 top-0 bottom-0 border-r border-border bg-background z-30">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">ProfitPilot AI</span>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>
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
        </div>
        
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2025 Tradingbot - ProfitPilot AI by Zentra LLC
          </div>
        </div>
      </div>
        
export default MainNavigation;
