
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataLoadingPlaceholderProps {
  message?: string;
  className?: string;
}

export const DataLoadingPlaceholder: React.FC<DataLoadingPlaceholderProps> = ({
  message = "Loading data...",
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8 px-4 space-y-4",
      "bg-muted/20 border border-border/50 rounded-lg",
      className
    )}>
      <Loader className="h-8 w-8 text-primary animate-spin" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};
