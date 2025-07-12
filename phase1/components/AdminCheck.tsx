"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Replace with your actual wallet hook
// This is a placeholder - you'll need to adjust based on your wallet integration
const useWallet = () => {
  // This is a mock - replace with your actual wallet hook implementation
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  // This should come from your actual wallet connection
  useEffect(() => {
    // For now we're just returning dummy values
    // In a real app, this would interact with your wallet provider
    const connected = localStorage.getItem('walletConnected') === 'true';
    const publicKey = localStorage.getItem('walletPublicKey');
    
    if (connected && publicKey) {
      setConnected(true);
      setWallet({ publicKey: { toString: () => publicKey } });
    }
  }, []);

  return { wallet, connected };
};

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { wallet, connected } = useWallet();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAdmin = async () => {
      if (!connected || !wallet?.publicKey) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const response = await fetch('/api/check-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: wallet.publicKey.toString() })
        });
        
        if (!response.ok) throw new Error('Failed to verify admin status');
        const { isAdmin } = await response.json();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error('Admin verification error:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [wallet, connected]);
  
  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }
  
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-electric-purple">Admin Access Required</h1>
        <p className="text-gray-400 mb-6">Please connect your wallet to continue</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Access Denied</h1>
        <p className="text-gray-400 mb-2">This wallet does not have admin privileges</p>
        <p className="text-gray-500 text-sm">
          Wallet: {wallet.publicKey.toString().slice(0, 6)}...{wallet.publicKey.toString().slice(-4)}
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
}
