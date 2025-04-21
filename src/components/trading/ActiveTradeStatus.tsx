
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
  
  if (pnlPct > 3) return { rec: "ADD", reason: "Positiv trend, hög vinst sedan entry. Daten är realtidsdata." };
  if (pnlPct < -2) return { rec: "REMOVE", reason: "Negativ utveckling, kritisk nivå passerad. Daten är realtidsdata." };
  return { rec: "HODL", reason: "Stabilitet - ingen tydlig vinst/förlust." };
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
    }, 2000);
    
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
      title: "Trade avslutad",
      description: "Din trade har avslutats.",
    });
    onEnd();
  };

  const handleResetTrade = () => {
    removeFromStorage(ACTIVE_TRADE_STORAGE_KEY);
    toast({
      title: "Trade återställd",
      description: "Din trade har återställts.",
    });
    onEnd();
  };

  // Determine the background color based on P&L
  const bgColorClass = pnlPct > 0 
    ? "bg-gradient-to-br from-green-950 to-green-900 border-green-800" 
    : pnlPct < 0 
      ? "bg-gradient-to-br from-red-950 to-red-900 border-red-800" 
      : "bg-slate-900 border-slate-800";

  return (
    <div className={cn("relative rounded-xl p-6 border shadow-xl transition-colors duration-500", bgColorClass)}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">AI Rekommendation</h2>
        
        <div className="flex flex-col items-center gap-2">
          <Badge 
            className={cn(
              "text-base px-8 py-2 rounded-full font-bold",
              rec === "ADD" ? "bg-green-600 text-white" : 
              rec === "REMOVE" ? "bg-red-600 text-white" : 
              "bg-yellow-500 text-black"
            )}
          >
            {rec === "ADD" && <CircleCheck className="mr-1 h-4 w-4" />}
            {rec === "REMOVE" && <CircleX className="mr-1 h-4 w-4" />}
            {rec === "HODL" && <Info className="mr-1 h-4 w-4" />}
            {rec}
          </Badge>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          
          <p className="text-sm text-gray-400 mt-1 max-w-xs text-center">{reason}</p>
        </div>
      </div>
      
      <div className="flex flex-col items-center mb-8">
        <div className="text-xs text-muted-foreground mb-1">Nuvarande pris</div>
        <div className={cn(
          "text-4xl font-bold text-white transition-all duration-200 transform",
          ticking ? "scale-110" : "scale-100"
        )}>
          {lastPrice.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">Entry</div>
          <div className="font-bold text-white text-lg">
            {trade.entryPrice.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">P&amp;L %</div>
          <div className={cn(
            "flex items-center gap-1 font-bold text-lg",
            pnlPct >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {pnlPct >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {pnlPct.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">P&amp;L (val.)</div>
          <div className={cn(
            "font-bold text-lg",
            pnlVal >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {pnlVal.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-3 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {trade.leverage > 1 ? "Storlek (hävstång)" : "Storlek"}
          </div>
          <div className="font-bold text-white text-lg">
            {trade.size}
            {trade.leverage > 1 && <span className="text-orange-400 ml-2">{trade.leverage}x</span>}
          </div>
        </div>
      </div>
      
      <div className="grid gap-3">
        <TransparentWhiteButton 
          className="w-full text-base font-bold"
          onClick={handleResetTrade}
        >
          Börja om
        </TransparentWhiteButton>
        
        <TransparentWhiteButton 
          className="w-full text-base font-bold"
          onClick={handleEndTrade}
        >
          Avsluta trade
        </TransparentWhiteButton>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
