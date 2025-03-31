
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useTradingMode } from '@/hooks/useTradingMode';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface TradePageHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const TradePageHeader = ({ isLoading, onRefresh }: TradePageHeaderProps) => {
  const { tradingMode, getDescription } = useTradingMode();
  
  // Get color scheme based on trading mode
  const getModeColor = () => {
    switch(tradingMode) {
      case 'scalp': return 'text-blue-500';
      case 'day': return 'text-amber-500';
      case 'night': return 'text-indigo-500';
      default: return 'text-primary';
    }
  };
  
  // Get icon based on trading mode
  const getModeIcon = () => {
    switch(tradingMode) {
      case 'scalp': 
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        );
      case 'day': 
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        );
      case 'night': 
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        );
      default: 
        return null;
    }
  };
  
  return (
    <div className="mb-8"> {/* Increased top margin from mb-6 to mb-8 */}
      <div className="flex items-center justify-between mb-5"> {/* Increased bottom margin from mb-4 to mb-5 */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mr-2">Trade Analysis</h1>
          <div className={cn("rounded-full px-2 py-0.5 text-sm font-medium flex items-center gap-1.5", getModeColor())}>
            {getModeIcon()}
            <span>{tradingMode.charAt(0).toUpperCase() + tradingMode.slice(1)}</span>
          </div>
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={isLoading} 
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>
      
      <Alert className="bg-primary/5 border-primary/20 mb-6"> {/* Increased bottom margin from mb-4 to mb-6 */}
        <AlertCircle className={cn("h-4 w-4", getModeColor())} />
        <AlertTitle className="font-medium flex items-center gap-1.5">
          <span className={getModeColor()}>{tradingMode.charAt(0).toUpperCase() + tradingMode.slice(1)} Trading</span>
          <span>Mode Active</span>
        </AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          {getDescription()}
        </AlertDescription>
      </Alert>
    </div>
  );
};
