
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarContext } from '../ui/sidebar';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import CryptoSelector from '../crypto/CryptoSelector';
import TradingModeSelector from '../trading/TradingModeSelector';
import { useCrypto } from '@/hooks/useCrypto';
import { Badge } from '../ui/badge';

const TopHeader: React.FC = () => {
  const { isCollapsed, setIsCollapsed } = useSidebarContext();
  const location = useLocation();
  const { selectedCrypto } = useCrypto();

  const showCryptoSelector = ['/dashboard', '/', '/chart', '/trade', '/market-dashboard'].includes(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-md border-b pt-safe flex h-auto">
      <div className={`transition-all w-full ${!isCollapsed ? 'md:ml-64' : 'md:ml-16'}`}>
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            {showCryptoSelector && (
              <div className="hidden md:flex items-center space-x-2 ml-2">
                <CryptoSelector />
                {selectedCrypto && (
                  <Badge variant="outline" className="ml-2">
                    {selectedCrypto}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div>
            <TradingModeSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
