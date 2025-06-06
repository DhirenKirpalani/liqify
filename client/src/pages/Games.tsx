import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
// NavBar is rendered at the App level
import WalletConnectModal from "@/components/WalletConnectModal";
import CreateGamePanel from "@/components/CreateGamePanel";
import TradingChart from "@/components/TradingChart";
import MarketTable from "@/components/MarketTable";
import LeaderboardPreview from "@/components/LeaderboardPreview";
import GameItem from "@/components/GameItem";
import PostMatchSummary from "@/components/PostMatchSummary";
import { useWallet } from "@/hooks/useWallet";
import { useMatch } from "@/hooks/useMatch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Join with Code component for joining games with a unique code
function JoinWithCode() {
  const [gameCode, setGameCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  
  const handleJoinGame = () => {
    if (!gameCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid game code"
      });
      return;
    }
    
    setIsJoining(true);
    
    // Simulate API call to join game
    setTimeout(() => {
      // This would be replaced with an actual API call in production
      const successfulJoin = Math.random() > 0.3; // 70% chance of success for demo purposes
      
      if (successfulJoin) {
        toast({
          title: "Success!",
          description: "Successfully joined game!",
          className: "bg-[#05d6a9]/20 border-[#05d6a9] text-white"
        });
        // In a real app, this would redirect to the game
        // window.location.href = `/match?code=${gameCode}`;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid game code or game no longer available"
        });
      }
      
      setIsJoining(false);
      setGameCode('');
    }, 1500);
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#F2F2F2]/80">
        Have a game code? Enter it below to join an existing game.
      </p>
      
      <div className="flex gap-3 flex-col sm:flex-row">
        <Input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          className="flex-grow bg-[#0E0E10]/70 border-[#05d6a9]/30 focus:border-[#05d6a9] text-[#F2F2F2] placeholder:text-[#F2F2F2]/50"
        />
        <Button 
          onClick={handleJoinGame}
          disabled={isJoining || !gameCode.trim()}
          className="bg-[#05d6a9] hover:bg-[#05d6a9]/80 text-black font-medium transition-all duration-200"
        >
          {isJoining ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
              Joining...
            </>
          ) : 'Join Game'}
        </Button>
      </div>
    </div>
  );
}

export default function Games() {
  const { connected } = useWallet();
  const { activeMatch, matchEnded } = useMatch();
  const [showModal, setShowModal] = useState(false);
  const [, setLocation] = useLocation();
  
  // Parse URL parameters for market selection
  const [, params] = useRoute('/:path*');
  const urlParams = new URLSearchParams(window.location.search);
  const marketParam = urlParams.get('market') || 'BTC-PERP';
  const timeframeParam = urlParams.get('timeframe') || '1h';
  
  // Sample active games data
  const activeGames = [
    { id: "1", player1: "Alice", player2: "Bob", isActive: true },
    { id: "2", player1: "Carol", player2: "David", isActive: true },
    { id: "3", player1: "Emma", player2: "Frank", isActive: true },
  ];
  
  // Redirect to match page when an active match is found
  useEffect(() => {
    if (activeMatch && !matchEnded) {
      window.location.href = '/match';
    }
  }, [activeMatch, matchEnded]);

  return (
    <div className="text-[#F2F2F2] mt-2 overflow-visible">
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-3 pb-6 max-w-screen-xl relative z-10">
        {/* Wallet Connect Modal */}
        <WalletConnectModal show={showModal} onClose={() => setShowModal(false)} />

        {matchEnded ? (
          // Show post-match summary if the match has ended
          <PostMatchSummary />
        ) : (
          // Main Layout
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Create Game */}
            <div className="md:col-span-1">
              <div className="backdrop-blur-md bg-[#0E0E10]/40 rounded-xl border border-[#00F0FF]/20 shadow-[0_0_15px_rgba(0,240,255,0.15)] overflow-hidden relative p-1">
                <CreateGamePanel />
              </div>
              
              {/* Join with Code Section */}
              <div className="mt-4 backdrop-blur-md bg-[#0E0E10]/40 rounded-xl border border-[#05d6a9]/30 p-6 shadow-[0_0_20px_rgba(5,214,169,0.15)] overflow-hidden relative">
                {/* Animated corner effect */}
                <div className="absolute bottom-0 right-0 w-20 h-20">
                  <div className="absolute bottom-0 right-0 w-[2px] h-12 bg-[#05d6a9] animate-pulse shadow-[0_0_8px_rgba(5,214,169,0.8)]">
                    <div className="absolute -left-[1px] top-0 w-[4px] h-[4px] rounded-full bg-[#05d6a9] shadow-[0_0_5px_rgba(5,214,169,1)]"></div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 h-[2px] bg-[#05d6a9] animate-pulse shadow-[0_0_8px_rgba(5,214,169,0.8)]">
                    <div className="absolute -top-[1px] left-0 w-[4px] h-[4px] rounded-full bg-[#05d6a9] shadow-[0_0_5px_rgba(5,214,169,1)]"></div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-4 relative inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#05d6a9] to-[#04eac2]">JOIN WITH CODE</span>
                  <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-[#05d6a9] to-transparent"></div>
                </h2>
                
                <JoinWithCode />
              </div>
              
              {/* Games Section */}
              <div className="mt-8 backdrop-blur-md bg-[#0E0E10]/50 rounded-xl border border-[#CC33FF]/30 p-6 shadow-[0_0_20px_rgba(204,51,255,0.15)] overflow-hidden relative">
                {/* Animated corner effect */}
                <div className="absolute bottom-0 left-0 w-20 h-20">
                  <div className="absolute bottom-0 left-0 w-[2px] h-12 bg-[#CC33FF] animate-pulse shadow-[0_0_8px_rgba(204,51,255,0.8)]">
                    <div className="absolute -right-[1px] top-0 w-[4px] h-[4px] rounded-full bg-[#CC33FF] shadow-[0_0_5px_rgba(204,51,255,1)]"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-[#CC33FF] animate-pulse shadow-[0_0_8px_rgba(204,51,255,0.8)]">
                    <div className="absolute -top-[1px] right-0 w-[4px] h-[4px] rounded-full bg-[#CC33FF] shadow-[0_0_5px_rgba(204,51,255,1)]"></div>
                  </div>
                </div>
                
                {/* Top right accent */}
                <div className="absolute top-0 right-0 w-20 h-20">
                  <div className="absolute top-0 right-0 w-[2px] h-12 bg-[#CC33FF] animate-pulse shadow-[0_0_8px_rgba(204,51,255,0.8)]">
                    <div className="absolute -left-[1px] bottom-0 w-[4px] h-[4px] rounded-full bg-[#CC33FF] shadow-[0_0_5px_rgba(204,51,255,1)]"></div>
                  </div>
                  <div className="absolute top-0 right-0 w-12 h-[2px] bg-[#CC33FF] animate-pulse shadow-[0_0_8px_rgba(204,51,255,0.8)]">
                    <div className="absolute -bottom-[1px] left-0 w-[4px] h-[4px] rounded-full bg-[#CC33FF] shadow-[0_0_5px_rgba(204,51,255,1)]"></div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-6 relative inline-block">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#90D8E4]">GAMES</span>
                  <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-[#00F0FF] to-transparent"></div>
                </h2>
                
                <div className="space-y-3">
                  {activeGames.map((game) => (
                    <div key={game.id} className="backdrop-blur-sm bg-[#FFFFFF]/5 rounded-lg p-3 border border-[#FFFFFF]/10 hover:border-[#00F0FF]/30 transition-all duration-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                      <GameItem 
                        id={game.id}
                        player1={game.player1}
                        player2={game.player2}
                        isActive={game.isActive}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Middle & Right Columns - Chart and Market Data */}
            <div className="md:col-span-2 space-y-8">
              {/* Trading Chart with Market Selection */}
              <div className="backdrop-blur-md bg-[#0E0E10]/30 rounded-xl border border-[#90D8E4]/20 shadow-[0_0_15px_rgba(144,216,228,0.15)] overflow-hidden relative p-1">
                <div className="absolute top-0 right-0 w-24 h-24">
                  <div className="absolute top-0 right-0 w-[2px] h-12 bg-[#90D8E4] shadow-[0_0_8px_rgba(144,216,228,0.6)]"></div>
                  <div className="absolute top-0 right-0 w-12 h-[2px] bg-[#90D8E4] shadow-[0_0_8px_rgba(144,216,228,0.6)]"></div>
                </div>
                <TradingChart market={marketParam} />
              </div>
              
              {/* Market Table */}
              <div className="backdrop-blur-md bg-[#0E0E10]/40 rounded-xl border border-[#FFCC00]/20 shadow-[0_0_15px_rgba(255,204,0,0.1)] overflow-hidden relative p-1">
                <div className="absolute bottom-0 left-0 w-24 h-24">
                  <div className="absolute bottom-0 left-0 w-[2px] h-12 bg-[#FFCC00] shadow-[0_0_8px_rgba(255,204,0,0.6)]"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-[2px] bg-[#FFCC00] shadow-[0_0_8px_rgba(255,204,0,0.6)]"></div>
                </div>
                <MarketTable />
              </div>
              
              {/* Leaderboard Preview */}
              <div id="leaderboard-section" className="backdrop-blur-md bg-[#0E0E10]/40 rounded-xl border border-[#FF6600]/20 shadow-[0_0_15px_rgba(255,102,0,0.1)] overflow-hidden relative p-1">
                <div className="absolute top-0 left-0 w-24 h-24">
                  <div className="absolute top-0 left-0 w-[2px] h-12 bg-[#FF6600] shadow-[0_0_8px_rgba(255,102,0,0.6)]"></div>
                  <div className="absolute top-0 left-0 w-12 h-[2px] bg-[#FF6600] shadow-[0_0_8px_rgba(255,102,0,0.6)]"></div>
                </div>
                <LeaderboardPreview />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
