
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
import { TradingModeType } from '@/components/trading/TradingModeStyles';
import { useIsMobile } from '@/hooks/use-mobile';

const TopHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Safely use the trading mode context with fallbacks
  let tradingMode: TradingModeType = 'day';
  let getDescription = () => 'Select a trading mode to see details.';
  let isLoading = false;
  let generateAnalysis: (symbol: string, force?: boolean) => Promise<void> = async () => {};
  
  try {
    const tradingModeContext = useTradingMode();
    tradingMode = tradingModeContext.tradingMode as TradingModeType;
    getDescription = tradingModeContext.getDescription;
    
    const analysisContext = useTechnicalAnalysis();
    isLoading = analysisContext.isLoading;
    generateAnalysis = analysisContext.generateAnalysis;
  } catch (error) {
    console.log('Context not available:', error);
  }
  
  // Only show trading mode bar on these pages - use path.startsWith to catch subpages too
  const showTradingBar = location.pathname === '/' || 
                          location.pathname === '/dashboard' || 
                          location.pathname === '/trade-suggestion' || 
                          location.pathname === '/trade' || 
                          location.pathname === '/signals' ||
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
    try {
      // Call generateAnalysis with the required parameters
      generateAnalysis('BTC/USDT', true);
      
      toast({
        title: "Analysis Updated",
        description: "The analysis has been refreshed based on current market data.",
      });
    } catch (error) {
      console.error('Error refreshing analysis:', error);
      toast({
        title: "Update Failed",
        description: "Could not refresh the analysis. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 ios-dynamic-island-area">
      {/* Main header with logo and actions - with better spacing */}
      <div className="max-w-7xl mx-auto h-12 flex items-center justify-between px-4 sm:px-5 md:px-6 md:ml-64">
        <div className="flex items-center md:hidden">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="ProfitPilot" className="h-5 w-5" />
            <div className="font-semibold text-sm">
              ProfitPilot
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate('/notifications')}
                  className="h-8 w-8"
                >
                  <Bell className="h-4 w-4" />
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
                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
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
            className="gap-1.5 text-xs h-8"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
      
      {/* Trading mode selector - show on specific pages - with improved spacing */}
      {showTradingBar && (
        <div className={cn("border-b border-border/40 trading-selector-container pb-2", getModeHeaderBgClass(tradingMode))}>
          <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 md:ml-64">
            <div className="flex items-center justify-between py-2">
              <div className="flex-grow">
                <TradingModeSelector compact={true} displayLabel={!isMobile} />
              </div>
              
              {/* Display active mode description */}
              {!isMobile && (location.pathname === '/signals' || location.pathname === '/trade-suggestion' || location.pathname === '/trade') && (
                <div className="hidden md:flex items-center text-muted-foreground text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
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
                        className="h-8 w-8 ml-2" 
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
        </div>
      )}
    </header>
  );
};

export default TopHeader;
