import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { createWebSocketClient, WebSocketClient } from '@/lib/websocket';

// Types
type WebSocketContextType = {
  socket: WebSocket | null;
  connected: boolean;
  sendMessage: (data: any) => boolean;
};

// Create context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Provider component
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [connected, setConnected] = useState(false);

  // Initialize WebSocket client - wrapped in useCallback to prevent recreation
  const setupWebSocket = useCallback(() => {
    try {
      const wsClient = createWebSocketClient();
      setClient(wsClient);

      // Connect to WebSocket server
      wsClient.connect();

      // Add event listeners
      wsClient.addEventListener('open', () => {
        console.log('WebSocket connected');
        setConnected(true);
      });

      wsClient.addEventListener('close', () => {
        console.log('WebSocket disconnected');
        setConnected(false);
      });

      wsClient.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });

      return wsClient;
    } catch (error) {
      console.error('Failed to setup WebSocket client:', error);
      return null;
    }
  }, []);

  // Set up WebSocket once on component mount
  useEffect(() => {
    const wsClient = setupWebSocket();
    
    // Clean up on unmount
    return () => {
      if (wsClient) {
        wsClient.disconnect();
      }
    };
  }, [setupWebSocket]);

  // Send message safely
  const sendMessage = useCallback((data: any) => {
    if (!client || !connected) return false;
    
    try {
      return client.send(data);
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }, [client, connected]);

  const value = {
    socket: client?.socket || null,
    connected,
    sendMessage,
  };

  return React.createElement(WebSocketContext.Provider, { value }, children);
};

// Hook to use WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
