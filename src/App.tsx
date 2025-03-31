
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from './components/layout/RootLayout';
import Dashboard from './pages/Dashboard';
import SignalsView from './pages/SignalsView';
import ChartView from './pages/ChartView';
import SettingsView from './pages/SettingsView';
import CalendarView from './pages/CalendarView';
import MarketDashboard from './pages/MarketDashboard';
import NotFound from './pages/NotFound';
import Welcome from './pages/Welcome';
import TradeSuggestion from './pages/TradeSuggestion';
import LevelsView from './pages/LevelsView';
import { MarketsProvider } from './contexts/MarketsContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { SupportResistanceProvider } from './contexts/SupportResistanceContext';
import { CryptoProvider } from './contexts/CryptoContext';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TimeframeProvider>
          <TradingModeProvider>
            <TechnicalAnalysisProvider>
              <MarketsProvider>
                <SupportResistanceProvider>
                  <CryptoProvider>
                    <Routes>
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/" element={<RootLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="signals" element={<SignalsView />} />
                        <Route path="chart" element={<ChartView />} />
                        <Route path="calendar" element={<CalendarView />} />
                        <Route path="trade" element={<TradeSuggestion />} />
                        <Route path="settings" element={<SettingsView />} />
                        <Route path="market-dashboard" element={<MarketDashboard />} />
                        <Route path="levels" element={<LevelsView />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                    <Toaster />
                  </CryptoProvider>
                </SupportResistanceProvider>
              </MarketsProvider>
            </TechnicalAnalysisProvider>
          </TradingModeProvider>
        </TimeframeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
