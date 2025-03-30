
import React from 'react';
import { Apple, Monitor } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const PlatformsAvailability = () => {
  return (
    <div className="py-12 px-4 md:px-6 bg-muted/50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Available on All Your Devices</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay connected to the markets with ProfitPilot on iOS and macOS.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Apple className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">ProfitPilot for iOS</h3>
            <p className="mb-6 text-muted-foreground">
              Take your trading on the go with our powerful iOS app. Get real-time alerts and monitor your positions from anywhere.
            </p>
            <Button className="w-full">
              Download for iOS
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Monitor className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">ProfitPilot for Mac</h3>
            <p className="mb-6 text-muted-foreground">
              Experience the full power of ProfitPilot on your desktop with our advanced macOS application.
            </p>
            <Button className="w-full">
              Download for Mac
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlatformsAvailability;
