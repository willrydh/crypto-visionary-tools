
import React from 'react';
import { Button } from "@/components/ui/button";
import { Clock4, CalendarClock, Moon } from 'lucide-react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TradingModeSelector: React.FC = () => {
  const { tradingMode, setTradingMode } = useTradingMode();
  
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={tradingMode === 'scalp' ? "default" : "ghost"}
              className="rounded-none border-r"
              onClick={() => setTradingMode('scalp')}
              size="sm"
            >
              <Clock4 size={16} className="mr-2" />
              <span className="hidden sm:inline">Scalp</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Scalp Trading: 1m-30m timeframes</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={tradingMode === 'day' ? "default" : "ghost"}
              className="rounded-none border-r"
              onClick={() => setTradingMode('day')}
              size="sm"
            >
              <CalendarClock size={16} className="mr-2" />
              <span className="hidden sm:inline">Day</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Day Trading: 15m-4h timeframes</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant={tradingMode === 'night' ? "default" : "ghost"}
              className="rounded-none"
              onClick={() => setTradingMode('night')}
              size="sm"
            >
              <Moon size={16} className="mr-2" />
              <span className="hidden sm:inline">Night</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Night Trading: 1h-1d timeframes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
