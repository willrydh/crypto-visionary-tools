
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TradingModeProvider } from '@/contexts/TradingModeContext';
import { TechnicalAnalysisProvider } from '@/contexts/TechnicalAnalysisContext';
import { MarketsProvider } from '@/contexts/MarketsContext';
import { SupportResistanceProvider } from '@/contexts/SupportResistanceContext';
import { TimeframeProvider } from '@/contexts/TimeframeContext';
import TopHeader from './TopHeader';
import MobileNavigation from './MobileNavigation';

const RootLayout: React.FC = () => {
  return (
    <TooltipProvider>
      <TimeframeProvider>
        <TradingModeProvider>
          <TechnicalAnalysisProvider>
            <MarketsProvider>
              <SupportResistanceProvider>
                <div className="flex flex-col min-h-screen">
                  <TopHeader />
                  <main className="flex-1 overflow-auto pb-16 md:pb-0">
                    <Outlet />
                  </main>
                  <MobileNavigation />
                  <Toaster />
                  <Sonner />
                </div>
              </SupportResistanceProvider>
            </MarketsProvider>
          </TechnicalAnalysisProvider>
        </TradingModeProvider>
      </TimeframeProvider>
    </TooltipProvider>
  );
};

export default RootLayout;
