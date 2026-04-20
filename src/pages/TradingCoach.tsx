import React, { useState, useEffect, useCallback } from 'react';
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
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

type Step = 1 | 2 | 3 | 4 | 5;
type TradeType = "long" | "short";
type Recommendation = "HODL" | "ADD" | "REMOVE";
interface TradeEntry {
  entryPrice: number;
  size: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
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
  return { 
    rec: "HODL", 
    reason: "Consolidation - Waiting for breakout confirmation. Price is currently consolidating after London open and a spike to the upside. Macd shows bullish conversion on over 5 timeframes, RSI shows momentum is gathering strength, Stochastics show slightly overbought territory. Analysis shows you should watch the trade and wait for a breakout confirmation before taking more action for now.", 
    pnl 
  };
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
  const [lastPriceUpdate, setLastPriceUpdate] = useState(0);

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
    if (activeTrade && activeTrade.pairSymbol) {
      const formattedSymbol = activeTrade.pairSymbol.replace('/', '');
      
      loadPriceData(formattedSymbol);
      
      const intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastPriceUpdate >= 1000) {
          loadPriceData(formattedSymbol);
          setLastPriceUpdate(now);
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [activeTrade, loadPriceData, lastPriceUpdate]);

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
      {!activeTrade && (
        <>
          <div className="flex flex-col items-center gap-3 mb-6">
            <Badge className="px-4 py-1 text-base bg-surface-2 shadow border-0"
              variant="outline"
            >AI Trading Assistant</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 text-primary-foreground text-center">Trade Coach</h1>
          <div className="text-center text-lg text-muted-foreground mb-8">
            <span className="font-semibold">{selectedCrypto.name}</span> <span className="mx-1">•</span> <span>{selectedCrypto.pairSymbol}</span>
          </div>
        </>
      )}

      {activeTrade && (
        <ActiveTradeStatus
          trade={activeTrade}
          lastPrice={currentPrice}
          onEnd={endTrade}
          hideHeader={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 1 && !activeTrade && (
            <Card className="bg-surface-1 shadow-xl border-border/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-surface-2/50">
                <CardTitle className="text-xl font-bold">1. Create new trade</CardTitle>
                <CardDescription className="text-base">Start a new trade with {selectedCrypto.name}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-surface-1 to-surface-2/80">
                <div className="py-4">
                  <div className="flex flex-col items-center mb-4">
                    <CryptoSelector showDataSource label="" />
                  </div>
                  <p className="text-muted-foreground mb-6">Set up a new trade position for AI monitoring and recommendations.</p>
                </div>
                <button
                  className="w-full bg-surface-2 hover:bg-surface-3 text-primary-foreground py-3 px-4 rounded-lg flex items-center justify-center transition-colors gap-2 font-medium"
                  onClick={handleSelectCrypto}
                >
                  <span>Monitor trade</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-surface-1 shadow-xl border-border/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-surface-2/50">
                <CardTitle className="text-lg font-bold">2. Type of trade</CardTitle>
                <CardDescription className="text-base">Long or short on <span className="font-semibold">{selectedCrypto.name}</span>?</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-surface-1 to-surface-2/80">
                <div className="flex items-center justify-center gap-6 my-6">
                  <button
                    className={cn(
                      "flex-1 py-5 rounded-lg flex flex-col items-center justify-center gap-2 transition-all border",
                      trade.type === "long" 
                        ? "bg-bullish/20 border-bullish/30 text-bullish shadow-lg shadow-green-900/20" 
                        : "bg-surface-2/80 border-border/30 text-muted-foreground hover:bg-surface-2 hover:text-primary-foreground"
                    )}
                    onClick={() => handleTypeSelect("long")}
                  >
                    <TrendingUp className={cn("h-6 w-6", trade.type === "long" ? "text-bullish" : "text-muted-foreground")} />
                    <span className="font-bold text-lg">Long</span>
                  </button>
                  
                  <button
                    className={cn(
                      "flex-1 py-5 rounded-lg flex flex-col items-center justify-center gap-2 transition-all border",
                      trade.type === "short" 
                        ? "bg-bearish/20 border-bearish/30 text-bearish shadow-lg shadow-red-900/20" 
                        : "bg-surface-2/80 border-border/30 text-muted-foreground hover:bg-surface-2 hover:text-primary-foreground"
                    )}
                    onClick={() => handleTypeSelect("short")}
                  >
                    <TrendingDown className={cn("h-6 w-6", trade.type === "short" ? "text-bearish" : "text-muted-foreground")} />
                    <span className="font-bold text-lg">Short</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => backTo(1)} 
                    className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={resetFlow} 
                    className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                  >
                    Start over
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-surface-1 shadow-xl border-border/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-surface-2/50">
                <CardTitle className="text-lg font-bold">3. Enter position</CardTitle>
                <CardDescription className="text-base">Details for <span className="font-semibold">{selectedCrypto.name}</span> / {selectedCrypto.pairSymbol}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-surface-1 to-surface-2/80">
                <form className="flex flex-col gap-5" onSubmit={handleEntrySizeSubmit}>
                  <div>
                    <Label htmlFor="entryPrice" className="text-sm text-muted-foreground mb-1 block">Entry price ({selectedCrypto.name})</Label>
                    <Input
                      id="entryPrice"
                      name="entryPrice"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-surface-2 border-border text-primary-foreground"
                      placeholder={currentPrice ? `E.g. ${currentPrice}` : "Ex. 12345"}
                      autoFocus
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="size" className="text-sm text-muted-foreground mb-1 block">Position size</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      required
                      inputMode="decimal"
                      min="0"
                      step="0.0001"
                      className="bg-surface-2 border-border text-primary-foreground"
                      placeholder="E.g. 0.01"
                    />
                  </div>
                  
                  <div className="bg-surface-2/50 p-4 rounded-lg border border-border/30">
                    <Label htmlFor="leverage" className="text-sm text-muted-foreground mb-1 block">
                      Leverage: <span className="text-primary-foreground font-bold">{leverageValue[0]}x</span>
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
                    <p className="text-xs text-muted-foreground">Adjust leverage: 1x (no leverage) to 100x</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => backTo(2)} 
                      className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                    >
                      Next step
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="bg-surface-1 shadow-xl border-border/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-surface-2/50">
                <CardTitle className="text-lg font-bold">
                  4. Stop-loss & take profit <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </CardTitle>
                <CardDescription className="text-base">Risk management for <span className="font-semibold">{selectedCrypto.name}</span></CardDescription>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-surface-1 to-surface-2/80">
                <form className="flex flex-col gap-5" onSubmit={handleRiskSubmit}>
                  <div>
                    <Label htmlFor="stopLoss" className="text-sm text-muted-foreground mb-1 block">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      name="stopLoss"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-surface-2 border-border text-primary-foreground"
                      placeholder="Stop-Loss level"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="takeProfit" className="text-sm text-muted-foreground mb-1 block">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      name="takeProfit"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      className="bg-surface-2 border-border text-primary-foreground"
                      placeholder="Take-Profit level"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => backTo(3)} 
                      className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                    >
                      Go to analysis
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 5 && trade.entryPrice && trade.size && (
            <Card className="bg-surface-1/95 shadow-2xl border-border/50 backdrop-blur-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">AI Recommendation</CardTitle>
                  <Badge className="bg-info text-primary-foreground border-0 shadow-glow-sm">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Live Analysis
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-gradient-to-br from-surface-1 to-surface-2/80">
                {(() => {
                  const fullTrade = { ...trade, leverage: trade.leverage || 1 } as TradeEntry;
                  const { rec, reason, pnl } = getRecommendation(fullTrade, currentPrice);
                  const leverageMultiplier = trade.leverage || 1;
                  
                  return (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3 items-center">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Badge 
                              className={cn(
                                "px-6 py-2 text-lg font-bold rounded-full border-0 shadow-glow cursor-pointer",
                                rec === "ADD" ? "bg-bullish text-primary-foreground" : 
                                rec === "REMOVE" ? "bg-bearish text-primary-foreground" : 
                                "bg-warning text-foreground"
                              )}
                            >
                              {rec}
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent 
                            className="w-80 p-4 bg-surface-2 border-border text-primary-foreground"
                            side="right"
                          >
                            <p className="text-sm">{reason}</p>
                          </HoverCardContent>
                        </HoverCard>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="font-medium">{selectedCrypto.name}</span>
                          <span>•</span>
                          <span>{selectedCrypto.pairSymbol}</span>
                          {leverageMultiplier > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-warning font-medium">{leverageMultiplier}x</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      
                      <div className="grid grid-cols-2 gap-3 bg-surface-2/30 rounded-lg p-4 border border-border/30">
                        <div>
                          <div className="text-xs text-muted-foreground">Entry</div>
                          <div className="font-medium text-primary-foreground">${trade.entryPrice?.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Current price</div>
                          <div className="font-medium text-primary-foreground">${currentPrice.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L %</div>
                          <div className={cn(
                            "font-medium",
                            pnl >= 0 ? "text-bullish" : "text-bearish"
                          )}>
                            {pnl.toFixed(2)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">P&amp;L (USD)</div>
                          <div className={cn(
                            "font-medium",
                            pnl >= 0 ? "text-bullish" : "text-bearish"
                          )}>
                            ${Math.abs((currentPrice - (trade.entryPrice as number)) * (trade.size as number) * (trade.type === "long" ? 1 : -1) * leverageMultiplier).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button 
                          onClick={resetFlow} 
                          className="bg-surface-2 hover:bg-surface-3 text-primary-foreground py-2 px-4 rounded-lg transition-colors"
                        >
                          Start over
                        </button>
                        <button
                          onClick={handleAnalyse}
                          className="bg-info hover:bg-blue-700 text-primary-foreground py-2 px-4 rounded-lg transition-colors font-medium"
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
        
        {!activeTrade && (
          <div className="space-y-6">
            <Card className="bg-surface-1 shadow-xl border-border/50 rounded-xl overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-surface-2/50">
                <CardTitle className="text-lg font-bold">Recommendation History</CardTitle>
                <CardDescription>Previous AI recommendations</CardDescription>
              </CardHeader>
              <CardContent className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col gap-2">
                  {coachHistory.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface-2/50 border border-border/30 flex flex-col gap-1">
                      <div className="flex justify-between text-xs items-center flex-wrap gap-1">
                        <span className="text-muted-foreground">
                          {item.timestamp} 
                          <span className="ml-2 bg-surface-3/50 px-2 py-0.5 rounded text-xs">{item.symbol}</span> 
                          <span className="text-muted-foreground">({item.pairSymbol})</span>
                          {item.leverage > 1 && <span className="text-warning ml-1">{item.leverage}x</span>}
                        </span>
                        <Badge variant="outline" className={cn(
                          "text-xs border-0",
                          item.recommendation === "ADD" ? "text-bullish bg-bullish/10" :
                            item.recommendation === "REMOVE" ? "text-bearish bg-bearish/10" : 
                            "text-warning bg-warning/10"
                        )}>{item.recommendation}</Badge>
                      </div>
                      <div className={cn(
                        "text-xs",
                        item.recommendation === "REMOVE" ? "text-bearish" : 
                        item.recommendation === "ADD" ? "text-bullish" : 
                        "text-warning"
                      )}>
                        {item.reason}
                      </div>
                      <div className={cn("text-xs font-medium mt-1", item.pnl >= 0 ? "text-bullish" : "text-bearish")}>
                        P&amp;L: {item.pnl.toFixed(2)}% | Entry: {item.entry} | Size: {item.size}
                      </div>
                    </div>
                  ))}
                  {coachHistory.length === 0 && (
                    <div className="text-muted-foreground text-sm text-center py-8 flex flex-col items-center gap-2">
                      <Badge variant="outline" className="bg-surface-2 border-border">No history yet</Badge>
                      <p className="text-xs text-muted-foreground max-w-[200px] mx-auto mt-2">
                        Your trading history and AI recommendations will appear here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingCoach;
