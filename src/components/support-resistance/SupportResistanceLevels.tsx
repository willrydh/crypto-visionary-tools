
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ArrowDown, ArrowUp, AlertCircle } from 'lucide-react';
import { useSupportResistance } from '@/hooks/useSupportResistance';
import { formatCurrency } from '@/utils/numberUtils';
import { useCrypto } from '@/hooks/useCrypto';

export const SupportResistanceLevels = () => {
  const { levels, structure, isLoading, error, lastUpdated, fetchLevels } = useSupportResistance();
  const { selectedCrypto } = useCrypto();
  
  useEffect(() => {
    if (levels.length === 0) {
      fetchLevels(selectedCrypto.pairSymbol);
    }
  }, [levels.length, fetchLevels, selectedCrypto]);
  
  const getLevelColor = (type: string, strength: string) => {
    if (type === 'support') {
      return strength === 'strong' ? 'bg-bullish text-primary-foreground' : 'bg-bullish/20 text-bullish';
    }
    return strength === 'strong' ? 'bg-bearish text-primary-foreground' : 'bg-bearish/20 text-bearish';
  };
  
  const getStructureColor = (type: string) => {
    switch (type) {
      case 'uptrend':
        return 'bg-bullish/10 text-bullish border-bullish/20';
      case 'downtrend':
        return 'bg-bearish/10 text-bearish border-bearish/20';
      case 'range':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-info/10 text-info border-info/20';
    }
  };
  
  return (
    <Card className="bg-surface-1 border-border/40 text-primary-foreground">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Support & Resistance Levels</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLevels(selectedCrypto.pairSymbol)}
            disabled={isLoading}
            className="bg-card/5 border-border/10 hover:bg-card/10 text-primary-foreground"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="h-48 flex flex-col items-center justify-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchLevels(selectedCrypto.pairSymbol)}
              className="mt-2 hover:bg-card/10 text-primary-foreground"
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {structure && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Market Structure</div>
                <Badge 
                  className={`${getStructureColor(structure.type)} px-3 py-1 text-sm`}
                >
                  {structure.type === 'uptrend' ? (
                    <ArrowUp className="h-3.5 w-3.5 mr-1.5" />
                  ) : structure.type === 'downtrend' ? (
                    <ArrowDown className="h-3.5 w-3.5 mr-1.5" />
                  ) : null}
                  {structure.description}
                </Badge>
              </div>
            )}
            
            <div>
              <div className="text-sm text-muted-foreground mb-2">Key Price Levels</div>
              {levels.length > 0 ? (
                <div className="space-y-2">
                  {levels.map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded-md border border-border/10 bg-card/5">
                      <div className="flex items-center gap-2">
                        <Badge className={getLevelColor(level.type, level.strength)}>
                          {level.type === 'support' ? 'Support' : 'Resistance'}
                        </Badge>
                        <span className={level.strength === 'strong' ? 'font-medium' : ''}>
                          {level.strength === 'strong' ? 'Strong' : 'Weak'}
                        </span>
                      </div>
                      <span className="font-mono font-medium">
                        {formatCurrency(level.price)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No key levels identified at this time
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground text-right">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
