
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
import RootLayout from './components/layout/RootLayout';
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
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPasswordConfirm />} />
          
          <Route element={<RootLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signals" element={<SignalsView />} />
            <Route path="/trade" element={<TradeSuggestion />} />
            <Route path="/chart" element={<ChartView />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/levels" element={<LevelsView />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
