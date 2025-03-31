
import React from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export const TradingModeSelector = () => {
  const { tradingMode, setTradingMode } = useTradingMode();
  const isMobile = useIsMobile();
  
  const handleModeChange = (mode: 'scalp' | 'day' | 'night') => {
    setTradingMode(mode);
  };

  const modeButtons = [
    { 
      id: 'scalp', 
      label: 'Scalp',
      icon: <Zap className="h-4 w-4" />,
      description: 'Ultra-short term trading (minutes). Focuses on small, quick price movements with frequent entries/exits.',
      timeframes: '1m, 5m, 15m',
      color: 'from-blue-600 to-blue-400',
      activeColor: 'bg-gradient-to-r from-blue-600 to-blue-500',
      hoverColor: 'hover:bg-blue-500/10',
      ringColor: 'ring-blue-500/30',
      borderColor: 'border-blue-500/20',
      iconClass: 'text-blue-500'
    },
    { 
      id: 'day', 
      label: 'Day',
      icon: <Sun className="h-4 w-4" />,
      description: 'Short-term trading (hours). Positions opened and closed within the same trading day, avoiding overnight risk.',
      timeframes: '15m, 1h, 4h',
      color: 'from-amber-500 to-amber-400',
      activeColor: 'bg-gradient-to-r from-amber-500 to-amber-400',
      hoverColor: 'hover:bg-amber-500/10',
      ringColor: 'ring-amber-500/30',
      borderColor: 'border-amber-500/20',
      iconClass: 'text-amber-500'
    },
    { 
      id: 'night', 
      label: 'Night',
      icon: <Moon className="h-4 w-4" />,
      description: 'Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation.',
      timeframes: '1h, 4h, 1d',
      color: 'from-indigo-600 to-indigo-400',
      activeColor: 'bg-gradient-to-r from-indigo-600 to-indigo-400',
      hoverColor: 'hover:bg-indigo-500/10',
      ringColor: 'ring-indigo-500/30',
      borderColor: 'border-indigo-500/20',
      iconClass: 'text-indigo-500'
    }
  ];
  
  return (
    <TooltipProvider>
      <div className="space-y-2 w-full">
        <span className="text-sm font-medium">Trading Mode</span>
        <div className="grid grid-cols-3 gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
          {modeButtons.map((mode) => {
            const isActive = tradingMode === mode.id;
            return (
              <Tooltip key={mode.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleModeChange(mode.id as 'scalp' | 'day' | 'night')}
                    className={cn(
                      "flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 px-2 py-2.5 rounded-md transition-all",
                      "text-xs font-medium whitespace-nowrap relative overflow-hidden",
                      isActive ? `${mode.activeColor} text-white shadow-sm` : `bg-background/50 ${mode.hoverColor}`,
                      isActive ? "" : "border border-transparent hover:border-border/50",
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-7 h-7 rounded-full",
                      isActive ? "bg-white/20" : `${mode.borderColor} border`,
                    )}>
                      <span className={cn(
                        "z-10",
                        isActive ? "text-white" : mode.iconClass
                      )}>
                        {mode.icon}
                      </span>
                    </div>
                    <span className={cn(
                      "z-10",
                      isMobile ? "text-[10px]" : ""
                    )}>
                      {mode.label}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="w-64 p-3">
                  <p className="font-medium mb-1">{mode.label} Trading Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {mode.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Timeframes: {mode.timeframes}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};
