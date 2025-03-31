
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Rocket, TrendingUp, LineChart, Calendar } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, imageSrc }) => {
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
      {imageSrc && (
        <div className="h-60 overflow-hidden border-t">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
      )}
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
          imageSrc="/lovable-uploads/0bbcaaf7-41ab-41c2-a81f-15c52b4d6202.png"
        />
        
        <FeatureCard
          title="Trade Signals"
          description="Smart trade suggestions based on current market conditions and volatility patterns."
          icon={<Rocket className="h-6 w-6 text-primary" />}
          imageSrc="/lovable-uploads/cbf4d840-cd1b-4a3f-ab13-dce9b7f9bb53.png"
        />
        
        <FeatureCard
          title="Real-time Charts"
          description="Professional-grade charts with multiple timeframes and indicator overlays."
          icon={<LineChart className="h-6 w-6 text-primary" />}
          imageSrc="/lovable-uploads/4a0c6ea8-49f6-4dd0-8216-6e0085aec938.png"
        />
        
        <FeatureCard
          title="Economic Calendar"
          description="Never miss important market events with our comprehensive economic calendar."
          icon={<Calendar className="h-6 w-6 text-primary" />}
          imageSrc="/lovable-uploads/83cd3ce3-8a61-4043-aa68-18467165dbc3.png"
        />
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card/50 backdrop-blur overflow-hidden">
          <CardContent className="p-0">
            <img 
              src="/lovable-uploads/cd165e0d-4678-4599-8125-3439bc1496cc.png" 
              alt="Advanced Charts" 
              className="w-full h-auto"
            />
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur overflow-hidden">
          <CardContent className="p-0">
            <img 
              src="/lovable-uploads/b26d8332-d911-4cd0-92d8-9d88267f181e.png" 
              alt="Mobile Trading" 
              className="w-full h-auto"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
