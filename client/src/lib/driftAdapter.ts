import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useWallet } from "@/hooks/useWallet";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { 
  DriftClient, 
  initialize, 
  BulkAccountLoader, 
  getUserAccountPublicKey,
  convertToNumber,
  PositionDirection,
  QUOTE_PRECISION
} from "@drift-labs/sdk";
import { BN } from "@project-serum/anchor";

// Type definitions for Drift SDK handling
type DriftClientInstance = {
  getUserAccount: () => Promise<any>;
  getPerpMarketAccount: (marketIndex: number) => any;
  unsubscribe: () => void;
  subscribe: () => Promise<void>;
};

// Position type
export type Position = {
  id: string;
  market: string;
  direction: 'long' | 'short';
  size: number;
  leverage: number;
  entryPrice: number;
  liquidationPrice: number;
  pnl: number;
  pnlUsd: number;
};

// Order type
export type OrderParams = {
  market: string;
  direction: 'long' | 'short';
  amount: number;
  leverage: number;
};

// Available trading pairs
export const TRADING_PAIRS = [
  'SOL/USDT',
  'SOL/USDC',
  'BTC/USDC',
  'ETH/USDC'
];

// Market mapping between our market notation and Drift's
// Using fixed market indices for Devnet
const MARKET_MAP: Record<string, number> = {
  'SOL/USDT': 1, // Mapping to SOL market index on Devnet
  'SOL/USDC': 1, // Same as SOL/USDT since USDT and USDC are treated the same on Drift
  'BTC/USDC': 0, // Mapping to BTC market index on Devnet
  'ETH/USDC': 2  // Mapping to ETH market index on Devnet
};

// Devnet RPC endpoint
const SOLANA_RPC_URL = 'https://api.devnet.solana.com';

// Drift Protocol adapter
export const useDrift = () => {
  const { connected, address } = useWallet();
  const [driftClient, setDriftClient] = useState<DriftClient | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Drift client
  const initializeDrift = useCallback(async () => {
    if (!connected || !address) return;
    
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll use server API instead of actual Drift client
      // In a real implementation with working wallet, we would initialize the Drift client
      
      console.log("Wallet connected:", address);
      
      // Mock a successful initialization
      setTimeout(() => {
        setIsInitialized(true);
        setIsLoading(false);
      }, 500);
      
      // We won't fetch initial positions here since we're using server API
      
    } catch (error) {
      console.error("Failed to initialize Drift client:", error);
      setIsLoading(false);
    }
  }, [connected, address]);
  
  // Clean up Drift client on unmount
  useEffect(() => {
    return () => {
      if (driftClient) {
        driftClient.unsubscribe();
      }
    };
  }, [driftClient]);
  
  // Initialize Drift client when wallet is connected
  useEffect(() => {
    if (connected && address && !isInitialized && !isLoading) {
      initializeDrift();
    }
  }, [connected, address, isInitialized, isLoading, initializeDrift]);
  
  // Fetch user positions
  const fetchPositions = async (_client: any = null) => {
    if (!connected || !address) return [];
    
    try {
      // Since we're relying on server-side data, we'll fetch positions from the API
      const response = await apiRequest('GET', `/api/drift/positions?address=${address}`, undefined);
      let positions: Position[] = [];
      
      try {
        positions = await response.json();
      } catch (error) {
        // If the endpoint doesn't exist yet, use an empty array
        positions = [];
      }
      
      setPositions(positions);
      return positions;
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      return [];
    }
  };
  
  // Place an order on Drift
  const placeOrder = async (params: OrderParams): Promise<Position | null> => {
    if (!connected || !address) {
      throw new Error("Wallet not connected");
    }
    
    const { market, direction, amount, leverage } = params;
    
    try {
      // Send the order to our server-side API
      const orderParams = {
        address,
        market,
        direction,
        amount,
        leverage
      };
      
      const response = await apiRequest('POST', '/api/drift/order', orderParams);
      const newPosition = await response.json();
      
      // Update positions
      await fetchPositions();
      
      return newPosition;
    } catch (error) {
      console.error("Failed to place order:", error);
      throw error;
    }
  };
  
  // Close position
  const closePosition = async (positionId: string): Promise<void> => {
    if (!connected || !address) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Send the close request to our server-side API
      const closeParams = {
        address,
        positionId
      };
      
      await apiRequest('POST', '/api/drift/close', closeParams);
      
      // Update positions
      await fetchPositions();
    } catch (error) {
      console.error("Failed to close position:", error);
      throw error;
    }
  };
  
  // Get market price
  const getMarketPrice = async (market: string): Promise<number> => {
    try {
      // Get price from API
      const response = await apiRequest('GET', `/api/drift/price?market=${market}`, undefined);
      const data = await response.json();
      return data.price;
    } catch (error) {
      console.error("Failed to get market price:", error);
      throw error;
    }
  };
  
  // Get market history
  const getMarketHistory = async (market: string, interval = '1h'): Promise<any[]> => {
    try {
      const response = await apiRequest('GET', `/api/drift/history?market=${market}&interval=${interval}`, undefined);
      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error("Failed to get market history:", error);
      return [];
    }
  };
  
  return {
    isInitialized,
    isLoading,
    positions,
    placeOrder,
    closePosition,
    getMarketPrice,
    getMarketHistory,
    fetchPositions,
    tradingPairs: TRADING_PAIRS
  };
};
