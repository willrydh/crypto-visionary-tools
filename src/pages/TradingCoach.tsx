
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCrypto } from "@/hooks/useCrypto";
import CryptoSelector from "@/components/crypto/CryptoSelector";
import { usePrice } from "@/hooks/usePrice";
import { TransparentWhiteButton } from "@/components/ui/TransparentWhiteButton";
import ActiveTradeStatus from "@/components/trading/ActiveTradeStatus";
import { getFromStorage, saveToStorage, removeFromStorage } from '@/utils/storageUtils';
import { toast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, TrendingUp, TrendingDown, Zap } from "lucide-react";

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
    <div className="space-y-6 mt-6 animate-fade-in pb-20">
      <div className="flex flex-col items-center gap-3 mb-6">
        <Badge className="px-4 py-1 text-base bg-slate-800 shadow border-0"
          variant="outline"
        >AI Trading Assistant</Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 1 && !activeTrade && (
            <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                <CardTitle className="text-xl font-bold">1. Create new trade</CardTitle>
                <CardDescription className="text-base">Start a new trade with {selectedCrypto.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-slate-900 to-slate-800/80">
                <div className="py-4">
                  <div className="flex flex-col items-center mb-4">
                    <CryptoSelector showDataSource label="" />
                  </div>
                  <p className="text-muted-foreground mb-6">Set up a new trade position for AI monitoring and recommendations.</p>
                </div>
                <button
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors gap-2 font-medium"
                  onClick={handleSelectCrypto}
                >
                  <span>Monitor trade</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                <CardTitle className="text-lg font-bold">2. Type of trade</CardTitle>
                <CardDescription className="text-base">Long or short on <span className="font-semibold">{selectedCrypto.name}</span>?</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-slate-900 to-slate-800/80">
                <div className="flex items-center justify-center gap-6 my-6">
                  <button
                    className={cn(
                      "flex-1 py-5 rounded-lg flex flex-col items-center justify-center gap-2 transition-all border",
                      trade.type === "long" 
                        ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-lg shadow-green-900/20" 
                        : "bg-slate-800/80 border-slate-700/30 text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                    onClick={() => handleTypeSelect("long")}
                  >
                    <TrendingUp className={cn("h-6 w-6", trade.type === "long" ? "text-green-400" : "text-slate-400")} />
                    <span className="font-bold text-lg">Long</span>
                  </button>
                  
                  <button
                    className={cn(
                      "flex-1 py-5 rounded-lg flex flex-col items-center justify-center gap-2 transition-all border",
                      trade.type === "short" 
                        ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-900/20" 
                        : "bg-slate-800/80 border-slate-700/30 text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                    onClick={() => handleTypeSelect("short")}
                  >
                    <TrendingDown className={cn("h-6 w-6", trade.type === "short" ? "text-red-400" : "text-slate-400")} />
                    <span className="font-bold text-lg">Short</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => backTo(1)} 
                    className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={resetFlow} 
                    className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Start over
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                <CardTitle className="text-lg font-bold">3. Enter position</CardTitle>
                <CardDescription className="text-base">Details for <span className="font-semibold">{selectedCrypto.name}</span> / {selectedCrypto.pairSymbol}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-slate-900 to-slate-800/80">
                <form className="flex flex-col gap-5" onSubmit={handleEntrySizeSubmit}>
                  <div>
                    <Label htmlFor="entryPrice" className="text-sm text-slate-300 mb-1 block">Entry price ({selectedCrypto.name})</Label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder={currentPrice ? `E.g. ${currentPrice}` : "Ex. 12345"}
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="size" className="text-sm text-slate-300 mb-1 block">Position size</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.0001"
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="E.g. 0.01"
                    />
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
                    <Label htmlFor="leverage" className="text-sm text-slate-300 mb-1 block">
                      Leverage: <span className="text-white font-bold">{leverageValue[0]}x</span>
                    </Label>
                    <input
                      type="hidden"
                      id="leverage"
                      name="leverage"
                      value={leverageValue[0]}
                    />
                    <Slider
                      className="my-4"
                      defaultValue={[1]}
                      value={leverageValue}
                      onValueChange={setLeverageValue}
                      max={100}
                      min={1}
                      step={1}
                    />
                    <p className="text-xs text-slate-400">Adjust leverage: 1x (no leverage) to 100x</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => backTo(2)} 
                      className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Next step
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                <CardTitle className="text-lg font-bold">
                  4. Stop-loss & take profit <span className="text-xs font-normal text-slate-400">(optional)</span>
                </CardTitle>
                <CardDescription className="text-base">Risk management for <span className="font-semibold">{selectedCrypto.name}</span></CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-slate-900 to-slate-800/80">
                <form className="flex flex-col gap-5" onSubmit={handleRiskSubmit}>
                  <div>
                    <Label htmlFor="stopLoss" className="text-sm text-slate-300 mb-1 block">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      name="stopLoss"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Stop-Loss level"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="takeProfit" className="text-sm text-slate-300 mb-1 block">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      name="takeProfit"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-slate-800 border-slate-700 text-white"
                      placeholder="Take-Profit level"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateTime" className="text-sm text-slate-300 mb-1 block">Date/time <span className="text-slate-400">(optional)</span></Label>
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => backTo(3)} 
                      className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Go to analysis
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 5 && trade.entryPrice && trade.size && (
            <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">AI Recommendation</CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Live Analysis
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-slate-900 to-slate-800/80">
                {(() => {
                  const fullTrade = { ...trade, leverage: trade.leverage || 1 } as TradeEntry;
                  const { rec, reason, pnl } = getRecommendation(fullTrade, currentPrice);
                  const leverageMultiplier = trade.leverage || 1;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={cn(
                            "px-4 py-1.5 rounded-full font-bold text-white border-0",
                            rec === "ADD" ? "bg-green-500/80" : 
                            rec === "REMOVE" ? "bg-red-500/80" : 
                            "bg-yellow-500/80 text-slate-900"
                          )}
                        >
                          {rec}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="font-medium">{selectedCrypto.name}</span>
                          <span>•</span>
                          <span>{selectedCrypto.pairSymbol}</span>
                          {leverageMultiplier > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-orange-400 font-medium">{leverageMultiplier}x</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className={cn(
                        "text-sm p-3 rounded-lg bg-slate-800/40 border",
                        rec === "REMOVE" ? "border-red-500/20 text-red-300" : 
                        rec === "ADD" ? "border-green-500/20 text-green-300" : 
                        "border-yellow-500/20 text-yellow-300"
                      )}>
                        {reason}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 bg-slate-800/30 rounded-lg p-3 border border-slate-700/30">
                        <div>
                          <div className="text-xs text-slate-400">Entry</div>
                          <div className="font-medium text-white">{trade.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">Current price</div>
                          <div className="font-medium text-white">{currentPrice}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">P&amp;L %</div>
                          <div className={cn("font-medium", pnl >= 0 ? "text-green-400" : "text-red-400")}>
                            {pnl.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400">P&amp;L (val.)</div>
                          <div className={cn("font-medium", pnl >= 0 ? "text-green-400" : "text-red-400")}>
                            {((currentPrice - (trade.entryPrice as number)) * (trade.size as number) * (trade.type === "long" ? 1 : -1) * leverageMultiplier).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button 
                          onClick={resetFlow} 
                          className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          Start over
                        </button>
                        <button
                          onClick={handleAnalyse}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                        >
                          Save as active trade
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
              <CardTitle className="text-lg font-bold">Recommendation History</CardTitle>
              <CardDescription>Previous AI recommendations</CardDescription>
            </CardHeader>
            <CardContent className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-2">
                {coachHistory.map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 flex flex-col gap-1">
                    <div className="flex justify-between text-xs items-center flex-wrap gap-1">
                      <span className="text-slate-300">
                        {item.timestamp} 
                        <span className="ml-2 bg-slate-700/50 px-2 py-0.5 rounded text-xs">{item.symbol}</span> 
                        <span className="text-slate-400">({item.pairSymbol})</span>
                        {item.leverage > 1 && <span className="text-orange-400 ml-1">{item.leverage}x</span>}
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-xs border-0",
                        item.recommendation === "ADD" ? "text-green-400 bg-green-500/10" :
                          item.recommendation === "REMOVE" ? "text-red-400 bg-red-500/10" : 
                          "text-yellow-400 bg-yellow-500/10"
                      )}>{item.recommendation}</Badge>
                    </div>
                    <div className={cn(
                      "text-xs",
                      item.recommendation === "REMOVE" ? "text-red-300" : 
                      item.recommendation === "ADD" ? "text-green-300" : 
                      "text-yellow-300"
                    )}>
                      {item.reason}
                    </div>
                    <div className={cn("text-xs font-medium mt-1", item.pnl >= 0 ? "text-green-400" : "text-red-400")}>
                      P&amp;L: {item.pnl.toFixed(2)}% | Entry: {item.entry} | Size: {item.size}
                    </div>
                  </div>
                ))}
                {coachHistory.length === 0 && (
                  <div className="text-slate-400 text-sm text-center py-8 flex flex-col items-center gap-2">
                    <Badge variant="outline" className="bg-slate-800 border-slate-700">No history yet</Badge>
                    <p className="text-xs text-slate-500 max-w-[200px] mx-auto mt-2">
                      Your trading history and AI recommendations will appear here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingCoach;
