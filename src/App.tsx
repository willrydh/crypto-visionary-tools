
import React, { useState } from 'react';
import {
  BrowserRouter,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider"
import { PriceProvider } from './contexts/PriceContext';
import { TimeframeProvider } from './contexts/TimeframeContext';
import { TradingModeProvider } from './contexts/TradingModeContext';
import { TechnicalAnalysisProvider } from './contexts/TechnicalAnalysisContext';
import { CryptoProvider } from './contexts/CryptoContext';
import { MarketsProvider } from './contexts/MarketsContext';
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
                  <MarketsProvider>
                    <BrowserRouter>
                      <RootLayout />
                    </BrowserRouter>
                  </MarketsProvider>
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
