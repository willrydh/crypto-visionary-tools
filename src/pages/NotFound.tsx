
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingDown, Home, BarChart } from 'lucide-react';
import Logo from '@/assets/logo.svg';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <img src={Logo} alt="ProfitPilot AI" className="h-16 w-16 mx-auto mb-6" />
        
        <div className="relative mb-8">
          <div className="absolute -top-6 -right-6">
            <TrendingDown className="h-12 w-12 text-red-500 animate-bounce" />
          </div>
          <h1 className="text-5xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-primary mb-4">Market Not Found</h2>
        </div>
        
        <p className="text-lg text-muted-foreground mb-6">
          Looks like you're trading in uncharted territory. This page doesn't exist or has been liquidated.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={() => navigate('/')} className="gap-2">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/chart')} className="gap-2">
            <BarChart className="h-4 w-4" />
            View Charts
          </Button>
        </div>

        <div className="p-4 bg-card/50 rounded-lg border border-border">
          <h3 className="font-medium mb-2">Trading Tip</h3>
          <p className="text-sm text-muted-foreground">
            Even the best traders sometimes enter the wrong positions. The key is to have a clear exit strategy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
