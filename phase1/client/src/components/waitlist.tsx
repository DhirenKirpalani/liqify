import React, { useState } from 'react';
import { useWallet } from '@/components/wallet-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Bell } from 'lucide-react';

export function Waitlist() {
  const { connected, connect } = useWallet();
  const { toast } = useToast();
  const [discordUsername, setDiscordUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifyMe = async () => {
    if (!connected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate waitlist registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "You're on the list!",
        description: "We'll notify you when new challenges launch.",
      });
      
      setDiscordUsername('');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 bg-dark-bg">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-8 gradient-text-primary">
          Summon Your Spot
        </h2>
        <p className="text-xl text-gray-300 mb-12">
          Be the first to know when the next arena opens. Join our elite waitlist.
        </p>

        <div className="max-w-md mx-auto gaming-card rounded-xl p-8">
          <div className="mb-6">
            <Button
              onClick={connect}
              disabled={connected}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                connected ? 'bg-green-600' : 'gaming-button'
              }`}
            >
              <Wallet className="mr-2 h-5 w-5" />
              {connected ? 'Wallet Connected' : 'Connect Wallet'}
            </Button>
          </div>

          <div className="mb-6">
            <Label className="block text-sm font-semibold mb-2 text-left">
              Discord Username (Optional)
            </Label>
            <Input
              type="text"
              value={discordUsername}
              onChange={(e) => setDiscordUsername(e.target.value)}
              placeholder="@username#1234"
              className="w-full bg-dark-bg border-dark-border focus:border-electric-purple"
            />
          </div>

          <Button
            onClick={handleNotifyMe}
            disabled={!connected || isSubmitting}
            className="w-full gaming-button py-4 rounded-lg text-lg font-bold"
          >
            <Bell className="mr-2 h-5 w-5" />
            {isSubmitting ? 'Adding to List...' : 'Notify Me'}
          </Button>

          <p className="text-xs text-gray-500 mt-4">
            We'll notify you via wallet or Discord when new challenges launch.
          </p>
        </div>
      </div>
    </section>
  );
}
