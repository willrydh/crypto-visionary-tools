
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CryptoCoinIcon from './CryptoCoinIcon';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';
import { useCrypto } from '@/hooks/useCrypto';

export interface CryptoOption {
  symbol: string;
  name: string;
  pairSymbol: string; // e.g., BTCUSDT
  description?: string; // Added description field
}

interface CryptoSelectorProps {
  className?: string;
  showDataSource?: boolean;
  label?: string;
  fullWidth?: boolean;
  onSymbolChange?: (symbol: string) => void;
}

export const cryptoOptions: CryptoOption[] = [
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    pairSymbol: 'BTCUSDT',
    description: 'The world\'s first cryptocurrency. A decentralized digital currency without a central bank or administrator.'
  },
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    pairSymbol: 'ETHUSDT',
    description: 'A decentralized platform that enables smart contracts and dApps, founded by Vitalik Buterin.'
  },
  { 
    symbol: 'XRP', 
    name: 'Ripple', 
    pairSymbol: 'XRPUSDT',
    description: 'Digital payment protocol designed for fast and low-cost international transactions.'
  },
  { 
    symbol: 'SOL', 
    name: 'Solana', 
    pairSymbol: 'SOLUSDT',
    description: 'High-performance blockchain supporting smart contracts with extremely fast transaction speeds.'
  },
  { 
    symbol: 'DOGE', 
    name: 'Dogecoin', 
    pairSymbol: 'DOGEUSDT',
    description: 'Created as a joke in 2013, now a popular cryptocurrency with a devoted community.'
  },
  { 
    symbol: 'WLD', 
    name: 'Worldcoin', 
    pairSymbol: 'WLDUSDT',
    description: 'A cryptocurrency project focused on digital identity verification and universal basic income.'
  },
  { 
    symbol: 'LTC', 
    name: 'Litecoin', 
    pairSymbol: 'LTCUSDT',
    description: 'Created as a "lighter" version of Bitcoin with faster transaction confirmations.'
  },
  { 
    symbol: 'SUI', 
    name: 'Sui', 
    pairSymbol: 'SUIUSDT',
    description: 'Layer-1 blockchain designed for high throughput and low latency transactions.'
  },
];

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({ 
  className,
  showDataSource = false,
  label = "", // Default to empty string instead of "Select cryptocurrency"
  fullWidth = false,
  onSymbolChange
}) => {
  const { selectedCrypto, setSelectedCrypto } = useCrypto();
  
  const handleChange = (value: string) => {
    const selected = cryptoOptions.find(crypto => crypto.pairSymbol === value);
    if (selected) {
      setSelectedCrypto(selected);
      // Call the onSymbolChange callback if provided
      if (onSymbolChange) {
        onSymbolChange(selected.pairSymbol);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <Select value={selectedCrypto.pairSymbol} onValueChange={handleChange}>
        <SelectTrigger className={`${fullWidth ? 'w-full' : 'w-[180px]'} ${className}`}>
          <SelectValue>
            <div className="flex items-center gap-2">
              <CryptoCoinIcon coin={selectedCrypto.symbol as any} size="sm" />
              <span>{selectedCrypto.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {!label && <SelectLabel>Cryptocurrencies</SelectLabel>}
            {cryptoOptions.map((crypto) => (
              <SelectItem key={crypto.pairSymbol} value={crypto.pairSymbol}>
                <div className="flex items-center gap-2">
                  <CryptoCoinIcon coin={crypto.symbol as any} size="sm" />
                  <span>{crypto.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {showDataSource && (
        <DataSourceIndicator 
          source="Bybit API" 
          isLive={true} 
          placement="right"
          details="Real-time cryptocurrency data from Bybit" 
        />
      )}
    </div>
  );
};

export default CryptoSelector;
