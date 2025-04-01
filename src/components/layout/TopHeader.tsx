
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from '@/assets/logo.svg';
import { useTradingMode } from '@/hooks/useTradingMode';
import { cn } from '@/lib/utils';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';
import { getModeHeaderBgClass } from '@/components/trading/TradingModeStyles';

const TopHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { tradingMode, getDescription } = useTradingMode();
  const { isLoading, generateAnalysis } = useTechnicalAnalysis();
  
  // Only show trading mode bar on these pages - use path.startsWith to catch subpages too
  const showTradingBar = location.pathname === '/' || 
                          location.pathname === '/dashboard' || 
                          location.pathname === '/trade-suggestion' || 
                          location.pathname === '/trade' || 
                          location.pathname === '/signals' ||
                          location.pathname === '/chart' ||
                          location.pathname === '/calendar';
  
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

  const handleRefresh = () => {
    generateAnalysis('BTC/USDT', true);
    toast({
      title: "Analysis Updated",
      description: "The analysis has been refreshed based on current market data.",
    });
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      {/* Main header with logo and actions */}
      <div className="h-16 flex items-center px-6 ml-64">
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
                  onClick={() => navigate('/notifications')}
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
      </div>
      
      {/* Trading mode selector - show on specific pages */}
      {showTradingBar && (
        <div className={cn("px-6 ml-64", getModeHeaderBgClass(tradingMode), "border-b border-border/40")}>
          <div className="flex items-center justify-between py-2.5">
            <div className="flex-grow">
              <TradingModeSelector compact={true} displayLabel={false} />
            </div>
            
            {/* Display active mode description */}
            {(location.pathname === '/signals' || location.pathname === '/trade-suggestion' || location.pathname === '/trade') && (
              <div className="hidden md:flex items-center text-muted-foreground text-xs">
                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>{tradingMode.charAt(0).toUpperCase() + tradingMode.slice(1)} Mode</span>
              </div>
            )}
            
            {/* Refresh button */}
            {(location.pathname === '/trade-suggestion' || location.pathname === '/trade' || location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/signals') && (
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
