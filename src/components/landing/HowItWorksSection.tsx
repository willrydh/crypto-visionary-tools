
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  Database, 
  BrainCircuit, 
  Zap, 
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkflowStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  step: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  title, 
  description, 
  icon, 
  color,
  bgColor,
  step
}) => {
  return (
    <div className="relative">
      {/* Step number bubble */}
      <div className={cn(
        "absolute -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white z-10",
        color
      )}>
        {step}
      </div>
      
      <Card className={cn(
        "overflow-hidden transition-all h-full relative backdrop-blur-md border-none",
        bgColor
      )}>
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-4">
            <Badge variant="outline" className="self-start text-xs font-medium bg-background/20 backdrop-blur-sm mb-1">
              Step {step}
            </Badge>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <p className="text-white/80">{description}</p>
        </div>
      </Card>
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      title: "Data Collection",
      description: "Our advanced systems gather high-frequency market data from multiple exchanges, combining real-time price action with volume profiles and order flow analytics.",
      icon: <Database className="h-5 w-5" />,
      color: "bg-indigo-600",
      bgColor: "bg-[#1A1F2C] border-none"
    },
    {
      title: "AI Processing",
      description: "Proprietary machine learning algorithms analyze patterns, trends, and market conditions, identifying key support and resistance levels with unprecedented accuracy.",
      icon: <BrainCircuit className="h-5 w-5" />,
      color: "bg-purple-600",
      bgColor: "bg-[#1A1F2C] border-none"
    },
    {
      title: "Signal Generation",
      description: "High-probability trading signals are generated based on multi-timeframe analysis, with risk management parameters tailored to your selected trading strategy.",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-amber-500",
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600 border-none"
    },
    {
      title: "Actionable Insights",
      description: "Receive precise entry and exit points, position sizing recommendations, and real-time alerts on your dashboard to execute trades with confidence.",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "bg-green-600",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600 border-none"
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-6 bg-background/50">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-background/90 z-0"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Advanced Technology</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How ProfitPilot Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform analyzes massive datasets to provide you with actionable 
            trading insights backed by proprietary algorithms and predictive models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 mt-16">
          {steps.map((step, index) => (
            <WorkflowStep
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              bgColor={step.bgColor}
              step={index + 1}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto overflow-hidden bg-card/50 backdrop-blur border-primary/20">
            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <Zap className="h-5 w-5" />
                <h3 className="font-medium">Results That Speak For Themselves</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Our high-frequency algorithm has consistently outperformed market benchmarks in both 
                bull and bear markets, with average signals achieving <span className="font-medium text-green-500">73% win rate</span> across
                more than 10,000 trades.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
