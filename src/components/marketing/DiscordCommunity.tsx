
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DiscordCommunity = () => {
  return (
    <div className="py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden bg-[#5865F2]/10 border-[#5865F2]/20">
          <CardHeader className="text-center">
            <CardTitle className="text-xl md:text-2xl">Join the VIP Discord Community</CardTitle>
          </CardHeader>
          
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="flex flex-col justify-center space-y-4">
              <p className="text-muted-foreground">
                Connect with fellow traders, receive exclusive signals, and get priority support in our VIP Discord channel - ProfitPilotAI.
              </p>
              <ul className="space-y-2">
                {[
                  "Daily trading ideas from professional traders",
                  "Live market discussions during key events",
                  "Early access to new features and updates",
                  "Priority support from our team"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4">
                Join VIP Community
              </Button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="aspect-square w-48 h-48 bg-[#5865F2] flex items-center justify-center text-white">
                  {/* This is a placeholder for a QR code - in a real app, you'd use an actual QR code image */}
                  <div className="text-center">
                    <div className="mb-2 font-bold">ProfitPilotAI</div>
                    <div className="border-2 border-white w-32 h-32 mx-auto grid grid-cols-4 grid-rows-4 p-2">
                      {/* Simplified QR code pattern */}
                      {Array(16).fill(0).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs mt-2 text-gray-500">Scan to join ProfitPilotAI</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscordCommunity;
