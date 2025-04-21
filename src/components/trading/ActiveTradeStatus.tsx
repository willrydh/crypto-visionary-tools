
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
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    
    // Save the trade to storage immediately when component mounts
    saveToStorage(ACTIVE_TRADE_STORAGE_KEY, trade);
    
    loadPriceData(formattedSymbol);
    
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      setTicking(prev => !prev);
    }, 1500); // Slightly faster updates for more real-time feel
    
    return () => clearInterval(intervalId);
  }, [trade.pairSymbol, loadPriceData, trade]);
  
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    const currentPriceData = priceData[formattedSymbol];
    
    if (currentPriceData && currentPriceData.price) {
      setLastPrice(currentPriceData.price);
    }
  }, [priceData, trade.pairSymbol]);

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

  // Determine the background color based on P&L
  const getBackgroundClass = () => {
    if (pnlPct > 0) {
      return "bg-green-600 border-green-500/70 shadow-green-500/20 shadow-lg";
    } else if (pnlPct < 0) {
      return "bg-red-600 border-red-500/70 shadow-red-500/20 shadow-lg";
    } else {
      return "bg-slate-900 border-slate-800";
    }
  };

  return (
    <div className={cn(
      "relative rounded-xl p-6 border shadow-xl transition-colors duration-300", 
      getBackgroundClass()
    )}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 text-white">AI Recommendation</h2>
        
        {/* Display trade pair info */}
        <div className="flex flex-col items-center gap-1 mb-3">
          <div className="flex items-center gap-2 text-sm text-white">
            <span>{trade.name}</span>
            <span>•</span>
            <span>{trade.pairSymbol}</span>
            {trade.leverage > 1 && (
              <>
                <span>•</span>
                <span className="font-medium text-orange-400">{trade.leverage}x</span>
              </>
            )}
          </div>
        </div>
        
        {/* Badge recommendation */}
        <div className="flex justify-center mb-2">
          <Badge 
            className={cn(
              "text-base px-8 py-2 rounded-full font-bold",
              rec === "ADD" ? "bg-green-500 text-white" : 
              rec === "REMOVE" ? "bg-red-500 text-white" : 
              "bg-yellow-500 text-black"
            )}
          >
            {rec === "ADD" && <CircleCheck className="mr-1 h-4 w-4" />}
            {rec === "REMOVE" && <CircleX className="mr-1 h-4 w-4" />}
            {rec === "HODL" && <Info className="mr-1 h-4 w-4" />}
            {rec}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-200 mt-1 max-w-xs mx-auto">{reason}</p>
      </div>
      
      {/* Current price with animation */}
      <div className="flex flex-col items-center mb-5 bg-black/20 rounded-xl py-4 mx-4">
        <div className="text-xs text-gray-200 mb-1">Current price</div>
        <div className={cn(
          "text-4xl font-bold text-white transition-all duration-300 transform",
          ticking ? "scale-110" : "scale-100"
        )}>
          {lastPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      {/* PNL display - central and prominent */}
      <div className="flex justify-center mb-6">
        <div className={cn(
          "flex items-center justify-center px-6 py-3 rounded-lg transition-colors", 
          pnlPct >= 0 ? "bg-green-500/30" : "bg-red-500/30"
        )}>
          <div className="text-center">
            <div className="text-xs text-gray-200 mb-1">P&amp;L %</div>
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
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-gray-200">Entry</div>
          <div className="font-bold text-white text-lg">
            {trade.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-gray-200">P&amp;L (val.)</div>
          <div className={cn(
            "font-bold text-lg",
            pnlVal >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {pnlVal.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-gray-200">
            {trade.leverage > 1 ? "Size (leverage)" : "Size"}
          </div>
          <div className="font-bold text-white text-lg">
            {trade.size}
            {trade.leverage > 1 && <span className="text-orange-400 ml-2">{trade.leverage}x</span>}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-gray-200">Trade</div>
          <div className={cn(
            "font-bold text-lg",
            trade.type === "long" ? "text-green-400" : "text-red-400"
          )}>
            {trade.type === "long" ? "LONG" : "SHORT"}
          </div>
        </div>
      </div>
      
      <div className="grid gap-3">
        <TransparentWhiteButton 
          className="w-full text-base font-bold"
          onClick={handleResetTrade}
        >
          Start over
        </TransparentWhiteButton>
        
        <TransparentWhiteButton 
          className="w-full text-base font-bold"
          onClick={handleEndTrade}
        >
          End trade
        </TransparentWhiteButton>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
