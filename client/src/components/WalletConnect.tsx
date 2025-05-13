import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import WalletConnectModal from "@/components/WalletConnectModal";

export default function WalletConnect() {
  const [showModal, setShowModal] = useState(false);
  const { connected, address, connect } = useWallet();

  const handleOpenModal = () => {
    if (!connected) {
      setShowModal(true);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <>
      <Button 
        variant="outline" 
        className={connected ? "border-accent-secondary text-accent-secondary" : "border-accent-secondary bg-accent-secondary/20 text-accent-secondary"}
        onClick={handleOpenModal}
      >
        <i className="ri-wallet-3-line mr-2"></i>
        {connected ? formatAddress(address) : "Connect Phantom"}
      </Button>
      
      <WalletConnectModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onConnect={connect}
      />
    </>
  );
}
