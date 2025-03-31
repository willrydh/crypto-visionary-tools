
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, CircleDollarSign, BarChart3 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import CryptoCoinIcon from './CryptoCoinIcon';

interface CoinInfoProps {
  symbol: string;
  name?: string;
  price?: number;
  change24h?: number;
  marketCap?: number;
  volume24h?: number;
  rank?: number;
  description?: string;
}

// Crypto descriptions for different coins
const cryptoDescriptions: Record<string, string> = {
  BTC: "The world's first cryptocurrency. A decentralized digital currency without a central bank or administrator.",
  ETH: "A decentralized, open-source blockchain with smart contract functionality. Powers the Ethereum ecosystem and NFTs.",
  XRP: "Digital payment protocol and cryptocurrency that enables fast, low-cost international money transfers.",
  SOL: "High-performance blockchain supporting smart contracts and decentralized applications with fast transaction speeds.",
  DOGE: "Originally created as a joke, now a popular meme cryptocurrency with a devoted community.",
  WLD: "The utility token for Worldcoin, a project aiming to create a global identity and financial network.",
  LTC: "Peer-to-peer cryptocurrency created as a fork of Bitcoin, known for faster transaction confirmation times.",
  SUI: "Native token of the Sui blockchain, designed for high throughput and low latency applications."
};

const CoinInfo: React.FC<CoinInfoProps> = ({
  symbol,
  name = 'Bitcoin',
  price = 82450,
  change24h = 2.5,
  marketCap = 1.6e12,
  volume24h = 24.5e9,
  rank = 1,
  description
}) => {
  const isPositive = change24h > 0;
  const coinSymbol = symbol.split('/')[0] as any;
  
  // Use provided description or fallback to our predefined descriptions
  const coinDescription = description || cryptoDescriptions[coinSymbol] || 
    "A digital cryptocurrency traded on various exchanges.";
  
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CryptoCoinIcon coin={coinSymbol} size="lg" />
            <h3 className="font-bold text-lg">{name}</h3>
            <Badge variant="outline" className="text-xs">{symbol}</Badge>
          </div>
          <Badge className={isPositive ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5 mr-1" /> : <TrendingDown className="h-3.5 w-3.5 mr-1" />}
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{coinDescription}</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Price:</span>
            <span className="font-medium">${price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">${(volume24h / 1e9).toFixed(1)}B</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Market Cap:</span>
            <span className="font-medium">${(marketCap / 1e9).toFixed(1)}B</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 mr-1">
              {rank}
            </Badge>
            <span className="text-muted-foreground">Rank:</span>
            <span className="font-medium">#{rank}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinInfo;
