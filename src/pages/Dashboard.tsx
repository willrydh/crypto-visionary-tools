
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowDown,
  ArrowUp,
  RefreshCw,
  LineChart,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  getMockBtcPrice, 
  getMockTechnicalIndicators, 
  getMockTradeSuggestion,
  getMockMarketSessions,
  formatTimeUntil,
  CryptoPrice,
  TechnicalIndicator,
  TradeSuggestion,
  MarketSession
} from '@/utils/mockData';

const Dashboard = () => {
  const { toast } = useToast();
  const [btcPrice, setBtcPrice] = useState<CryptoPrice | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [tradeSuggestion, setTradeSuggestion] = useState<TradeSuggestion | null>(null);
  const [marketSessions, setMarketSessions] = useState<MarketSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    updateData();
    const interval = setInterval(() => {
      const price = getMockBtcPrice();
      setBtcPrice(price);
    }, 5000);
    
    const sessionsInterval = setInterval(() => {
      setMarketSessions(getMockMarketSessions());
    }, 60000);
    
    return () => {
      clearInterval(interval);
      clearInterval(sessionsInterval);
    };
  }, []);

  const updateData = () => {
    const price = getMockBtcPrice();
    setBtcPrice(price);
    setIndicators(getMockTechnicalIndicators());
    setMarketSessions(getMockMarketSessions());
    setLastUpdated(new Date());
  };

  const generateTechnicalAnalysis = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      if (btcPrice) {
        const newIndicators = getMockTechnicalIndicators();
        const suggestion = getMockTradeSuggestion(btcPrice.price);
        
        setIndicators(newIndicators);
        setTradeSuggestion(suggestion);
        setLastUpdated(new Date());
        
        toast({
          title: "Analysis Complete",
          description: "Technical analysis has been generated successfully.",
        });
      }
      
      setIsGenerating(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "text-bullish";
    if (confidence >= 50) return "text-yellow-500";
    return "text-bearish";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Market overview and trading signals
          </p>
        </div>
        <Button 
          onClick={generateTechnicalAnalysis} 
          disabled={isGenerating} 
          className="gap-2"
        >
          {isGenerating ? 
            <RefreshCw className="h-4 w-4 animate-spin" /> : 
            <LineChart className="h-4 w-4" />
          }
          Generate Technical Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Price Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {btcPrice ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">BTC/USDT</p>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-bold font-mono">
                        ${Math.round(btcPrice.price)}
                      </h2>
                      <Badge 
                        className={btcPrice.change24h >= 0 ? "bg-bullish" : "bg-bearish"}
                      >
                        {btcPrice.change24h >= 0 ? 
                          <ArrowUp className="h-3 w-3 mr-1" /> : 
                          <ArrowDown className="h-3 w-3 mr-1" />
                        }
                        {Math.abs(Math.round(btcPrice.change24h))}%
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="font-mono font-medium">
                      ${Math.round(btcPrice.volume24h / 1000000000)}B
                    </p>
                  </div>
                </div>
                
                <div className="h-24 bg-muted rounded flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Price chart placeholder</p>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Last updated: {btcPrice.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Market Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketSessions.map((session) => (
                <div key={session.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{session.name}</span>
                    <Badge 
                      variant={session.status === "open" ? "default" : "outline"}
                      className={session.status === "open" ? "bg-bullish" : ""}
                    >
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground flex justify-between">
                    <span>{session.hours}</span>
                    <span>
                      {session.nextEvent.type.charAt(0).toUpperCase() + session.nextEvent.type.slice(1)}{" "}
                      {formatTimeUntil(session.nextEvent.time)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Technical Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {indicators.map((indicator) => (
                <div
                  key={indicator.name}
                  className="rounded-lg border p-3 text-center"
                >
                  <div className="text-sm font-medium mb-1">{indicator.name}</div>
                  <div 
                    className={`text-lg font-mono font-bold ${
                      indicator.signal === 'bullish' 
                        ? 'text-bullish' 
                        : indicator.signal === 'bearish' 
                          ? 'text-bearish' 
                          : 'text-neutral'
                    }`}
                  >
                    {indicator.value.toString()}
                  </div>
                  <div 
                    className={`text-xs ${
                      indicator.signal === 'bullish' 
                        ? 'text-bullish' 
                        : indicator.signal === 'bearish' 
                          ? 'text-bearish' 
                          : 'text-neutral'
                    }`}
                  >
                    {indicator.signal.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
            
            {lastUpdated && (
              <div className="mt-4 text-xs text-muted-foreground flex justify-between">
                <span>Last analysis: {lastUpdated.toLocaleTimeString()}</span>
                <button 
                  className="text-primary hover:underline text-xs"
                  onClick={updateData}
                >
                  Refresh
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {tradeSuggestion ? (
          <Card className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              tradeSuggestion.direction === 'long' ? 'bg-bullish' : 'bg-bearish'
            }`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Trade Suggestion</span>
                {tradeSuggestion.direction === 'long' ? (
                  <Badge className="bg-bullish">LONG</Badge>
                ) : (
                  <Badge className="bg-bearish">SHORT</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Entry</p>
                    <p className="indicator-value">${Math.round(tradeSuggestion.entry)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stop Loss</p>
                    <p className="indicator-value text-bearish">${Math.round(tradeSuggestion.stopLoss)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Take Profit</p>
                    <p className="indicator-value text-bullish">${Math.round(tradeSuggestion.takeProfit)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Confidence</span>
                    <span 
                      className={`font-medium ${getConfidenceColor(tradeSuggestion.confidence)}`}
                    >
                      {tradeSuggestion.confidence}%
                    </span>
                  </div>
                  <Progress 
                    value={tradeSuggestion.confidence}
                    className={`h-2 ${
                      tradeSuggestion.confidence >= 70 
                        ? 'bg-muted' 
                        : tradeSuggestion.confidence >= 50 
                          ? 'bg-muted' 
                          : 'bg-muted'
                    }`}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Probability</span>
                  <span className="font-medium">{tradeSuggestion.probability}%</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Timeframe</span>
                  <span className="font-medium capitalize">{tradeSuggestion.timeframe}</span>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="w-full gap-2"
                  onClick={() => window.location.href = '/trade'}
                >
                  <Zap className="h-4 w-4" />
                  View Full Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Trade Suggestion</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <LineChart className="h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No Active Signals</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a technical analysis to get trading suggestions
              </p>
              <Button 
                onClick={generateTechnicalAnalysis} 
                disabled={isGenerating}
                className="gap-2"
              >
                {isGenerating ? 
                  <RefreshCw className="h-4 w-4 animate-spin" /> : 
                  <LineChart className="h-4 w-4" />
                }
                Generate Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
