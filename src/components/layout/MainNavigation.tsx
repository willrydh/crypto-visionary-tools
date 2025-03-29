
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
  Webhook,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Navigation items for the sidebar
const navItems = [
  { path: '/', label: 'Dashboard', icon: <BarChart3 className="h-5 w-5" /> },
  { path: '/chart', label: 'Chart', icon: <CandlestickChart className="h-5 w-5" /> },
  { path: '/trade-suggestion', label: 'Trade', icon: <Zap className="h-5 w-5" /> },
  { path: '/calendar', label: 'Calendar', icon: <Calendar className="h-5 w-5" /> },
  { path: '/levels', label: 'Levels', icon: <Layers className="h-5 w-5" /> },
  { path: '/miner', label: 'Miner', icon: <Webhook className="h-5 w-5" /> },
  { path: '/faq', label: 'FAQ', icon: <HelpCircle className="h-5 w-5" /> },
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
            © 2023 ProfitPilot AI
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation - Sheet/drawer that opens on smaller screens */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-border">
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
              
              <div className="flex-1 overflow-auto py-4">
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
                  © 2023 ProfitPilot AI
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default MainNavigation;
