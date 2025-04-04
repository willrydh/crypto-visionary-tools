
import React from 'react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Zap, Sun, Moon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  TradingModeType, 
  getModeBgClass, 
  getModeTextClass, 
  getModeBorderClass,
  getModeGradientClass,
  getModeIconBgClass
} from './TradingModeStyles';

export const TradingModeSelector = ({ displayLabel = true, compact = false }) => {
  const { tradingMode, setTradingMode } = useTradingMode();
  const isMobile = useIsMobile();
  
  const handleModeChange = (mode: TradingModeType) => {
    setTradingMode(mode);
  };

  const modeButtons = [
    { 
      id: 'scalp' as TradingModeType, 
      label: 'Scalp',
      icon: <Zap className="h-5 w-5" />,
      description: 'Ultra-short term trading (minutes). Focuses on small, quick price movements with frequent entries/exits.',
      timeframes: '1m, 5m, 15m',
      color: getModeTextClass('scalp'),
    },
    { 
      id: 'day' as TradingModeType, 
      label: 'Day',
      icon: <Sun className="h-5 w-5" />,
      description: 'Short-term trading (hours). Positions opened and closed within the same trading day, avoiding overnight risk.',
      timeframes: '15m, 1h, 4h',
      color: getModeTextClass('day'),
    },
    { 
      id: 'night' as TradingModeType, 
      label: 'Night',
      icon: <Moon className="h-5 w-5" />,
      description: 'Medium-term trading (12+ hours). Positions that can be held overnight, focusing on larger price swings and trend continuation.',
      timeframes: '1h, 4h, 1d',
      color: getModeTextClass('night'),
    }
  ];

  // Compact mode for header
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {modeButtons.map((mode) => {
          const isActive = tradingMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md transition-all shadow-sm flex-1",
                isActive 
                  ? getModeBgClass(mode.id, true) + " text-white" 
                  : getModeBgClass(mode.id, false)
              )}
            >
              <span className={cn(
                "flex items-center justify-center",
                isActive ? "text-white" : mode.color
              )}>
                {mode.icon}
              </span>
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {displayLabel && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm font-medium flex items-center gap-1.5 text-gray-300">
            Select Trading Mode
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
      )}
      
      <div className="grid grid-cols-3 gap-3">
        {modeButtons.map((mode) => {
          const isActive = tradingMode === mode.id;
          
          return (
            <TooltipProvider key={mode.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleModeChange(mode.id)}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300 w-full",
                      "py-3 px-2 border shadow-md",
                      isActive 
                        ? `${getModeGradientClass(mode.id)} border-white/10 shadow-lg` 
                        : `${getModeBgClass(mode.id, false)} ${getModeBorderClass(mode.id)} hover:bg-card/50`
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-80 rounded-lg" />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center rounded-full p-1.5 mb-2",
                      isActive ? "" : getModeIconBgClass(mode.id)
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
  );
};
