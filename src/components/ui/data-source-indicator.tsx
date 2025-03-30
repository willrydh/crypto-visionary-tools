
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface DataSourceIndicatorProps {
  source: string;
  isLive: boolean;
  className?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  details?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({
  source,
  isLive,
  className,
  placement = 'top',
  details
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}>
            <Info className="h-3.5 w-3.5" />
            <span>{source}</span>
            <span 
              className={`inline-block h-2 w-2 rounded-full ${
                isLive ? 'bg-green-500' : 'bg-amber-500'
              }`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side={placement}>
          <div className="text-xs">
            <p className="font-medium mb-1">Data Source: {source}</p>
            <div className="flex items-center">
              <span 
                className={`inline-block h-2 w-2 rounded-full mr-1.5 ${
                  isLive ? 'bg-green-500' : 'bg-amber-500'
                }`}
              />
              <span>{isLive ? 'Live data' : 'Simulated data'}</span>
            </div>
            {details && <p className="mt-1 text-muted-foreground">{details}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DataSourceIndicator;
