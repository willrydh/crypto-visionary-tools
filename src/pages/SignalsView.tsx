
import React, { useEffect, useState } from 'react';
import PriceChart from '@/components/PriceChart';
import { TechnicalAnalysisSummary } from '@/components/analysis/TechnicalAnalysisSummary';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LineChart, RefreshCw, Bitcoin, CircleDollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PriceRangeIndicator from '@/components/charts/PriceRangeIndicator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import CryptoBubbles from '@/components/crypto/CryptoBubbles';

const SignalsView = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('chart');
  const { fetchLevels, levels, structure } = useSupportResistance();
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
      generateAnalysis('BTC/USDT');
    }
    
    fetchLevels('BTC/USDT');
    
    const interval = setInterval(() => {
      setPriceInfo(prev => ({
        ...prev,
        currentPrice: prev.currentPrice + (Math.random() * 200 - 100)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    try {
      await generateAnalysis('BTC/USDT', true);
      await fetchLevels('BTC/USDT');
      
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Signals</h1>
          <p className="text-muted-foreground">
            Market analysis, trade signals, and key price levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataSourceIndicator 
            source="Bybit API" 
            isLive={true} 
            placement="top"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleRefresh} 
                  disabled={isLoading} 
                  className="gap-2"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Data Source: Bybit API</p>
                <div className="flex items-center mt-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-xs">Live data</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="levels">Support & Resistance</TabsTrigger>
            <TabsTrigger value="bubbles">Crypto Bubbles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="pt-4">
            <PriceChart showLevels={true} levels={levels} />
          </TabsContent>
          
          <TabsContent value="levels" className="pt-4">
            <SupportResistanceLevels />
          </TabsContent>
          
          <TabsContent value="bubbles" className="pt-4">
            <CryptoBubbles />
          </TabsContent>
        </Tabs>
        
        <div className="space-y-6">
          <TechnicalAnalysisSummary 
            currentBias={currentBias}
            indicators={indicators}
            confidenceScore={confidenceScore}
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            onRefresh={handleRefresh}
          />
          
          <TradeSuggestionCard 
            tradeSuggestion={tradeSuggestion} 
            isLoading={isLoading} 
          />
          
          <PriceRangeIndicator
            currentPrice={priceInfo.currentPrice}
            dailyHigh={priceInfo.dailyHigh}
            dailyLow={priceInfo.dailyLow}
            weeklyHigh={priceInfo.weeklyHigh}
            weeklyLow={priceInfo.weeklyLow}
          />
        </div>
      </div>
    </div>
  );
};

export default SignalsView;
