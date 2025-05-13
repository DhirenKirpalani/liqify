// Interface for Phantom wallet
interface PhantomProvider {
  isPhantom?: boolean;
  connect: ({ onlyIfTrusted }: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  isConnected: boolean;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction: (transaction: any) => Promise<any>;
  signAllTransactions: (transactions: any[]) => Promise<any[]>;
}

// Get the Phantom provider from window
const getProvider = (): PhantomProvider | null => {
  if (typeof window !== "undefined" && "solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

// Create wallet adapter class - this doesn't use hooks
export class WalletAdapter {
  provider: PhantomProvider | null;
  connected: boolean;
  address: string | null;

  constructor() {
    this.provider = getProvider();
    this.connected = this.provider?.isConnected || false;
    this.address = null;
  }

  connect = async (): Promise<string | null> => {
    if (!this.provider) {
      console.error("Phantom wallet not found");
      throw new Error("Phantom wallet not found");
    }
    
    try {
      // In development environment, simulate a connection
      if (typeof window !== 'undefined' && !(window as any).solana) {
        this.connected = true;
        this.address = "SimulatedWallet" + Math.floor(Math.random() * 10000);
        return this.address;
      }
      
      const response = await this.provider.connect({ onlyIfTrusted: false });
      this.address = response.publicKey.toString();
      this.connected = true;
      return this.address;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    }
  };
  
  disconnect = async (): Promise<void> => {
    if (!this.provider) return;
    
    try {
      await this.provider.disconnect();
      this.address = null;
      this.connected = false;
    } catch (error) {
      console.error("Error disconnecting from wallet:", error);
      throw error;
    }
  };
  
  signMessage = async (message: string): Promise<Uint8Array> => {
    if (!this.provider || !this.address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await this.provider.signMessage(encodedMessage);
      return signedMessage.signature;
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  };
  
  getBalance = async (): Promise<{ sol: number, arena: number }> => {
    if (!this.address) return { sol: 0, arena: 0 };
    
    try {
      // This is where you would make a real request to the Solana RPC
      // For now, return mock data
      return {
        sol: 2.45,
        arena: 750,
      };
    } catch (error) {
      console.error("Error fetching balance:", error);
      return { sol: 0, arena: 0 };
    }
  };
}

// Create a singleton instance
export const walletAdapter = new WalletAdapter();
