import { useState, useEffect } from 'react';
import { useWallet } from '../components/wallet-provider';

export function useAdminStatus() {
  const { connected, publicKey } = useWallet();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!connected || !publicKey) {
        setIsAdmin(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/check-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ wallet: publicKey }),
        });

        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [connected, publicKey]);

  return { isAdmin, loading };
}
