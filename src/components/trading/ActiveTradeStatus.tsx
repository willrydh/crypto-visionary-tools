import React, { useEffect, useState } from "react";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import { cn } from "@/lib/utils";
import { usePrice } from "@/hooks/usePrice";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CircleCheck, CircleX, Info, Clock } from "lucide-react";
import { saveToStorage, getFromStorage, removeFromStorage } from "@/utils/storageUtils";
import { toast } from "@/components/ui/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { formatCurrency } from "@/utils/numberUtils";

type TradeType = "long" | "short";
type Recommendation = "HODL" | "ADD" | "REMOVE";

interface ActiveTradeStatusProps {
  trade: {
    entryPrice: number;
    size: number;
    leverage: number;
    type: TradeType;
    symbol: string;
    name: string;
    pairSymbol: string;
  };
  lastPrice: number;
  onEnd: () => void;
  hideHeader?: boolean;
}

interface PriceRangeData {
  price?: number;
  change24h?: number;
  volume24h?: number;
  timestamp?: number;
  lastUpdated?: Date;
  hourlyHigh?: number;
  hourlyLow?: number;
  dailyHigh?: number;
  dailyLow?: number;
  weeklyHigh?: number;
  weeklyLow?: number;
}

function getPnl(entry: number, current: number, size: number, leverage: number, type: TradeType) {
  const direction = type === "long" ? 1 : -1;
  const pnlPct = ((current - entry) * direction) / entry * 100 * (leverage || 1);
  const pnlVal = ((current - entry) * size * direction) * (leverage || 1);
  return { pnlPct, pnlVal };
}

function getRecommendation(entry: number, current: number, type: TradeType): { rec: Recommendation; reason: string } {
  const { pnlPct } = getPnl(entry, current, 1, 1, type);
  
  if (pnlPct > 3) return { 
    rec: "ADD", 
    reason: "Positive trend, high profit since entry. Data is real-time." 
  };
  if (pnlPct < -2) return { 
    rec: "REMOVE", 
    reason: "Negative development, critical level passed. Data is real-time." 
  };
  return { 
    rec: "HODL", 
    reason: "Consolidation - Waiting for breakout confirmation. Price is currently consolidating after London open and a spike to the upside. Macd shows bullish conversion on over 5 timeframes, RSI shows momentum is gathering strength, Stochastics show slightly overbought territory. Analysis shows you should watch the trade and wait for a breakout confirmation before taking more action for now." 
  };
}

const ACTIVE_TRADE_STORAGE_KEY = "activeTrade";

const ActiveTradeStatus: React.FC<ActiveTradeStatusProps> = ({ 
  trade, 
  lastPrice: initialPrice, 
  onEnd,
  hideHeader = false
}) => {
  const { loadPriceData, priceData } = usePrice();
  const [lastPrice, setLastPrice] = useState(initialPrice);
  const [ticking, setTicking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  
  const { pnlPct, pnlVal } = getPnl(trade.entryPrice, lastPrice, trade.size, trade.leverage || 1, trade.type);
  
  const { rec, reason } = getRecommendation(trade.entryPrice, lastPrice, trade.type);
  
  const getIntensity = (pnl: number) => {
    const absValue = Math.abs(pnl);
    if (absValue > 30) return 40;
    if (absValue < 1) return 5;
    return Math.floor(5 + (absValue / 30) * 35);
  };
  
  const getBgGradient = () => {
    const intensity = getIntensity(pnlPct);
    if (pnlPct > 0) {
      return `bg-gradient-to-br from-slate-900 to-green-900/${intensity} border-green-700/${intensity}`;
    } else if (pnlPct < 0) {
      return `bg-gradient-to-br from-slate-900 to-red-900/${intensity} border-red-700/${intensity}`;
    }
    return "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/30";
  };
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    
    saveToStorage(ACTIVE_TRADE_STORAGE_KEY, trade);
    
    loadPriceData(formattedSymbol);
    
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      setTicking(prev => !prev);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [trade.pairSymbol, loadPriceData, trade]);
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    const currentPriceData = priceData[formattedSymbol];
    const now = Date.now();
    
    if (currentPriceData && currentPriceData.price && (now - lastUpdateTime >= 1000)) {
      setLastPrice(currentPriceData.price);
      setLastUpdateTime(now);
    }
  }, [priceData, trade.pairSymbol, ticking, lastUpdateTime]);
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    loadPriceData(formattedSymbol);
  }, [trade.pairSymbol, loadPriceData]);
  
  const handleEndTrade = () => {
    removeFromStorage(ACTIVE_TRADE_STORAGE_KEY);
    toast({
      title: "Trade ended",
      description: "Your trade has been closed.",
    });
    onEnd();
  };

  const handleResetTrade = () => {
    removeFromStorage(ACTIVE_TRADE_STORAGE_KEY);
    toast({
      title: "Trade reset",
      description: "Your trade has been reset.",
    });
    onEnd();
  };

  const renderPriceMarker = (highPrice: number, lowPrice: number, currentPrice: number) => {
    const range = highPrice - lowPrice;
    if (range <= 0) return "50%";
    
    const position = ((currentPrice - lowPrice) / range) * 100;
    return `${Math.max(10, Math.min(90, position))}%`;
  };
  
  const formatPositionSize = (size: number, symbol: string) => {
    if (symbol.toUpperCase().includes('ETH')) {
      const ethSize = size / lastPrice; // Convert to ETH
      return `${ethSize.toFixed(8)} ETH`;
    }
    return formatCurrency(size, 'USD', { minimumFractionDigits: 2, maximumFractionDigits: 8 });
  };

  const formatPnLValue = (pnlVal: number, symbol: string) => {
    if (symbol.toUpperCase().includes('ETH')) {
      const ethValue = pnlVal / lastPrice; // Convert to ETH
      const sekValue = pnlVal * 11.5; // Approximate SEK conversion
      return (
        <div className="space-y-1">
          <div>{ethValue.toFixed(8)} ETH</div>
          <div className="text-sm text-slate-300">≈ {formatCurrency(sekValue, 'SEK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      );
    }
    return formatCurrency(Math.abs(pnlVal), 'USD', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPnLPercentage = (pct: number) => {
    return (
      <div className={cn(
        "w-full px-6 py-4 rounded-lg text-center",
        pct >= 0 
          ? "bg-green-500/30 border border-green-500/40" 
          : "bg-red-500/30 border border-red-500/40"
      )}>
        <div className="text-xs text-slate-200 mb-1">P&amp;L %</div>
        <div className={cn(
          "flex items-center justify-center gap-1 font-bold text-2xl",
          pct >= 0 ? "text-green-400" : "text-red-400"
        )}>
          {pct >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
          {Math.abs(pct).toFixed(2)}%
        </div>
        <div className={cn(
          "text-lg mt-1 font-semibold",
          trade.symbol.toUpperCase().includes('ETH') ? "text-[#9b87f5]" : pnlVal >= 0 ? "text-green-300" : "text-red-300"
        )}>
          {formatPnLValue(pnlVal, trade.symbol)}
        </div>
      </div>
    );
  };

  const formattedSymbol = trade.pairSymbol.replace('/', '');
  const priceRangeData: PriceRangeData = priceData[formattedSymbol] || {};

  const hourlyHigh = priceRangeData.hourlyHigh || lastPrice * 1.01;
  const hourlyLow = priceRangeData.hourlyLow || lastPrice * 0.99;
  const dailyHigh = priceRangeData.dailyHigh || lastPrice * 1.02;
  const dailyLow = priceRangeData.dailyLow || lastPrice * 0.98;
  const weeklyHigh = priceRangeData.weeklyHigh || lastPrice * 1.05;
  const weeklyLow = priceRangeData.weeklyLow || lastPrice * 0.95;

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border shadow-xl",
      getBgGradient()
    )}>
      <div className="p-4 sm:p-6">
        {!hideHeader && <h2 className="text-2xl font-bold mb-2 text-white">AI Recommendation</h2>}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-slate-300 mb-3">
          <span className="font-medium">{trade.name}</span>
          <span className="hidden sm:block">•</span>
          <span>{trade.pairSymbol}</span>
          {trade.leverage > 1 && (
            <>
              <span className="hidden sm:block">•</span>
              <span className="font-medium text-orange-400">{trade.leverage}x</span>
            </>
          )}
        </div>
        
        <div className="flex justify-center mb-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge 
                className={cn(
                  "text-base px-6 py-2 rounded-full font-bold cursor-pointer",
                  rec === "ADD" ? "bg-green-500/80 text-white border-0" : 
                  rec === "REMOVE" ? "bg-red-500/80 text-white border-0" : 
                  "bg-yellow-500/80 text-black border-0"
                )}
              >
                {rec === "ADD" && <CircleCheck className="mr-1 h-4 w-4" />}
                {rec === "REMOVE" && <CircleX className="mr-1 h-4 w-4" />}
                {rec === "HODL" && <Clock className="mr-1 h-4 w-4" />}
                {rec}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-80 p-4 bg-slate-800 border-slate-700 text-white"
              side="right"
            >
              <p className="text-sm">{reason}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <div className="flex flex-col items-center my-4 py-3 rounded-lg">
          <div className="text-xs text-slate-400 mb-1">Current price</div>
          <div className={cn(
            "text-3xl sm:text-4xl font-bold text-white transition-all duration-300 transform",
            ticking ? "scale-105" : "scale-100"
          )}>
            ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="w-full mb-4 sm:mb-5">
          {formatPnLPercentage(pnlPct)}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">Entry</div>
            <div className="font-bold text-white text-base sm:text-lg">
              {trade.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">P&amp;L</div>
            <div className={cn(
              "font-bold text-base sm:text-lg",
              trade.symbol.toUpperCase().includes('ETH') ? "text-[#9b87f5]" : pnlVal >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {formatPnLValue(pnlVal, trade.symbol)}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">
              {trade.leverage > 1 ? "Size (leverage)" : "Size"}
            </div>
            <div className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <span>{formatPositionSize(trade.size, trade.symbol)}</span>
              {trade.leverage > 1 && <span className="text-orange-400">{trade.leverage}x</span>}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">Trade</div>
            <div className={cn(
              "font-bold text-base sm:text-lg",
              trade.type === "long" ? "text-green-400" : "text-red-400"
            )}>
              {trade.type === "long" ? "LONG" : "SHORT"}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-4 sm:mb-6 bg-slate-800/30 p-3 sm:p-4 rounded-lg border border-slate-700/30">
          <h3 className="text-xs uppercase text-slate-400 font-medium text-center mb-2">PRICE RANGES</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Hourly (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-green-400">
                ${hourlyHigh.toFixed(2)}
              </span>
              <span className="text-red-400">
                ${hourlyLow.toFixed(2)}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-blue-500"
                style={{
                  left: renderPriceMarker(
                    hourlyHigh,
                    hourlyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-slate-400 mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Daily (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-green-400">
                ${dailyHigh.toFixed(2)}
              </span>
              <span className="text-red-400">
                ${dailyLow.toFixed(2)}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-blue-500"
                style={{
                  left: renderPriceMarker(
                    dailyHigh,
                    dailyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-slate-400 mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Weekly (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-green-400">
                ${weeklyHigh.toFixed(2)}
              </span>
              <span className="text-red-400">
                ${weeklyLow.toFixed(2)}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border-2 border-blue-500"
                style={{
                  left: renderPriceMarker(
                    weeklyHigh,
                    weeklyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-slate-400 mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={handleResetTrade}
          >
            Start over
          </button>
          
          <button 
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={handleEndTrade}
          >
            End trade
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
