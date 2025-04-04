
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Settings, 
  Bell, 
  Activity,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40 pb-safe">
      <div className="flex justify-around items-center h-16 px-1">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-[10px]",
            isActive('/') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5 mb-0.5" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/signals" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-[10px]",
            isActive('/signals') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Activity className="h-5 w-5 mb-0.5" />
          <span>Signals</span>
        </Link>
        
        <Link 
          to="/trade" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-[10px]",
            isActive('/trade') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Lightbulb className="h-5 w-5 mb-0.5" />
          <span>Trade</span>
        </Link>
        
        <Link 
          to="/calendar" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-[10px]",
            isActive('/calendar') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Calendar className="h-5 w-5 mb-0.5" />
          <span>Calendar</span>
        </Link>
        
        <Link 
          to="/education" 
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-[10px]",
            isActive('/education') ? "text-primary" : "text-muted-foreground"
          )}
        >
          <BookOpen className="h-5 w-5 mb-0.5" />
          <span>Learn</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
