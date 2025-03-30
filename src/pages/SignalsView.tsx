
import React, { useEffect, useState } from 'react';
import { PriceChart } from '@/components/charts/PriceChart';
import { TechnicalAnalysisSummary } from '@/components/analysis/TechnicalAnalysisSummary';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LineChart, RefreshCw, Bitcoin, Ethereum } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PriceRangeIndicator from '@/components/charts/PriceRangeIndicator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Initialize data on component mount
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTC/USDT');
    }
    
    fetchLevels('BTC/USDT');
    
    // Update price info periodically (this would typically come from a real API)
    const interval = setInterval(() => {
      // Simulate small price changes for demo purposes
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - chart and analysis */}
        <div className="lg:col-span-3 space-y-6">
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
              <div className="p-6 border rounded-md h-[500px] bg-muted/20 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold mb-4">Crypto Bubbles</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {['BTC', 'ETH', 'XRP', 'SOL', 'DOGE', 'WLD', 'LTC', 'SUI'].map((symbol, i) => (
                    <div key={i} className="rounded-full w-20 h-20 flex items-center justify-center" 
                         style={{ 
                           backgroundColor: `hsl(${i * 45}, 70%, 80%)`,
                           transform: `scale(${0.8 + Math.random() * 0.4})`
                         }}>
                      <span className="font-bold">{symbol}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    <span>Mockup data - Real API integration coming soon</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 gap-6">
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
    </div>
  );
};

export default SignalsView;
