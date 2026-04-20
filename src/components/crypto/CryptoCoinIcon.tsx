
import React, { useState } from 'react';
import { Bitcoin, CircleDollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCryptoIconUrl, getFallbackIconUrl } from '@/utils/cryptoIcons';

type SupportedCoin = 'BTC' | 'ETH' | 'XRP' | 'SOL' | 'DOGE' | 'WLD' | 'LTC' | 'SUI';

interface CryptoCoinIconProps {
  coin: SupportedCoin;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  useRealIcons?: boolean;
}

const CryptoCoinIcon: React.FC<CryptoCoinIconProps> = ({ 
  coin, 
  size = 'md',
  className,
  useRealIcons = true
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const colorMap: Record<SupportedCoin, string> = {
    BTC: 'text-warning',
    ETH: 'text-indigo-400',
    XRP: 'text-info',
    SOL: 'text-mode-night',
    DOGE: 'text-warning',
    WLD: 'text-bullish',
    LTC: 'text-muted-foreground',
    SUI: 'text-blue-300'
  };

  // Use actual cryptocurrency icons when enabled and no error occurred
  if (useRealIcons && !imageError) {
    const iconUrl = getCryptoIconUrl(coin);
    const fallbackUrl = getFallbackIconUrl(coin);
    
    return (
      <img 
        src={iconUrl} 
        alt={`${coin} icon`}
        className={cn(sizeMap[size], className)}
        onError={() => setImageError(true)}
        onLoad={() => setImageError(false)}
      />
    );
  }

  // Fallback to the original icon rendering
  const renderIcon = () => {
    switch (coin) {
      case 'BTC':
        return <Bitcoin className={cn(sizeMap[size], colorMap[coin], className)} />;
      case 'ETH':
        return <CircleDollarSign className={cn(sizeMap[size], colorMap[coin], className)} />;
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
