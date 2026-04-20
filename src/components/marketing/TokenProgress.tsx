
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bitcoin, TrendingUp, Users, LineChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

export const TokenProgress = () => {
  return (
    <div className="py-12 px-4 md:px-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">$PP Token (ProfitPilot)</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join the fastest growing trading community token on the most popular meme-coin chain.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              $PP Token Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Presale progress</span>
                <span>72% Complete</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">Price</span>
                </div>
                <div className="text-lg font-bold">$0.0258</div>
                <div className="text-xs text-bullish">+12.4% 24h</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs font-medium">Holders</span>
                </div>
                <div className="text-lg font-bold">13,687</div>
                <div className="text-xs text-bullish">+842 24h</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <LineChart className="h-4 w-4" />
                  <span className="text-xs font-medium">Market Cap</span>
                </div>
                <div className="text-lg font-bold">$2.58M</div>
                <div className="text-xs text-bullish">+15.2% 24h</div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Bitcoin className="h-4 w-4" />
                  <span className="text-xs font-medium">Total Supply</span>
                </div>
                <div className="text-lg font-bold">100M</div>
                <div className="text-xs text-muted-foreground">Max Supply</div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-2">$PP Token Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Exclusive access to premium trading signals</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Reduced fees on the ProfitPilot trading platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Governance voting rights on platform features</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1.5 mr-2"></span>
                  <span>Staking rewards and community benefits</span>
                </li>
              </ul>
            </div>
            
            <Button className="w-full">Buy $PP Token Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenProgress;
