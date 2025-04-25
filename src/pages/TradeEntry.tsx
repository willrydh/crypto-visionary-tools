
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCrypto } from "@/hooks/useCrypto";
import { usePrice } from "@/hooks/usePrice";
import CryptoSelector from "@/components/crypto/CryptoSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import ActiveTradeStatus from "@/components/trading/ActiveTradeStatus";
import { getFromStorage, saveToStorage } from "@/utils/storageUtils";

const ACTIVE_TRADE_STORAGE_KEY = "activeTrade";

const TradeEntry = () => {
  const { toast } = useToast();
  const { selectedCrypto } = useCrypto();
  const { priceData, loadPriceData } = usePrice();
  
  const [entryPrice, setEntryPrice] = useState('');
  const [tradeSize, setTradeSize] = useState('');
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState('1');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [activeTrade, setActiveTrade] = useState<any>(null);
  
  const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
  const cryptoPrice = priceData[formattedSymbol]?.price || 0;
  
  // Load any active trade from storage on component mount
  useEffect(() => {
    const savedTrade = getFromStorage(ACTIVE_TRADE_STORAGE_KEY, null);
    if (savedTrade) {
      setActiveTrade(savedTrade);
    }
  }, []);
  
  // Load price data for the selected crypto
  useEffect(() => {
    if (!priceData[formattedSymbol]) {
      loadPriceData(formattedSymbol);
    }
  }, [selectedCrypto, formattedSymbol, loadPriceData, priceData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the active trade object
    const newTrade = {
      entryPrice: parseFloat(entryPrice || String(cryptoPrice)),
      size: parseFloat(tradeSize),
      leverage: parseInt(leverage),
      type: tradeType,
      symbol: selectedCrypto.symbol,
      name: selectedCrypto.name,
      pairSymbol: selectedCrypto.pairSymbol
    };
    
    setActiveTrade(newTrade);
    saveToStorage(ACTIVE_TRADE_STORAGE_KEY, newTrade);
    
    toast({
      title: "Trade Entry Saved",
      description: `Your ${tradeType} position for ${selectedCrypto.name} has been recorded.`,
    });
    
    // Reset form fields after submission
    setEntryPrice('');
    setTradeSize('');
    setStopLoss('');
    setTakeProfit('');
    setLeverage('1');
  };
  
  const resetActiveTrade = () => {
    setActiveTrade(null);
  };
  
  const calculateRiskReward = () => {
    if (!entryPrice || !stopLoss || !takeProfit) return null;
    
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);
    
    if (isNaN(entry) || isNaN(sl) || isNaN(tp)) return null;
    
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    const ratio = reward / risk;
    
    return {
      risk,
      reward,
      ratio: ratio.toFixed(2)
    };
  };
  
  const riskReward = calculateRiskReward();
  
  // If there's an active trade, show the monitoring view
  if (activeTrade) {
    return (
      <div className="space-y-6 mt-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Active Trade</h1>
            <p className="text-muted-foreground">
              Monitor your current position and check performance
            </p>
          </div>
        </div>
        
        <ActiveTradeStatus 
          trade={activeTrade} 
          lastPrice={cryptoPrice || activeTrade.entryPrice}
          onEnd={resetActiveTrade}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trade Entry</h1>
          <p className="text-muted-foreground">
            Record your trading positions and manage your portfolio
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
          <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
            <CardTitle className="text-xl">New Trade Position</CardTitle>
            <CardDescription>Enter the details of your trade</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label>Select Asset</Label>
                <CryptoSelector showDataSource fullWidth />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="tradeType">Position Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={cn(
                        "flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all border",
                        tradeType === "long" 
                          ? "bg-green-500/20 border-green-500/30 text-green-400 shadow-lg shadow-green-900/20" 
                          : "bg-slate-800/80 border-slate-700/30 text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                      onClick={() => setTradeType("long")}
                    >
                      <TrendingUp className={cn("h-4 w-4", tradeType === "long" ? "text-green-400" : "text-slate-400")} />
                      <span className="font-medium">Long</span>
                    </button>
                    
                    <button
                      type="button"
                      className={cn(
                        "flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all border",
                        tradeType === "short" 
                          ? "bg-red-500/20 border-red-500/30 text-red-400 shadow-lg shadow-red-900/20" 
                          : "bg-slate-800/80 border-slate-700/30 text-slate-400 hover:bg-slate-800 hover:text-white"
                      )}
                      onClick={() => setTradeType("short")}
                    >
                      <TrendingDown className={cn("h-4 w-4", tradeType === "short" ? "text-red-400" : "text-slate-400")} />
                      <span className="font-medium">Short</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage</Label>
                  <Select value={leverage} onValueChange={setLeverage}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select leverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1x (No leverage)</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                      <SelectItem value="5">5x</SelectItem>
                      <SelectItem value="10">10x</SelectItem>
                      <SelectItem value="20">20x</SelectItem>
                      <SelectItem value="50">50x</SelectItem>
                      <SelectItem value="100">100x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price</Label>
                  <Input
                    id="entryPrice"
                    placeholder={cryptoPrice ? `Current: ${cryptoPrice}` : "Enter entry price"}
                    className="bg-slate-800 border-slate-700 text-white"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    type="number"
                    step="0.0000001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tradeSize">Position Size</Label>
                  <Input
                    id="tradeSize"
                    placeholder="Amount to trade"
                    className="bg-slate-800 border-slate-700 text-white"
                    value={tradeSize}
                    onChange={(e) => setTradeSize(e.target.value)}
                    type="number"
                    step="0.0000001"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">Stop Loss</Label>
                  <Input
                    id="stopLoss"
                    placeholder={tradeType === 'long' ? "Lower than entry" : "Higher than entry"}
                    className="bg-slate-800 border-slate-700 text-white"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    type="number"
                    step="0.0000001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">Take Profit</Label>
                  <Input
                    id="takeProfit"
                    placeholder={tradeType === 'long' ? "Higher than entry" : "Lower than entry"}
                    className="bg-slate-800 border-slate-700 text-white"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    type="number"
                    step="0.0000001"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-6" size="lg">
                <span className="flex items-center gap-2">
                  Save Trade Entry <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-slate-900 shadow-xl border-slate-700/50 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-700/50 bg-slate-800/50">
              <CardTitle className="text-lg">Position Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              {entryPrice && tradeSize ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Asset</span>
                    <span className="font-medium">{selectedCrypto.pairSymbol}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Position Type</span>
                    <Badge className={tradeType === 'long' ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-red-500/20 text-red-400 border-red-500/20"}>
                      {tradeType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Entry Price</span>
                    <span className="font-medium">{entryPrice}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Position Size</span>
                    <span className="font-medium">{tradeSize}</span>
                  </div>
                  {stopLoss && (
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Stop Loss</span>
                      <span className="font-medium text-red-400">{stopLoss}</span>
                    </div>
                  )}
                  {takeProfit && (
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Take Profit</span>
                      <span className="font-medium text-green-400">{takeProfit}</span>
                    </div>
                  )}
                  {leverage !== '1' && (
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="text-slate-400">Leverage</span>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/20">
                        {leverage}x
                      </Badge>
                    </div>
                  )}
                  
                  {riskReward && (
                    <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-center mb-2">
                        <span className="text-sm text-slate-400">Risk/Reward Ratio</span>
                        <div className="text-xl font-bold">{riskReward.ratio}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-red-500/10 rounded">
                          <span className="text-xs text-red-300">Risk</span>
                          <div className="text-red-400">{riskReward.risk.toFixed(2)}</div>
                        </div>
                        <div className="p-2 bg-green-500/10 rounded">
                          <span className="text-xs text-green-300">Reward</span>
                          <div className="text-green-400">{riskReward.reward.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p>Enter trade details to see summary</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradeEntry;
