
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
import { Card, CardContent } from "@/components/ui/card";

export const TradingModeSelector: React.FC = () => {
  const { tradingMode, setTradingMode, getVolatilityEvents } = useTradingMode();
  
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-3">
        <div className="flex flex-col space-y-3">
          <div className="flex border rounded-lg overflow-hidden w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={tradingMode === 'scalp' ? "default" : "ghost"}
                    className={`rounded-none border-r flex-1 py-1 px-2 ${tradingMode === 'scalp' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setTradingMode('scalp')}
                    size="sm"
                  >
                    <Clock4 size={16} className="mr-2" />
                    <span className="hidden sm:inline">Scalp</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scalp Trading: Minutes to hours</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={tradingMode === 'day' ? "default" : "ghost"}
                    className={`rounded-none border-r flex-1 py-1 px-2 ${tradingMode === 'day' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setTradingMode('day')}
                    size="sm"
                  >
                    <CalendarClock size={16} className="mr-2" />
                    <span className="hidden sm:inline">Day</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Day Trading: Several hours</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={tradingMode === 'night' ? "default" : "ghost"}
                    className={`rounded-none flex-1 py-1 px-2 ${tradingMode === 'night' ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => setTradingMode('night')}
                    size="sm"
                  >
                    <Moon size={16} className="mr-2" />
                    <span className="hidden sm:inline">Night</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Night Trading: 12+ hours</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Volatility events:</span>
            <ul className="mt-1 ml-4 list-disc space-y-0.5">
              {getVolatilityEvents().slice(0, 2).map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
