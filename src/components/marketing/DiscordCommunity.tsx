
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code } from 'lucide-react';

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
              <div className="bg-gray-900/60 p-5 rounded-lg border border-[#5865F2]/30 shadow-lg font-mono w-full max-w-xs">
                <div className="flex items-center gap-2 border-b border-[#5865F2]/30 pb-3 mb-4">
                  <Code className="h-5 w-5 text-[#5865F2]" />
                  <span className="text-[#5865F2] font-semibold">Discord Invite</span>
                </div>
                <div className="text-center space-y-3">
                  <p className="text-white/90 font-bold">ProfitPilotAI</p>
                  <pre className="text-sm bg-black/40 py-3 px-4 rounded border border-[#5865F2]/20 text-green-400 overflow-x-auto font-mono">
                    discord.gg/ProfitPilotAI
                  </pre>
                  <p className="text-xs text-gray-400">Join our trading community</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscordCommunity;
