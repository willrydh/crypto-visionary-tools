
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Settings, 
  Bell, 
  Activity,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MobileNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            isActive('/') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/signals" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            isActive('/signals') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Activity className="h-5 w-5 mb-1" />
          <span>Signals</span>
        </Link>
        
        <Link 
          to="/trade" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            isActive('/trade') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Lightbulb className="h-5 w-5 mb-1" />
          <span>Trade</span>
        </Link>
        
        <Link 
          to="/notifications" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            isActive('/notifications') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Bell className="h-5 w-5 mb-1" />
          <span>Alerts</span>
        </Link>
        
        <Link 
          to="/education" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs",
            isActive('/education') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <BookOpen className="h-5 w-5 mb-1" />
          <span>Learn</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
