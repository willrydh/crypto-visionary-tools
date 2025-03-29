import React from 'react';
import Logo from "@/assets/logo.svg";
import { useTradingMode } from '@/hooks/useTradingMode';
import { TradingModeSelector } from '@/components/trading/TradingModeSelector';

const TopHeader: React.FC = () => {
  const { tradingMode } = useTradingMode();

  return (
    <header className="h-16 border-b border-border bg-background z-40 sticky top-0 flex items-center px-4">
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <img src={Logo} alt="Logo" className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">ProfitPilot AI</h1>
            <p className="text-xs text-muted-foreground">Trading Assistant</p>
          </div>
        </div>

        <div className="hidden md:flex">
          <TradingModeSelector />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
