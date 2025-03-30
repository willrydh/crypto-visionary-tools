
import React from 'react';
import { Bitcoin, Ethereum } from 'lucide-react';
import { cn } from '@/lib/utils';

type SupportedCoin = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE' | 'WLD' | 'LTC' | 'SUI';

interface CryptoCoinIconProps {
  coin: SupportedCoin;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CryptoCoinIcon: React.FC<CryptoCoinIconProps> = ({ 
  coin, 
  size = 'md',
  className 
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const colorMap: Record<SupportedCoin, string> = {
    BTC: 'text-amber-500',
    ETH: 'text-indigo-400',
    XRP: 'text-blue-500',
    SOL: 'text-purple-500',
    DOGE: 'text-yellow-400',
    WLD: 'text-green-400',
    LTC: 'text-slate-400',
    SUI: 'text-blue-300'
  };

  const renderIcon = () => {
    switch (coin) {
      case 'BTC':
        return <Bitcoin className={cn(sizeMap[size], colorMap[coin], className)} />;
      case 'ETH':
        return <Ethereum className={cn(sizeMap[size], colorMap[coin], className)} />;
      default:
        return (
          <div className={cn(
            'rounded-full flex items-center justify-center font-bold',
            sizeMap[size],
            colorMap[coin],
            className
          )}>
            {coin.substring(0, 1)}
          </div>
        );
    }
  };

  return renderIcon();
};

export default CryptoCoinIcon;
