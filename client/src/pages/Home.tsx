import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import WalletConnectModal from "@/components/WalletConnectModal";
import ConnectedWalletBanner from "@/components/ConnectedWalletBanner";
import MatchQueue from "@/components/MatchQueue";
import LiveMatches from "@/components/LiveMatches";
import PostMatchSummary from "@/components/PostMatchSummary";
import { useWallet } from "@/hooks/useWallet";
import { useMatch } from "@/hooks/useMatch";
import BinanceMarketList from "@/components/BinanceMarketData";

export default function Home() {
  const { connected } = useWallet();
  const { activeMatch, matchEnded } = useMatch();
  const [showModal, setShowModal] = useState(false);
  const [, setLocation] = useLocation();
  
  // Redirect to match page when an active match is found
  useEffect(() => {
    console.log('Home component - checking match status:', { activeMatch: !!activeMatch, matchEnded });
    if (activeMatch && !matchEnded) {
      console.log('Home component - redirecting to match page from useEffect');
      // Use direct window.location for more forceful navigation if needed
      window.location.href = '/match';
    }
  }, [activeMatch, matchEnded]);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 max-w-7xl">
      {/* Wallet Connect Modal */}
      <WalletConnectModal show={showModal} onClose={() => setShowModal(false)} />

      {/* Connected Wallet Banner */}
      {connected && <ConnectedWalletBanner />}

      {matchEnded ? (
        // Show post-match summary if the match has ended
        <PostMatchSummary />
      ) : (
        // Show normal home page content when not in a match
        <>
          {/* Match Queue Section */}
          <MatchQueue />

          {/* Live Matches Section */}
          <LiveMatches />
        </>
      )}

      {/* Post Match Summary */}
      {matchEnded && <PostMatchSummary />}
      <div className="App">
        <BinanceMarketList />  {/* Render the component */}
      </div>
    </div>
  );
}
