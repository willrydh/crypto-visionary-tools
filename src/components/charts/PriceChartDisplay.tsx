
import React, { useMemo, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatYAxisCurrencyTick } from '@/utils/numberUtils';
import { formatChartXAxisTick } from '@/utils/chartTimeUtils';
import { AlertTriangle } from 'lucide-react';

interface PriceChartDisplayProps {
  processedData: Array<any>;
  timeframe: string;
}

export const PriceChartDisplay: React.FC<PriceChartDisplayProps> = ({ processedData, timeframe }) => {
  // Format X-axis labels
  const formatXAxis = useCallback(
    (timestamp: number) => formatChartXAxisTick(timestamp, timeframe),
    [timeframe]
  );

  const renderLineChart = useMemo(() => {
    if (!processedData || processedData.length === 0) {
      return (
        <div className="h-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-warning mr-2" />
          <p>No chart data available</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary)))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--primary)))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            tickCount={6}
            minTickGap={20}
            tick={{ fontSize: 10 }}
            type="number"
            domain={['dataMin', 'dataMax']}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fontSize: 10 }}
            tickFormatter={formatYAxisCurrencyTick}
            width={60}
          />
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value, name) => {
              return [formatCurrency(value as number), typeof name === 'string' ? name === 'price' ? 'Price' : name.charAt(0).toUpperCase() + name.slice(1) : name];
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(var(--primary)))"
            fill="url(#colorPrice)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }, [processedData, formatXAxis, timeframe]);

  return <div className="h-64">{renderLineChart}</div>;
};

export default PriceChartDisplay;
