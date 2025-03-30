
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, BarChart } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md mx-auto p-4 sm:p-6">
        <img src={Logo} alt="ProfitPilot AI" className="h-16 w-16 mx-auto mb-6" />
        
        <div className="mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">404</h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-3 sm:mb-4">Market Not Found</h2>
        </div>
        
        <p className="text-base sm:text-lg text-muted-foreground mb-6">
          Looks like you're trading in uncharted territory. This page doesn't exist or has been liquidated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 sm:mb-8">
          <Button onClick={() => navigate('/')} className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Return to Dashboard
          </Button>
          <Button variant="outline" onClick={() => navigate('/chart')} className="gap-2 w-full sm:w-auto">
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
