
import React from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, Sun, Moon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toggle, toggleVariants } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
      icon: <Zap className="h-5 w-5" />,
      description: 'Ultra-short term trading (minutes). Focuses on small, quick price movements with frequent entries/exits.',
      timeframes: '1m, 5m, 15m',
      gradient: 'from-blue-600/90 to-blue-400/90',
      iconGlow: 'text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
      inactive: 'text-blue-500/80 bg-blue-900/20 border-blue-500/20',
      pulse: 'animate-pulse text-blue-400'
    },
    { 
      id: 'day', 
      label: 'Day',
      icon: <Sun className="h-5 w-5" />,
      description: 'Short-term trading (hours). Positions opened and closed within the same trading day, avoiding overnight risk.',
      timeframes: '15m, 1h, 4h',
      gradient: 'from-amber-500/90 to-amber-400/90',
      iconGlow: 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]',
      inactive: 'text-amber-500/80 bg-amber-900/20 border-amber-500/20',
      pulse: 'animate-pulse text-amber-400'
    },
    { 
      id: 'night', 
      label: 'Night',
      icon: <Moon className="h-5 w-5" />,
      description: 'Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation.',
      timeframes: '1h, 4h, 1d',
      gradient: 'from-indigo-600/90 to-indigo-400/90',
      iconGlow: 'text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]',
      inactive: 'text-indigo-500/80 bg-indigo-900/20 border-indigo-500/20',
      pulse: 'animate-pulse text-indigo-400'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-1.5">
          Trading Mode
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-xs">Select a trading mode to optimize indicators and suggestions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </div>
      
      <div className="w-full backdrop-blur-md bg-card/20 rounded-xl border border-border/40 p-1.5 shadow-xl relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-primary/5 to-background/5 rounded-xl opacity-30" />
        
        <div className="grid grid-cols-3 gap-2 relative">
          {modeButtons.map((mode) => {
            const isActive = tradingMode === mode.id;
            
            return (
              <TooltipProvider key={mode.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleModeChange(mode.id as 'scalp' | 'day' | 'night')}
                      className={cn(
                        "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 overflow-hidden",
                        "py-3 px-1 border shadow-md",
                        isActive 
                          ? `bg-gradient-to-br ${mode.gradient} border-white/10 shadow-lg` 
                          : `${mode.inactive} hover:bg-card/50`
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-80" />
                      )}
                      
                      <div className={cn(
                        "flex items-center justify-center rounded-full p-1.5 mb-1",
                        isActive ? mode.iconGlow : ""
                      )}>
                        <span className={isActive ? "text-white" : ""}>
                          {mode.icon}
                        </span>
                      </div>
                      
                      <span className={cn(
                        "text-xs font-semibold",
                        isActive ? "text-white" : ""
                      )}>
                        {mode.label}
                      </span>
                      
                      {isActive && (
                        <div className="absolute -bottom-1 left-0 right-0 h-1">
                          <div className="h-full bg-white/30 animate-pulse-subtle"></div>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="w-64 p-3">
                    <p className="font-semibold mb-1">{mode.label} Trading Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                    <div className="mt-2 bg-muted/50 rounded-md px-2 py-1.5 text-xs flex justify-between">
                      <span className="text-muted-foreground">Timeframes:</span>
                      <span className="font-mono font-medium">{mode.timeframes}</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
};
