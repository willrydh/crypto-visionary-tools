
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from './components/ui/toaster';
import { CryptoProvider } from './contexts/CryptoContext';
import { MarketsProvider } from './contexts/MarketsContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { PriceProvider } from './contexts/PriceContext';
import { SupportResistanceProvider } from './contexts/SupportResistanceContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import RootLayout from './components/layout/RootLayout';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <Router>
          <TimeframeProvider>
            <CryptoProvider>
              <MarketsProvider>
                <TradingModeProvider>
                  <TechnicalAnalysisProvider>
                    <SupportResistanceProvider>
                      <PriceProvider refreshInterval={30000}>
                        <RootLayout />
                        <Toaster />
                      </PriceProvider>
                    </SupportResistanceProvider>
                  </TechnicalAnalysisProvider>
                </TradingModeProvider>
              </MarketsProvider>
            </CryptoProvider>
          </TimeframeProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
