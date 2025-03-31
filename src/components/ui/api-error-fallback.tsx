
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ApiErrorFallbackProps {
  message: string;
  error?: string;
  onRetry?: () => void;
  className?: string;
}

export const ApiErrorFallback: React.FC<ApiErrorFallbackProps> = ({
  message,
  error,
  onRetry,
  className
}) => {
  return (
    <div className={cn(
      "bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center",
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div className="text-destructive font-medium">{message}</div>
        
        {error && (
          <div className="text-xs text-destructive/70 mt-1 max-w-full overflow-hidden text-ellipsis">
            {error}
          </div>
        )}
        
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10" 
            onClick={onRetry}
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
