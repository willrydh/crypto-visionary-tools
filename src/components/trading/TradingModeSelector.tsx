
import React from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TradingModeSelector = () => {
  let tradingMode = 'day';
  let setTradingMode = (mode: any) => console.log('Trading mode not available:', mode);
  let getDescription = () => '';
  
  try {
    const tradingModeContext = useTradingMode();
    tradingMode = tradingModeContext.tradingMode;
    setTradingMode = tradingModeContext.setTradingMode;
    getDescription = tradingModeContext.getDescription;
  } catch (error) {
    console.log('Trading mode context not available');
  }
  
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'day':
        return <Sun className="h-4 w-4" />;
      case 'night':
        return <Moon className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getModeColor = (mode: string) => {
    if (mode === tradingMode) {
      switch (mode) {
        case 'day':
          return 'bg-amber-500 hover:bg-amber-600 text-white';
        case 'night':
          return 'bg-indigo-500 hover:bg-indigo-600 text-white';
        default:
          return 'bg-primary hover:bg-primary/90';
      }
    }
    return 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
  };
  
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur rounded-full p-1 border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTradingMode('day')}
              className={`rounded-full px-3 ${getModeColor('day')}`}
            >
              <Sun className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Day</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 max-w-xs">
              <p className="font-medium">Day Trading Mode</p>
              <p className="text-xs text-muted-foreground">
                Short-term trading (hours). Positions opened and closed within the same day.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTradingMode('night')}
              className={`rounded-full px-3 ${getModeColor('night')}`}
            >
              <Moon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Night</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 max-w-xs">
              <p className="font-medium">Night Trading Mode</p>
              <p className="text-xs text-muted-foreground">
                Medium-term trading (12+ hours). Positions that can be held overnight.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
