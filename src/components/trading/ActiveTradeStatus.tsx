
import React from "react";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import { cn } from "@/lib/utils";

type TradeType = "long" | "short";

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

const ActiveTradeStatus: React.FC<ActiveTradeStatusProps> = ({ trade, lastPrice, onEnd }) => {
  const { pnlPct, pnlVal } = getPnl(trade.entryPrice, lastPrice, trade.size, trade.type);
  const pnlRounded = pnlPct >= 0 ? "+" + pnlPct.toFixed(2) : pnlPct.toFixed(2);
  const btnColor = pnlPct > 0 ? "text-green-100 border-green-300" : pnlPct < 0 ? "text-red-100 border-red-400" : "";

  return (
    <div
      className={cn(
        "relative rounded-3xl p-8 md:p-12 border-2 border-white/25 shadow-2xl mb-14 flex flex-col gap-9 transition-all duration-300 animate-fade-in"
      )}
      style={{
        background: getPnlGradient(pnlPct)
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 text-lg font-bold text-white">
            <span className={trade.type === "long" ? "text-green-400" : "text-red-400"}>
              {trade.type === "long" ? "Long" : "Short"}
            </span>
            <span className="text-white/90">{trade.name} <span className="text-xs font-normal text-muted-foreground ml-1">({trade.pairSymbol})</span></span>
          </div>
          <div className="text-xs text-muted-foreground font-medium">Pågående trade</div>
        </div>
        <div>
          <div className={cn(
            "rounded-full px-5 py-2 font-extrabold text-xl shadow-lg border-2 transition-colors duration-200",
            pnlPct >= 0 ? "bg-green-600/95 text-white border-green-200" : "bg-red-600/95 text-white border-red-200"
          )}>
            {pnlRounded}% <span className="text-xs pl-2 font-semibold">{pnlVal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-9 text-base">
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-0.5">Entrypris</div>
          <div className="font-bold text-white">{trade.entryPrice}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-0.5">Nuvarande pris</div>
          <div className="font-bold text-white">{lastPrice}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-0.5">Storlek</div>
          <div className="font-bold text-white">{trade.size}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground mb-0.5">Symbol</div>
          <div className="font-bold text-white">{trade.symbol}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 justify-end mt-2 px-2">
        <TransparentWhiteButton className={cn("w-full md:w-auto text-base font-bold backdrop-blur-md border-2", btnColor)}
          onClick={onEnd}
        >
          Avsluta Trade
        </TransparentWhiteButton>
      </div>
    </div>
  );
};

export default ActiveTradeStatus;
