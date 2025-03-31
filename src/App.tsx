
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SignalsView from './pages/SignalsView';
import TradeSuggestion from './pages/TradeSuggestion';
import ChartView from './pages/ChartView';
import CalendarView from './pages/CalendarView';
import SettingsView from './pages/SettingsView';
import LevelsView from './pages/LevelsView';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import FAQ from './pages/FAQ';
import MarketDashboard from './pages/MarketDashboard';
import RootLayout from './components/layout/RootLayout';
import MarketAlerts from './components/markets/MarketAlerts';
import { Toaster } from './components/ui/toaster';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MarketAlerts />
        <Toaster />
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />
          <Route path="/faq" element={<FAQ />} />
          
          <Route element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<SignalsView />} />
            <Route path="/trade" element={<TradeSuggestion />} />
            <Route path="/chart" element={<ChartView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/levels" element={<LevelsView />} />
            <Route path="/market-dashboard" element={<MarketDashboard />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
