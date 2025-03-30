
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, Bitcoin, CircleDollarSign } from 'lucide-react';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from '@/assets/logo.svg';

const TopHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleNotifications = () => {
    // Navigate to notifications page
    navigate('/notifications');
    
    toast({
      title: "Notifications",
      description: "Viewing your latest notifications",
    });
  };
  
  const handleLogout = () => {
    // In a real app, this would clear authentication tokens
    localStorage.removeItem('user');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to welcome page
    navigate('/welcome');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 md:px-6 md:ml-64">
      <div className="flex items-center gap-2 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="ProfitPilot AI" className="h-8 w-8" />
          <div className="font-semibold">
            ProfitPilot AI
            <span className="text-xs text-muted-foreground ml-1">Profits on Autopilot</span>
          </div>
        </Link>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:block">
          <TradingModeSelector />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotifications}
              >
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications & Activity Log</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 gap-1"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default TopHeader;
