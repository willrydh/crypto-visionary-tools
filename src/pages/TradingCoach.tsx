
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

type TradeType = "long" | "short";
type Recommendation = "HODL" | "ADD" | "REMOVE";
interface TradeEntry {
  entryPrice: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  dateTime?: string;
  type: TradeType;
}

interface CoachHistoryItem {
  timestamp: string;
  recommendation: Recommendation;
  reason: string;
  pnl: number;
}

const dummyIndicators = {
  ma21: 71000,
  ma50: 70500,
  ma100: 70050,
  ma200: 69000,
  ema21: 71250,
  macd: 2.05,
  macdSignal: 1.82,
  rsi6: 62,
  rsi12: 52,
  rsi24: 46,
  stochRsi: 74,
  volume: 320000,
  isUptrend: true
};

const dummyCurrentPrice = 72000;

function getDummyRecommendation(entry: TradeEntry, cur: number): { rec: Recommendation, reason: string, pnl: number } {
  // Dummy logic: profit/loss determines rec
  const pnl = ((cur - entry.entryPrice) * (entry.type === 'long' ? 1 : -1)) / entry.entryPrice * 100;
  if (pnl > 3) return { rec: "ADD", reason: "Trenden fortsatt stark: MA21 ovan, MACD positiv. → ADD", pnl };
  if (pnl < -2) return { rec: "REMOVE", reason: "Pris har brutit under MA50, RSI sjunker. → REMOVE", pnl };
  return { rec: "HODL", reason: "MACD neutral, MA ordning ej bruten ännu. → HODL", pnl };
}

const initialTrade: TradeEntry = {
  entryPrice: 71000,
  size: 0.21,
  stopLoss: 70000,
  takeProfit: 80000,
  dateTime: "2024-04-20T10:30",
  type: "long"
};

const TradingCoach: React.FC = () => {
  const [trade, setTrade] = useState<TradeEntry>(initialTrade);
  const [mode, setMode] = useState<"api"|"manual">("manual");
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([
    {
      timestamp: "2024-04-19 20:01",
      recommendation: "HODL",
      reason: "MACD flack, pris över MA100, inga varningssignaler.",
      pnl: 1.5,
    }
  ]);
  
  // Skapa “analys”/rekommendation för aktiv trade
  const { rec, reason, pnl } = getDummyRecommendation(trade, dummyCurrentPrice);

  // Bakgrundsfärg för profit/loss
  const bgGradient = pnl >= 0
    ? "from-[#F2FCE2] to-[#e9f8ce]" // grön gradient
    : "from-[#FFEBEE] to-[#f6e0e3]"; // röd gradient

  // Hantera formulär
  function handleManualInput(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newTrade: TradeEntry = {
      entryPrice: Number(form.entryPrice.value),
      size: Number(form.size.value),
      stopLoss: form.stopLoss.value ? Number(form.stopLoss.value) : undefined,
      takeProfit: form.takeProfit.value ? Number(form.takeProfit.value) : undefined,
      dateTime: form.dateTime.value || undefined,
      type: form.type.value as TradeType
    };
    setTrade(newTrade);
    setCoachHistory((old) => [
      {
        timestamp: new Date().toISOString().slice(0,16).replace('T', ' '),
        recommendation: getDummyRecommendation(newTrade, dummyCurrentPrice).rec,
        reason: getDummyRecommendation(newTrade, dummyCurrentPrice).reason,
        pnl: getDummyRecommendation(newTrade, dummyCurrentPrice).pnl
      },
      ...old
    ]);
  }

  return (
    <div className={cn("min-h-screen flex flex-col items-center py-8 px-2 md:px-0 transition bg-gradient-to-b w-full", bgGradient)}>
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">Trading Coach</h1>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex gap-2 flex-col sm:flex-row items-center justify-center">
              <Button 
                variant={mode==="api" ? "default" : "outline"} 
                onClick={() => setMode("api")}
              >Importera från Bybit</Button>
              <Button 
                variant={mode==="manual" ? "default" : "outline"} 
                onClick={() => setMode("manual")}
              >Manuell inmatning</Button>
            </div>
          </CardHeader>
          <CardContent>
            {mode === "manual" && (
              <form className="w-full grid gap-3" onSubmit={handleManualInput} autoComplete="off">
                <div className="flex gap-2">
                  <label className="flex items-center gap-1 font-medium">
                    <input type="radio" name="type" value="long" defaultChecked={trade.type === "long"} /> Long
                  </label>
                  <label className="flex items-center gap-1 font-medium">
                    <input type="radio" name="type" value="short" defaultChecked={trade.type === "short"} /> Short
                  </label>
                </div>
                <Input type="number" name="entryPrice" placeholder="Entry price" step="0.01" required defaultValue={trade.entryPrice} />
                <Input type="number" name="size" placeholder="Size" step="0.0001" required defaultValue={trade.size} />
                <Input type="number" name="stopLoss" placeholder="Stop Loss (valfritt)" step="0.01" defaultValue={trade.stopLoss} />
                <Input type="number" name="takeProfit" placeholder="Take Profit (valfritt)" step="0.01" defaultValue={trade.takeProfit} />
                <Input type="datetime-local" name="dateTime" placeholder="Date/time (valfritt)" defaultValue={trade.dateTime} />
                <Button type="submit" className="w-full mt-2">Analysera trade</Button>
              </form>
            )}
            {mode === "api" && (
              <div className="p-2 text-center text-muted-foreground">API-integration kommer snart! Lägg till din Bybit-nyckel i inställningar för att automatiskt hämta öppna trades.</div>
            )}
          </CardContent>
        </Card>

        {/* Analys-ruta */}
        <Card className="mb-4 shadow-2xl">
          <CardContent>
            <div className="flex flex-col items-center py-4">
              <div className="text-4xl font-bold mb-0">{rec}</div>
              <Badge className={cn("text-lg mb-2", 
                rec === "ADD" ? "bg-green-200 text-green-800" : 
                rec === "REMOVE" ? "bg-red-200 text-red-800" : 
                "bg-yellow-200 text-yellow-800"
              )}>{rec}</Badge>
              <div className="mb-2 text-sm text-center">{reason}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Entry</div>
                <div className="font-semibold">{trade.entryPrice}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Current</div>
                <div className="font-semibold">{dummyCurrentPrice}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">P&L %</div>
                <div className={cn("font-semibold", pnl >= 0 ? "text-green-600" : "text-red-600")}>{pnl.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">P&L (val)</div>
                <div className={cn("font-semibold", pnl >= 0 ? "text-green-600" : "text-red-600")}>{((dummyCurrentPrice - trade.entryPrice) * trade.size * (trade.type === "long" ? 1 : -1)).toFixed(2)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>MA21: {dummyIndicators.ma21}</Badge>
              <Badge>MA50: {dummyIndicators.ma50}</Badge>
              <Badge>MA100: {dummyIndicators.ma100}</Badge>
              <Badge>MA200: {dummyIndicators.ma200}</Badge>
              <Badge>EMA21: {dummyIndicators.ema21}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>MACD: {dummyIndicators.macd} ({dummyIndicators.macdSignal})</Badge>
              <Badge>RSI6: {dummyIndicators.rsi6}</Badge>
              <Badge>RSI12: {dummyIndicators.rsi12}</Badge>
              <Badge>RSI24: {dummyIndicators.rsi24}</Badge>
              <Badge>Stoch RSI: {dummyIndicators.stochRsi}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Volym: {dummyIndicators.volume.toLocaleString()}</Badge>
              <Badge>Trend: {dummyIndicators.isUptrend ? "Stark ↑" : "Svag ↓"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="font-bold text-lg">Rekommendations-historik</span>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {coachHistory.map((item, i) => (
                <div key={i} className="p-2 rounded bg-white/60 border flex flex-col gap-1">
                  <div className="flex justify-between text-xs items-center">
                    <span>{item.timestamp}</span>
                    <Badge variant="outline" className="text-xs">{item.recommendation}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.reason}</div>
                  <div className={cn("text-xs", item.pnl >= 0 ? "text-green-700" : "text-red-700")}>
                    P&L: {item.pnl.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingCoach;
