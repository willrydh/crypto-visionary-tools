
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { LineChart, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTechnicalAnalysis } from '@/hooks/useTechnicalAnalysis';
import { useTradingMode } from '@/hooks/useTradingMode';
import { IndicatorBreakdown } from '@/components/analysis/IndicatorBreakdown';
import { MarketStatus } from '@/components/markets/MarketStatus';
import PriceRangeIndicator from '@/components/charts/PriceRangeIndicator';
import PriceChart from '@/components/charts/PriceChart';
import CoinInfo from '@/components/crypto/CoinInfo';
import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, ArrowRight, Zap, Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { usePrice } from '@/hooks/usePrice';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { toast } = useToast();
  const { tradingMode } = useTradingMode();
  const { loadPriceData, priceData } = usePrice();
  const isMobile = useIsMobile();
  const { 
    indicators, 
    currentBias, 
    confidenceScore,
    tradeSuggestion,
    isLoading, 
    lastUpdated, 
    generateAnalysis 
  } = useTechnicalAnalysis();

  useEffect(() => {
    if (indicators.length === 0) {
      generateAnalysis('BTCUSDT');
    }
    
    if (!priceData['BTCUSDT']) {
      loadPriceData('BTCUSDT');
    }
  }, [tradingMode, indicators.length, generateAnalysis, loadPriceData, priceData]);

  const btcPriceData = priceData['BTCUSDT'] || { price: 82500, change24h: 2.3 };

  useEffect(() => {
    if (priceData['BTCUSDT']) {
      console.log('Dashboard - Price data for BTC:', {
        price: priceData['BTCUSDT'].price,
        hourlyHigh: priceData['BTCUSDT'].hourlyHigh,
        hourlyLow: priceData['BTCUSDT'].hourlyLow,
        dailyHigh: priceData['BTCUSDT'].dailyHigh,
        dailyLow: priceData['BTCUSDT'].dailyLow,
        weeklyHigh: priceData['BTCUSDT'].weeklyHigh,
        weeklyLow: priceData['BTCUSDT'].weeklyLow,
      });
    }
  }, [priceData]);

  const handleAnalysisGeneration = async () => {
    try {
      await generateAnalysis('BTCUSDT', true);
      await loadPriceData('BTCUSDT');
      toast({
        title: "Analysis Complete",
        description: "Technical analysis has been generated successfully.",
      });
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate technical analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTradingDescription = () => {
    switch (tradingMode) {
      case 'scalp':
        return "Ultra-short term market overview for scalping opportunities";
      case 'day':
        return "Intraday market analysis and day trading signals";
      case 'night':
        return "Overnight market overview and medium-term signals";
      default:
        return "Market overview and trading signals";
    }
  };

  const getTradingForecast = () => {
    const strategy = {
      scalp: {
        bullish: {
          title: "Quick Scalp Long",
          description: "Look for minor pullbacks to support levels for quick long entries with tight stops.",
          icon: <Zap className="h-5 w-5 text-blue-500" />,
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        },
        bearish: {
          title: "Quick Scalp Short",
          description: "Watch for rejection at resistance levels for rapid short opportunities.",
          icon: <Zap className="h-5 w-5 text-blue-500" />,
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        },
        neutral: {
          title: "Range Scalping",
          description: "Focus on trading within established ranges, taking profits quickly.",
          icon: <Zap className="h-5 w-5 text-blue-500" />,
          color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
        }
      },
      day: {
        bullish: {
          title: "Intraday Uptrend",
          description: "Look for higher lows forming during the session for swing long positions.",
          icon: <Sun className="h-5 w-5 text-amber-500" />,
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
        },
        bearish: {
          title: "Intraday Downtrend",
          description: "Monitor lower highs for short entries with targets at support levels.",
          icon: <Sun className="h-5 w-5 text-amber-500" />,
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
        },
        neutral: {
          title: "Consolidation Pattern",
          description: "Watch for breakouts from intraday consolidation patterns.",
          icon: <Sun className="h-5 w-5 text-amber-500" />,
          color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }
      },
      night: {
        bullish: {
          title: "Overnight Long",
          description: "Consider overnight positions that target the next day's opening range.",
          icon: <Moon className="h-5 w-5 text-indigo-500" />,
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
        },
        bearish: {
          title: "Overnight Short",
          description: "Look for evening reversals that may continue through Asian trading hours.",
          icon: <Moon className="h-5 w-5 text-indigo-500" />,
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
        },
        neutral: {
          title: "Overnight Range",
          description: "Prepare for potential breakouts during overnight sessions.",
          icon: <Moon className="h-5 w-5 text-indigo-500" />,
          color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
        }
      }
    };

    return strategy[tradingMode][currentBias] || strategy[tradingMode].neutral;
  };

  const forecast = getTradingForecast();

  return (
    <div className="space-y-6 mt-6 animate-fade-in">
      <WelcomeHeader />
      
      <CoinInfo 
        symbol="BTC/USDT" 
        price={btcPriceData.price}
        change24h={btcPriceData.change24h}
      />

      <Alert 
        className={cn(
          "border-0",
          tradingMode === 'scalp' ? 'bg-blue-500/5' : 
          tradingMode === 'day' ? 'bg-amber-500/5' : 
          'bg-indigo-500/5'
        )}
      >
        <div className="flex items-center gap-2">
          {forecast.icon}
          <div>
            <AlertTitle className="flex items-center gap-2">
              <span>{forecast.title}</span>
              <Badge 
                variant="outline" 
                className={forecast.color}
              >
                {tradingMode} Trading
              </Badge>
            </AlertTitle>
            <AlertDescription className="text-sm">
              {forecast.description}
              {tradeSuggestion && (
                <span className="block mt-1 font-medium">
                  Recommended: {tradeSuggestion.direction.toUpperCase()} at ${Math.round(tradeSuggestion.entry)}
                </span>
              )}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <PriceChart symbol="BTC/USDT" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IndicatorBreakdown indicators={indicators} />
            <MarketStatus showDetails={true} customTitle="Smart Money" customSource="World API" />
          </div>
        </div>
        
        <div className="space-y-6">
          <PriceRangeIndicator title="Price Ranges" symbol="BTCUSDT" />
          <MarketStatus showDetails={true} customTitle="Smart Money" customSource="Global Markets" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
