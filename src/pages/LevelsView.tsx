
import React from 'react';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import PriceChart from '@/components/charts/PriceChart';
import { useSupportResistance } from '@/hooks/useSupportResistance';

const LevelsView = () => {
  const { levels } = useSupportResistance();
  
  return (
    <div className="space-y-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Support & Resistance</h1>
          <p className="text-muted-foreground">
            Key price levels and market structure
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="w-full overflow-hidden rounded-lg border border-border">
            <PriceChart showLevels={true} levels={levels} />
          </div>
        </div>
        
        <div>
          <SupportResistanceLevels />
        </div>
      </div>
    </div>
  );
};

export default LevelsView;
