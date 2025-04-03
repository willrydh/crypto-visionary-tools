
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, TrendingUp, LineChart, Calendar } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
      </div>
    </Card>
  );
};

export const AppShowcase = () => {
  return (
    <div className="py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Powerful Trading Tools</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          ProfitPilot AI offers advanced market analysis and real-time trading signals to help you navigate the crypto markets with confidence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <FeatureCard
          title="Market Analysis"
          description="Advanced technical analysis with support & resistance detection and trend identification."
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
        />
        
        <FeatureCard
          title="Trade Signals"
          description="Smart trade suggestions based on current market conditions and volatility patterns."
          icon={<Rocket className="h-6 w-6 text-primary" />}
        />
        
        <FeatureCard
          title="Real-time Charts"
          description="Professional-grade charts with multiple timeframes and indicator overlays."
          icon={<LineChart className="h-6 w-6 text-primary" />}
        />
        
        <FeatureCard
          title="Economic Calendar"
          description="Never miss important market events with our comprehensive economic calendar."
          icon={<Calendar className="h-6 w-6 text-primary" />}
        />
      </div>
    </div>
  );
};
