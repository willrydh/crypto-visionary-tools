
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, ArrowRight, RefreshCw, BarChart3, Activity, Clock, LineChart, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatTimeUntil } from '@/utils/dateUtils';
import { TechnicalIndicator, MarketBias } from '@/contexts/TechnicalAnalysisContext';
import { useTradingMode } from '@/hooks/useTradingMode';

interface EnhancedTechnicalAnalysisProps {
  currentBias: MarketBias;
  indicators: TechnicalIndicator[];
  confidenceScore: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const EnhancedTechnicalAnalysis: React.FC<EnhancedTechnicalAnalysisProps> = ({
  currentBias,
  indicators,
  confidenceScore,
  lastUpdated,
  isLoading,
  onRefresh
}) => {
  const { tradingMode } = useTradingMode();
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  // Count signals by type
  const bullishCount = indicators.filter(i => i.signal === 'bullish').length;
  const bearishCount = indicators.filter(i => i.signal === 'bearish').length;
  const neutralCount = indicators.filter(i => i.signal === 'neutral').length;
  
  // Group indicators by category
  const trendIndicators = indicators.filter(i => i.category === 'trend');
  const momentumIndicators = indicators.filter(i => i.category === 'momentum');
  const volumeIndicators = indicators.filter(i => i.category === 'volume');
  const volatilityIndicators = indicators.filter(i => i.category === 'volatility');
  
  // Get advanced analysis based on trading mode and bias
  const getAdvancedAnalysis = () => {
    const modeName = tradingMode === 'scalp' ? 'Scalping' : tradingMode === 'day' ? 'Day Trading' : 'Swing Trading';
    
    const analyses = {
      bullish: {
        title: `Strong ${modeName} Opportunity`,
        summary: `Market shows significant bullish signals for ${modeName}. ${bullishCount} of ${indicators.length} indicators are positive, with particularly strong readings from trend and momentum indicators. Volume analysis confirms buying pressure, suggesting potential upside continuation.`,
        details: [
          "Higher time frame trends align with bullish bias, increasing probability of success",
          "Momentum indicators show acceleration of buying pressure",
          "Key support levels have been respected during recent price action",
          "Volume analysis shows accumulation patterns typical of institutional buying"
        ],
        warning: trendIndicators.some(i => i.signal === 'bearish') ? "Divergence with some trend indicators suggests caution despite overall bullish bias" : null
      },
      bearish: {
        title: `Potential ${modeName} Short Opportunity`,
        summary: `Market displays bearish characteristics suitable for ${modeName}. ${bearishCount} of ${indicators.length} indicators are negative, with weakness primarily in momentum and trend metrics. Volume analysis shows potential distribution phase beginning.`,
        details: [
          "Price is showing weakness at key resistance levels",
          "Momentum indicators show deceleration of buying pressure and potential reversal",
          "Multiple timeframe analysis shows bearish alignment",
          "Volume analysis suggests distribution phase may be underway"
        ],
        warning: momentumIndicators.some(i => i.signal === 'bullish') ? "Some bullish divergence in momentum indicators suggests potential for relief bounce - consider tighter stop loss" : null
      },
      neutral: {
        title: `Mixed Signals - ${modeName} Caution`,
        summary: `Market shows conflicting signals for ${modeName}. Indicators are mixed with ${bullishCount} bullish, ${bearishCount} bearish, and ${neutralCount} neutral readings. Consider waiting for clearer direction or trading with reduced position size.`,
        details: [
          "Conflicting signals between timeframes - higher timeframes and lower timeframes diverge",
          "Price is consolidating in a range, lacking clear directional momentum",
          "Volume analysis shows indecision with neither buyers nor sellers in control",
          "Volatility indicators suggest potential for increased movement soon - monitor for breakout"
        ],
        warning: "Consolidation patterns can break either way - consider both scenarios in your trading plan"
      }
    };
    
    return analyses[currentBias];
  };
  
  const analysis = getAdvancedAnalysis();
  
  // Get color based on bias
  const getBiasColor = (bias: MarketBias) => {
    switch(bias) {
      case 'bullish':
        return 'bg-green-500 text-white';
      case 'bearish':
        return 'bg-red-500 text-white';
      case 'neutral':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-muted';
    }
  };
  
  // Indicator categories
  const categories = [
    { id: 'trend', name: 'Trend', icon: <LineChart className="h-4 w-4" /> },
    { id: 'momentum', name: 'Momentum', icon: <Activity className="h-4 w-4" /> },
    { id: 'volume', name: 'Volume', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'volatility', name: 'Volatility', icon: <Activity className="h-4 w-4" /> }
  ];
  
  // Get status text based on confidence score
  const getConfidenceStatus = (score: number) => {
    if (score >= 80) return 'Very High';
    if (score >= 65) return 'High';
    if (score >= 50) return 'Moderate';
    if (score >= 35) return 'Low';
    return 'Very Low';
  };
  
  // Ensure confidence score has a valid value or use a fallback
  const displayConfidence = isNaN(confidenceScore) ? 50 : confidenceScore;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Enhanced Technical Analysis</CardTitle>
          <Badge className={getBiasColor(currentBias)} variant="secondary">
            {currentBias === 'bullish' ? (
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
            ) : currentBias === 'bearish' ? (
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5 mr-1" />
            )}
            {currentBias.charAt(0).toUpperCase() + currentBias.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">{analysis.title}</h3>
              <p className="text-sm text-muted-foreground">{analysis.summary}</p>
              
              {analysis.warning && (
                <div className="flex items-start gap-2 text-sm p-2 border bg-yellow-50/10 text-yellow-600 dark:text-yellow-400 rounded-md mt-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <p>{analysis.warning}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Analysis Confidence</span>
                <span 
                  className={`font-medium text-sm ${
                    displayConfidence >= 70 ? 'text-green-500' : 
                    displayConfidence >= 50 ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}
                >
                  {getConfidenceStatus(displayConfidence)} ({displayConfidence}%)
                </span>
              </div>
              <Progress 
                value={displayConfidence}
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="space-y-1 bg-muted/30 rounded p-2">
                <p className="text-xs text-muted-foreground">Bullish</p>
                <p className="font-semibold text-green-500">{bullishCount || 0}</p>
              </div>
              <div className="space-y-1 bg-muted/30 rounded p-2">
                <p className="text-xs text-muted-foreground">Neutral</p>
                <p className="font-semibold text-yellow-500">{neutralCount || 0}</p>
              </div>
              <div className="space-y-1 bg-muted/30 rounded p-2">
                <p className="text-xs text-muted-foreground">Bearish</p>
                <p className="font-semibold text-red-500">{bearishCount || 0}</p>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground space-x-1">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {lastUpdated ? formatTimeUntil(lastUpdated) : 'never'}</span>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="space-y-3">
              {analysis.details.map((detail, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <p>{detail}</p>
                </div>
              ))}
            </div>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="trading-implications">
                <AccordionTrigger className="text-sm font-medium">
                  Trading Implications
                </AccordionTrigger>
                <AccordionContent className="text-sm space-y-2">
                  <p className="text-muted-foreground">Based on the current {tradingMode} mode:</p>
                  
                  {currentBias === 'bullish' && (
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>Consider long positions with strong risk management</li>
                      <li>Look for pullbacks to key support levels for entries</li>
                      <li>Monitor volume for confirmation of trend continuation</li>
                      <li>Set take profit targets at key resistance levels</li>
                    </ul>
                  )}
                  
                  {currentBias === 'bearish' && (
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>Consider short positions with defined risk parameters</li>
                      <li>Look for rallies to key resistance levels for entries</li>
                      <li>Monitor for potential bull traps at previous support levels</li>
                      <li>Be aware of oversold bounces in downtrends</li>
                    </ul>
                  )}
                  
                  {currentBias === 'neutral' && (
                    <ul className="list-disc pl-4 space-y-1 text-sm">
                      <li>Consider reducing position size due to unclear direction</li>
                      <li>Range trading strategies may be appropriate</li>
                      <li>Wait for breakout confirmation before directional trades</li>
                      <li>Monitor for changes in volume patterns for early signals</li>
                    </ul>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="multi-timeframe">
                <AccordionTrigger className="text-sm font-medium">
                  Multi-Timeframe Analysis
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>1 Hour</span>
                      <Badge className={
                        currentBias === 'bullish' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20' : 
                        currentBias === 'bearish' ? 'bg-red-500/20 text-red-600 hover:bg-red-500/20' : 
                        'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20'
                      }>
                        {currentBias.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>4 Hour</span>
                      <Badge className={
                        currentBias === 'neutral' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20' : 
                        currentBias === 'bullish' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20' : 
                        'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20'
                      }>
                        {currentBias === 'neutral' ? 'BULLISH' : 
                         currentBias === 'bullish' ? 'BULLISH' : 'NEUTRAL'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>1 Day</span>
                      <Badge className={
                        currentBias === 'bearish' ? 'bg-red-500/20 text-red-600 hover:bg-red-500/20' :
                        currentBias === 'bullish' ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20' : 
                        'bg-green-500/20 text-green-600 hover:bg-green-500/20'
                      }>
                        {currentBias === 'bearish' ? 'BEARISH' : 'BULLISH'}
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
          
          <TabsContent value="indicators" className="mt-4 space-y-4">
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name} Indicators</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {indicators.filter(i => i.category === category.id).map((indicator, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center p-2 text-sm border rounded-md"
                        >
                          <div className="font-medium">{indicator.name}</div>
                          <Badge variant="outline" className={
                            indicator.signal === 'bullish' ? 'bg-green-500/10 text-green-600 border-green-200' :
                            indicator.signal === 'bearish' ? 'bg-red-500/10 text-red-600 border-red-200' :
                            'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                          }>
                            {typeof indicator.value === 'number' ? indicator.value.toFixed(2) : indicator.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        {lastUpdated ? (
          <p className="text-xs text-muted-foreground">
            Updated {formatTimeUntil(lastUpdated)}
          </p>
        ) : (
          <span className="text-xs text-muted-foreground">Not analyzed yet</span>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedTechnicalAnalysis;
