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

export default function Home() {
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
    <div className="min-h-screen bg-bg-darkest text-white">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-screen-xl">
        {/* Wallet Connect Modal */}
        <WalletConnectModal show={showModal} onClose={() => setShowModal(false)} />

        {matchEnded ? (
          // Show post-match summary if the match has ended
          <PostMatchSummary />
        ) : (
          // Main Layout
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Create Game */}
            <div className="md:col-span-1">
              <CreateGamePanel />
              
              {/* Games Section */}
              <div className="mt-6 p-6 bg-bg-darker rounded-xl border border-neutral/10">
                <h2 className="text-2xl font-bold mb-4 text-white">GAMES</h2>
                <div className="space-y-1">
                  {activeGames.map((game) => (
                    <GameItem 
                      key={game.id}
                      id={game.id}
                      player1={game.player1}
                      player2={game.player2}
                      isActive={game.isActive}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Middle & Right Columns - Chart and Market Data */}
            <div className="md:col-span-2 space-y-6">
              {/* Trading Chart with Market Selection */}
              <TradingChart market={marketParam} />
              
              {/* Market Table */}
              <MarketTable />
              
              {/* Leaderboard Preview */}
              <LeaderboardPreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
