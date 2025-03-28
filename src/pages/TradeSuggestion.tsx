
import React, { useState, useEffect } from 'react';
import { 
  ArrowDown,
  ArrowUp,
  DollarSign,
  BarChart3,
  Moon,
  Sun,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  getMockTradeSuggestion,
  getMockBtcPrice,
  TradeSuggestion,
  TechnicalIndicator
} from '@/utils/mockData';

const TradeSuggestionPage = () => {
  const [btcPrice, setBtcPrice] = useState(0);
  const [tradeSuggestion, setTradeSuggestion] = useState<TradeSuggestion | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'scalp' | 'day' | 'swing'>('day');
  const [leverage, setLeverage] = useState(5);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const price = getMockBtcPrice();
    setBtcPrice(price.price);
    generateSuggestion(price.price, selectedTimeframe);
    
    // Update price periodically
    const interval = setInterval(() => {
      const updatedPrice = getMockBtcPrice();
      setBtcPrice(updatedPrice.price);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const generateSuggestion = (price: number, timeframe: 'scalp' | 'day' | 'swing') => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const suggestion = getMockTradeSuggestion(price);
      suggestion.timeframe = timeframe;
      suggestion.leverage = leverage;
      setTradeSuggestion(suggestion);
      setIsLoading(false);
    }, 1000);
  };

  const handleTimeframeChange = (timeframe: 'scalp' | 'day' | 'swing') => {
    setSelectedTimeframe(timeframe);
    generateSuggestion(btcPrice, timeframe);
  };

  const handleLeverageChange = (value: number[]) => {
    const newLeverage = value[0];
    setLeverage(newLeverage);
    
    if (tradeSuggestion) {
      setTradeSuggestion({
        ...tradeSuggestion,
        leverage: newLeverage
      });
    }
  };

  // Calculate potential profit/loss
  const calculatePotentialOutcome = () => {
    if (!tradeSuggestion) return { profit: 0, loss: 0 };
    
    const entryPrice = tradeSuggestion.entry;
    const tpPrice = tradeSuggestion.takeProfit;
    const slPrice = tradeSuggestion.stopLoss;
    
    let profitPercentage = 0;
    let lossPercentage = 0;
    
    if (tradeSuggestion.direction === 'long') {
      profitPercentage = ((tpPrice - entryPrice) / entryPrice) * 100;
      lossPercentage = ((entryPrice - slPrice) / entryPrice) * 100;
    } else {
      profitPercentage = ((entryPrice - tpPrice) / entryPrice) * 100;
      lossPercentage = ((slPrice - entryPrice) / entryPrice) * 100;
    }
    
    // Apply leverage
    profitPercentage *= tradeSuggestion.leverage;
    lossPercentage *= tradeSuggestion.leverage;
    
    return {
      profit: profitPercentage,
      loss: lossPercentage
    };
  };

  const potentialOutcome = calculatePotentialOutcome();
  
  const getSignalIcon = (signal: 'bullish' | 'bearish' | 'neutral') => {
    if (signal === 'bullish') return <ArrowUp className="h-4 w-4 text-bullish" />;
    if (signal === 'bearish') return <ArrowDown className="h-4 w-4 text-bearish" />;
    return <span className="h-4 w-4 text-neutral">−</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Trade Suggestion</h1>
          <p className="text-muted-foreground">
            Current trading signal and analysis
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={selectedTimeframe === 'scalp' ? 'bg-accent' : ''}
            onClick={() => handleTimeframeChange('scalp')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Scalp
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={selectedTimeframe === 'day' ? 'bg-accent' : ''}
            onClick={() => handleTimeframeChange('day')}
          >
            <Sun className="h-4 w-4 mr-2" />
            Day Trade
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={selectedTimeframe === 'swing' ? 'bg-accent' : ''}
            onClick={() => handleTimeframeChange('swing')}
          >
            <Moon className="h-4 w-4 mr-2" />
            Night Trade
          </Button>
        </div>
      </div>

      {tradeSuggestion ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    BTC/USDT {tradeSuggestion.direction === 'long' ? 'Long' : 'Short'}
                  </CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString()} • {selectedTimeframe} timeframe
                  </CardDescription>
                </div>
                <Badge 
                  className={
                    tradeSuggestion.direction === 'long' 
                      ? 'bg-bullish text-white' 
                      : 'bg-bearish text-white'
                  }
                >
                  {tradeSuggestion.direction === 'long' ? 'LONG' : 'SHORT'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="chart-container">
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Trade visualization chart placeholder</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Entry Price</div>
                  <div className="text-xl font-mono font-bold">${tradeSuggestion.entry.toFixed(1)}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Stop Loss</div>
                  <div className="text-xl font-mono font-bold text-bearish">
                    ${tradeSuggestion.stopLoss.toFixed(1)}
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Take Profit</div>
                  <div className="text-xl font-mono font-bold text-bullish">
                    ${tradeSuggestion.takeProfit.toFixed(1)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="leverage">Leverage: {leverage}x</Label>
                    <Slider 
                      id="leverage"
                      min={1} 
                      max={50} 
                      step={1} 
                      value={[leverage]} 
                      onValueChange={handleLeverageChange}
                      className="my-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1x</span>
                      <span>25x</span>
                      <span>50x</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between p-3 border rounded-lg">
                    <span>Success Probability</span>
                    <span className="font-bold">{tradeSuggestion.probability}%</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between p-3 border rounded-lg bg-muted/50">
                    <span>Potential Profit</span>
                    <span className="font-bold text-bullish">+{potentialOutcome.profit.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-lg bg-muted/50">
                    <span>Potential Loss</span>
                    <span className="font-bold text-bearish">-{potentialOutcome.loss.toFixed(2)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="breakdown"
                  checked={showBreakdown}
                  onCheckedChange={setShowBreakdown}
                />
                <Label htmlFor="breakdown">Show technical analysis breakdown</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Signal Details</CardTitle>
              <CardDescription>
                Confidence score: <span className="font-medium">{tradeSuggestion.confidence}%</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg bg-muted/50">
                <div className="text-sm mb-1">Current Price</div>
                <div className="text-xl font-mono font-bold">${btcPrice.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>
              
              {showBreakdown && (
                <div className="space-y-3">
                  <Separator />
                  <h3 className="font-medium">Technical Indicators</h3>
                  
                  {tradeSuggestion.indicators.map((indicator: TechnicalIndicator) => (
                    <div key={indicator.name} className="flex justify-between items-center p-2 border-b">
                      <div className="flex items-center gap-2">
                        {getSignalIcon(indicator.signal)}
                        <span>{indicator.name}</span>
                      </div>
                      <span 
                        className={
                          indicator.signal === 'bullish' 
                            ? 'text-bullish' 
                            : indicator.signal === 'bearish' 
                              ? 'text-bearish' 
                              : ''
                        }
                      >
                        {indicator.value.toString()}
                      </span>
                    </div>
                  ))}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    <span>Signals are based on {selectedTimeframe} timeframe</span>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full mt-4"
                onClick={() => generateSuggestion(btcPrice, selectedTimeframe)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </>
                )}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground mt-4">
                <p>This is a simulated trading suggestion.</p>
                <p>Always do your own research before trading.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="w-full">
          <CardContent className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TradeSuggestionPage;
