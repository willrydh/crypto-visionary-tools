
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
  
  // Calculate PnL for background color
  const getPnl = () => {
    const direction = trade.type === "long" ? 1 : -1;
    const pnlPct = ((lastPrice - trade.entryPrice) * direction) / trade.entryPrice * 100 * (trade.leverage || 1);
    return pnlPct;
  };
  
  // Enhanced background color based on PnL with stronger intensity
  const getBackgroundGradient = () => {
    const pnl = getPnl();
    
    if (pnl > 0) {
      // Much more visible green gradient for profit with higher opacity
      return "bg-gradient-to-br from-surface-1 via-slate-900/90 to-green-700/60 border-bullish/50";
    } 
    else if (pnl < 0) {
      // More visible red gradient for loss with higher opacity
      return "bg-gradient-to-br from-surface-1 via-slate-900/90 to-red-700/60 border-bearish/50";
    }
    
    return "bg-gradient-to-br from-surface-1 to-slate-800 border-border/30";
  };

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

  const handleExit = useCallback(() => {
    onExit();
  }, [onExit]);

  return (
    <div 
      className={cn(
        "fixed inset-0 text-primary-foreground z-[9999] flex flex-col p-4 overflow-hidden",
        getBackgroundGradient()
      )}
      onClick={handleScreenClick}
      style={{
        position: 'fixed', // Ensure fixed positioning for iOS/Mac
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        WebkitBackfaceVisibility: 'hidden', // Fix for iOS rendering
        WebkitTransform: 'translateZ(0)', // Promote to GPU on iOS
      }}
    >
      <div className="absolute top-2 right-2 z-10">
        <button 
          className="p-2 rounded-full bg-surface-2/70 hover:bg-surface-3/70 shadow-lg"
          onClick={handleExit}
        >
          <Minimize2 className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="h-full flex flex-col gap-4">
        <div className="flex-none">
          <ActiveTradeStatus 
            trade={trade} 
            lastPrice={lastPrice} 
            onEnd={handleExit}
            hideHeader={true}
          />
        </div>
        
        <div className="flex-1 bg-surface-2/70 rounded-lg border border-border/50 p-4 shadow-lg">
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

      <div className="text-center text-xs text-muted-foreground mt-2 absolute bottom-2 left-0 right-0">
        Triple-click anywhere to exit fullscreen
      </div>
    </div>
  );
};

export default FullscreenTradeMonitor;
