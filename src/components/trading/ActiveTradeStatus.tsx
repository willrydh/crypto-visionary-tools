
import React, { useEffect, useState } from "react";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import { cn } from "@/lib/utils";
import { usePrice } from "@/hooks/usePrice";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, CircleCheck, CircleX, Info } from "lucide-react";
import { saveToStorage, getFromStorage, removeFromStorage } from "@/utils/storageUtils";
import { toast } from "@/components/ui/use-toast";

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
}

function getPnl(entry: number, current: number, size: number, leverage: number, type: TradeType) {
  const direction = type === "long" ? 1 : -1;
  const pnlPct = ((current - entry) * direction) / entry * 100 * (leverage || 1);
  const pnlVal = ((current - entry) * size * direction) * (leverage || 1);
  return { pnlPct, pnlVal };
}

function getRecommendation(entry: number, current: number, type: TradeType): { rec: Recommendation; reason: string } {
  const { pnlPct } = getPnl(entry, current, 1, 1, type);
  
  if (pnlPct > 3) return { rec: "ADD", reason: "Positive trend, high profit since entry. Data is real-time." };
  if (pnlPct < -2) return { rec: "REMOVE", reason: "Negative development, critical level passed. Data is real-time." };
  return { rec: "HODL", reason: "Stability - no clear profit/loss." };
}

const ACTIVE_TRADE_STORAGE_KEY = "activeTrade";

const ActiveTradeStatus: React.FC<ActiveTradeStatusProps> = ({ trade, lastPrice: initialPrice, onEnd }) => {
  const { loadPriceData, priceData } = usePrice();
  const [lastPrice, setLastPrice] = useState(initialPrice);
  const [ticking, setTicking] = useState(false);
  
  const { pnlPct, pnlVal } = getPnl(trade.entryPrice, lastPrice, trade.size, trade.leverage || 1, trade.type);
  
  const { rec, reason } = getRecommendation(trade.entryPrice, lastPrice, trade.type);
  
  // Calculate intensity for background colors based on PnL
  const getIntensity = (pnl: number) => {
    const absValue = Math.abs(pnl);
    // Cap at 30% for visual effect, scale from 5% to 40%
    if (absValue > 30) return 40;
    if (absValue < 1) return 5;
    return Math.floor(5 + (absValue / 30) * 35);
  };
  
  // Background gradient classes based on PnL
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
    
    // Save the trade to storage immediately when component mounts
    saveToStorage(ACTIVE_TRADE_STORAGE_KEY, trade);
    
    loadPriceData(formattedSymbol);
    
    // More frequent updates for real-time feeling (3-5 seconds)
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      setTicking(prev => !prev);
    }, 3000); // 3 seconds interval for faster updates
    
    return () => clearInterval(intervalId);
  }, [trade.pairSymbol, loadPriceData, trade]);
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    const currentPriceData = priceData[formattedSymbol];
    
    if (currentPriceData && currentPriceData.price) {
      setLastPrice(currentPriceData.price);
    }
  }, [priceData, trade.pairSymbol, ticking]); // Added ticking dependency to force re-render

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

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden border shadow-xl",
      getBgGradient()
    )}>
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2 text-white">AI Recommendation</h2>
          
          {/* Display trade pair info */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-300 mb-3">
            <span className="font-medium">{trade.name}</span>
            <span>•</span>
            <span>{trade.pairSymbol}</span>
            {trade.leverage > 1 && (
              <>
                <span>•</span>
                <span className="font-medium text-orange-400">{trade.leverage}x</span>
              </>
            )}
          </div>
          
          {/* Badge recommendation */}
          <div className="flex justify-center mb-2">
            <Badge 
              className={cn(
                "text-base px-6 py-2 rounded-full font-bold",
                rec === "ADD" ? "bg-green-500/80 text-white border-0" : 
                rec === "REMOVE" ? "bg-red-500/80 text-white border-0" : 
                "bg-yellow-500/80 text-black border-0"
              )}
            >
              {rec === "ADD" && <CircleCheck className="mr-1 h-4 w-4" />}
              {rec === "REMOVE" && <CircleX className="mr-1 h-4 w-4" />}
              {rec === "HODL" && <Info className="mr-1 h-4 w-4" />}
              {rec}
            </Badge>
          </div>
          
          <p className="text-sm text-slate-300 mt-1 max-w-xs mx-auto">{reason}</p>
        </div>
        
        {/* Current price with animation */}
        <div className={cn(
          "flex flex-col items-center my-5 py-4 rounded-lg", 
          "bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700/30"
        )}>
          <div className="text-xs text-slate-400 mb-1">Current price</div>
          <div className={cn(
            "text-4xl font-bold text-white transition-all duration-300 transform",
            ticking ? "scale-105" : "scale-100"
          )}>
            {lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        {/* PNL display - central and prominent */}
        <div className="flex justify-center mb-5">
          <div className={cn(
            "flex items-center justify-center px-6 py-3 rounded-lg", 
            pnlPct >= 0 
              ? "bg-green-500/20 border border-green-500/30" 
              : "bg-red-500/20 border border-red-500/30"
          )}>
            <div className="text-center">
              <div className="text-xs text-slate-300 mb-1">P&amp;L %</div>
              <div className={cn(
                "flex items-center justify-center gap-1 font-bold text-2xl",
                pnlPct >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {pnlPct >= 0 ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                {pnlPct.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">Entry</div>
            <div className="font-bold text-white text-lg">
              {trade.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">P&amp;L (val.)</div>
            <div className={cn(
              "font-bold text-lg",
              pnlVal >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {pnlVal.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">
              {trade.leverage > 1 ? "Size (leverage)" : "Size"}
            </div>
            <div className="font-bold text-white text-lg">
              {trade.size}
              {trade.leverage > 1 && <span className="text-orange-400 ml-2">{trade.leverage}x</span>}
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/30">
            <div className="text-xs text-slate-400">Trade</div>
            <div className={cn(
              "font-bold text-lg",
              trade.type === "long" ? "text-green-400" : "text-red-400"
            )}>
              {trade.type === "long" ? "LONG" : "SHORT"}
            </div>
          </div>
        </div>
        
        <div className="grid gap-3">
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
