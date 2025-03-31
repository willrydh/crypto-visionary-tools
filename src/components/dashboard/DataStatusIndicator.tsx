
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

type DataStatusIndicatorProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

const DataStatusIndicator: React.FC<DataStatusIndicatorProps> = ({
  isLoading,
  isError,
  errorMessage,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center mt-2 text-muted-foreground text-sm bg-muted/50 p-2 rounded">
        <div className="animate-pulse h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
        <span>Loading data...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center mt-2 text-destructive text-sm bg-destructive/10 p-2 rounded">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>{errorMessage || 'Error fetching data'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-2 text-green-600 text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
      <CheckCircle className="h-4 w-4 mr-2" />
      <span>Data loaded successfully</span>
    </div>
  );
};

export default DataStatusIndicator;
