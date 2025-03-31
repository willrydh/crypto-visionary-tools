
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Cloud } from 'lucide-react';
import { TradingModeSelector } from './TradingModeSelector';
import { cn } from '@/lib/utils';

interface TradePageHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const TradePageHeader = ({ isLoading, onRefresh }: TradePageHeaderProps) => {
  return (
    <div className="sticky top-14 z-20 pt-6 pb-4 -mx-6 px-6 backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Trade Suggestions</h1>
            <p className="text-muted-foreground">
              Advanced trade analysis and execution
            </p>
          </div>
          <Button 
            onClick={onRefresh} 
            disabled={isLoading} 
            variant="outline"
            className={cn(
              "flex-shrink-0 backdrop-blur-sm bg-card/30 border-border/50 gap-2",
              "hover:bg-primary/10 transition-all duration-200"
            )}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Update Analysis'}</span>
          </Button>
        </div>
        
        <div className="w-full overflow-visible py-1">
          <TradingModeSelector />
        </div>
      </div>
    </div>
  );
};
