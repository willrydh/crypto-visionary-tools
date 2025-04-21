
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
  symbol: string;
  pairSymbol: string;
  name: string;
}
interface CoachHistoryItem {
  timestamp: string;
  recommendation: Recommendation;
  reason: string;
  pnl: number;
  symbol: string;
  pairSymbol: string;
  tradeType: TradeType;
  entry: number;
  size: number;
  lastPrice: number;
}

// Skapa snygga status-vy för aktiv trade
const ActiveTradeView: React.FC<{ trade: TradeEntry; lastPrice: number; onEnd: () => void; }> = ({ trade, lastPrice, onEnd }) => {
  const pnl = ((lastPrice - trade.entryPrice) * (trade.type === "long" ? 1 : -1)) / trade.entryPrice * 100;
  return (
    <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-br from-gray-800/80 to-slate-800/70 py-6 px-4 mb-12">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Aktiv Trade</CardTitle>
        <CardDescription>
          {trade.name} ({trade.pairSymbol}) • {trade.type === "long" ? "Long" : "Short"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:items-start gap-8 pt-2">
        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Entry</div>
              <div className="font-semibold text-white">{trade.entryPrice}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Nuvarande pris</div>
              <div className="font-semibold text-white">{lastPrice}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">P&amp;L %</div>
              <span className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-400")}>{pnl.toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <Button variant="outline" className="w-full md:w-auto" onClick={onEnd}>
              Avsluta Trade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Bybit API rekommendation byggd på riktig data
const getRecommendation = (entry: TradeEntry, current: number): { rec: Recommendation; reason: string; pnl: number } => {
  if (!entry || !current) return { rec: 'HODL', reason: "Ingen data", pnl: 0 };
  const pnl = ((current - entry.entryPrice) * (entry.type === "long" ? 1 : -1)) / entry.entryPrice * 100;
  if (pnl > 3) return { rec: "ADD", reason: "Positiv trend, hög vinst sedan entry. Daten är realtidsdata.", pnl };
  if (pnl < -2) return { rec: "REMOVE", reason: "Negativ utveckling, kritisk nivå passerad. Daten är realtidsdata.", pnl };
  return { rec: "HODL", reason: "Stabilitet - ingen tydlig vinst/förlust.", pnl };
};

const TradingCoach: React.FC = () => {
  const { selectedCrypto, setSelectedCrypto } = useCrypto();
  const { priceData } = usePrice();

  // Price driven från riktig Bybit-data för valt par
  const pairSymbol = selectedCrypto.pairSymbol;
  const priceKey = pairSymbol.replace('/', '');
  const currentPriceObj = priceData[priceKey];
  const currentPrice = currentPriceObj?.price || 0;

  // State
  const [step, setStep] = useState<Step>(1);
  const [trade, setTrade] = useState<Partial<TradeEntry>>({
    type: "long",
    symbol: selectedCrypto.symbol,
    pairSymbol: selectedCrypto.pairSymbol,
    name: selectedCrypto.name,
  });
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([]);
  const [activeTrade, setActiveTrade] = useState<TradeEntry | null>(null);

  // Byt valuta, byt steg
  function handleSelectCrypto() {
    setStep(2);
    setTrade((old) => ({
      ...old,
      symbol: selectedCrypto.symbol,
      pairSymbol: selectedCrypto.pairSymbol,
      name: selectedCrypto.name,
    }));
  }
  function handleTypeSelect(type: TradeType) {
    setTrade((old) => ({ ...old, type }));
    setStep(3);
  }
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
  function handleAnalyse() {
    if (trade.entryPrice && trade.size && trade.type && trade.symbol && trade.pairSymbol && trade.name) {
      const { rec, reason, pnl } = getRecommendation(trade as TradeEntry, currentPrice);
      setCoachHistory((old) => [
        {
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          recommendation: rec,
          reason,
          pnl,
          symbol: trade.symbol,
          pairSymbol: trade.pairSymbol,
          tradeType: trade.type,
          entry: trade.entryPrice,
          size: trade.size,
          lastPrice: currentPrice,
        },
        ...old
      ]);
      setActiveTrade(trade as TradeEntry);
      setStep(1);
      setTrade({
        type: "long",
        symbol: selectedCrypto.symbol,
        pairSymbol: selectedCrypto.pairSymbol,
        name: selectedCrypto.name,
      });
    }
  }
  // "Backa" steg
  function backTo(stepNum: Step) {
    setStep(stepNum);
  }
  // "Börja om"
  function resetFlow() {
    setStep(1);
    setTrade({
      type: "long",
      symbol: selectedCrypto.symbol,
      pairSymbol: selectedCrypto.pairSymbol,
      name: selectedCrypto.name,
    });
    setActiveTrade(null);
  }
  // Avsluta trade
  function endTrade() {
    setActiveTrade(null);
  }

  // UI: Steg-wizard och status + knappjusteringar
  return (
    <div className="min-h-screen flex flex-col bg-background pb-24 px-2 md:px-0">
      <section className="max-w-2xl mx-auto py-10 sm:py-16 w-full fade-in">
        <div className="flex gap-3 mb-6 items-center justify-center">
          <Badge className="box-border whitespace-nowrap" variant="outline">AI Trading Assistant</Badge>
          <span className="inline-block"><CryptoSelector showDataSource label="" /></span>
        </div>
        <h1 className="text-4xl font-black mb-3 text-foreground text-center drop-shadow">Trade Coach</h1>
        <div className="text-center text-lg text-muted-foreground mb-5">
          {selectedCrypto.name} &bull; {selectedCrypto.pairSymbol}
        </div>

        {/* Aktiv trade vy */}
        {activeTrade && (
          <ActiveTradeView 
            trade={activeTrade}
            lastPrice={currentPrice}
            onEnd={endTrade}
          />
        )}

        <div className="w-full flex flex-col gap-8">
          {/* Steg 1: Välj Krypto */}
          {step === 1 && !activeTrade && (
            <Card className="bg-card shadow-lg border-0 rounded-2xl px-0 pt-2 pb-7">
              <CardHeader>
                <CardTitle className="text-lg mb-1">1. Välj kryptovaluta</CardTitle>
                <CardDescription>Vilken krypto vill du analysera?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <CryptoSelector fullWidth showDataSource label="Kryptovaluta" />
                <Button
                  size="lg"
                  className="mt-6 w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow font-bold text-base"
                  onClick={handleSelectCrypto}
                  type="button"
                >
                  Nästa steg
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Steg 2: Välj typ */}
          {step === 2 && (
            <Card className="bg-card shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1">2. Typ av trade</CardTitle>
                <CardDescription>Long eller short?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex items-center justify-center gap-8 mb-3">
                  <Button
                    variant={trade.type === "long" ? "default" : "outline"}
                    size="lg"
                    className={cn(trade.type === "long" ? "bg-gradient-to-r from-green-500 to-primary text-white shadow font-bold" : "")}
                    onClick={() => handleTypeSelect("long")}
                  >Long</Button>
                  <Button
                    variant={trade.type === "short" ? "default" : "outline"}
                    size="lg"
                    className={cn(trade.type === "short" ? "bg-gradient-to-r from-red-500 to-primary text-white shadow font-bold" : "")}
                    onClick={() => handleTypeSelect("short")}
                  >Short</Button>
                </div>
                <div className="flex gap-3 justify-between">
                  <Button variant="ghost" onClick={() => backTo(1)} className="w-full">Tillbaka</Button>
                  <Button onClick={resetFlow} variant="outline" className="w-full">Börja om</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steg 3: Entry & storlek */}
          {step === 3 && (
            <Card className="bg-card shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1">3. Skriv in position</CardTitle>
                <CardDescription>Fyll i dina uppgifter för analys</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-5" onSubmit={handleEntrySizeSubmit}>
                  <div>
                    <Label htmlFor="entryPrice">Entrypris ({selectedCrypto.name})</Label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="mt-1 bg-muted/40"
                      placeholder={`T.ex. ${currentPrice}`}
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
                      className="mt-1 bg-muted/40"
                      placeholder="T.ex. 0.01"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" type="button" onClick={() => backTo(2)} className="w-full">Tillbaka</Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow font-bold"
                    >Nästa steg</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Steg 4: Risk */}
          {step === 4 && (
            <Card className="bg-card shadow-lg border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1">4. Stop-loss & take profit <span className="text-xs font-normal text-muted-foreground">(valfritt)</span></CardTitle>
                <CardDescription>Ange nivåer eller fortsätt till analys</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-5" onSubmit={handleRiskSubmit}>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      name="stopLoss"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="mt-1 bg-muted/40"
                      placeholder="Stop-Loss nivå"
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
                      className="mt-1 bg-muted/40"
                      placeholder="Take-Profit nivå"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTime">Datum/tid <span className="text-muted-foreground">(valfritt)</span></Label>
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      className="mt-1 bg-muted/40"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" type="button" onClick={() => backTo(3)} className="w-full">Tillbaka</Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow font-bold"
                    >Gå till analys</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Steg 5: Analys/resultat */}
          {step === 5 && trade.entryPrice && trade.size && (
            <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-br from-slate-900/80 to-secondary/50 py-8 px-4">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold mb-1">AI Rekommendation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {(() => {
                  const { rec, reason, pnl } = getRecommendation(trade as TradeEntry, currentPrice);
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={cn(
                          "text-base px-8 py-2 rounded-full font-bold text-white border-0",
                          rec === "ADD" ? "bg-green-600" : rec === "REMOVE" ? "bg-red-600" : "bg-yellow-400 text-black"
                        )}>{rec}</Badge>
                        <span className="text-base font-semibold text-gray-100 drop-shadow">
                          {selectedCrypto.name} • {selectedCrypto.pairSymbol}
                        </span>
                      </div>
                      <div className={cn("mb-2 text-sm text-center", rec === "REMOVE" ? "text-red-300" : rec === "ADD" ? "text-green-300" : "text-yellow-700")}>{reason}</div>
                      <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-900/70 px-2 py-2 mb-2 border border-slate-800">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div className="font-semibold text-white">{trade.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Nuvarande pris</div>
                          <div className="font-semibold text-white">{currentPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L %</div>
                          <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-400")}>{pnl.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L (val.)</div>
                          <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-400")}>
                            {((currentPrice - (trade.entryPrice as number)) * (trade.size as number) * (trade.type === "long" ? 1 : -1)).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <Button variant="ghost" className="w-full" onClick={resetFlow}>Börja om</Button>
                        <Button
                          size="lg"
                          className="w-full bg-gradient-to-r from-primary to-secondary/80 text-white shadow font-bold"
                          onClick={handleAnalyse}
                        >
                          Spara & markera som aktiv trade
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      {/* Historik */}
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
                <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700 flex flex-col gap-1">
                  <div className="flex justify-between text-xs items-center flex-wrap gap-1">
                    <span className="text-slate-200">{item.timestamp} <span className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">{item.symbol}</span> <span>({item.pairSymbol})</span></span>
                    <Badge variant="outline" className={cn(
                      "text-xs border-0",
                      item.recommendation === "ADD" ? "text-green-400" :
                        item.recommendation === "REMOVE" ? "text-red-400" : "text-yellow-600"
                    )}>{item.recommendation}</Badge>
                  </div>
                  <div className={cn("text-xs", item.recommendation === "REMOVE" ? "text-red-300" : item.recommendation === "ADD" ? "text-green-300" : "text-yellow-700")}>{item.reason}</div>
                  <div className={cn("text-xs font-medium", item.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                    P&amp;L: {item.pnl.toFixed(2)}% | Entry: {item.entry} | Size: {item.size} | Pris: {item.lastPrice}
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
