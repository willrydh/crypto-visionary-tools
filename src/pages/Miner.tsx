
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Code, 
  Zap, 
  LoaderCircle,
  MoveDown,
  Webhook
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const Miner = () => {
  const { toast } = useToast();
  const [isMining, setIsMining] = useState<boolean>(false);
  const [hashRate, setHashRate] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [coinsFound, setCoinsFound] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>('Idle');
  const [consoleOutput, setConsoleOutput] = useState<string>('System: Mining operations idle...');
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // Intervals reference to clear them when stopping
  const intervalsRef = useRef<{[key: string]: NodeJS.Timeout}>({});
  
  // Sample crypto names for mining simulation
  const cryptoNames = [
    'MoonShot', 'PixelByte', 'NebulaCoin', 'QuantumChain', 'StellarBit',
    'CyberNova', 'AtomicFlux', 'OrbitalLink', 'PulseWave', 'NovaFlare',
    'GalaxyNode', 'EtherPulse', 'VortexCoin', 'SolarFlare', 'NebulaX',
    'QuantumLeap', 'AstralCoin', 'CosmosByte', 'NovaCrest', 'WarpDrive'
  ];
  
  // Sample mining operations
  const miningOperations = [
    'Connecting to mining pool...',
    'Initializing proof-of-work algorithm...',
    'Calculating optimal hashrate...',
    'Scanning blockchain for microcap opportunities...',
    'Analyzing network difficulty...',
    'Calibrating mining parameters...',
    'Establishing peer connections...',
    'Verifying block headers...',
    'Computing Merkle tree roots...',
    'Optimizing ASIC performance...',
    'Validating transaction data...',
    'Mining new transaction blocks...',
    'Creating proof-of-work solution...',
    'Checking hash validity...',
    'Confirming block rewards...',
    'Generating nonce values...'
  ];
  
  // Mining code lines for visual effect
  const generateCodeLine = () => {
    const hexChars = '0123456789ABCDEF';
    let hexString = '';
    
    // Generate a random hex string (like a hash)
    for (let i = 0; i < 64; i++) {
      hexString += hexChars[Math.floor(Math.random() * 16)];
    }
    
    const operations = [
      `Mining block ${Math.floor(Math.random() * 1000000)}...`,
      `Verifying hash: ${hexString.substring(0, 16)}...`,
      `Computing nonce: ${Math.floor(Math.random() * 1000000)}`,
      `Difficulty target: ${(Math.random() * 0.001).toFixed(8)}`,
      `Network connection: ${Math.floor(Math.random() * 100)} peers`,
      `Merkle root: ${hexString.substring(0, 20)}...`,
      `Block size: ${Math.floor(Math.random() * 1000) + 500}KB`,
      `Testing hash solution: ${hexString.substring(0, 10)}...`,
      `TX count: ${Math.floor(Math.random() * 2000) + 100}`,
      `Elapsed time: ${Math.floor(Math.random() * 120)}s`
    ];
    
    return operations[Math.floor(Math.random() * operations.length)];
  };
  
  // Function to start mining simulation
  const startMining = () => {
    if (isMining) return; // Don't start if already mining
    
    setIsMining(true);
    setProgress(0);
    setCurrentTask('Initializing mining operations');
    setConsoleOutput('System: Mining operations starting...');
    
    toast({
      title: "Mining Started",
      description: "Mining operations have been initiated successfully.",
    });
    
    // Simulate increasing hash rate
    intervalsRef.current.hashInterval = setInterval(() => {
      setHashRate(prev => {
        const newRate = prev + (Math.random() * 5);
        return newRate > 100 ? 100 : newRate;
      });
    }, 1000);
    
    // Simulate progress
    intervalsRef.current.progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (Math.random() * 0.5);
        if (newProgress >= 100) {
          // Simulate finding a coin
          handleCoinFound();
          return 0; // Reset progress
        }
        return newProgress;
      });
    }, 300);
    
    // Simulate changing tasks
    intervalsRef.current.taskInterval = setInterval(() => {
      setCurrentTask(miningOperations[Math.floor(Math.random() * miningOperations.length)]);
    }, 5000);
    
    // Simulate console output - only update one line
    intervalsRef.current.consoleInterval = setInterval(() => {
      setConsoleOutput(generateCodeLine());
    }, 200);
  };
  
  const stopMining = () => {
    setIsMining(false);
    setHashRate(0);
    setProgress(0);
    setCurrentTask('Idle');
    setConsoleOutput('System: Mining operations stopped.');
    
    // Clear all intervals
    Object.values(intervalsRef.current).forEach(interval => clearInterval(interval));
    intervalsRef.current = {};
    
    toast({
      title: "Mining Stopped",
      description: "Mining operations have been halted.",
    });
  };
  
  const handleCoinFound = () => {
    const randomCoin = cryptoNames[Math.floor(Math.random() * cryptoNames.length)];
    const amount = (Math.random() * 10).toFixed(4);
    
    setConsoleOutput(`SUCCESS: Found ${amount} ${randomCoin} tokens!`);
    
    setCoinsFound(prev => prev + 1);
    
    toast({
      title: "Microcap Token Found!",
      description: `Successfully mined ${amount} ${randomCoin} tokens`,
      variant: "default"
    });
  };
  
  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(interval => clearInterval(interval));
    };
  }, []);
  
  return (
    <div className="container py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Experimental Microcap Miner</h1>
        <p className="text-muted-foreground">
          Discover and mine potential microcap cryptocurrency gems
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" /> Mining Console
                  </CardTitle>
                  <CardDescription>
                    Real-time mining operations
                  </CardDescription>
                </div>
                
                {isMining ? (
                  <Button variant="destructive" size="sm" onClick={stopMining}>
                    <Square className="h-4 w-4 mr-2" /> Stop
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={startMining}>
                    <Play className="h-4 w-4 mr-2" /> Start Mining
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div 
                ref={consoleRef}
                className="h-10 flex items-center bg-black/80 text-green-400 font-mono text-xs p-4 rounded-md"
              >
                <div className={isMining ? 'animate-pulse' : ''}>
                  {consoleOutput}
                  {isMining && <span className="ml-1 animate-pulse">_</span>}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <div className="w-full">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Mining Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" /> Mining Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current Task</div>
                <div className="flex items-center gap-2">
                  {isMining ? (
                    <LoaderCircle className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <MoveDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className={isMining ? "font-medium" : "text-muted-foreground"}>
                    {currentTask}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Hash Rate</div>
                <div className="text-2xl font-bold font-mono">{hashRate.toFixed(2)} MH/s</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Tokens Found</div>
                <div className="text-2xl font-bold font-mono">{coinsFound}</div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Network Status</div>
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Connected (42 peers)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" /> Microcap Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              {coinsFound > 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: coinsFound }).map((_, index) => {
                    const coin = cryptoNames[Math.floor(Math.random() * cryptoNames.length)];
                    const amount = (Math.random() * 10).toFixed(4);
                    const value = (Math.random() * 5).toFixed(2);
                    
                    return (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                        <div>
                          <div className="font-medium">{coin}</div>
                          <div className="text-xs text-muted-foreground">{amount} tokens</div>
                        </div>
                        <div className="text-right">
                          <div>${value}</div>
                          <div className="text-xs text-green-500">+{(Math.random() * 5).toFixed(2)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No tokens mined yet</p>
                  <p className="text-xs mt-1">Start mining to discover microcap gems</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Miner;
