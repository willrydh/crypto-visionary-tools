
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCrypto } from "@/hooks/useCrypto";
import CryptoSelector from "@/components/crypto/CryptoSelector";
import { usePrice } from "@/hooks/usePrice";
import TransparentWhiteButton from "@/components/ui/TransparentWhiteButton";
import ActiveTradeStatus from "@/components/trading/ActiveTradeStatus";
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storageUtils';
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";

type Step = 1 | 2 | 3 | 4 | 5;
type TradeType = "long" | "short";
type Recommendation = "HODL" | "ADD" | "REMOVE";
interface TradeEntry {
  entryPrice: number;
  size: number;
  leverage: number;
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
  leverage: number;
  lastPrice: number;
}

const ACTIVE_TRADE_STORAGE_KEY = "activeTrade";
const COACH_HISTORY_STORAGE_KEY = "coachHistory";

const getRecommendation = (entry: TradeEntry, current: number): { rec: Recommendation; reason: string; pnl: number } => {
  if (!entry || !current) return { rec: 'HODL', reason: "No data", pnl: 0 };
  const pnl = ((current - entry.entryPrice) * (entry.type === "long" ? 1 : -1)) / entry.entryPrice * 100 * (entry.leverage || 1);
  if (pnl > 3) return { rec: "ADD", reason: "Positive trend, high profit since entry. Data is real-time.", pnl };
  if (pnl < -2) return { rec: "REMOVE", reason: "Negative development, critical level passed. Data is real-time.", pnl };
  return { rec: "HODL", reason: "Stability - no clear profit/loss.", pnl };
};

const TradingCoach: React.FC = () => {
  const { selectedCrypto, setSelectedCrypto } = useCrypto();
  const { priceData, loadPriceData } = usePrice();

  const pairSymbol = selectedCrypto.pairSymbol;
  const priceKey = pairSymbol.replace('/', '');
  const currentPriceObj = priceData[priceKey];
  const currentPrice = currentPriceObj?.price || 0;

  const [step, setStep] = useState<Step>(1);
  const [trade, setTrade] = useState<Partial<TradeEntry>>({
    type: "long",
    symbol: selectedCrypto.symbol,
    pairSymbol: selectedCrypto.pairSymbol,
    name: selectedCrypto.name,
    leverage: 1, // Default leverage
  });
  const [coachHistory, setCoachHistory] = useState<CoachHistoryItem[]>([]);
  const [activeTrade, setActiveTrade] = useState<TradeEntry | null>(null);
  const [leverageValue, setLeverageValue] = useState([1]);

  useEffect(() => {
    const savedTrade = getFromStorage<TradeEntry | null>(ACTIVE_TRADE_STORAGE_KEY, null);
    if (savedTrade) {
      setActiveTrade(savedTrade);
      
      if (savedTrade.symbol && savedTrade.pairSymbol && savedTrade.name) {
        setSelectedCrypto({
          symbol: savedTrade.symbol,
          pairSymbol: savedTrade.pairSymbol,
          name: savedTrade.name
        });
      }
      
      if (savedTrade.pairSymbol) {
        const formattedSymbol = savedTrade.pairSymbol.replace('/', '');
        loadPriceData(formattedSymbol);
      }
      
      toast({
        title: "Active trade loaded",
        description: `Continuing with your ${savedTrade.type} on ${savedTrade.name}`,
      });
    }
    
    const savedHistory = getFromStorage<CoachHistoryItem[]>(COACH_HISTORY_STORAGE_KEY, []);
    if (savedHistory && savedHistory.length > 0) {
      setCoachHistory(savedHistory);
    }
  }, []);

  useEffect(() => {
    if (coachHistory.length > 0) {
      saveToStorage(COACH_HISTORY_STORAGE_KEY, coachHistory);
    }
  }, [coachHistory]);

  useEffect(() => {
    setTrade(prev => ({
      ...prev,
      symbol: selectedCrypto.symbol,
      pairSymbol: selectedCrypto.pairSymbol,
      name: selectedCrypto.name,
    }));
  }, [selectedCrypto]);

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
      size: Number(form.size.value),
      leverage: Number(form.leverage.value) || 1
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
      const fullTrade = {
        ...trade,
        leverage: trade.leverage || 1
      } as TradeEntry;
      
      const { rec, reason, pnl } = getRecommendation(fullTrade, currentPrice);
      const newHistory = [
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
          leverage: trade.leverage || 1,
          lastPrice: currentPrice,
        },
        ...coachHistory
      ];
      
      setCoachHistory(newHistory);
      saveToStorage(COACH_HISTORY_STORAGE_KEY, newHistory);
      
      const newActiveTrade = fullTrade;
      setActiveTrade(newActiveTrade);
      saveToStorage(ACTIVE_TRADE_STORAGE_KEY, newActiveTrade);
      
      setStep(1);
      setTrade({
        type: "long",
        symbol: selectedCrypto.symbol,
        pairSymbol: selectedCrypto.pairSymbol,
        name: selectedCrypto.name,
        leverage: 1,
      });
      
      toast({
        title: "Trade saved",
        description: `Your ${trade.type} trade on ${trade.name} has been saved and is now active.`,
      });
    }
  }

  function backTo(stepNum: Step) {
    setStep(stepNum);
  }

  function resetFlow() {
    setStep(1);
    setTrade({
      type: "long",
      symbol: selectedCrypto.symbol,
      pairSymbol: selectedCrypto.pairSymbol,
      name: selectedCrypto.name,
      leverage: 1,
    });
  }

  function endTrade() {
    setActiveTrade(null);
    removeFromStorage(ACTIVE_TRADE_STORAGE_KEY);
    toast({
      title: "Trade ended",
      description: "Your trade has been ended and is no longer active.",
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 pb-24 px-2 md:px-0 section-padding">
      <section className="max-w-2xl mx-auto py-8 sm:py-12 w-full fade-in">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Badge className="px-4 py-1 text-base bg-slate-800 shadow border-0"
            variant="outline"
          >AI Trading Assistant</Badge>
          <div className="flex flex-col items-center">
            <CryptoSelector showDataSource label="" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-white text-center">Trade Coach</h1>
        <div className="text-center text-lg text-muted-foreground mb-8">
          <span className="font-semibold">{selectedCrypto.name}</span> <span className="mx-1">•</span> <span>{selectedCrypto.pairSymbol}</span>
        </div>

        {activeTrade && (
          <ActiveTradeStatus
            trade={activeTrade}
            lastPrice={currentPrice}
            onEnd={endTrade}
          />
        )}

        <div className="w-full flex flex-col gap-8">
          {step === 1 && !activeTrade && (
            <Card className="bg-slate-800 shadow-xl border-slate-700 rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-extrabold">1. Create new trade</CardTitle>
                <CardDescription className="text-base">Start a new trade with {selectedCrypto.name}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <TransparentWhiteButton
                  className="w-full text-base"
                  onClick={handleSelectCrypto}
                  type="button"
                >
                  Next step
                </TransparentWhiteButton>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-slate-800 shadow-xl border-slate-700 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1 font-extrabold">2. Type of trade</CardTitle>
                <CardDescription className="text-base">Long or short on <span className="font-semibold">{selectedCrypto.name}</span>?</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 mt-2">
                <div className="flex items-center justify-center gap-8">
                  <TransparentWhiteButton
                    className={cn(
                      "w-32 py-3 font-bold text-lg",
                      trade.type === "long" && "bg-green-500/30 border-green-400 text-green-100 shadow-md"
                    )}
                    onClick={() => handleTypeSelect("long")}
                  >Long</TransparentWhiteButton>
                  <TransparentWhiteButton
                    className={cn(
                      "w-32 py-3 font-bold text-lg",
                      trade.type === "short" && "bg-red-500/40 border-red-400 text-red-100 shadow-md"
                    )}
                    onClick={() => handleTypeSelect("short")}
                  >Short</TransparentWhiteButton>
                </div>
                <div className="flex flex-col gap-3 justify-between mt-3">
                  <TransparentWhiteButton onClick={() => backTo(1)} className="w-full">Back</TransparentWhiteButton>
                  <TransparentWhiteButton onClick={resetFlow} className="w-full">Start over</TransparentWhiteButton>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-slate-800 shadow-xl border-slate-700 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1 font-extrabold">3. Enter position</CardTitle>
                <CardDescription className="text-base">Details for <span className="font-semibold">{selectedCrypto.name}</span> / {selectedCrypto.pairSymbol}</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-6 mt-2" onSubmit={handleEntrySizeSubmit}>
                  <div>
                    <Label htmlFor="entryPrice">Entry price ({selectedCrypto.name})</Label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="mt-1 bg-muted/40"
                      placeholder={currentPrice ? `E.g. ${currentPrice}` : "Ex. 12345"}
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Position size</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.0001"
                      className="mt-1 bg-muted/40"
                      placeholder="E.g. 0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leverage">Leverage: {leverageValue[0]}x</Label>
                    <input
                      type="hidden"
                      id="leverage"
                      name="leverage"
                      value={leverageValue[0]}
                    />
                    <Slider
                      className="mt-2"
                      defaultValue={[1]}
                      value={leverageValue}
                      onValueChange={setLeverageValue}
                      max={100}
                      min={1}
                      step={1}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Adjust leverage: 1x (no leverage) to 100x</p>
                  </div>
                  <div className="flex flex-col gap-3 pt-1">
                    <TransparentWhiteButton type="button" onClick={() => backTo(2)} className="w-full">Back</TransparentWhiteButton>
                    <TransparentWhiteButton
                      type="submit"
                      className="w-full"
                    >Next step</TransparentWhiteButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="bg-slate-800 shadow-xl border-slate-700 rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg mb-1 font-extrabold">4. Stop-loss & take profit <span className="text-xs font-normal text-muted-foreground">(optional)</span></CardTitle>
                <CardDescription className="text-base">Risk management for <span className="font-semibold">{selectedCrypto.name}</span></CardDescription>
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
                      className="mt-1 bg-muted/40"
                      placeholder="Stop-Loss level"
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
                      placeholder="Take-Profit level"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateTime">Date/time <span className="text-muted-foreground">(optional)</span></Label>
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      className="mt-1 bg-muted/40"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <TransparentWhiteButton type="button" onClick={() => backTo(3)} className="w-full">Back</TransparentWhiteButton>
                    <TransparentWhiteButton
                      type="submit"
                      className="w-full"
                    >Go to analysis</TransparentWhiteButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 5 && trade.entryPrice && trade.size && (
            <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-br from-slate-900/80 to-secondary/50 py-8 px-4 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold mb-1">AI Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {(() => {
                  const fullTrade = { ...trade, leverage: trade.leverage || 1 } as TradeEntry;
                  const { rec, reason, pnl } = getRecommendation(fullTrade, currentPrice);
                  const leverageMultiplier = trade.leverage || 1;
                  
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={cn(
                          "text-base px-8 py-2 rounded-full font-bold text-white border-0",
                          rec === "ADD" ? "bg-green-600" : rec === "REMOVE" ? "bg-red-600" : "bg-yellow-400 text-black"
                        )}>{rec}</Badge>
                        <span className="text-base font-semibold text-gray-100 drop-shadow whitespace-nowrap">
                          {selectedCrypto.name} • {selectedCrypto.pairSymbol}
                          {leverageMultiplier > 1 && <span className="text-orange-400 ml-2">{leverageMultiplier}x</span>}
                        </span>
                      </div>
                      <div className={cn("mb-2 text-sm text-center", rec === "REMOVE" ? "text-red-300" : rec === "ADD" ? "text-green-300" : "text-yellow-700")}>{reason}</div>
                      <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-900/70 px-2 py-2 mb-2 border border-slate-800">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div className="font-semibold text-white">{trade.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Current price</div>
                          <div className="font-semibold text-white">{currentPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L %</div>
                          <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-400")}>{pnl.toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L (val.)</div>
                          <div className={cn("font-semibold text-lg", pnl >= 0 ? "text-green-400" : "text-red-400")}>
                            {((currentPrice - (trade.entryPrice as number)) * (trade.size as number) * (trade.type === "long" ? 1 : -1) * leverageMultiplier).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 mt-2">
                        <TransparentWhiteButton className="w-full" onClick={resetFlow}>Start over</TransparentWhiteButton>
                        <TransparentWhiteButton
                          className="w-full"
                          onClick={handleAnalyse}
                        >
                          Save & mark as active trade
                        </TransparentWhiteButton>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </section>
      <section className="max-w-2xl mx-auto w-full mb-8">
        <Card className="bg-slate-800 shadow-xl border-slate-700 rounded-xl">
          <CardHeader>
            <CardTitle>Recommendation History</CardTitle>
            <CardDescription>
              Previous AI recommendations for your analyzed trades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {coachHistory.map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700 flex flex-col gap-1">
                  <div className="flex justify-between text-xs items-center flex-wrap gap-1">
                    <span className="text-slate-200">
                      {item.timestamp} 
                      <span className="ml-2 bg-muted px-2 py-0.5 rounded text-xs">{item.symbol}</span> 
                      <span>({item.pairSymbol})</span>
                      {item.leverage > 1 && <span className="text-orange-400 ml-1">{item.leverage}x</span>}
                    </span>
                    <Badge variant="outline" className={cn(
                      "text-xs border-0",
                      item.recommendation === "ADD" ? "text-green-400" :
                        item.recommendation === "REMOVE" ? "text-red-400" : "text-yellow-600"
                    )}>{item.recommendation}</Badge>
                  </div>
                  <div className={cn("text-xs", item.recommendation === "REMOVE" ? "text-red-300" : item.recommendation === "ADD" ? "text-green-300" : "text-yellow-700")}>{item.reason}</div>
                  <div className={cn("text-xs font-medium", item.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                    P&amp;L: {item.pnl.toFixed(2)}% | Entry: {item.entry} | Size: {item.size} | Price: {item.lastPrice}
                  </div>
                </div>
              ))}
              {coachHistory.length === 0 && <div className="text-muted-foreground text-sm text-center py-2">No history yet.</div>}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default TradingCoach;
