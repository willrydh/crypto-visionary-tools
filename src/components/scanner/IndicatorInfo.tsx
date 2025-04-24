
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const IndicatorInfo: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trading Setup Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="bull-flag">
            <AccordionTrigger>Bull Flag</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Bullish continuation pattern where a strong uptrend (flagpole) is followed by a consolidation period (flag).</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Requires at least 3 candles in a strong upward movement</li>
                  <li>Followed by 3-6 candles in a tight downward channel</li>
                  <li>Volume typically decreases during flag formation</li>
                  <li>Entry is triggered when price breaks above the flag</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bear-flag">
            <AccordionTrigger>Bear Flag</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Bearish continuation pattern where a strong downtrend (flagpole) is followed by a consolidation period (flag).</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Requires at least 3 candles in a strong downward movement</li>
                  <li>Followed by 3-6 candles in a tight upward channel</li>
                  <li>Volume typically decreases during flag formation</li>
                  <li>Entry is triggered when price breaks below the flag</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bullish-retest">
            <AccordionTrigger>Bullish Retest</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Price has broken above a significant level (MA200 or structure) and returns to test it from above.</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>At least 2 candles near the level (support)</li>
                  <li>Rejection from the level indicates buyer strength</li>
                  <li>Often accompanied by positive RSI divergence</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bearish-retest">
            <AccordionTrigger>Bearish Retest</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Price has broken below a significant level (MA200 or structure) and returns to test it from below.</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>At least 2 candles near the level (resistance)</li>
                  <li>Rejection from the level indicates seller strength</li>
                  <li>Often accompanied by negative RSI divergence</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="reversal">
            <AccordionTrigger>Reversal</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Price forms a pattern indicating potential trend reversal.</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Double bottom/top, hammer or doji candle at support/resistance</li>
                  <li>MACD crossing signal line</li>
                  <li>RSI divergence (price makes new high/low but RSI doesn't)</li>
                  <li>Stochastic RSI turning from extreme levels</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="bom">
            <AccordionTrigger>BOM (Break of Market Structure)</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p className="text-sm">Price breaks a previous higher high (HH) or lower low (LL) with a closing price above/below the structure.</p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Typically accompanied by a spike in trading volume</li>
                  <li>Confirmed by structure break + momentum</li>
                  <li>Strong indication of trend change or continuation</li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
