
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface MarketDataTooltipProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const MarketDataTooltip: React.FC<MarketDataTooltipProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <HelpCircle className={`h-4 w-4 text-muted-foreground cursor-help ${className}`} />
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="max-w-[300px]">
        <p className="font-medium text-sm mb-1">{title}</p>
        <div className="text-xs">{children}</div>
      </TooltipContent>
    </Tooltip>
  );
};

export default MarketDataTooltip;
