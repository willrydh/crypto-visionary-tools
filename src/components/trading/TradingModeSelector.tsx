
import React from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, Sun, Moon } from 'lucide-react';

export const TradingModeSelector = () => {
  const { tradingMode, setTradingMode } = useTradingMode();
  
  const handleModeChange = (value: string) => {
    if (value && (value === 'scalp' || value === 'day' || value === 'night')) {
      setTradingMode(value as 'scalp' | 'day' | 'night');
    }
  };
  
  return (
    <TooltipProvider>
      <div className="flex flex-col space-y-1.5">
        <span className="text-sm font-medium">Trading Mode</span>
        <ToggleGroup 
          type="single" 
          value={tradingMode} 
          onValueChange={handleModeChange}
          className="flex justify-between border rounded-lg p-1 bg-muted/40 w-full"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="scalp" 
                className="w-full text-xs flex items-center justify-center gap-1.5 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>Scalp</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-3">
              <p className="font-medium mb-1">Scalping Mode</p>
              <p className="text-sm text-muted-foreground">
                Ultra-short term trading (minutes). Focuses on small, quick price movements with frequent entries/exits.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Timeframes: 1m, 5m, 15m
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="day" 
                className="w-full text-xs flex items-center justify-center gap-1.5 data-[state=on]:bg-amber-500 data-[state=on]:text-white"
              >
                <Sun className="h-3.5 w-3.5" />
                <span>Day</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-3">
              <p className="font-medium mb-1">Day Trading Mode</p>
              <p className="text-sm text-muted-foreground">
                Short-term trading (hours). Positions opened and closed within the same trading day, avoiding overnight risk.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Timeframes: 15m, 1h, 4h
              </p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem 
                value="night" 
                className="w-full text-xs flex items-center justify-center gap-1.5 data-[state=on]:bg-indigo-500 data-[state=on]:text-white"
              >
                <Moon className="h-3.5 w-3.5" />
                <span>Night</span>
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-3">
              <p className="font-medium mb-1">Night Trading Mode</p>
              <p className="text-sm text-muted-foreground">
                Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Timeframes: 1h, 4h, 1d
              </p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};
