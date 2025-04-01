import React, { useEffect, useState } from 'react';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import PriceChart from '@/components/charts/PriceChart';
import { IndicatorBreakdown } from '@/components/analysis/IndicatorBreakdown';
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChartHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import CoinInfo from '@/components/crypto/CoinInfo';
import { Link } from 'react-router-dom';
import { useCrypto } from '@/hooks/useCrypto';
import CryptoSelector from '@/components/crypto/CryptoSelector';
import { usePrice } from '@/hooks/usePrice';

const ChartView = () => {
  const { toast } = useToast();
  const { indicators, isLoading, generateAnalysis } = useTechnicalAnalysis();
  const { levels, updateLevels } = useSupportResistance();
  const { selectedCrypto } = useCrypto();
  const { loadPriceData, priceData } = usePrice();
  
  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis(selectedCrypto.pairSymbol);
    }
    updateLevels(selectedCrypto.pairSymbol);
    
    // Load price data for the selected crypto
    const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
    if (!priceData[formattedSymbol]) {
      loadPriceData(formattedSymbol);
    }
  }, []);
  
  useEffect(() => {
    generateAnalysis(selectedCrypto.pairSymbol);
    updateLevels(selectedCrypto.pairSymbol);
    
    // Load price data when crypto changes
    const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
    loadPriceData(formattedSymbol);
  }, [selectedCrypto]);
  
  // Get current price data for the selected crypto
  const formattedSymbol = selectedCrypto.pairSymbol.replace('/', '');
  const cryptoPriceData = priceData[formattedSymbol] || { price: 0, change24h: 0 };
  
  const handleRefresh = async () => {
    try {
      await generateAnalysis(selectedCrypto.pairSymbol, true);
      await updateLevels(selectedCrypto.pairSymbol);
      
      // Refresh price data
      await loadPriceData(formattedSymbol);
      
      toast({
        title: "Chart Updated",
        description: "Chart data and indicators have been refreshed.",
      });
    } catch (error) {
      console.error('Error refreshing chart data:', error);
      toast({
        title: "Update Failed",
        description: "Could not refresh chart data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Chart View</h1>
          <p className="text-muted-foreground">
            Advanced price analysis and indicators
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Link to="/market-dashboard">
            <Button variant="outline" className="gap-2">
              <BarChartHorizontal className="h-4 w-4" />
              Market Dashboard
            </Button>
          </Link>
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading} 
            variant="outline"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <div className="hidden md:block">
            <DataSourceIndicator 
              source="Bybit API" 
              isLive={true} 
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Currency Selector first */}
        <div className="flex justify-center mb-2">
          <div className="bg-card/60 p-4 rounded-lg border border-border w-auto inline-flex">
            <CryptoSelector showDataSource={true} label="" />
          </div>
        </div>
        
        {/* Coin info underneath */}
        <CoinInfo 
          symbol={selectedCrypto.pairSymbol}
          name={selectedCrypto.name}
          price={cryptoPriceData.price}
          change24h={cryptoPriceData.change24h}
          description={selectedCrypto.description}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <PriceChart 
            symbol={selectedCrypto.pairSymbol}
            showLevels={true} 
            levels={levels} 
          />
        </div>
        
        <div>
          <IndicatorBreakdown indicators={indicators} />
        </div>
      </div>
    </div>
  );
};

export default ChartView;
