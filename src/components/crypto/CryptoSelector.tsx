
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

export interface CryptoOption {
  symbol: string;
  name: string;
  pairSymbol: string; // e.g., BTCUSDT
}

interface CryptoSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  showDataSource?: boolean;
}

const cryptoOptions: CryptoOption[] = [
  { symbol: 'BTC', name: 'Bitcoin', pairSymbol: 'BTCUSDT' },
  { symbol: 'ETH', name: 'Ethereum', pairSymbol: 'ETHUSDT' },
  { symbol: 'XRP', name: 'Ripple', pairSymbol: 'XRPUSDT' },
  { symbol: 'SOL', name: 'Solana', pairSymbol: 'SOLUSDT' },
  { symbol: 'DOGE', name: 'Dogecoin', pairSymbol: 'DOGEUSDT' },
  { symbol: 'WLD', name: 'Worldcoin', pairSymbol: 'WLDUSDT' },
  { symbol: 'LTC', name: 'Litecoin', pairSymbol: 'LTCUSDT' },
  { symbol: 'SUI', name: 'Sui', pairSymbol: 'SUIUSDT' },
];

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({ 
  value, 
  onChange,
  className,
  showDataSource = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-[180px] ${className}`}>
          <SelectValue placeholder="Select cryptocurrency" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Cryptocurrencies</SelectLabel>
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
export { cryptoOptions };
