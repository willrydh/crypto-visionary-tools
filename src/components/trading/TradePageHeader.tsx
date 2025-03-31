import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TradePageHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const TradePageHeader = ({ isLoading, onRefresh }: TradePageHeaderProps) => {
  return (
    <div className="hidden">
      <Button 
        onClick={onRefresh} 
        disabled={isLoading} 
        variant="ghost"
        size="icon"
      >
        <RefreshCw className={cn("h-5 w-5", isLoading && "animate-spin")} />
      </Button>
    </div>
  );
};
