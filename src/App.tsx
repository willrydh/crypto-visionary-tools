
import React, { useEffect } from 'react';
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
  // Add WebView detection and compatibility handling
  useEffect(() => {
    // Workaround to detect WebView environments
    const isWebView = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      return (
        userAgent.includes('wkwebview') ||
        userAgent.includes('iphone') && !userAgent.includes('safari') ||
        userAgent.includes('android') && userAgent.includes('wv')
      );
    };

    // If in WebView, apply fixes
    if (isWebView()) {
      // Ensure scroll behavior works correctly in WebViews
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
      document.body.style.overflow = 'auto';
      
      // Add CSS class to handle WebView-specific styles
      document.documentElement.classList.add('in-webview');
      
      // Add iOS class if on iOS
      if (navigator.userAgent.toLowerCase().includes('iphone') || 
          navigator.userAgent.toLowerCase().includes('ipad')) {
        document.documentElement.classList.add('ios-device');
      }
      
      // Force repaint which can sometimes fix rendering issues
      setTimeout(() => {
        const root = document.getElementById('root');
        if (root) {
          root.style.display = 'none';
          setTimeout(() => {
            root.style.display = '';
          }, 10);
        }
      }, 100);
      
      // Log WebView detected for debugging
      console.log('WebView environment detected, applying compatibility fixes');
    }
  }, []);

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
