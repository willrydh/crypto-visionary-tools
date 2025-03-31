
import React from 'react';
import { SupportResistanceLevels } from '@/components/support-resistance/SupportResistanceLevels';
import PriceChart from '@/components/PriceChart';
import { useSupportResistance } from '@/hooks/useSupportResistance';

const LevelsView = () => {
  const { levels } = useSupportResistance();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Support & Resistance</h1>
        <p className="text-muted-foreground">
          Key price levels and market structure
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <PriceChart showLevels={true} levels={levels} />
        </div>
        
        <div>
          <SupportResistanceLevels />
        </div>
      </div>
    </div>
  );
};

export default LevelsView;
