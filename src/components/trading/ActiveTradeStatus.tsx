
import React, { useEffect, useState } from "react";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import { cn } from "@/lib/utils";
import { usePrice } from "@/hooks/usePrice";
import { Badge } from "@/components/ui/badge";

type TradeType = "long" | "short";
type Recommendation = "HODL" | "ADD" | "REMOVE";

interface ActiveTradeStatusProps {
  trade: {
    entryPrice: number;
    size: number;
    type: TradeType;
    symbol: string;
    name: string;
    pairSymbol: string;
  };
  lastPrice: number;
  onEnd: () => void;
}

function getPnl(entry: number, current: number, size: number, type: TradeType) {
  const direction = type === "long" ? 1 : -1;
  const pnlPct = ((current - entry) * direction) / entry * 100;
  const pnlVal = ((current - entry) * size * direction);
  return { pnlPct, pnlVal };
}

// Get recommendation based on PNL
function getRecommendation(entry: number, current: number, type: TradeType): { rec: Recommendation; reason: string } {
  const { pnlPct } = getPnl(entry, current, 1, type);
  
  if (pnlPct > 3) return { rec: "ADD", reason: "Positiv trend, hög vinst sedan entry. Daten är realtidsdata." };
  if (pnlPct < -2) return { rec: "REMOVE", reason: "Negativ utveckling, kritisk nivå passerad. Daten är realtidsdata." };
  return { rec: "HODL", reason: "Stabilitet - ingen tydlig vinst/förlust." };
}

// Färga bakgrund beroende på PNL (ju högre abs(vinst/förlust) desto starkare färg)
function getPnlGradient(pnl: number) {
  const capped = Math.min(Math.abs(pnl) / 10, 1); // 10% eller mer = max färg
  if (pnl > 0) {
    // Grönare: från mjukt till starkt
    return `linear-gradient(95deg, rgba(34,197,94,${0.25 + capped*0.45}) 0%, rgba(34,197,94,${0.12 + capped*0.35}) 100%)`;
  }
  if (pnl < 0) {
    // Rödare: från mjukt till starkt
    return `linear-gradient(95deg, rgba(234,56,76,${0.20 + capped*0.5}) 0%, rgba(234,56,76,${0.05 + capped*0.16}) 100%)`;
  }
  return `linear-gradient(90deg, rgba(60,60,80,0.1) 0%, rgba(60,60,80,0.15) 100%)`; // neutral
}

const ActiveTradeStatus: React.FC<ActiveTradeStatusProps> = ({ trade, lastPrice: initialPrice, onEnd }) => {
  const { loadPriceData, priceData } = usePrice();
  const [lastPrice, setLastPrice] = useState(initialPrice);
  const [ticking, setTicking] = useState(false);
  
  // Calculate PNL based on the current price
  const { pnlPct, pnlVal } = getPnl(trade.entryPrice, lastPrice, trade.size, trade.type);
  
  // Get recommendation based on current PNL
  const { rec, reason } = getRecommendation(trade.entryPrice, lastPrice, trade.type);
  
  // Set up real-time price updates
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    
    // Initial load of price data
    loadPriceData(formattedSymbol);
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      loadPriceData(formattedSymbol);
      setTicking(prev => !prev); // Toggle to trigger animation
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [trade.pairSymbol, loadPriceData]);
  
  // Update local price when priceData changes
  useEffect(() => {
    const formattedSymbol = trade.pairSymbol.replace('/', '');
    const currentPriceData = priceData[formattedSymbol];
    
    if (currentPriceData && currentPriceData.price) {
      setLastPrice(currentPriceData.price);
    }
  }, [priceData, trade.pairSymbol]);

  return (
    <div
      className="relative rounded-3xl p-8 border-2 border-white/25 shadow-2xl mb-14 flex flex-col gap-9 transition-all duration-300 animate-fade-in overflow-hidden backdrop-blur-md"
      style={{
        background: getPnlGradient(pnlPct)
      }}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-2 text-lg font-bold text-white">
          <span className={trade.type === "long" ? "text-green-400" : "text-red-400"}>
            {trade.type === "long" ? "Long" : "Short"}
          </span>
          <span className="text-white/90">{trade.name} <span className="text-xs font-normal text-muted-foreground ml-1">({trade.pairSymbol})</span></span>
        </div>
        
        {/* AI Recommendation title */}
        <h2 className="text-2xl font-extrabold text-white mt-2">AI Rekommendation</h2>
        
        {/* Recommendation badge - centered and prominent */}
        <Badge 
          className={cn(
            "text-base px-8 py-2 rounded-full font-bold text-white border-0 mb-1",
            rec === "ADD" ? "bg-green-600" : 
            rec === "REMOVE" ? "bg-red-600" : 
            "bg-blue-600"
          )}
        >
          {rec}
        </Badge>
        
        {/* Recommendation reason */}
        <div className={cn(
          "text-sm mb-3 max-w-md text-center",
          rec === "REMOVE" ? "text-red-300" : 
          rec === "ADD" ? "text-green-300" : 
          "text-blue-200"
        )}>
          {reason}
        </div>
      </div>

      {/* Current price - large and centered */}
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1">Nuvarande pris</div>
        <div className={cn(
          "text-3xl font-bold text-white transition-all",
          ticking ? "scale-110" : "scale-100"
        )}>
          {lastPrice.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      
      {/* Trade details grid */}
      <div className="grid grid-cols-2 gap-4 bg-slate-900/70 p-4 rounded-lg border border-slate-800">
        <div>
          <div className="text-xs text-muted-foreground">Entry</div>
          <div className="font-bold text-white text-lg">
            {trade.entryPrice.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">Storlek</div>
          <div className="font-bold text-white text-lg">{trade.size}</div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">P&amp;L %</div>
          <div className={cn(
            "font-bold text-lg transition-all",
            ticking ? "scale-105" : "scale-100",
            pnlPct >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%
          </div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">P&amp;L (val.)</div>
          <div className={cn(
            "font-bold text-lg transition-all",
            ticking ? "scale-105" : "scale-100",
            pnlVal >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {pnlVal >= 0 ? "+" : ""}{pnlVal.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Buttons - stacked vertically */}
      <div className="flex flex-col gap-3 mt-2">
        <TransparentWhiteButton 
          className="w-full text-base font-bold backdrop-blur-md border-2"
          onClick={() => {}}
        >
          Börja om
        </TransparentWhiteButton>
        
        <TransparentWhiteButton 
          className="w-full text-base font-bold backdrop-blur-md border-2"
          onClick={onEnd}
        >
          Spara & markera som aktiv trade
        </TransparentWhiteButton>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
