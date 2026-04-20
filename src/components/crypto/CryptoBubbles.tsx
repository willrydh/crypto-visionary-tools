
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bitcoin, CircleDollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataSourceIndicator } from '@/components/ui/data-source-indicator';

// Interface for crypto data
interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', color: 'hsl(var(--warning))' },
  { symbol: 'ETH', name: 'Ethereum', color: 'hsl(var(--info))' },
  { symbol: 'SOL', name: 'Solana', color: 'hsl(var(--mode-night))' },
  { symbol: 'XRP', name: 'Ripple', color: 'hsl(var(--primary))' },
  { symbol: 'DOGE', name: 'Dogecoin', color: 'hsl(var(--warning))' },
  { symbol: 'ADA', name: 'Cardano', color: 'hsl(var(--info))' },
  { symbol: 'DOT', name: 'Polkadot', color: 'hsl(var(--mode-night))' },
  { symbol: 'AVAX', name: 'Avalanche', color: 'hsl(var(--bearish))' },
  { symbol: 'MATIC', name: 'Polygon', color: 'hsl(var(--mode-night))' },
  { symbol: 'LINK', name: 'Chainlink', color: 'hsl(var(--info))' },
  { symbol: 'UNI', name: 'Uniswap', color: 'hsl(var(--mode-night))' },
  { symbol: 'AAVE', name: 'Aave', color: 'hsl(var(--mode-night))' },
];

// Mock data generator - in a real app, this would be replaced by an API call
const generateCryptoData = (): CryptoData[] => {
  const baseVolumes = {
    'BTC': 25000000000,
    'ETH': 10000000000,
    'SOL': 2000000000,
    'XRP': 1500000000,
    'DOGE': 800000000,
    'ADA': 600000000,
    'DOT': 500000000,
    'AVAX': 400000000,
    'MATIC': 350000000,
    'LINK': 300000000,
    'UNI': 250000000,
    'AAVE': 200000000,
  };
  
  const basePrices = {
    'BTC': 82000,
    'ETH': 3200,
    'SOL': 170,
    'XRP': 0.58,
    'DOGE': 0.12,
    'ADA': 0.42,
    'DOT': 7.30,
    'AVAX': 38.5,
    'MATIC': 0.85,
    'LINK': 14.25,
    'UNI': 7.80,
    'AAVE': 92.5,
  };
  
  return cryptoList.map(crypto => {
    const change = (Math.random() * 10) - 5; // -5% to +5%
    const basePrice = basePrices[crypto.symbol as keyof typeof basePrices] || 100;
    const price = basePrice * (1 + (change / 100));
    const volume = baseVolumes[crypto.symbol as keyof typeof baseVolumes] || 100000000;
    const marketCap = price * volume / 1000;
    
    return {
      symbol: crypto.symbol,
      name: crypto.name,
      price,
      change24h: change,
      marketCap,
      volume24h: volume * (0.8 + Math.random() * 0.4)
    };
  });
};

const CryptoBubbles: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  
  useEffect(() => {
    // Initial load
    const initialData = generateCryptoData();
    setCryptoData(initialData);
    setIsLoading(false);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newData = cryptoData.map(crypto => {
        const smallChange = (Math.random() - 0.5) * 0.2; // small price fluctuation
        return {
          ...crypto,
          price: crypto.price * (1 + smallChange),
          change24h: crypto.change24h + (Math.random() - 0.5) * 0.1,
          volume24h: crypto.volume24h * (0.995 + Math.random() * 0.01)
        };
      });
      setCryptoData(newData);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate bubble size based on market cap
  const getBubbleSize = (marketCap: number) => {
    const minSize = 50;
    const maxSize = 120;
    const maxMarketCap = Math.max(...cryptoData.map(c => c.marketCap));
    const minMarketCap = Math.min(...cryptoData.map(c => c.marketCap));
    
    const sizeFactor = (marketCap - minMarketCap) / (maxMarketCap - minMarketCap);
    return minSize + sizeFactor * (maxSize - minSize);
  };
  
  // Random position within container
  const getRandomPosition = (index: number) => {
    const positions = [
      { x: '20%', y: '30%' },
      { x: '65%', y: '40%' },
      { x: '40%', y: '60%' },
      { x: '80%', y: '60%' },
      { x: '30%', y: '20%' },
      { x: '75%', y: '25%' },
      { x: '55%', y: '70%' },
      { x: '15%', y: '60%' },
      { x: '60%', y: '15%' },
      { x: '45%', y: '80%' },
      { x: '85%', y: '70%' },
      { x: '25%', y: '75%' },
    ];
    
    return positions[index % positions.length];
  };
  
  const handleBubbleClick = (crypto: CryptoData) => {
    setSelectedCrypto(crypto);
  };
  
  const getCryptoColor = (symbol: string) => {
    const crypto = cryptoList.find(c => c.symbol === symbol);
    return crypto?.color || 'hsl(var(--info))';
  };
  
  if (isLoading) {
    return (
      <div className="p-6 border rounded-md h-[500px] bg-muted/20 flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading crypto market data...</div>
      </div>
    );
  }
  
  return (
    <div className="relative border rounded-md p-4 h-[500px] bg-muted/10 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Crypto Market Overview</h2>
        <DataSourceIndicator 
          source="CoinGecko API" 
          isLive={true} 
        />
      </div>
      
      <div className="w-full h-full relative">
        {cryptoData.map((crypto, index) => {
          const position = getRandomPosition(index);
          const size = getBubbleSize(crypto.marketCap);
          const isPositive = crypto.change24h > 0;
          
          return (
            <motion.div
              key={crypto.symbol}
              className="absolute cursor-pointer rounded-full flex flex-col items-center justify-center shadow-lg select-none"
              style={{ 
                backgroundColor: `${getCryptoColor(crypto.symbol)}20`,
                border: `2px solid ${getCryptoColor(crypto.symbol)}`,
                left: position.x,
                top: position.y,
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1, 
                width: size, 
                height: size,
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
              }}
              transition={{ 
                scale: { duration: 0.5 },
                x: { 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 3 + Math.random() * 2 
                },
                y: { 
                  repeat: Infinity, 
                  repeatType: "mirror", 
                  duration: 4 + Math.random() * 2,
                  delay: Math.random()
                }
              }}
              whileHover={{ 
                scale: 1.1,
                boxShadow: `0 0 15px ${getCryptoColor(crypto.symbol)}80`,
                transition: { duration: 0.2 }
              }}
              onClick={() => handleBubbleClick(crypto)}
            >
              <span className="font-bold">{crypto.symbol}</span>
              <div className="flex items-center text-xs">
                {isPositive ? 
                  <TrendingUp className="h-3 w-3 text-bullish mr-1" /> : 
                  <TrendingDown className="h-3 w-3 text-bearish mr-1" />
                }
                <span className={isPositive ? "text-bullish" : "text-bearish"}>
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Crypto details popup */}
      <AnimatePresence>
        {selectedCrypto && (
          <motion.div 
            className="absolute bottom-4 left-4 right-4 bg-card border rounded-lg p-4 shadow-xl z-10"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: `${getCryptoColor(selectedCrypto.symbol)}30` }}
                >
                  <Bitcoin className="h-5 w-5" style={{ color: getCryptoColor(selectedCrypto.symbol) }} />
                </div>
                <div>
                  <h3 className="font-bold">{selectedCrypto.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedCrypto.symbol}</p>
                </div>
              </div>
              <button 
                className="text-muted-foreground rounded-full p-1 hover:bg-muted transition-colors"
                onClick={() => setSelectedCrypto(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div>
                <p className="text-muted-foreground">Price</p>
                <p className="font-bold">${selectedCrypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-muted-foreground">24h Change</p>
                <p className={`font-bold ${selectedCrypto.change24h > 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {selectedCrypto.change24h > 0 ? '+' : ''}{selectedCrypto.change24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-bold">${(selectedCrypto.marketCap / 1000000000).toFixed(2)}B</p>
              </div>
              <div>
                <p className="text-muted-foreground">24h Volume</p>
                <p className="font-bold">${(selectedCrypto.volume24h / 1000000000).toFixed(2)}B</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CryptoBubbles;
