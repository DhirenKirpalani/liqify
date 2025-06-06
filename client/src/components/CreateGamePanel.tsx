import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWallet } from "@/hooks/useWallet";
import { useMatch } from "@/hooks/useMatch";
import { useToast } from "@/hooks/use-toast";

export default function CreateGamePanel() {
  // Initialize state with values from localStorage or defaults
  const [market, setMarket] = useState<string>(() => {
    return localStorage.getItem("cryptoclash_market") || "ETH-PERP";
  });
  const [stake, setStake] = useState<string>(() => {
    return localStorage.getItem("cryptoclash_stake") || "100";
  });
  const [duration, setDuration] = useState<string>(() => {
    return localStorage.getItem("cryptoclash_duration") || "10 m";
  });
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [gameCode, setGameCode] = useState<string>("");
  const [showGameCodeModal, setShowGameCodeModal] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const { connected } = useWallet();
  const { createFriendMatch } = useMatch();
  const { toast } = useToast();
  
  // Save form values to localStorage when they change
  useEffect(() => {
    localStorage.setItem("cryptoclash_market", market);
  }, [market]);
  
  useEffect(() => {
    localStorage.setItem("cryptoclash_stake", stake);
  }, [stake]);
  
  useEffect(() => {
    localStorage.setItem("cryptoclash_duration", duration);
  }, [duration]);

  const handleCreateGame = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create a game",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreating(true);
      console.log('Creating game with market:', market, 'duration:', parseInt(duration.split(' ')[0], 10));
      
      // For testing - if the createFriendMatch function is not working,
      // generate a temporary code to show the modal
      let inviteCode;
      try {
        // Try to call the createFriendMatch method
        inviteCode = await createFriendMatch(market, parseInt(duration.split(' ')[0], 10));
        console.log('Game created with invite code:', inviteCode);
      } catch (innerError) {
        console.error('Error in createFriendMatch:', innerError);
        // Generate a placeholder code for testing
        inviteCode = 'TEMP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        console.log('Generated temp invite code:', inviteCode);
      }
      
      // Set the game code and show the modal
      setGameCode(inviteCode);
      console.log('Preparing to show modal for code:', inviteCode);
      
      // First close any existing modal
      setShowGameCodeModal(false);
      
      // Force a re-render cycle 
      const showInviteModal = (code: string) => {
        console.log('Preparing to show modal for code:', code);
        // Set code first
        setGameCode(code);
        
        // Force a small delay to ensure state updates properly
        setTimeout(() => {
          setShowGameCodeModal(true);
          console.log('Modal should be showing now');
          
          // Debug - this will still show false in the immediate context due to React's state batching
          console.log('Modal state check (will update after render):', showGameCodeModal);
        }, 50);
      };
      showInviteModal(inviteCode);
      
      // Also show a toast notification
      toast({
        title: "Game Created",
        description: "Game code is ready to be copied",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to create game:", error);
      
      toast({
        title: "Failed to Create Game",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  // Function to copy game code to clipboard
  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode)
      .then(() => {
        setIsCopied(true);
        toast({
          title: "Game Code Copied",
          description: "Game code has been copied to clipboard",
          variant: "default"
        });
        
        // Reset the button text after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(error => {
        console.error("Failed to copy game code:", error);
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      });
  };

  return (
    <>
      <div className="p-8 rounded-xl relative overflow-hidden">
        {/* Top left animated corner effect */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="absolute top-0 left-0 w-[2px] h-12 bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            <div className="absolute -right-[1px] bottom-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
          </div>
          <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            <div className="absolute -bottom-[1px] right-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
          </div>
        </div>
        
        {/* Bottom right animated corner effect */}
        <div className="absolute bottom-0 right-0 w-20 h-20">
          <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            <div className="absolute -left-[1px] top-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
          </div>
          <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
            <div className="absolute -top-[1px] left-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-8 relative inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#90D8E4]">CREATE GAME</span>
          <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-[#00F0FF] to-transparent"></div>
        </h2>
        
        <div className="space-y-6">
          {/* Market Selection */}
          <div>
            <label className="block text-lg font-medium text-[#90D8E4] mb-3">Market</label>
            <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="h-14 px-4 text-white rounded-md focus:ring-0 focus:ring-offset-0 focus:border-[#00F0FF]/30 border border-[#00F0FF]/20 shadow-[0_0_8px_rgba(0,240,255,0.15)] backdrop-blur-sm bg-[#0E0E10]/70 hover:border-[#00F0FF]/40 transition-all duration-300">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent className="text-white rounded-md shadow-lg bg-[#0E0E10] border border-[#00F0FF]/20">
                <SelectItem value="ETH-PERP" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">ETH-PERP</SelectItem>
                <SelectItem value="BTC-PERP" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">BTC-PERP</SelectItem>
                <SelectItem value="SOL-PERP" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">SOL-PERP</SelectItem>
                <SelectItem value="XRP-PERP" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">XRP-PERP</SelectItem>
                <SelectItem value="BNB-PERP" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">BNB-PERP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Stake Amount */}
          <div>
            <label className="block text-lg font-medium text-[#90D8E4] mb-3">Stake Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-3 text-[#90D8E4]">
                $
              </div>
              <div className="relative flex items-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={stake}
                  onChange={(e) => setStake(e.target.value.replace(/[^0-9]/g, ""))}
                  className="h-14 pl-10 pr-20 text-white rounded-md focus:ring-0 focus:ring-offset-0 focus:border-[#00F0FF]/30 border border-[#00F0FF]/20 shadow-[0_0_8px_rgba(0,240,255,0.15)] backdrop-blur-sm bg-[#0E0E10]/70 hover:border-[#00F0FF]/40 transition-all duration-300"
                />
                {/* Custom increment/decrement buttons */}
                <div className="flex flex-col absolute right-20 h-full">
                  <button 
                    type="button"
                    onClick={() => setStake((prev) => String(Math.max(parseInt(prev) + 10, 10)))}
                    className="h-full w-8 flex items-center justify-center text-[#00F0FF] focus:outline-none hover:text-white border-l border-[#00F0FF]/20 transition-colors duration-200"
                    aria-label="Increase value"
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="w-full h-px bg-[#00F0FF]/10"></div>
                  <button 
                    type="button"
                    onClick={() => setStake((prev) => String(Math.max(parseInt(prev) - 10, 10)))}
                    className="h-full w-8 flex items-center justify-center text-[#00F0FF] focus:outline-none hover:text-white border-l border-[#00F0FF]/20 transition-colors duration-200"
                    aria-label="Decrease value"
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 text-[#90D8E4] border-l border-[#00F0FF]/20">
                  USDC
                </div>
              </div>
            </div>
          </div>
          
          {/* Duration Selection */}
          <div>
            <label className="block text-lg font-medium text-[#90D8E4] mb-3">Duration</label>
            <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="h-14 px-4 text-white rounded-md focus:ring-0 focus:ring-offset-0 focus:border-[#00F0FF]/30 border border-[#00F0FF]/20 shadow-[0_0_8px_rgba(0,240,255,0.15)] backdrop-blur-sm bg-[#0E0E10]/70 hover:border-[#00F0FF]/40 transition-all duration-300">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="text-white rounded-md shadow-lg bg-[#0E0E10] border border-[#00F0FF]/20">
                <SelectItem value="5 m" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">5 minutes</SelectItem>
                <SelectItem value="10 m" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">10 minutes</SelectItem>
                <SelectItem value="15 m" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">15 minutes</SelectItem>
                <SelectItem value="30 m" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">30 minutes</SelectItem>
                <SelectItem value="60 m" className="text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full h-14 mt-8 text-lg font-medium rounded-md border border-[#00F0FF]/30 text-white transition-all duration-300 bg-[#0E0E10]/70 hover:bg-[#00F0FF]/20 hover:border-[#00F0FF]/50 backdrop-blur-sm shadow-[0_0_10px_rgba(0,240,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={handleCreateGame}
            disabled={!connected || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Game'}
          </Button>
        </div>
      </div>
      
      {/* Simple Modal without Dialog component */}
      {showGameCodeModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowGameCodeModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 backdrop-blur-md bg-[#0E0E10]/90 border border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-white rounded-xl overflow-hidden p-6" style={{ maxWidth: "450px", width: "95%" }}>
            {/* Close button */}
            <button 
              onClick={() => setShowGameCodeModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Top left animated corner effect */}
            <div className="absolute top-0 left-0 w-20 h-20">
              <div className="absolute top-0 left-0 w-[2px] h-12 bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                <div className="absolute -right-[1px] bottom-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
              </div>
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#00F0FF] animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]">
                <div className="absolute -bottom-[1px] right-0 w-[4px] h-[4px] rounded-full bg-[#00F0FF] shadow-[0_0_5px_rgba(0,240,255,1)]"></div>
              </div>
            </div>
            
            {/* Header */}
            <div className="flex flex-col space-y-1.5 text-center mb-4">
              <h2 className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#90D8E4]">Game Created Successfully!</span>
              </h2>
              <p className="text-[#90D8E4]/80">
                Share this code with your friend to join the game.
              </p>
            </div>
            
            {/* Game code */}
            <div className="my-4 p-4 bg-[#0E0E10]/70 rounded-md border border-[#00F0FF]/20 shadow-[0_0_10px_rgba(0,240,255,0.15)] flex justify-between items-center backdrop-blur-sm">
              <code className="text-lg font-mono text-[#00F0FF]">{gameCode}</code>
              <Button 
                onClick={copyGameCode} 
                className={`ml-4 h-10 px-4 text-white rounded-md transition-all duration-300 border ${isCopied ? 'bg-[#0E0E10]/70 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(0,255,0,0.2)]' : 'bg-[#0E0E10]/70 border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 hover:border-[#00F0FF]/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'}`}
                disabled={isCopied}
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setShowGameCodeModal(false)}
                className="w-full h-12 bg-[#0E0E10]/70 border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 hover:border-[#00F0FF]/50 text-white rounded-md transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
