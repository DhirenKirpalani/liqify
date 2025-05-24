import { useState, useEffect } from 'react';
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
      
      // Call the createFriendMatch method
      const inviteCode = await createFriendMatch(market, parseInt(duration.split(' ')[0], 10));
      console.log('Game created with invite code:', inviteCode);
      
      // Set the game code and show the modal
      setGameCode(inviteCode);
      setShowGameCodeModal(true);
      
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
      <div className="p-8 rounded-xl border border-neutral/10" style={{ backgroundColor: "#000E33" }}>
        <h2 className="text-2xl font-bold mb-8 text-white">CREATE GAME</h2>
        
        <div className="space-y-6">
          {/* Market Selection */}
          <div>
            <label className="block text-lg font-medium text-text-secondary mb-3">Market</label>
            <Select value={market} onValueChange={setMarket}>
              <SelectTrigger className="h-14 px-4 text-white rounded-md focus:ring-0 focus:ring-offset-0 focus:border-neutral/20" style={{ backgroundColor: "#001440", borderColor: "rgba(255,255,255,0.1)" }}>
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent className="text-white rounded-md shadow-lg" style={{ backgroundColor: "#001440", borderColor: "rgba(255,255,255,0.1)" }}>
                <SelectItem value="ETH-PERP" className="text-white hover:bg-bg-darker py-3">ETH-PERP</SelectItem>
                <SelectItem value="BTC-PERP" className="text-white hover:bg-bg-darker py-3">BTC-PERP</SelectItem>
                <SelectItem value="SOL-PERP" className="text-white hover:bg-bg-darker py-3">SOL-PERP</SelectItem>
                <SelectItem value="AVAX-PERP" className="text-white hover:bg-bg-darker py-3">AVAX-PERP</SelectItem>
                <SelectItem value="DOGE-PERP" className="text-white hover:bg-bg-darker py-3">DOGE-PERP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Stake Amount */}
          <div>
            <label className="block text-lg font-medium text-text-secondary mb-3">Stake</label>
            <div className="relative flex items-center">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={stake}
                  onChange={(e) => {
                    // Only allow numeric values (no spaces, letters, or special characters)
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value === '') {
                      setStake('0');
                    } else {
                      // Remove leading zeros
                      setStake(value.replace(/^0+(?=\d)/, ''));
                    }
                  }}
                  onBlur={(e) => {
                    // Format properly on blur (e.g., remove leading zeros)
                    const numValue = parseFloat(stake);
                    if (!isNaN(numValue)) {
                      setStake(numValue.toString());
                    } else {
                      setStake('0');
                    }
                  }}
                  className="h-14 px-4 text-white pr-20 rounded-md focus:ring-0 focus:ring-offset-0 focus:border-neutral/20"
                  style={{
                    backgroundColor: "#001440", 
                    borderColor: "rgba(255,255,255,0.1)",
                    /* Hide the default number input arrows */
                    WebkitAppearance: "none",
                    MozAppearance: "textfield"
                  }}
                />
              </div>
              
              {/* Custom increment/decrement buttons */}
              <div className="flex flex-col absolute right-20 h-full">
                <button 
                  type="button"
                  onClick={() => {
                    const currentValue = parseInt(stake, 10) || 0;
                    setStake((currentValue + 10).toString());
                  }}
                  className="flex-1 flex items-center justify-center w-10 border-l border-neutral/10 hover:bg-[#052975] active:bg-[#0A3A8F] transition-colors text-blue-300"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  aria-label="Increase value"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <div className="w-full h-px bg-neutral/5" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}></div>
                <button 
                  type="button"
                  onClick={() => {
                    const currentValue = parseInt(stake, 10) || 0;
                    setStake(Math.max(0, currentValue - 10).toString());
                  }}
                  className="flex-1 flex items-center justify-center w-10 border-l border-neutral/10 hover:bg-[#052975] active:bg-[#0A3A8F] transition-colors text-blue-300"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  aria-label="Decrease value"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary border-l border-neutral/10" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                USDC
              </div>
            </div>
          </div>
          
          {/* Duration Selection */}
          <div>
            <label className="block text-lg font-medium text-text-secondary mb-3">Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-14 px-4 text-white rounded-md focus:ring-0 focus:ring-offset-0 focus:border-neutral/20" style={{ backgroundColor: "#001440", borderColor: "rgba(255,255,255,0.1)" }}>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="text-white rounded-md shadow-lg" style={{ backgroundColor: "#001440", borderColor: "rgba(255,255,255,0.1)" }}>
                <SelectItem value="5 m" className="text-white hover:bg-bg-darker py-3">5 minutes</SelectItem>
                <SelectItem value="10 m" className="text-white hover:bg-bg-darker py-3">10 minutes</SelectItem>
                <SelectItem value="15 m" className="text-white hover:bg-bg-darker py-3">15 minutes</SelectItem>
                <SelectItem value="30 m" className="text-white hover:bg-bg-darker py-3">30 minutes</SelectItem>
                <SelectItem value="60 m" className="text-white hover:bg-bg-darker py-3">1 hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full h-14 mt-8 text-lg font-medium rounded-md border-none text-white transition-colors duration-200 hover:bg-[#0A3A8F]" 
            onClick={handleCreateGame}
            disabled={!connected || isCreating}
            style={{ 
              backgroundColor: "#052975", 
              boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
            }}
          >
            {isCreating ? 'Creating...' : 'Create Game'}
          </Button>
        </div>
      </div>
      
      {/* Game Code Modal */}
      <Dialog open={showGameCodeModal} onOpenChange={setShowGameCodeModal}>
        <DialogContent className="bg-[#001440] border-neutral/20 text-white" style={{ maxWidth: "450px" }}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Game Created Successfully!</DialogTitle>
            <DialogDescription className="text-text-secondary">
              Share this code with your friend to join the game.
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-4 p-4 bg-[#000E33] rounded-md border border-neutral/20 flex justify-between items-center">
            <code className="text-lg font-mono text-accent-primary">{gameCode}</code>
            <Button 
              onClick={copyGameCode} 
              className={`ml-4 h-10 px-4 text-white rounded-md transition-colors duration-200 ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#052975] hover:bg-[#0A3A8F]'}`}
              disabled={isCopied}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <DialogFooter>
            <Button
              onClick={() => setShowGameCodeModal(false)}
              className="w-full h-12 bg-[#052975] hover:bg-[#0A3A8F] text-white rounded-md"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
