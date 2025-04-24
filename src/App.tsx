
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import CalendarView from './pages/CalendarView';
import TradeSuggestion from './pages/TradeSuggestion';
import { PriceProvider } from './contexts/PriceContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { CryptoProvider } from './contexts/CryptoContext';
import EntryScanner from "@/pages/EntryScanner";
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import MainLayout from './components/layout/MainLayout';
import RootLayout from './components/layout/RootLayout';

// Create a simple AuthContext
import { createContext } from 'react';
export const AuthContext = createContext({ isLoggedIn: false });

// Create simple Login and Register pages
const Login = () => {
  return <div className="container py-8">Login Form</div>;
};

const Register = () => {
  return <div className="container py-8">Register Form</div>;
};

const App = () => {
  // Mock authentication state
  const [isLoggedIn] = useState(true);
  const authContextValue = { isLoggedIn };
  
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="profit-pilot-theme"
    >
      <AuthContext.Provider value={authContextValue}>
        <PriceProvider>
          <TimeframeProvider>
            <TradingModeProvider>
              <CryptoProvider>
                <TechnicalAnalysisProvider>
                  <RootLayout />
                </TechnicalAnalysisProvider>
              </CryptoProvider>
            </TradingModeProvider>
          </TimeframeProvider>
        </PriceProvider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default App;
