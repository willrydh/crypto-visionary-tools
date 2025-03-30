
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, X, AlertTriangle, ArrowRight, TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InitiateTradeProps {
  currentPrice?: number;
  tradeSuggestion?: any;
  coinSymbol?: string;
}

const InitiateTrade: React.FC<InitiateTradeProps> = ({
  currentPrice = 82450,
  tradeSuggestion = null,
  coinSymbol = 'BTC/USDT'
}) => {
  const { toast } = useToast();
  const [tradeType, setTradeType] = useState<'long' | 'short'>(tradeSuggestion?.direction || 'long');
  const [amount, setAmount] = useState<string>('100');
  const [leverage, setLeverage] = useState<number>(5);
  const [takeProfit, setTakeProfit] = useState<string>(tradeSuggestion?.takeProfit?.toString() || (currentPrice * 1.05).toFixed(0));
  const [stopLoss, setStopLoss] = useState<string>(tradeSuggestion?.stopLoss?.toString() || (currentPrice * 0.95).toFixed(0));
  const [useRecommendedLevels, setUseRecommendedLevels] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  // Calculate risk metrics
  const entryPrice = currentPrice;
  const takeProfitPrice = parseFloat(takeProfit);
  const stopLossPrice = parseFloat(stopLoss);
  
  const profitPotential = tradeType === 'long' 
    ? (takeProfitPrice - entryPrice) / entryPrice * 100 * leverage
    : (entryPrice - takeProfitPrice) / entryPrice * 100 * leverage;
    
  const riskPotential = tradeType === 'long'
    ? (entryPrice - stopLossPrice) / entryPrice * 100 * leverage
    : (stopLossPrice - entryPrice) / entryPrice * 100 * leverage;
    
  const riskRewardRatio = (profitPotential / riskPotential).toFixed(2);
  
  // Handle trade initiation
  const handleInitiateTrade = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      
      toast({
        title: "Trade Initiated",
        description: `${tradeType.toUpperCase()} order for ${coinSymbol} placed successfully`,
      });
    }, 1500);
  };
  
  // Reset confirmation and start new trade
  const handleNewTrade = () => {
    setShowConfirmation(false);
  };
  
  // Set recommended trade levels
  const handleUseRecommended = (checked: boolean) => {
    setUseRecommendedLevels(checked);
    
    if (checked && tradeSuggestion) {
      setTakeProfit(tradeSuggestion.takeProfit.toString());
      setStopLoss(tradeSuggestion.stopLoss.toString());
      setTradeType(tradeSuggestion.direction);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Initiate Trade</span>
          <Badge className={tradeType === 'long' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
            {tradeType === 'long' ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
            {tradeType === 'long' ? 'LONG' : 'SHORT'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!showConfirmation ? (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="coin-pair">Trading Pair</Label>
              <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <span className="text-muted-foreground mr-1">Symbol:</span>
                <span className="font-medium">{coinSymbol}</span>
              </div>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="entry-price">Entry Price</Label>
              <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <span className="text-muted-foreground mr-1">Current:</span>
                <span className="font-medium">${currentPrice.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Trade Direction</Label>
                {tradeSuggestion && (
                  <div className="text-xs text-muted-foreground">
                    Recommended: {tradeSuggestion.direction.toUpperCase()}
                  </div>
                )}
              </div>
              <RadioGroup 
                value={tradeType} 
                onValueChange={(value) => setTradeType(value as 'long' | 'short')}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="long" />
                  <Label htmlFor="long" className="flex items-center cursor-pointer">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                    Long
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="short" />
                  <Label htmlFor="short" className="flex items-center cursor-pointer">
                    <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                    Short
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="amount">Trade Amount (USDT)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-mono"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="leverage">Leverage: {leverage}x</Label>
                <span className="text-xs text-muted-foreground">Max: 20x</span>
              </div>
              <Slider
                id="leverage"
                min={1}
                max={20}
                step={1}
                value={[leverage]}
                onValueChange={(values) => setLeverage(values[0])}
              />
            </div>
            
            {tradeSuggestion && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-recommended"
                  checked={useRecommendedLevels}
                  onCheckedChange={handleUseRecommended}
                />
                <Label htmlFor="use-recommended" className="cursor-pointer">
                  Use recommended levels
                </Label>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="take-profit">Take Profit ($)</Label>
                <Input
                  id="take-profit"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="stop-loss">Stop Loss ($)</Label>
                <Input
                  id="stop-loss"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg space-y-3">
              <div className="text-sm font-medium">Order Summary</div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Position Size:</span>
                  <span>${parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Effective Position:</span>
                  <span>${(parseFloat(amount) * leverage).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Profit Target:</span>
                  <span className="text-green-500">
                    {profitPotential > 0 ? '+' : ''}{profitPotential.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk:</span>
                  <span className="text-red-500">{riskPotential.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk/Reward:</span>
                  <span className={parseFloat(riskRewardRatio) >= 2 ? "text-green-500" : "text-yellow-500"}>
                    1:{riskRewardRatio}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            
            <h3 className="text-xl font-bold">Trade Successful</h3>
            <p className="text-center text-muted-foreground">
              Your {tradeType.toUpperCase()} position for {coinSymbol} has been opened successfully
            </p>
            
            <div className="w-full p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Type:</span>
                <span className="font-medium">{tradeType.toUpperCase()} Market</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entry Price:</span>
                <span className="font-medium">${currentPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position Size:</span>
                <span className="font-medium">${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Leverage:</span>
                <span className="font-medium">{leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Take Profit:</span>
                <span className="font-medium text-green-500">${parseFloat(takeProfit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stop Loss:</span>
                <span className="font-medium text-red-500">${parseFloat(stopLoss).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        {!showConfirmation ? (
          <Button 
            onClick={handleInitiateTrade} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Open {tradeType.toUpperCase()} Position
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleNewTrade}
            variant="outline"
            className="w-full"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            New Trade
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default InitiateTrade;
