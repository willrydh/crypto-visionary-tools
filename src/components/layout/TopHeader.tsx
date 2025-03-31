
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from '@/assets/logo.svg';
import { useTradingMode } from '@/hooks/useTradingMode';
import { cn } from '@/lib/utils';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';

const TopHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { tradingMode, setTradingMode } = useTradingMode();
  const { isLoading, generateAnalysis } = useTechnicalAnalysis();
  
  // Update to include signals page in the list of pages that show trading mode bar
  const showTradingBar = location.pathname === '/' || 
                          location.pathname === '/trade-suggestion' || 
                          location.pathname === '/trade' || 
                          location.pathname === '/signals';
  
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

  const handleModeChange = (mode: 'scalp' | 'day' | 'night') => {
    setTradingMode(mode);
  };

  const handleRefresh = () => {
    generateAnalysis('BTC/USDT', true);
    toast({
      title: "Analysis Updated",
      description: "The analysis has been refreshed based on current market data.",
    });
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 flex flex-col">
      {/* Main header with logo and actions */}
      <div className="h-14 flex items-center px-4 md:px-6 md:ml-64">
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="ProfitPilot" className="h-8 w-8" />
            <div className="font-semibold">
              ProfitPilot
            </div>
          </Link>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleNotifications}
                  asChild
                >
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
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
      </div>
      
      {/* Trading mode selector - show on dashboard, trade-suggestion and signals pages */}
      {showTradingBar && (
        <div className="px-4 md:px-6 md:ml-64 bg-primary/5 border-b border-border/40">
          <div className="flex items-center justify-between py-2">
            <div className="grid grid-cols-3 gap-1 flex-grow max-w-md">
              {/* Scalp Trading Button */}
              <button
                onClick={() => handleModeChange('scalp')}
                className={cn(
                  "relative flex items-center justify-center rounded-md transition-all duration-200 py-1.5 px-2",
                  tradingMode === 'scalp' 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-blue-900/20 text-blue-400 hover:bg-blue-900/30"
                )}
              >
                <span className="flex items-center text-sm font-medium">
                  <span className="mr-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </span>
                  Scalp
                </span>
              </button>

              {/* Day Trading Button */}
              <button
                onClick={() => handleModeChange('day')}
                className={cn(
                  "relative flex items-center justify-center rounded-md transition-all duration-200 py-1.5 px-2",
                  tradingMode === 'day' 
                    ? "bg-amber-600 text-white shadow-md" 
                    : "bg-amber-900/20 text-amber-400 hover:bg-amber-900/30"
                )}
              >
                <span className="flex items-center text-sm font-medium">
                  <span className="mr-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  </span>
                  Day
                </span>
              </button>

              {/* Night Trading Button */}
              <button
                onClick={() => handleModeChange('night')}
                className={cn(
                  "relative flex items-center justify-center rounded-md transition-all duration-200 py-1.5 px-2",
                  tradingMode === 'night' 
                    ? "bg-indigo-600 text-white shadow-md" 
                    : "bg-indigo-900/20 text-indigo-400 hover:bg-indigo-900/30"
                )}
              >
                <span className="flex items-center text-sm font-medium">
                  <span className="mr-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  </span>
                  Night
                </span>
              </button>
            </div>
            
            {/* Refresh button */}
            {(location.pathname === '/trade-suggestion' || location.pathname === '/trade' || location.pathname === '/' || location.pathname === '/signals') && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2" 
                      onClick={handleRefresh}
                      disabled={isLoading}
                    >
                      <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh Analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopHeader;
