
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Database, 
  BrainCircuit, 
  LineChart, 
  BarChart3, 
  ArrowRight, 
  Zap, 
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface WorkflowStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  step: number;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ 
  title, 
  description, 
  icon, 
  color,
  step
}) => {
  return (
    <div className="relative">
      {/* Step number */}
      <div className={cn(
        "absolute -left-4 top-10 md:left-0 md:-top-4 w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm z-10",
        color
      )}>
        {step}
      </div>
      
      {/* Connection line */}
      {step < 4 && (
        <div className="absolute left-0 top-20 md:left-[50%] md:top-12 h-[calc(100%-40px)] md:h-0 md:w-[calc(100%-40px)] border-l-2 md:border-l-0 md:border-t-2 border-dashed border-border/50 z-0"></div>
      )}
      
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-lg border-t-4 h-full z-10 relative bg-card/80 backdrop-blur",
        color.replace('text-', 'border-').replace('/20', '')
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn(
              "p-3 rounded-full",
              color
            )}>
              {icon}
            </div>
            <div>
              <Badge variant="outline" className="mb-1 font-medium">Step {step}</Badge>
              <h3 className="font-bold text-xl">{title}</h3>
            </div>
          </div>
          <p className="text-muted-foreground">{description}</p>
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
      color: "bg-blue-500/20 text-blue-500"
    },
    {
      title: "AI Processing",
      description: "Proprietary machine learning algorithms analyze patterns, trends, and market conditions, identifying key support and resistance levels with unprecedented accuracy.",
      icon: <BrainCircuit className="h-5 w-5" />,
      color: "bg-purple-500/20 text-purple-500"
    },
    {
      title: "Signal Generation",
      description: "High-probability trading signals are generated based on multi-timeframe analysis, with risk management parameters tailored to your selected trading strategy.",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-amber-500/20 text-amber-500"
    },
    {
      title: "Actionable Insights",
      description: "Receive precise entry and exit points, position sizing recommendations, and real-time alerts on your dashboard to execute trades with confidence.",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "bg-green-500/20 text-green-500"
    }
  ];

  return (
    <section className="relative overflow-hidden py-16 px-6">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-amber-500/10 to-green-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Advanced Technology</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How ProfitPilot Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our AI-powered platform analyzes massive datasets to provide you with actionable 
            trading insights backed by proprietary algorithms and predictive models.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 mt-16">
          {steps.map((step, index) => (
            <WorkflowStep
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              color={step.color}
              step={index + 1}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto overflow-hidden bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 text-primary mb-4">
                <TrendingUp className="h-5 w-5" />
                <h3 className="font-medium">Results That Speak For Themselves</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Our high-frequency algorithm has consistently outperformed market benchmarks in both 
                bull and bear markets, with average signals achieving <span className="font-medium text-green-500">73% win rate</span> across
                more than 10,000 trades.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
