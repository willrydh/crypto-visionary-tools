
import React, { useEffect, useState } from 'react';
import PriceChart from '@/components/charts/PriceChart';
import EnhancedTechnicalAnalysis from '@/components/analysis/EnhancedTechnicalAnalysis';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LineChart, RefreshCw, Bitcoin, CircleDollarSign, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import CryptoBubbles from '@/components/crypto/CryptoBubbles';
import CoinInfo from '@/components/crypto/CoinInfo';
import MarketSessionStats from '@/components/markets/MarketSessionStats';
import { TradePageHeader } from '@/components/trading/TradePageHeader';
import { useTradingMode } from '@/hooks/useTradingMode';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from '@/lib/utils';
import { useCrypto } from '@/hooks/useCrypto';
import CryptoSelector from '@/components/crypto/CryptoSelector';

const SignalsView = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('chart');
  const { fetchLevels, levels, structure } = useSupportResistance();
  const { tradingMode, getTimeframes, getIndicators, getVolatilityEvents } = useTradingMode();
  const { selectedCrypto } = useCrypto();
  
  const { 
    indicators, 
    currentBias, 
    tradeSuggestion, 
    confidenceScore, 
    isLoading, 
    lastUpdated, 
    generateAnalysis 
  } = useTechnicalAnalysis();

  const [priceInfo, setPriceInfo] = useState({
    currentPrice: 82500,
    dailyHigh: 83200,
    dailyLow: 81800,
    weeklyHigh: 84500,
    weeklyLow: 80200
  });

  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis(selectedCrypto.pairSymbol);
    }
    
    fetchLevels(selectedCrypto.pairSymbol);
    
    const interval = setInterval(() => {
      setPriceInfo(prev => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() * 200 - 100)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    generateAnalysis(selectedCrypto.pairSymbol, true);
    fetchLevels(selectedCrypto.pairSymbol);
  }, [tradingMode, selectedCrypto]);

  const handleRefresh = async () => {
    try {
      await generateAnalysis(selectedCrypto.pairSymbol, true);
      await fetchLevels(selectedCrypto.pairSymbol);
      
      toast({
        title: "Data Refreshed",
        description: "Technical analysis and market levels have been updated.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not update market data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const timeframes = getTimeframes();
  const modeIndicators = getIndicators();
  const volatilityEvents = getVolatilityEvents();

  const getModeColor = () => {
    switch(tradingMode) {
      case 'scalp': return 'text-blue-500';
      case 'day': return 'text-amber-500';
      case 'night': return 'text-indigo-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className="space-y-6">
      <TradePageHeader isLoading={isLoading} onRefresh={handleRefresh} />

      <div className="flex justify-between items-center">
        <CoinInfo 
          symbol={`${selectedCrypto.symbol}/USDT`}
          name={selectedCrypto.name}
          price={priceInfo.currentPrice}
          change24h={1.8}
        />
        <CryptoSelector showDataSource={true} />
      </div>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="levels">Support & Resistance</TabsTrigger>
            <TabsTrigger value="bubbles">Bubbles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-4">
            <PriceChart symbol={`${selectedCrypto.symbol}/USDT`} />
          </TabsContent>
          
          <TabsContent value="levels" className="pt-4">
            <SupportResistanceLevels />
          </TabsContent>
          
          <TabsContent value="bubbles" className="pt-4">
            <CryptoBubbles />
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <EnhancedTechnicalAnalysis 
              currentBias={currentBias}
              indicators={indicators}
              confidenceScore={confidenceScore}
              lastUpdated={lastUpdated}
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
            
            <div className="mt-6 bg-card rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <span className={getModeColor()}>
                  {tradingMode === 'scalp' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                  {tradingMode === 'day' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>}
                  {tradingMode === 'night' && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>}
                </span>
                <span>{tradingMode.charAt(0).toUpperCase() + tradingMode.slice(1)} Trading Indicators</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Timeframes</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {timeframes.map((tf) => (
                      <div key={tf} className={`text-xs px-2 py-1 rounded-md bg-${tradingMode === 'scalp' ? 'blue' : tradingMode === 'day' ? 'amber' : 'indigo'}-900/20 font-mono`}>
                        {tf}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Key Indicators</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {modeIndicators.slice(0, 3).map((ind) => (
                      <div key={ind} className={`text-xs px-2 py-1 rounded-md bg-${tradingMode === 'scalp' ? 'blue' : tradingMode === 'day' ? 'amber' : 'indigo'}-900/20 font-mono`}>
                        {ind}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <TradeSuggestionCard 
              tradeSuggestion={tradeSuggestion} 
              isLoading={isLoading} 
            />
            
            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-3">Market Volatility Events</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Key volatility events to monitor for {tradingMode} trading:
              </p>
              <ul className="space-y-2">
                {volatilityEvents.map((event, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5" />
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <MarketSessionStats 
          title="Market Session Impact Analysis" 
          asianSessionStart={7} 
          europeanSessionStart={2} 
          usSessionStart={8} 
        />
      </div>
    </div>
  );
};

export default SignalsView;
