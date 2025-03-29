
import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ = () => {
  // FAQ sections with questions and answers
  const faqSections = [
    {
      title: "Technical Analysis",
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
        }
      ]
    },
    {
      title: "Trade Suggestions",
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
        }
      ]
    },
    {
      title: "Trading Styles",
      questions: [
        {
          question: "Why does timing matter in different trading styles?",
          answer: "Different trading styles require different timing approaches. Scalping demands immediate execution and quick exits, typically within minutes or hours. Day trading follows intraday trends and requires closing positions by end-of-day. Swing trading looks for larger market moves over days or weeks, requiring patience and wider stop-losses. ProfitPilot tailors its suggestions to match your selected style."
        },
        {
          question: "Which timeframes work best for each trading style?",
          answer: "For scalping, we recommend 1-minute to 15-minute charts for entries, with 1-hour for trend context. Day trading works best with 15-minute to 1-hour charts, using 4-hour for trend direction. Swing trading typically uses 4-hour to daily charts, with weekly charts for broader context. Our system automatically adjusts indicator weights based on your selected style."
        },
        {
          question: "How should I adjust my risk management for different styles?",
          answer: "Scalping typically requires tighter stop-losses (0.2-0.5%) with smaller profit targets (0.5-1.5%). Day trading uses moderate stops (1-2%) and targets (2-5%). Swing trading needs wider stops (3-7%) to accommodate normal market fluctuations, with larger targets (7-20%). Each style requires different position sizing to maintain consistent risk per trade."
        }
      ]
    }
  ];
  
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="text-muted-foreground mb-8">
        Learn more about how ProfitPilot AI works and how to get the most from your trading assistant.
      </p>
      
      <div className="space-y-8">
        {faqSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
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
