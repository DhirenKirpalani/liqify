import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WalletConnectModalProps {
  show: boolean;
  onClose: () => void;
  onConnect?: () => Promise<void>;
}

export default function WalletConnectModal({ show, onClose, onConnect }: WalletConnectModalProps) {
  const handleConnect = async () => {
    if (onConnect) {
      try {
        await onConnect();
        onClose();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="gradient-card rounded-xl p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-manrope">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Connect your Phantom wallet to start trading and competing in matches.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 border border-neutral/20 rounded-lg mb-6 hover:border-accent-primary/50 transition-colors cursor-pointer" onClick={handleConnect}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#AB9FF2] flex items-center justify-center mr-4">
              <img src="https://phantom.app/favicon.ico" alt="Phantom" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium">Phantom</h3>
              <p className="text-sm text-text-secondary">Connect to your Phantom wallet</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border border-neutral/20 rounded-lg mb-6 hover:border-accent-primary/50 transition-colors cursor-pointer opacity-50">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#3396FF]/20 flex items-center justify-center mr-4">
              <i className="ri-wallet-3-line text-[#3396FF] text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium">WalletConnect</h3>
              <p className="text-sm text-text-secondary">Coming soon</p>
            </div>
          </div>
        </div>
        
        <Button className="w-full py-3 px-4 bg-accent-primary text-bg-primary rounded-lg font-medium glow-button" onClick={handleConnect}>
          Connect Wallet
        </Button>
        
        <p className="text-xs text-center text-text-secondary mt-4">By connecting, you agree to our Terms of Service</p>
      </DialogContent>
    </Dialog>
  );
}
