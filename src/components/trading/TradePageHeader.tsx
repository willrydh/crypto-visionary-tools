
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Sun, Moon } from 'lucide-react';
import { useTradingMode } from '@/hooks/useTradingMode';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TradePageHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const TradePageHeader = ({ isLoading, onRefresh }: TradePageHeaderProps) => {
  const { tradingMode, setTradingMode } = useTradingMode();

  const handleModeChange = (mode: 'scalp' | 'day' | 'night') => {
    setTradingMode(mode);
  };
  
  return (
    <div className="sticky top-14 z-20 pt-6 pb-4 -mx-6 px-6 backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Trade Suggestions</h1>
            <p className="text-muted-foreground">
              Advanced trade analysis and execution
            </p>
          </div>
          <Button 
            onClick={onRefresh} 
            disabled={isLoading} 
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
          </Button>
        </div>
        
        <div className="w-full backdrop-blur-md bg-card/20 rounded-xl border border-border/40 p-1.5 shadow-xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-primary/5 to-background/5 rounded-xl opacity-30" />
          
          <div className="grid grid-cols-3 gap-2 relative">
            {/* Scalp Trading Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleModeChange('scalp')}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300",
                      "py-3 px-1 border shadow-md",
                      tradingMode === 'scalp' 
                        ? "bg-gradient-to-br from-blue-600/90 to-blue-400/90 border-white/10 shadow-lg" 
                        : "text-blue-500/80 bg-blue-900/20 border-blue-500/20 hover:bg-card/50"
                    )}
                  >
                    {tradingMode === 'scalp' && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-80" />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center rounded-full p-1.5 mb-1",
                      tradingMode === 'scalp' ? "text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""
                    )}>
                      <span className={tradingMode === 'scalp' ? "text-white" : ""}>
                        <Zap className="h-5 w-5" />
                      </span>
                    </div>
                    
                    <span className={cn(
                      "text-xs font-semibold",
                      tradingMode === 'scalp' ? "text-white" : ""
                    )}>
                      Scalp
                    </span>
                    
                    {tradingMode === 'scalp' && (
                      <div className="absolute -bottom-1 left-0 right-0 h-1">
                        <div className="h-full bg-white/30 animate-pulse-subtle"></div>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">Scalp Trading</p>
                  <p className="text-xs text-muted-foreground">
                    Ultra-short term trading (minutes)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Day Trading Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleModeChange('day')}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300",
                      "py-3 px-1 border shadow-md",
                      tradingMode === 'day' 
                        ? "bg-gradient-to-br from-amber-500/90 to-amber-400/90 border-white/10 shadow-lg" 
                        : "text-amber-500/80 bg-amber-900/20 border-amber-500/20 hover:bg-card/50"
                    )}
                  >
                    {tradingMode === 'day' && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-80" />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center rounded-full p-1.5 mb-1",
                      tradingMode === 'day' ? "text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" : ""
                    )}>
                      <span className={tradingMode === 'day' ? "text-white" : ""}>
                        <Sun className="h-5 w-5" />
                      </span>
                    </div>
                    
                    <span className={cn(
                      "text-xs font-semibold",
                      tradingMode === 'day' ? "text-white" : ""
                    )}>
                      Day
                    </span>
                    
                    {tradingMode === 'day' && (
                      <div className="absolute -bottom-1 left-0 right-0 h-1">
                        <div className="h-full bg-white/30 animate-pulse-subtle"></div>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">Day Trading</p>
                  <p className="text-xs text-muted-foreground">
                    Short-term trading (1-2 hours)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Night Trading Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleModeChange('night')}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-lg transition-all duration-300",
                      "py-3 px-1 border shadow-md",
                      tradingMode === 'night' 
                        ? "bg-gradient-to-br from-indigo-600/90 to-indigo-400/90 border-white/10 shadow-lg" 
                        : "text-indigo-500/80 bg-indigo-900/20 border-indigo-500/20 hover:bg-card/50"
                    )}
                  >
                    {tradingMode === 'night' && (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-black/20 to-transparent opacity-80" />
                    )}
                    
                    <div className={cn(
                      "flex items-center justify-center rounded-full p-1.5 mb-1",
                      tradingMode === 'night' ? "text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" : ""
                    )}>
                      <span className={tradingMode === 'night' ? "text-white" : ""}>
                        <Moon className="h-5 w-5" />
                      </span>
                    </div>
                    
                    <span className={cn(
                      "text-xs font-semibold",
                      tradingMode === 'night' ? "text-white" : ""
                    )}>
                      Night
                    </span>
                    
                    {tradingMode === 'night' && (
                      <div className="absolute -bottom-1 left-0 right-0 h-1">
                        <div className="h-full bg-white/30 animate-pulse-subtle"></div>
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="font-semibold">Night Trading</p>
                  <p className="text-xs text-muted-foreground">
                    Medium-term trading (up to 12 hours)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
