
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import CryptoSelector from '@/components/crypto/CryptoSelector';
import { cryptoOptions } from '@/components/crypto/CryptoSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { fetchHistoricalPrices } from '@/services/priceDataService';
import { SetupCard } from '@/components/scanner/SetupCard';
import { IndicatorInfo } from '@/components/scanner/IndicatorInfo';
import { scanForSetups } from '@/services/scannerService';
import { Badge } from '@/components/ui/badge';
import { LoaderCircle } from 'lucide-react';
import { TechnicalSetup } from '@/types/scanner';

const EntryScanner = () => {
  const { toast } = useToast();
  const [selectedTimeframe, setSelectedTimeframe] = useState('5');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSetups, setDetectedSetups] = useState<TechnicalSetup[]>([]);
  const [symbol, setSymbol] = useState(cryptoOptions[0].pairSymbol);

  // Handle symbol change from CryptoSelector component
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    runScan(newSymbol, selectedTimeframe);
  };

  // Run the technical analysis scan
  const runScan = async (symbolToScan: string, timeframe: string) => {
    setIsLoading(true);
    setDetectedSetups([]);
    
    try {
      // Get candle data from the price service
      const candleData = await fetchHistoricalPrices(symbolToScan, timeframe, 100);
      
      if (!candleData || candleData.length === 0) {
        throw new Error('No candle data available');
      }
      
      // Run the scanner service to detect technical setups
      const setups = await scanForSetups(symbolToScan, timeframe, candleData);
      
      setDetectedSetups(setups);
      
      // Show notification on success
      if (setups.length > 0) {
        toast({
          title: "Scan Complete",
          description: `Found ${setups.length} potential setups for ${symbolToScan}`,
        });
      } else {
        toast({
          title: "Scan Complete",
          description: "No technical setups detected at this time",
        });
      }
    } catch (error) {
      console.error('Error running scan:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to complete the technical analysis scan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set up auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      runScan(symbol, selectedTimeframe);
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [autoRefresh, symbol, selectedTimeframe]);

  // Initial scan on component mount or when parameters change
  useEffect(() => {
    runScan(symbol, selectedTimeframe);
  }, [symbol, selectedTimeframe]);

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Entry Scanner</CardTitle>
          <CardDescription>
            Scan for technical entry setups across multiple strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <Label>Symbol</Label>
              <CryptoSelector 
                fullWidth 
                showDataSource 
                onSymbolChange={handleSymbolChange}
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Timeframe</Label>
              <Tabs defaultValue={selectedTimeframe} onValueChange={setSelectedTimeframe} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="5">5 min</TabsTrigger>
                  <TabsTrigger value="15">15 min</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="auto-refresh">Auto Refresh (5 min)</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {autoRefresh ? 'ON' : 'OFF'}
                </span>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {isLoading ? 'Scanning...' : `Last scan: ${new Date().toLocaleTimeString()}`}
              </Badge>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={() => runScan(symbol, selectedTimeframe)}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                'Scan Now'
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <LoaderCircle className="h-8 w-8 animate-spin" />
          <span className="ml-2">Scanning for entry setups...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detectedSetups.length > 0 ? (
            detectedSetups.map((setup, index) => (
              <SetupCard key={index} setup={setup} />
            ))
          ) : (
            <div className="col-span-full text-center p-12">
              <p className="text-muted-foreground">No technical setups detected at this time.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Try changing the symbol or timeframe.
              </p>
            </div>
          )}
        </div>
      )}

      <IndicatorInfo />
    </div>
  );
};

export default EntryScanner;
