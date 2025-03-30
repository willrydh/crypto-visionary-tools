
import React, { useEffect } from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  LineChart, 
  Rocket, 
  Calculator, 
  DollarSign, 
  Clock, 
  Shield, 
  TrendingUp, 
  Users, 
  Brain,
  Zap
} from 'lucide-react';

const FAQ = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // FAQ sections with questions and answers
  const faqSections = [
    {
      title: "Technical Analysis",
      icon: <LineChart className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How does ProfitPilot use technical analysis?",
          answer: "ProfitPilot analyzes multiple technical indicators across various timeframes to generate trading signals. We combine traditional indicators like moving averages, RSI, and MACD with advanced pattern recognition to identify potential entry and exit points. The system weighs each indicator based on its reliability in current market conditions and provides an overall confidence score for each trading signal."
        },
        {
          question: "Which technical indicators are used?",
          answer: "Our system employs a diverse set of indicators including Moving Averages (MA21, MA50, MA100, MA200), RSI, MACD, Bollinger Bands, Volume Profile, and Support/Resistance levels. These indicators are analyzed across multiple timeframes to provide a comprehensive market view and reduce false signals."
        },
        {
          question: "How accurate is the technical analysis?",
          answer: "Technical analysis accuracy varies with market conditions. During trending markets, our signals typically achieve 65-75% accuracy. In ranging or choppy markets, accuracy may decrease. We provide confidence scores with each signal to help you gauge reliability, and continuously refine our algorithms based on market performance."
        },
        {
          question: "How does ProfitPilot handle price action analysis?",
          answer: "Our AI integrates price action analysis by identifying key candlestick patterns (engulfing, doji, hammers), chart patterns (head and shoulders, double tops/bottoms), and support/resistance levels. We combine these with volume analysis to confirm breakouts and trend changes, providing a comprehensive view beyond just indicator values."
        },
        {
          question: "Can I customize the indicator settings?",
          answer: "Pro and Guru users can fully customize indicator parameters including lookback periods, thresholds, and weighting in the signal generation. Free users have access to our optimized default settings. The platform remembers your preferences across sessions and adapts recommendations accordingly."
        }
      ]
    },
    {
      title: "Trade Suggestions",
      icon: <Rocket className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How are confidence levels calculated?",
          answer: "Confidence levels are calculated using a proprietary algorithm that evaluates multiple factors: indicator agreement across timeframes, historical performance of the pattern, volume confirmation, and market volatility. Higher confidence (>70%) indicates strong agreement among multiple indicators and favorable market conditions for the trade."
        },
        {
          question: "What does the risk-reward ratio mean?",
          answer: "The risk-reward ratio compares potential profit to potential loss. For example, a ratio of 1:3 means the potential reward is three times the risk. Our system targets trades with favorable risk-reward ratios, typically 1:2 or better, depending on your selected trading style. These calculations consider key support/resistance levels and recent price volatility."
        },
        {
          question: "Should I follow all trade suggestions?",
          answer: "Trade suggestions should be used as one input in your decision-making process, not followed blindly. Always apply your own analysis, risk management, and consider broader market conditions. Suggestions with higher confidence scores (>70%) and favorable risk-reward ratios aligned with your trading style are generally more reliable."
        },
        {
          question: "How often are new trade signals generated?",
          answer: "Signal frequency varies by trading mode. Scalping mode may generate multiple signals per hour during active markets. Day trading mode typically produces 3-5 signals per day. Swing trading mode generally creates 1-3 signals per day. Each signal includes an estimated duration window, so you know how long the opportunity is expected to remain valid."
        },
        {
          question: "Can ProfitPilot automatically execute trades?",
          answer: "Guru plan subscribers can enable auto-trading via API integration with supported exchanges (currently Bybit, Binance, and Kraken). This feature allows you to set parameters for automatic execution based on signal confidence, max position size, and risk limits. Every auto-trade includes built-in stop-loss and take-profit parameters for risk management."
        }
      ]
    },
    {
      title: "Trading Styles",
      icon: <Clock className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "What's the difference between Scalp, Day, and Swing trading?",
          answer: "Scalping focuses on very short-term trades (minutes to hours) with small profit targets. Day trading opens and closes positions within the same trading day (hours to a full day). Swing trading holds positions for several days to weeks to capture larger market movements. Each style requires different timeframes, risk management, and psychological approach."
        },
        {
          question: "Why does timing matter in different trading styles?",
          answer: "Different trading styles require different timing approaches. Scalping demands immediate execution and quick exits, typically within minutes or hours. Day trading follows intraday trends and requires closing positions by end-of-day. Swing trading looks for larger market moves over days or weeks, requiring patience and wider stop-losses. ProfitPilot tailors its suggestions to match your selected style."
        },
        {
          question: "Which timeframes work best for each trading style?",
          answer: "For scalping, we recommend 1-minute to 5-minute charts for entries, with 1-hour for trend context. Day trading works best with 1-hour to 4-hour charts, using daily charts for trend direction. Swing trading typically uses 4-hour to daily charts, with weekly charts for broader context. Our system automatically adjusts indicator weights based on your selected style."
        },
        {
          question: "How should I adjust my risk management for different styles?",
          answer: "Scalping typically requires tighter stop-losses (0.2-0.5%) with smaller profit targets (0.5-1.5%). Day trading uses moderate stops (1-2%) and targets (2-5%). Swing trading needs wider stops (3-7%) to accommodate normal market fluctuations, with larger targets (7-20%). Each style requires different position sizing to maintain consistent risk per trade."
        },
        {
          question: "Can I switch between trading styles easily?",
          answer: "Yes, you can switch between trading styles with a single click. The system immediately adjusts all analysis parameters, indicator weights, and signal generation to match your selected style. We recommend maintaining consistent risk management regardless of which style you're using, adjusting only your position sizes and profit targets."
        }
      ]
    },
    {
      title: "Risk Management",
      icon: <Shield className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How does ProfitPilot help with risk management?",
          answer: "Every trade suggestion includes recommended stop-loss and take-profit levels based on key support/resistance areas and volatility metrics. We provide position sizing recommendations based on your account balance and risk preferences. Pro and Guru users can access advanced risk analytics including maximum drawdown projections, correlation analysis, and portfolio heat mapping."
        },
        {
          question: "What position sizing strategies does ProfitPilot recommend?",
          answer: "We recommend risk-based position sizing where each trade risks a consistent percentage (typically 1-2%) of your trading capital. The system calculates optimal position sizes based on your stop-loss distance and account balance. This approach ensures no single trade can significantly damage your account and helps maintain consistent risk exposure across different market conditions."
        },
        {
          question: "How are stop-loss levels calculated?",
          answer: "Stop-loss levels are calculated based on multiple factors: key support/resistance levels, recent volatility (ATR), typical price retracements for the pattern, and probability analysis of price movement. The system aims to place stops at levels that avoid being triggered by normal market noise while still protecting capital if the trade thesis is invalidated."
        },
        {
          question: "Does ProfitPilot offer portfolio-level risk management?",
          answer: "Yes, Pro and Guru users can access portfolio-level risk analysis that shows total exposure by asset, correlation between positions, and aggregate risk metrics. The system provides warnings when multiple positions create excessive exposure to a single asset class or highly correlated assets. This helps prevent overexposure during strong market trends."
        }
      ]
    },
    {
      title: "PP Token & Economics",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "What is the PP Token and what are its benefits?",
          answer: "PP Token is the native utility token of the ProfitPilot ecosystem. Token holders receive subscription discounts (up to 30%), exclusive access to premium features, priority signal delivery, and governance voting rights. The token is built on the Solana blockchain for maximum speed and minimum transaction costs."
        },
        {
          question: "How can I earn or acquire PP Tokens?",
          answer: "PP Tokens can be purchased directly through our platform using major cryptocurrencies or through partner exchanges. Users can also earn tokens through our referral program, participating in trading competitions, providing valuable feedback, and testing new features. Pro and Guru subscribers receive monthly token rewards based on subscription length."
        },
        {
          question: "Is there a staking program for PP Tokens?",
          answer: "Yes, our staking program allows token holders to lock their tokens for 1-12 months and earn staking rewards (15-30% APY). Stakers also receive boosted platform benefits including higher trading limits, enhanced signals, and exclusive educational content. Our dynamic staking rewards adjust based on total tokens staked to ensure long-term sustainability."
        },
        {
          question: "What is the token's deflationary mechanism?",
          answer: "PP Token implements several deflationary mechanisms: 30% of all subscription fees are used to buy back and burn tokens, reducing circulating supply over time. Additionally, tokens used for premium features are partially burned, creating constant demand pressure. These mechanisms are designed to align token value with platform growth."
        },
        {
          question: "How is PP Token integrated with the trading platform?",
          answer: "PP Token is deeply integrated within the platform: it can be used to unlock premium features, boost signal delivery speed, access VIP support, participate in exclusive trading rooms, and unlock advanced analytics. Token holders with significant stakes receive priority during high-traffic periods and beta access to new features."
        }
      ]
    },
    {
      title: "Platform & Technology",
      icon: <Zap className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "What technology powers ProfitPilot's analysis?",
          answer: "ProfitPilot is built on a sophisticated multi-layered architecture combining traditional technical analysis, machine learning models, and deep neural networks. Our AI is trained on millions of historical price patterns and continuously learns from market movements. We use distributed computing for real-time analysis across multiple assets and timeframes simultaneously."
        },
        {
          question: "How reliable is the platform uptime?",
          answer: "We maintain 99.9% uptime through redundant cloud infrastructure and multiple failover systems. Our architecture is distributed across several geographic regions to prevent regional outages from affecting service. In the rare event of downtime, we have automated systems to quickly restore service and communicate status updates to users."
        },
        {
          question: "Is my trading data secure?",
          answer: "Absolutely. We implement bank-grade security including end-to-end encryption, two-factor authentication, and regular security audits. API keys are stored using hardware-level encryption and can be limited to read-only access. We never store complete API secrets, and our system architecture follows a zero-trust security model."
        },
        {
          question: "Does ProfitPilot work on mobile devices?",
          answer: "Yes, ProfitPilot is fully optimized for mobile use with native iOS and Android apps. The mobile experience includes all desktop features including real-time alerts, chart analysis, and trade management. Our responsive design ensures comfortable usage on any screen size, from phones to tablets to desktop monitors."
        },
        {
          question: "How frequently is the platform updated?",
          answer: "We release feature updates bi-weekly and performance improvements weekly. Major version updates occur quarterly, introducing significant new capabilities. Our AI models are retrained daily with fresh market data, and indicator optimizations happen automatically based on recent market conditions. Users receive notifications about significant updates."
        }
      ]
    },
    {
      title: "Account & Subscription",
      icon: <Users className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "Can I try ProfitPilot before subscribing?",
          answer: "Yes, we offer a 30-day free trial that gives you access to basic features including limited signal generation, core technical analysis, and standard charts. No credit card is required to start the trial. You can upgrade to a paid plan at any time to unlock all features."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and various cryptocurrencies including Bitcoin, Ethereum, USDT, SOL, and our native PP Token. Crypto payments receive a 5% discount, and payments made with PP Token receive up to 30% discount depending on subscription tier."
        },
        {
          question: "Is there a refund policy?",
          answer: "Yes, we offer a 14-day money-back guarantee for new subscribers. If you're not satisfied with the service, contact our support team within 14 days of purchase for a full refund. For annual subscriptions, we offer prorated refunds if you cancel after the 14-day period."
        },
        {
          question: "Can I change my subscription plan?",
          answer: "Yes, you can upgrade your plan at any time, with the price difference prorated for your remaining subscription period. Downgrades take effect at the end of your current billing cycle. You can manage all subscription changes directly from your account dashboard."
        },
        {
          question: "Do you offer educational resources?",
          answer: "Yes, all subscription tiers include access to our educational library with trading guides, video tutorials, and strategy explanations. Pro and Guru subscribers receive additional premium content including weekly strategy sessions, expert webinars, and personalized learning paths based on their trading style."
        }
      ]
    },
    {
      title: "Trading Performance",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How is signal performance measured?",
          answer: "We track multiple performance metrics for all signals: win rate (percentage of profitable trades), average profit/loss ratio, maximum drawdown, and risk-adjusted return. Performance is categorized by market condition (trending/ranging), asset class, timeframe, and signal confidence level to provide complete transparency."
        },
        {
          question: "What win rates can I expect?",
          answer: "Historical win rates vary by trading style and market conditions. High-confidence signals (>70%) have historically achieved 70-80% win rates in trending markets and 55-65% in ranging markets. Lower confidence signals (50-70%) typically achieve 50-60% win rates. We provide detailed performance metrics for all signal types in your dashboard."
        },
        {
          question: "How can I improve my results with ProfitPilot?",
          answer: "For best results, focus on high-confidence signals (>70%), maintain consistent position sizing (1-2% risk per trade), follow the recommended stop-loss and take-profit levels, and align signal selection with your chosen trading style. Pro and Guru users can access personalized performance analytics with specific improvement recommendations."
        },
        {
          question: "Do you provide performance history?",
          answer: "Yes, we maintain transparent performance records for all signal types dating back to platform launch. Users can review historical performance filtered by asset, timeframe, market condition, and confidence level. Pro and Guru users can access detailed backtesting tools to evaluate strategies against historical data."
        },
        {
          question: "What's the average profit per trade?",
          answer: "Average profit varies by trading style. Scalping signals typically target 0.5-1.5% per trade with high frequency. Day trading signals aim for 2-5% profit per trade. Swing trading signals target 5-15% profit per position. These figures represent gross profit before fees and are based on suggested position sizing and take-profit levels."
        }
      ]
    },
    {
      title: "AI Strategy & Development",
      icon: <Brain className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "How does your AI differ from traditional technical analysis?",
          answer: "Unlike traditional TA that relies on fixed rules, our AI adapts to changing market conditions in real-time. It can detect subtle patterns across multiple timeframes, weight indicators based on recent effectiveness, and incorporate market sentiment data. The system continuously evaluates its own performance and self-adjusts to maintain accuracy in different market regimes."
        },
        {
          question: "What data sources does your AI use?",
          answer: "Our AI ingests multiple data sources including price action from major exchanges, on-chain metrics for cryptocurrencies, economic calendar events, market sentiment from social media analysis, institutional flow data, order book imbalances, and options market metrics. This comprehensive data approach provides a holistic view of market conditions."
        },
        {
          question: "How often is the AI model updated?",
          answer: "Our core models undergo daily reinforcement learning using the latest market data, ensuring adaptability to current conditions. Major model updates with architectural improvements happen quarterly. We maintain separate model instances for different market types (trending, ranging, volatile) and trading styles to maximize performance in all conditions."
        },
        {
          question: "How does the AI handle market regime changes?",
          answer: "The system employs regime detection algorithms that recognize shifts between trending, ranging, and volatile markets. When regime changes are detected, the AI adjusts indicator weights, signal thresholds, and risk parameters automatically. This adaptive approach maintains performance across different market environments without manual intervention."
        },
        {
          question: "Can the AI predict black swan events?",
          answer: "No AI system can reliably predict true black swan events, as they are by definition rare and unprecedented. However, our system incorporates volatility projection models and risk assessment tools that can identify increasing market fragility and unusual conditions. During periods of detected instability, the system automatically increases risk management stringency."
        }
      ]
    },
    {
      title: "Financial & Tax Considerations",
      icon: <Calculator className="h-5 w-5 text-primary" />,
      questions: [
        {
          question: "Does ProfitPilot provide tax reporting tools?",
          answer: "Pro and Guru subscribers receive comprehensive trade history exports formatted for tax reporting, including cost basis calculation, holding periods, and realized gains/losses. While we provide the data in tax-friendly formats, we recommend consulting with a tax professional for specific advice tailored to your jurisdiction."
        },
        {
          question: "How should I handle taxes on crypto trading?",
          answer: "Cryptocurrency tax regulations vary significantly by country. In most jurisdictions, crypto trading profits are subject to capital gains tax, with rates depending on holding period. Our platform provides detailed transaction records, but we recommend using specialized crypto tax software or consulting with a tax professional familiar with crypto assets."
        },
        {
          question: "Can I connect ProfitPilot to my accounting software?",
          answer: "Yes, Pro and Guru users can export trading data in formats compatible with major accounting and tax software including TurboTax, CoinTracker, TokenTax, and Koinly. We also provide API access for users who need automated data transfer to custom accounting solutions."
        },
        {
          question: "Are PP Token rewards taxable?",
          answer: "Token rewards (from staking, referrals, etc.) are typically considered taxable income in most jurisdictions at the fair market value when received. Token appreciation may be subject to capital gains tax when sold. We provide transaction records for all token activities, but specific tax treatment varies by location."
        },
        {
          question: "Does ProfitPilot offer financial advice?",
          answer: "No, ProfitPilot does not provide personalized financial advice. Our trading signals and analysis are algorithmic and not tailored to individual financial situations or goals. All trading involves risk, and users should consider their own financial circumstances and consult with financial advisors before making investment decisions."
        }
      ]
    },
  ];
  
  return (
    <div className="container py-8 mt-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Learn more about how ProfitPilot AI works and how to get the most from your trading assistant.
        </p>
      </div>
      
      <div className="space-y-8">
        {faqSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader className="flex flex-row items-center space-y-0 gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                {section.icon}
              </div>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.questions.map((item, itemIndex) => (
                  <AccordionItem key={itemIndex} value={`section-${sectionIndex}-item-${itemIndex}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 text-muted-foreground">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
