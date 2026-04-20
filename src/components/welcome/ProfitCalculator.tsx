
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PiggyBank, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfitCalculatorProps {
  className?: string;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({ className }) => {
  const [budget, setBudget] = useState([5000]);
  const [dailyGoal, setDailyGoal] = useState([100]);
  
  // Calculate potential earnings with app assistance
  const [standardEarnings, setStandardEarnings] = useState(0);
  const [enhancedEarnings, setEnhancedEarnings] = useState(0);
  const [annualEarnings, setAnnualEarnings] = useState(0);
  
  useEffect(() => {
    // Calculations for potential earnings:
    // Standard trading (without app): assuming 2-3% monthly return
    const standardMonthlyRate = 0.025; // 2.5% monthly
    const standard = budget[0] * standardMonthlyRate;
    
    // Enhanced trading (with app): assuming 5-7% monthly return due to better decisions
    const enhancedMonthlyRate = 0.06; // 6% monthly with app assistance
    const enhanced = budget[0] * enhancedMonthlyRate;
    
    // Annual calculation with compound growth
    const annualWithApp = budget[0] * Math.pow((1 + enhancedMonthlyRate), 12) - budget[0];
    
    setStandardEarnings(standard);
    setEnhancedEarnings(enhanced);
    setAnnualEarnings(annualWithApp);
  }, [budget, dailyGoal]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calculate what % of daily goal is achievable with app assistance
  const goalPercentage = Math.min(Math.round((enhancedEarnings / 20) / dailyGoal[0] * 100), 100);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden border bg-card">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
          <CardTitle className="flex items-center gap-2 text-xl">
            <PiggyBank className="h-5 w-5 text-primary" />
            Trading Profit Calculator
          </CardTitle>
          <CardDescription>
            See how ProfitPilot can help reach your trading goals
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Your Trading Budget</label>
                <span className="text-sm font-semibold">{formatCurrency(budget[0])}</span>
              </div>
              <Slider
                value={budget}
                min={1000}
                max={100000}
                step={1000}
                onValueChange={setBudget}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$1,000</span>
                <span>$100,000</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Daily Profit Goal</label>
                <span className="text-sm font-semibold">{formatCurrency(dailyGoal[0])}</span>
              </div>
              <Slider
                value={dailyGoal}
                min={20}
                max={1000}
                step={10}
                onValueChange={setDailyGoal}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$20</span>
                <span>$1,000</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h3 className="text-lg font-medium mb-4">Potential Monthly Returns</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-info/10 rounded-lg p-4 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-info" />
                      <h4 className="font-medium">Standard Trading</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Without ProfitPilot</p>
                    <div className="text-2xl font-bold text-info">
                      {formatCurrency(standardEarnings)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <BarChart3 className="h-24 w-24 text-info" />
                  </div>
                </div>
                
                <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 relative overflow-hidden border border-primary/20">
                  <div className="absolute top-1 right-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <div className="relative z-10 pt-6 md:pt-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">With ProfitPilot</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">Enhanced signals & timing</p>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(enhancedEarnings)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/mo</span>
                    </div>
                    <div className="mt-2 text-sm text-primary">
                      +{Math.round((enhancedEarnings - standardEarnings) / standardEarnings * 100)}% improvement
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 opacity-10">
                    <TrendingUp className="h-24 w-24 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-card border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-bullish" />
                  <h4 className="font-medium">Daily Goal Achievement</h4>
                </div>
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-bullish" 
                      style={{ width: `${goalPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{goalPercentage}%</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {goalPercentage >= 100 
                    ? `You can exceed your daily goal of ${formatCurrency(dailyGoal[0])} with ProfitPilot` 
                    : `ProfitPilot can help you reach ${goalPercentage}% of your ${formatCurrency(dailyGoal[0])} daily goal`}
                </p>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">Potential Annual Growth</h5>
                      <p className="text-sm text-muted-foreground">With compound returns</p>
                    </div>
                    <div className="text-xl font-bold text-bullish">
                      {formatCurrency(annualEarnings)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfitCalculator;
