
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useCrypto } from "@/hooks/useCrypto";
import CryptoSelector from "@/components/crypto/CryptoSelector";
import { usePrice } from "@/hooks/usePrice";

// Typdefinitioner
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

// Dummyindikatorer kan senare ersättas med riktiga (här för demo)
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

// BYT: Den här funktionen måste få in rätt symbol och nuvarande prisdata!
function getDummyRecommendation(entry: TradeEntry, cur: number): { rec: Recommendation, reason: string, pnl: number } {
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
  // Lägg till stöd för att välja krypto
  const { selectedCrypto } = useCrypto();
  const { priceData } = usePrice();

  // Bybit symbol utan /
  const pairSymbol = selectedCrypto.pairSymbol;
  const priceKey = pairSymbol.replace('/', '');
  const currentPriceObj = priceData[priceKey];

  // Om data saknas, defaulta till 0
  const dummyCurrentPrice = currentPriceObj?.price || 0;

  // TODO: Byt även indikatorvärden till rätt krypto (leave dummy tills vidare)
  // Senare: Hämta och visa realtidsindikatorer per symbol

  const [trade, setTrade] = useState<TradeEntry>(initialTrade);
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([
    {
      timestamp: "2024-04-19 20:01",
      recommendation: "HODL",
      reason: "MACD flack, pris över MA100, inga varningssignaler.",
      pnl: 1.5,
    }
  ]);

  // Anpassa DUMMY-funktion om det behövs för andra coins
  const { rec, reason, pnl } = getDummyRecommendation(trade, dummyCurrentPrice);

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

  // UI START — Settings/modern look
  return (
    <div className="w-full max-w-2xl mx-auto pt-6 pb-12 flex flex-col gap-8">
      {/* Selector sektion överst LIKE i Settings */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Trading Coach</h1>
        <p className="text-muted-foreground max-w-xl">
          Få coach-rekommendationer på din trade! Ange dina tradingparametrar för att analysera din position och se AI-coachens råd. <br />
          <span className="hidden md:inline">Du kan välja kryptovaluta och analysen gäller alltid den du valt.</span>
        </p>
      </div>
      <div className="bg-card/80 rounded-xl border border-border p-4 mt-2 mb-2">
        <CryptoSelector fullWidth={true} showDataSource={true} label="Välj kryptovaluta" />
      </div>

      <Card className="glass border-0 shadow-card">
        <CardHeader>
          <CardTitle>Analys av din {selectedCrypto.name}-trade</CardTitle>
          <CardDescription>
            Mata in din position för personlig AI-analys och strategi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualInput} className="space-y-6 mt-2">
            <div className="flex items-center justify-center gap-6">
              <Label htmlFor="type-long" className={cn("cursor-pointer", trade.type === "long" ? "text-green-400" : "text-muted-foreground")}>
                <input type="radio" name="type" id="type-long" value="long" defaultChecked={trade.type === "long"} className="accent-green-400 mr-2" />
                Long
              </Label>
              <Label htmlFor="type-short" className={cn("cursor-pointer", trade.type === "short" ? "text-red-400" : "text-muted-foreground")}>
                <input type="radio" name="type" id="type-short" value="short" defaultChecked={trade.type === "short"} className="accent-red-400 mr-2" />
                Short
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryPrice">Entrypris</Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                required
                defaultValue={trade.entryPrice}
                step="0.01"
                className="glass"
                placeholder="Entryprice"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Positionstorlek</Label>
              <Input
                id="size"
                name="size"
                type="number"
                required
                defaultValue={trade.size}
                step="0.0001"
                className="glass"
                placeholder="Storlek"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss <span className="text-muted-foreground">(valfritt)</span></Label>
              <Input
                id="stopLoss"
                name="stopLoss"
                type="number"
                defaultValue={trade.stopLoss}
                step="0.01"
                className="glass"
                placeholder="Stop Loss"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit <span className="text-muted-foreground">(valfritt)</span></Label>
              <Input
                id="takeProfit"
                name="takeProfit"
                type="number"
                defaultValue={trade.takeProfit}
                step="0.01"
                className="glass"
                placeholder="Take Profit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTime">Datum/tid <span className="text-muted-foreground">(valfritt)</span></Label>
              <Input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                defaultValue={trade.dateTime}
                className="glass"
                placeholder="Datum/tid"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-tr from-primary to-secondary/80 text-white shadow hover:from-primary/70 hover:to-secondary/70">
              Analysera trade
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-card">
        <CardHeader>
          <CardTitle>Rekommendation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 pb-4">
            <div className={cn(
              "text-3xl font-bold",
              rec === "ADD" ? "text-green-300" : rec === "REMOVE" ? "text-red-300" : "text-yellow-200"
            )}>{rec}</div>
            <Badge className={cn(
              "text-base px-6 py-2 rounded-full font-semibold shadow pulse-subtle backdrop-blur select-none border-0",
              rec === "ADD" ? "bg-green-400/30 text-green-200" :
                rec === "REMOVE" ? "bg-red-400/30 text-red-200" : "bg-yellow-300/20 text-yellow-100"
            )}>{rec}</Badge>
            <div className="mb-2 text-sm text-center text-slate-200">{reason}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <div className="text-xs text-muted-foreground">Entry</div>
              <div className="font-semibold text-white">{trade.entryPrice}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Nuvarande pris</div>
              <div className="font-semibold text-white">{dummyCurrentPrice}</div>
            </div>
            <div>
              <div className="text-xs text-slate-200">P&amp;L %</div>
              <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-300")}>{pnl.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-slate-200">P&amp;L (val)</div>
              <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-300")}>
                {((dummyCurrentPrice - trade.entryPrice) * trade.size * (trade.type === "long" ? 1 : -1)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-1 justify-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA21: ${dummyIndicators.ma21}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA50: ${dummyIndicators.ma50}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA100: ${dummyIndicators.ma100}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA200: ${dummyIndicators.ma200}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-violet-100 border border-violet-200/20 backdrop-blur">{`EMA21: ${dummyIndicators.ema21}`}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-1 justify-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-cyan-100 border border-cyan-200/20 backdrop-blur">{`MACD: ${dummyIndicators.macd} (${dummyIndicators.macdSignal})`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-pink-100 border border-pink-200/20 backdrop-blur">{`RSI6: ${dummyIndicators.rsi6}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-pink-100 border border-pink-200/20 backdrop-blur">{`RSI12: ${dummyIndicators.rsi12}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-pink-100 border border-pink-200/20 backdrop-blur">{`RSI24: ${dummyIndicators.rsi24}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-orange-100 border border-orange-200/20 backdrop-blur">{`Stoch RSI: ${dummyIndicators.stochRsi}`}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="rounded-full glass px-3 py-1 text-xs text-slate-100 border border-slate-200/20 backdrop-blur">{`Volym: ${dummyIndicators.volume.toLocaleString()}`}</span>
            <span className="rounded-full glass px-3 py-1 text-xs text-purple-100 border border-purple-200/20 backdrop-blur">{`Trend: ${dummyIndicators.isUptrend ? "Stark ↑" : "Svag ↓"}`}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-0 shadow-card">
        <CardHeader>
          <CardTitle>Rekommendations-historik</CardTitle>
          <CardDescription>
            Tidigare AI-rekommendationer baserat på din trade-inmatning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {coachHistory.map((item, i) => (
              <div key={i} className="p-2 rounded-md glass border border-white/10 flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between text-xs items-center">
                  <span className="text-slate-200">{item.timestamp}</span>
                  <Badge variant="outline" className={cn(
                    "text-xs border-0",
                    item.recommendation === "ADD" ? "text-green-300" : 
                    item.recommendation === "REMOVE" ? "text-red-300" : "text-yellow-100"
                  )}>{item.recommendation}</Badge>
                </div>
                <div className="text-xs text-slate-300">{item.reason}</div>
                <div className={cn("text-xs font-medium", item.pnl >= 0 ? "text-green-400" : "text-red-300")}>
                  P&amp;L: {item.pnl.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingCoach;
