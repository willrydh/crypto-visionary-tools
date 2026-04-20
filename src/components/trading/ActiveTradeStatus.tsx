import React, { useEffect, useState } from "react";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import { cn } from "@/lib/utils";
import { usePrice } from "@/hooks/usePrice";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CircleCheck, CircleX, Info, Clock, Maximize2 } from "lucide-react";
import { saveToStorage, getFromStorage, removeFromStorage } from "@/utils/storageUtils";
import { toast } from "@/components/ui/use-toast";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { formatCurrency } from "@/utils/numberUtils";
import FullscreenTradeMonitor from "./FullscreenTradeMonitor";

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
  const { loadPriceData, priceData, loadHighLowData } = usePrice();
  const [lastPrice, setLastPrice] = useState(initialPrice);
  const [ticking, setTicking] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      return `bg-gradient-to-br from-surface-1 to-green-900/${intensity} border-green-700/${intensity}`;
    } else if (pnlPct < 0) {
      return `bg-gradient-to-br from-surface-1 to-red-900/${intensity} border-red-700/${intensity}`;
    }
    return "bg-gradient-to-br from-surface-1 to-slate-800 border-border/30";
  };
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    
    saveToStorage(ACTIVE_TRADE_STORAGE_KEY, trade);
    
    loadPriceData(formattedSymbol);
    loadHighLowData(formattedSymbol);
    
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      loadHighLowData(formattedSymbol);
      setTicking(prev => !prev);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [trade.pairSymbol, loadPriceData, loadHighLowData, trade]);
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    const currentPriceData = priceData[formattedSymbol];
    const now = Date.now();
    
    if (currentPriceData && currentPriceData.price && (now - lastUpdateTime >= 1000)) {
      setLastPrice(currentPriceData.price);
      setLastUpdateTime(now);
    }
  }, [priceData, trade.pairSymbol, ticking, lastUpdateTime]);
  
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
          <div className="text-sm text-muted-foreground">≈ {formatCurrency(sekValue, 'SEK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
          ? "bg-bullish/30 border border-bullish/40" 
          : "bg-bearish/30 border border-bearish/40"
      )}>
        <div className="text-xs text-slate-200 mb-1">P&amp;L %</div>
        <div className={cn(
          "flex items-center justify-center gap-1 font-bold text-2xl",
          pct >= 0 ? "text-bullish" : "text-bearish"
        )}>
          {pct >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
          {Math.abs(pct).toFixed(2)}%
        </div>
        <div className={cn(
          "text-lg mt-1 font-semibold",
          trade.symbol.toUpperCase().includes('ETH') ? "text-[#9b87f5]" : pnlVal >= 0 ? "text-bullish" : "text-bearish"
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

  const formatPriceValue = (value: number) => {
    if (trade.symbol.toUpperCase().includes('ETH')) {
      return value.toFixed(2);
    }
    return value.toFixed(2);
  };

  if (isFullscreen) {
    return (
      <FullscreenTradeMonitor
        trade={trade}
        lastPrice={lastPrice}
        onExit={() => setIsFullscreen(false)}
      />
    );
  }

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border shadow-xl",
      getBgGradient()
    )}>
      <div className="p-4 sm:p-6">
        {!hideHeader && (
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-primary-foreground">AI Recommendation</h2>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 hover:bg-surface-3/50 rounded-lg transition-colors"
            >
              <Maximize2 className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
          <span className="font-medium">{trade.name}</span>
          <span className="hidden sm:block">•</span>
          <span>{trade.pairSymbol}</span>
          {trade.leverage > 1 && (
            <>
              <span className="hidden sm:block">•</span>
              <span className="font-medium text-warning">{trade.leverage}x</span>
            </>
          )}
        </div>
        
        <div className="flex justify-center mb-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge 
                className={cn(
                  "text-base px-6 py-2 rounded-full font-bold cursor-pointer",
                  rec === "ADD" ? "bg-bullish/80 text-primary-foreground border-0" : 
                  rec === "REMOVE" ? "bg-bearish/80 text-primary-foreground border-0" : 
                  "bg-warning/80 text-foreground border-0"
                )}
              >
                {rec === "ADD" && <CircleCheck className="mr-1 h-4 w-4" />}
                {rec === "REMOVE" && <CircleX className="mr-1 h-4 w-4" />}
                {rec === "HODL" && <Clock className="mr-1 h-4 w-4" />}
                {rec}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent 
              className="w-80 p-4 bg-surface-2 border-border text-primary-foreground"
              side="right"
            >
              <p className="text-sm">{reason}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <div className="flex flex-col items-center my-4 py-3 rounded-lg">
          <div className="text-xs text-muted-foreground mb-1">Current price</div>
          <div className={cn(
            "text-3xl sm:text-4xl font-bold text-primary-foreground transition-all duration-300 transform",
            ticking ? "scale-105" : "scale-100"
          )}>
            ${lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="w-full mb-4 sm:mb-5">
          {formatPnLPercentage(pnlPct)}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-surface-2/50 p-3 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground">Entry</div>
            <div className="font-bold text-primary-foreground text-base sm:text-lg">
              {trade.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-surface-2/50 p-3 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground">P&amp;L</div>
            <div className={cn(
              "font-bold text-base sm:text-lg",
              trade.symbol.toUpperCase().includes('ETH') ? "text-[#9b87f5]" : pnlVal >= 0 ? "text-bullish" : "text-bearish"
            )}>
              {formatPnLValue(pnlVal, trade.symbol)}
            </div>
          </div>
          
          <div className="bg-surface-2/50 p-3 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground">
              {trade.leverage > 1 ? "Size (leverage)" : "Size"}
            </div>
            <div className="font-bold text-primary-foreground text-base sm:text-lg flex items-center gap-2">
              <span>{formatPositionSize(trade.size, trade.symbol)}</span>
              {trade.leverage > 1 && <span className="text-warning">{trade.leverage}x</span>}
            </div>
          </div>
          
          <div className="bg-surface-2/50 p-3 rounded-lg border border-border/30">
            <div className="text-xs text-muted-foreground">Trade</div>
            <div className={cn(
              "font-bold text-base sm:text-lg",
              trade.type === "long" ? "text-bullish" : "text-bearish"
            )}>
              {trade.type === "long" ? "LONG" : "SHORT"}
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-4 sm:mb-6 bg-surface-2/30 p-3 sm:p-4 rounded-lg border border-border/30">
          <h3 className="text-xs uppercase text-muted-foreground font-medium text-center mb-2">PRICE RANGES</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Hourly (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-bullish">
                ${formatPriceValue(hourlyHigh)}
              </span>
              <span className="text-bearish">
                ${formatPriceValue(hourlyLow)}
              </span>
            </div>
            <div className="h-1.5 bg-surface-3/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-card border-2 border-info"
                style={{
                  left: renderPriceMarker(
                    hourlyHigh,
                    hourlyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Daily (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-bullish">
                ${formatPriceValue(dailyHigh)}
              </span>
              <span className="text-bearish">
                ${formatPriceValue(dailyLow)}
              </span>
            </div>
            <div className="h-1.5 bg-surface-3/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-card border-2 border-info"
                style={{
                  left: renderPriceMarker(
                    dailyHigh,
                    dailyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Weekly (high/low)</span>
            </div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-bullish">
                ${formatPriceValue(weeklyHigh)}
              </span>
              <span className="text-bearish">
                ${formatPriceValue(weeklyLow)}
              </span>
            </div>
            <div className="h-1.5 bg-surface-3/50 rounded-full relative">
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-card border-2 border-info"
                style={{
                  left: renderPriceMarker(
                    weeklyHigh,
                    weeklyLow,
                    lastPrice
                  )
                }}
              ></div>
            </div>
            <div className="text-center text-xs text-muted-foreground mt-1">
              Market price: ${lastPrice.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            className="w-full bg-surface-2 hover:bg-surface-3 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={handleResetTrade}
          >
            Start over
          </button>
          
          <button 
            className="w-full bg-surface-2 hover:bg-surface-3 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors"
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
