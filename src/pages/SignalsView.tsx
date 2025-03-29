
import React, { useEffect, useState } from 'react';
import { PriceChart } from '@/components/charts/PriceChart';
import { TechnicalAnalysisSummary } from '@/components/analysis/TechnicalAnalysisSummary';
import { TradeSuggestionCard } from '@/components/analysis/TradeSuggestionCard';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { LineChart, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PriceRangeIndicator from '@/components/charts/PriceRangeIndicator';

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - chart and analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="chart">Price Chart</TabsTrigger>
              <TabsTrigger value="levels">Support & Resistance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="pt-4">
              <PriceChart showLevels={true} levels={levels} />
            </TabsContent>
            
            <TabsContent value="levels" className="pt-4">
              <SupportResistanceLevels />
            </TabsContent>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>
        </div>
        
        {/* Side panel - market context and price ranges */}
        <div className="space-y-6">
          <PriceRangeIndicator
            currentPrice={priceInfo.currentPrice}
            dailyHigh={priceInfo.dailyHigh}
            dailyLow={priceInfo.dailyLow}
            weeklyHigh={priceInfo.weeklyHigh}
            weeklyLow={priceInfo.weeklyLow}
          />
          
          {/* You can add additional context cards here */}
        </div>
      </div>
    </div>
  );
};

export default SignalsView;
