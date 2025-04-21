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

// Step types
type Step = 1 | 2 | 3 | 4 | 5;
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

// Dummy TA-indikatorer
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

const getDummyRecommendation = (entry: TradeEntry, cur: number) => {
  const pnl = ((cur - entry.entryPrice) * (entry.type === 'long' ? 1 : -1)) / entry.entryPrice * 100;
  if (pnl > 3) return { rec: "ADD" as Recommendation, reason: "Trenden fortsatt stark: MA21 ovan, MACD positiv. → ADD", pnl };
  if (pnl < -2) return { rec: "REMOVE" as Recommendation, reason: "Pris har brutit under MA50, RSI sjunker. → REMOVE", pnl };
  return { rec: "HODL" as Recommendation, reason: "MACD neutral, MA ordning ej bruten ännu. → HODL", pnl };
};

const TradingCoach: React.FC = () => {
  // Hooks för krypto och pris
  const { selectedCrypto, setSelectedCrypto } = useCrypto();
  const { priceData } = usePrice();

  // Price config
  const pairSymbol = selectedCrypto.pairSymbol;
  const priceKey = pairSymbol.replace('/', '');
  const currentPriceObj = priceData[priceKey];
  const dummyCurrentPrice = currentPriceObj?.price || 0;

  // Step state & inputs
  const [step, setStep] = useState<Step>(1);
  const [trade, setTrade] = useState<Partial<TradeEntry>>({
    type: "long"
  });
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([]);
  const { rec, reason, pnl } = trade.entryPrice
    ? getDummyRecommendation(trade as TradeEntry, dummyCurrentPrice)
    : { rec: 'HODL', reason: '', pnl: 0 };

  // Step 1: Crypto
  function handleSelectCrypto() {
    setStep(2);
  }
  // Step 2: Typ
  function handleTypeSelect(type: TradeType) {
    setTrade((old) => ({ ...old, type }));
    setStep(3);
  }
  // Step 3: entry & size
  function handleEntrySizeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setTrade((old) => ({
      ...old,
      entryPrice: Number(form.entryPrice.value),
      size: Number(form.size.value)
    }));
    setStep(4);
  }
  // Step 4: SL & TP
  function handleRiskSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setTrade((old) => ({
      ...old,
      stopLoss: form.stopLoss.value ? Number(form.stopLoss.value) : undefined,
      takeProfit: form.takeProfit.value ? Number(form.takeProfit.value) : undefined,
      dateTime: form.dateTime.value || undefined
    }));
    setStep(5);
  }
  // Step 5: Gör analys
  function handleAnalyse() {
    if (trade.entryPrice && trade.size && trade.type) {
      setCoachHistory((old) => [
        {
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          recommendation: rec as Recommendation,
          reason,
          pnl
        },
        ...old
      ]);
      setStep(1); // Efter analys: starta om flödet
      setTrade({ type: "long" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24 px-2 md:px-0">
      <section className="max-w-2xl mx-auto py-12 sm:py-16 px-3 md:px-0 w-full fade-in">
        <Badge className="mb-4" variant="outline">AI Trading Assistant</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground drop-shadow">Trade Coach</h1>
        <p className="text-lg max-w-xl mx-auto text-muted-foreground mb-7 text-center">
          Få AI-drivna rekommendationer för dina trades. Följ stegen nedan och analysera din trade.
        </p>

        {/* Steg-wizard */}
        <div className="w-full flex flex-col gap-10">
          {/* Step 1: Select Crypto */}
          {step === 1 && (
            <Card className="bg-card/90 shadow-lg border-0 rounded-2xl p-0">
              <CardHeader>
                <CardTitle className="text-xl mb-1">1. Välj Kryptovaluta</CardTitle>
                <CardDescription>Vilken krypto vill du analysera?</CardDescription>
              </CardHeader>
              <CardContent>
                <CryptoSelector fullWidth showDataSource label="Kryptovaluta" />
                <Button
                  size="lg"
                  className="mt-6 w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow hover:from-primary/70 hover:to-secondary/70"
                  onClick={handleSelectCrypto}
                  type="button"
                >
                  Nästa steg
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Choose type */}
          {step === 2 && (
            <Card className="bg-card/90 shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl mb-1">2. Typ av Trade</CardTitle>
                <CardDescription>Är det en long eller short?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center justify-center gap-8 mb-2 mt-1">
                  <Button
                    variant={trade.type === "long" ? "default" : "outline"}
                    size="lg"
                    className={cn(trade.type === "long" ?
                      "bg-gradient-to-r from-green-500 to-primary text-white shadow" : "bg-none")}
                    onClick={() => handleTypeSelect("long")}
                  >
                    Long
                  </Button>
                  <Button
                    variant={trade.type === "short" ? "default" : "outline"}
                    size="lg"
                    className={cn(trade.type === "short" ?
                      "bg-gradient-to-r from-red-500 to-primary text-white shadow" : "bg-none")}
                    onClick={() => handleTypeSelect("short")}
                  >
                    Short
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Entry & Storlek */}
          {step === 3 && (
            <Card className="bg-card/90 shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl mb-1">3. Skriv in position</CardTitle>
                <CardDescription>Några uppgifter krävs för analys</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-6" onSubmit={handleEntrySizeSubmit}>
                  <div>
                    <Label htmlFor="entryPrice">Entrypris</Label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="glass mt-1"
                      placeholder="Ange entrypris"
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Positionstorlek</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.0001"
                      className="glass mt-1"
                      placeholder="Ange storlek (t.ex. 0.01)"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow hover:from-primary/70 hover:to-secondary/70"
                  >
                    Nästa steg
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Riskhantering */}
          {step === 4 && (
            <Card className="bg-card/90 shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl mb-1">4. Stop-Loss & Take Profit</CardTitle>
                <CardDescription>(Valfritt) Ange nivåer eller fortsätt</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-6" onSubmit={handleRiskSubmit}>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      name="stopLoss"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="glass mt-1"
                      placeholder="Ange stop-loss nivå"
                    />
                  </div>
                  <div>
                    <Label htmlFor="takeProfit">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      name="takeProfit"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="glass mt-1"
                      placeholder="Ange take-profit nivå"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTime">Datum/tid <span className="text-muted-foreground">(valfritt)</span></Label>
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      className="glass mt-1"
                      placeholder="Datum/tid"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow hover:from-primary/70 hover:to-secondary/70"
                  >
                    Gå till analys
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Analys */}
          {step === 5 && trade.entryPrice && trade.size && (
            <Card className="bg-gradient-to-br from-card to-secondary/40 shadow-lg border-0 rounded-2xl py-2 glass">
              <CardHeader>
                <CardTitle className="text-xl">Rekommendation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2 pb-2">
                  <Badge className={cn(
                    "text-base px-7 py-2 rounded-full font-bold shadow pulse-subtle text-center select-none border-0 text-white tracking-wide text-lg",
                    rec === "ADD" ? "bg-green-500/80" :
                      rec === "REMOVE" ? "bg-red-500/80" : "bg-yellow-400/80 text-black"
                  )}>{rec}</Badge>
                  <div className={cn("mb-2 text-sm text-center w-full", rec === "REMOVE" ? "text-red-200" : rec === "ADD" ? "text-green-200" : "text-yellow-700")}>
                    {reason}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-xs text-muted-foreground">Entry</div>
                    <div className="font-semibold text-white">{trade.entryPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Nuvarande pris</div>
                    <div className="font-semibold text-white">{dummyCurrentPrice}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">P&amp;L %</div>
                    <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-300")}>{pnl.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">P&amp;L (val)</div>
                    <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-300")}>
                      {((dummyCurrentPrice - trade.entryPrice) * trade.size * (trade.type === "long" ? 1 : -1)).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-1">
                  <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA21: ${dummyIndicators.ma21}`}</span>
                  <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA50: ${dummyIndicators.ma50}`}</span>
                  <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA100: ${dummyIndicators.ma100}`}</span>
                  <span className="rounded-full glass px-3 py-1 text-xs text-blue-100 border border-blue-200/20 backdrop-blur">{`MA200: ${dummyIndicators.ma200}`}</span>
                  <span className="rounded-full glass px-3 py-1 text-xs text-violet-100 border border-violet-200/20 backdrop-blur">{`EMA21: ${dummyIndicators.ema21}`}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-1">
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
                {/* Nollställ/starta om-knapp */}
                <Button
                  size="lg"
                  className="w-full mt-4 bg-gradient-to-r from-primary to-secondary/80 text-white shadow hover:from-primary/70 hover:to-secondary/70"
                  onClick={handleAnalyse}
                >
                  Spara & Börja ny analys
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      {/* Coach history nedan */}
      <section className="max-w-2xl mx-auto w-full mb-8">
        <Card className="bg-card/80 shadow-lg border-0 rounded-2xl">
          <CardHeader>
            <CardTitle>Rekommendationshistorik</CardTitle>
            <CardDescription>
              Tidigare AI-rekommendationer för dina analyserade trades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {coachHistory.map((item, i) => (
                <div key={i} className="p-3 rounded-lg glass border border-white/10 flex flex-col gap-1">
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-slate-200">{item.timestamp}</span>
                    <Badge variant="outline" className={cn(
                      "text-xs border-0",
                      item.recommendation === "ADD" ? "text-green-400" :
                        item.recommendation === "REMOVE" ? "text-red-400" : "text-yellow-600"
                    )}>{item.recommendation}</Badge>
                  </div>
                  <div className={cn("text-xs", item.recommendation === "REMOVE" ? "text-red-300" : item.recommendation === "ADD" ? "text-green-300" : "text-yellow-700")}>{item.reason}</div>
                  <div className={cn("text-xs font-medium", item.pnl >= 0 ? "text-green-400" : "text-red-300")}>
                    P&amp;L: {item.pnl.toFixed(2)}%
                  </div>
                </div>
              ))}
              {coachHistory.length === 0 && <div className="text-muted-foreground text-sm text-center py-2">Ingen historik ännu.</div>}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TradingCoach;
