import { useState } from "react";
import WalletConnectModal from "@/components/WalletConnectModal";
import ConnectedWalletBanner from "@/components/ConnectedWalletBanner";
import MatchQueue from "@/components/MatchQueue";
import LiveMatches from "@/components/LiveMatches";
import MatchDashboard from "@/components/MatchDashboard";
import PostMatchSummary from "@/components/PostMatchSummary";
import { useWallet } from "@/hooks/useWallet";
import { useMatch } from "@/hooks/useMatch";

export default function Home() {
  const { connected } = useWallet();
  const { activeMatch, matchEnded } = useMatch();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mx-auto px-4 lg:px-6 py-4 max-w-7xl">
      {/* Wallet Connect Modal */}
      <WalletConnectModal show={showModal} onClose={() => setShowModal(false)} />
      
      {/* Connected Wallet Banner */}
      {connected && <ConnectedWalletBanner />}
      
      {/* Show match dashboard if in active match */}
      {activeMatch && !matchEnded ? (
        <MatchDashboard />
      ) : (
        <>
          {/* Match Queue Section */}
          <MatchQueue />
          
          {/* Live Matches Section */}
          <LiveMatches />
        </>
      )}
      
      {/* Post Match Summary */}
      {matchEnded && <PostMatchSummary />}
    </div>
  );
}
