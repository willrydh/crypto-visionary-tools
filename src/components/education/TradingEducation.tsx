
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, GraduationCap, LineChart, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const TradingEducation = () => {
  const [activeTab, setActiveTab] = useState('patterns');
  const isMobile = useIsMobile();
  
  const educationCategories = [
    { id: 'patterns', label: 'Chart Patterns', icon: <LineChart className="h-4 w-4" /> },
    { id: 'indicators', label: 'Indicators', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'strategies', label: 'Trading Strategies', icon: <Zap className="h-4 w-4" /> },
    { id: 'psychology', label: 'Psychology', icon: <GraduationCap className="h-4 w-4" /> },
  ];

  const patterns = [
    {
      id: 'golden-cross',
      title: 'Golden Cross',
      description: 'A golden cross is a chart pattern in which a relatively short-term moving average crosses above a long-term moving average. It is interpreted as signaling a bullish reversal that has gained momentum.',
      tips: 'Look for confirmation with increased volume. The golden cross is most reliable in trending markets rather than range-bound conditions.',
      warning: 'False signals can occur in choppy markets. Always use additional indicators to confirm the trend.',
    },
    {
      id: 'death-cross',
      title: 'Death Cross',
      description: 'A death cross occurs when a short-term moving average crosses below a long-term moving average. This pattern is interpreted as signaling a potential bearish market mood.',
      tips: 'The death cross can precede extended downtrends in major indices. Look for confirmation with declining volume during rallies.',
      warning: 'Similar to golden crosses, death crosses can produce false signals, especially in sideways markets.',
    },
    {
      id: 'fvg',
      title: 'Fair Value Gap (FVG)',
      description: 'A Fair Value Gap is an imbalance in price created when price movement exceeds typical value areas, showing significant buyer or seller dominance. It represents inefficiency in price discovery that markets often return to fill.',
      tips: 'FVGs are often seen as high-probability reversal zones or areas where price is likely to return to. They work well with order blocks and liquidity concepts.',
      warning: 'Not all FVGs get filled, especially if market structure changes significantly. Time decay affects older FVGs.',
    },
    {
      id: 'order-block',
      title: 'Order Block',
      description: 'An order block is the last opposing candle before a significant move in the opposite direction. It represents an area where major players have placed significant orders, creating liquidity.',
      tips: 'Order blocks often act as support and resistance zones. The most powerful order blocks come before strong impulse moves.',
      warning: 'Order blocks lose effectiveness over time. Recent order blocks have more significance than older ones.',
    },
    {
      id: 'liquidity-grab',
      title: 'Liquidity Grab',
      description: 'A liquidity grab (or stop hunt) occurs when price temporarily moves beyond a significant level to trigger stop losses before reversing back in the intended direction.',
      tips: 'Often occurs near key support/resistance levels. Watch for quick rejections after breaking through major levels.',
      warning: 'Can be difficult to distinguish from genuine breakouts in real-time. Requires practice to identify effectively.',
    },
  ];

  const indicators = [
    {
      id: 'rsi',
      title: 'Relative Strength Index (RSI)',
      description: 'RSI measures the speed and magnitude of price movements to evaluate overbought or oversold conditions. The standard RSI is a 14-period indicator scaled from 0 to 100.',
      tips: 'Traditional overbought values are above 70, while oversold values are below 30. RSI divergences can signal potential reversals.',
      warning: 'During strong trends, RSI can remain overbought or oversold for extended periods. Not effective as a standalone tool.',
    },
    {
      id: 'macd',
      title: 'Moving Average Convergence Divergence (MACD)',
      description: 'MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security\'s price, typically the 12-period and 26-period EMAs.',
      tips: 'MACD crossovers, divergences, and rapid rises/falls can provide trading signals. Works best in trending markets.',
      warning: 'Can generate false signals in range-bound markets. Signal line crossovers should be confirmed with other indicators.',
    },
    {
      id: 'vwap',
      title: 'Volume-Weighted Average Price (VWAP)',
      description: 'VWAP is a trading benchmark that represents the average price a security has traded at throughout the day, based on both volume and price.',
      tips: 'Institutional traders use VWAP to minimize market impact. Retail traders can use it to identify value areas.',
      warning: 'VWAP resets each day, making it more useful for intraday trading than longer timeframes. Less effective in low-volume conditions.',
    },
    {
      id: 'bb',
      title: 'Bollinger Bands',
      description: 'Bollinger Bands consist of a middle band (simple moving average) with an upper and lower band representing volatility (standard deviations from the middle band).',
      tips: 'Price touching the upper/lower bands isn\'t necessarily a buy/sell signal alone. Band contraction often precedes significant price movements.',
      warning: 'Works best in range-bound markets. During strong trends, price can "walk the band" in the direction of the trend.',
    },
  ];

  const strategies = [
    {
      id: 'trend-following',
      title: 'Trend Following',
      description: 'A strategy that aims to capture gains through identifying and following the momentum of existing trends. This approach assumes that markets trend in particular directions and these trends persist for meaningful periods.',
      tips: 'Use multiple timeframes to confirm the trend direction. Consider trailing stop-losses to protect profits while letting winners run.',
      warning: 'Underperforms in ranging or choppy markets. Can experience significant drawdowns during trend reversals.',
    },
    {
      id: 'breakout-trading',
      title: 'Breakout Trading',
      description: 'Breakout trading involves entering positions when price moves beyond a defined support or resistance level with increased volume, signaling continued momentum.',
      tips: 'Volume confirmation is crucial for valid breakouts. The best breakouts often come after periods of consolidation or low volatility.',
      warning: 'False breakouts are common. Consider waiting for a retest of the broken level before entering, or use smaller position sizes for immediate entries.',
    },
    {
      id: 'support-resistance',
      title: 'Support & Resistance Trading',
      description: 'This strategy involves identifying key price levels where a security has historically had difficulty rising above (resistance) or falling below (support).',
      tips: 'The more times a level is tested, the more significant it becomes. Round numbers often act as psychological S&R levels.',
      warning: 'Support and resistance are zones, not exact prices. Once broken, support can become resistance and vice versa.',
    },
  ];

  const psychology = [
    {
      id: 'fomo',
      title: 'Fear of Missing Out (FOMO)',
      description: 'FOMO is the anxiety or fear that others are enjoying successful trades while you are not. It often leads to impulsive entries after significant price movements have already occurred.',
      tips: 'Establish trading rules and stick to your plan. Remind yourself that there will always be other opportunities.',
      warning: 'FOMO trades are often taken at suboptimal entry points, increasing risk and reducing profit potential.',
    },
    {
      id: 'revenge-trading',
      title: 'Revenge Trading',
      description: 'Revenge trading occurs when a trader attempts to recoup losses by entering new trades immediately after experiencing a loss, often with larger position sizes or without proper analysis.',
      tips: 'Take a break after significant losses. Implement a rule to reduce position size after losing trades.',
      warning: 'Revenge trading often leads to compounding losses and can quickly deplete trading capital.',
    },
  ];

  // Determine which array to use based on active tab
  const getActiveContent = () => {
    switch(activeTab) {
      case 'patterns': return patterns;
      case 'indicators': return indicators;
      case 'strategies': return strategies;
      case 'psychology': return psychology;
      default: return patterns;
    }
  };

  return (
    <Card className="bg-card/70 border-border/60 mb-10">
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Trading Education</CardTitle>
        </div>
        <CardDescription className="text-sm md:text-base">
          Enhance your trading knowledge with key concepts and strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-3 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1">
            {educationCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className={cn(
                  "flex items-center justify-center gap-1.5 py-1.5",
                  activeTab === category.id ? "bg-primary text-white" : ""
                )}
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {educationCategories.map((category) => (
            <TabsContent 
              key={category.id} 
              value={category.id} 
              className="pt-4 overflow-auto max-h-[60vh] sm:max-h-none"
            >
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                defaultValue={getActiveContent()[0]?.id}
              >
                {getActiveContent().map((item, index) => (
                  <AccordionItem key={item.id} value={item.id} className="border-b border-border/40 py-1">
                    <AccordionTrigger className="text-left py-3 px-1 md:px-2 hover:no-underline">
                      <span className="text-base md:text-lg font-medium">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 text-sm md:text-base px-1 md:px-2">
                      <p className="text-muted-foreground">{item.description}</p>
                      
                      <div className="bg-primary/5 border border-primary/10 rounded-md p-3">
                        <div className="flex items-center gap-1.5 text-primary font-medium mb-1">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm md:text-base">Pro Tips</span>
                        </div>
                        <p className="text-sm">{item.tips}</p>
                      </div>
                      
                      <div className="bg-orange-500/5 border border-orange-500/10 rounded-md p-3 mb-2">
                        <div className="flex items-center gap-1.5 text-orange-500 font-medium mb-1">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm md:text-base">Watch Out</span>
                        </div>
                        <p className="text-sm">{item.warning}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingEducation;
