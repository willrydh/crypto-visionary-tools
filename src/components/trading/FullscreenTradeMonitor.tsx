import React, { useState, useEffect, useCallback } from 'react';
import { Minimize2 } from 'lucide-react';
import ActiveTradeStatus from './ActiveTradeStatus';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { usePrice } from '@/hooks/usePrice';
import { formatCurrency } from '@/utils/numberUtils';
import { cn } from '@/lib/utils';

interface FullscreenTradeMonitorProps {
  trade: any;
  lastPrice: number;
  onExit: () => void;
}

const FullscreenTradeMonitor: React.FC<FullscreenTradeMonitorProps> = ({
  trade,
  lastPrice,
  onExit,
}) => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const { loadPriceData, priceData: currentPrice } = usePrice();
  const formattedSymbol = trade.pairSymbol.replace('/', '');

  // Add escape key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleExit();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  // Update price data at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      setPriceData(prev => {
        const newPrice = currentPrice[formattedSymbol]?.price;
        if (!newPrice) return prev;
        
        const now = Date.now();
        const newData = [...prev, { timestamp: now, price: newPrice }];
        // Keep only last 60 points (1 minute data)
        if (newData.length > 60) {
          return newData.slice(-60);
        }
        return newData;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [formattedSymbol, loadPriceData, currentPrice]);

  // Handle triple click to exit
  useEffect(() => {
    if (clickCount === 3) {
      handleExit();
    }

    const timer = setTimeout(() => setClickCount(0), 1000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleScreenClick = () => {
    setClickCount(prev => prev + 1);
  };

  const handleExit = () => {
    onExit();
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900 text-white z-[9999] flex flex-col p-4 overflow-hidden"
      onClick={handleScreenClick}
    >
      <div className="absolute top-2 right-2 z-10">
        <button 
          className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50"
          onClick={handleExit}
        >
          <Minimize2 className="h-5 w-5 text-slate-300" />
        </button>
      </div>

      <div className="h-full flex flex-col gap-4">
        <div className="flex-none">
          <ActiveTradeStatus 
            trade={trade} 
            lastPrice={lastPrice} 
            onExit={handleExit}
            hideHeader={true}
          />
        </div>
        
        <div className="flex-1 bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="#666"
              />
              <YAxis 
                domain={['auto', 'auto']}
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#666"
              />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                formatter={(value: any) => [formatCurrency(value), 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#9b87f5"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 mt-2 absolute bottom-2 left-0 right-0">
        Triple-click anywhere to exit fullscreen
      </div>
    </div>
  );
};

export default FullscreenTradeMonitor;
