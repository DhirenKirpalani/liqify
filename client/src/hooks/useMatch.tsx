// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: (market?: string, duration?: number) => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found, update match state
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
//             break;
            
//           case 'match_update':
//             // Update match state (PnL changes, new spectators, etc.)
//             setActiveMatch(prev => prev ? { ...prev, ...data.update } : null);
//             break;
            
//           case 'match_ended':
//             // Match ended, show summary
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async (market = 'BTC/USDC', duration = 1800) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest({
//         url: '/api/matches/create',
//         method: 'POST',
//         body: { 
//           address,
//           market,
//           duration 
//         },
//       });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by ID
//   const joinMatch = useCallback(async (matchId: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest(`/api/matches/${matchId}/join`, { address });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest(`/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest(`/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: () => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found, update match state
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
//             break;
            
//           case 'match_update':
//             // Update match state (PnL changes, new spectators, etc.)
//             setActiveMatch(prev => prev ? { ...prev, ...data.update } : null);
//             break;
            
//           case 'match_ended':
//             // Match ended, show summary
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/create', { address });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by ID
//   const joinMatch = useCallback(async (matchId: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/join`, { address });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('POST', '/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return React.createElement(MatchContext.Provider, { value }, children);
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: (market?: string, duration?: number) => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found, update match state
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
//             break;
            
//           case 'match_update':
//             // Update match state (PnL changes, new spectators, etc.)
//             setActiveMatch(prev => prev ? { ...prev, ...data.update } : null);
//             break;
            
//           case 'match_ended':
//             // Match ended, show summary
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async (market = 'BTC/USDC', duration = 1800) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest({
//         url: '/api/matches/create',
//         method: 'POST',
//         body: { 
//           address,
//           market,
//           duration 
//         },
//       });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by invite code
//   const joinMatch = useCallback(async (inviteCode: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       // First, look up the match ID using the invite code
//       console.log('Looking up match with invite code:', inviteCode);
//       const lookupResponse = await apiRequest({
//         url: `/api/matches/code/${inviteCode}`,
//         method: 'GET'
//       });
//       const lookupData = await lookupResponse.json();
      
//       if (!lookupData.matchId) {
//         throw new Error('Invalid invite code');
//       }
      
//       console.log('Found match with ID:', lookupData.matchId);
      
//       // Now join the match using the actual match ID
//       await apiRequest({
//         url: `/api/matches/${lookupData.matchId}/join`,
//         method: 'POST',
//         body: { address }
//       });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest(`/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest(`/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: () => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found, update match state
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
//             break;
            
//           case 'match_update':
//             // Update match state (PnL changes, new spectators, etc.)
//             setActiveMatch(prev => prev ? { ...prev, ...data.update } : null);
//             break;
            
//           case 'match_ended':
//             // Match ended, show summary
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/create', { address });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by ID
//   const joinMatch = useCallback(async (matchId: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/join`, { address });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('POST', '/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return React.createElement(MatchContext.Provider, { value }, children);
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: (market?: string, duration?: number) => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages
//   useEffect(() => {
//     if (!socket) return;

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found, update match state
//             console.log('WebSocket: match_found event received', data);
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
            
//             // Force redirect to match page
//             console.log('Redirecting to match page due to match_found event');
//             setTimeout(() => {
//               window.location.href = '/match';
//             }, 500);
//             break;
            
//           case 'match_update':
//             // Update match state (PnL changes, new spectators, etc.)
//             setActiveMatch(prev => prev ? { ...prev, ...data.update } : null);
//             break;
            
//           case 'match_ended':
//             // Match ended, show summary
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async (market = 'BTC/USDC', duration = 1800) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest({
//         url: '/api/matches/create',
//         method: 'POST',
//         body: { 
//           address,
//           market,
//           duration 
//         },
//       });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by invite code
//   const joinMatch = useCallback(async (inviteCode: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       // First, look up the match ID using the invite code
//       console.log('Looking up match with invite code:', inviteCode);
//       const lookupResponse = await apiRequest({
//         url: `/api/matches/code/${inviteCode}`,
//         method: 'GET'
//       });
//       const lookupData = await lookupResponse.json();
      
//       if (!lookupData.matchId) {
//         throw new Error('Invalid invite code');
//       }
      
//       console.log('Found match with ID:', lookupData.matchId);
      
//       // Now join the match using the actual match ID
//       await apiRequest({
//         url: `/api/matches/${lookupData.matchId}/join`,
//         method: 'POST',
//         body: { address }
//       });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest(`/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest(`/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
// import { useWebSocket } from '@/hooks/useWebSocket';
// import { useWallet } from '@/hooks/useWallet';
// import { useToast } from '@/hooks/use-toast';
// import { apiRequest } from '@/lib/queryClient';
// import { queryClient } from '@/lib/queryClient';

// // Types
// type Player = {
//   username: string;
//   pnl: number;
// };

// type Match = {
//   id: string;
//   player: Player;
//   opponent: Player;
//   market: string;
//   duration: number;
//   startTime: number;
//   spectators: string[];
// };

// type MatchSummary = {
//   playerPnl: number;
//   opponentPnl: number;
//   opponentName: string;
//   stats: {
//     ordersPlaced: number;
//     winRate: number;
//     avgPositionSize: string;
//     biggestWin: number;
//   };
//   rewards: {
//     tokens: number;
//     xp: number;
//     leaderboardPoints: number;
//     achievement?: string;
//   };
// };

// type MatchContextType = {
//   activeMatch: Match | null;
//   matchEnded: boolean;
//   matchSummary: MatchSummary | null;
//   timeRemaining: number;
//   joinQueue: () => Promise<void>;
//   createFriendMatch: () => Promise<string>;
//   joinMatch: (matchId: string) => Promise<void>;
//   spectateMatch: (matchId: string) => Promise<void>;
//   forfeitMatch: () => Promise<void>;
//   resetMatch: () => void;
//   rematch: () => Promise<void>;
//   formatTime: (seconds: number) => string;
// };

// // Create context
// const MatchContext = createContext<MatchContextType | undefined>(undefined);

// // Provider component
// export const MatchProvider = ({ children }: { children: ReactNode }) => {
//   const { socket, sendMessage } = useWebSocket();
//   const { connected, address } = useWallet();
//   const { toast } = useToast();
  
//   const [activeMatch, setActiveMatch] = useState<Match | null>(null);
//   const [matchEnded, setMatchEnded] = useState(false);
//   const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState(0);
//   const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

//   // Format time as mm:ss
//   const formatTime = useCallback((seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }, []);

//   // Start countdown timer for match
//   const startTimer = useCallback((duration: number) => {
//     // Clear existing timer if any
//     if (timer) clearInterval(timer);
    
//     setTimeRemaining(duration);
    
//     const interval = setInterval(() => {
//       setTimeRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     setTimer(interval);
    
//     return () => clearInterval(interval);
//   }, [timer]);

//   // Handle WebSocket messages with throttling for high-frequency updates
//   useEffect(() => {
//     if (!socket) return;

//     const lastUpdateTimeRef = useRef<number>(0);
//     const latestMatchRef = useRef<Match | null>(null);

//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
//         const now = Date.now();
        
//         switch (data.type) {
//           case 'match_found':
//             // Match found - this is an important update, don't throttle
//             const match: Match = data.match;
//             setActiveMatch(match);
//             setMatchEnded(false);
//             startTimer(match.duration);
            
//             toast({
//               title: 'Match Found',
//               description: `You are matched with ${match.opponent.username}`,
//             });
//             break;
            
//           case 'match_update':
//             // For PnL updates, only apply if enough time has passed or it's significant
//             if (data.update && latestMatchRef.current) {
//               // Check if this is a frequent update (like PnL changes)
//               const isPnLUpdate = data.update.player?.pnl !== undefined || 
//                                 data.update.opponent?.pnl !== undefined;
              
//               // For PnL updates, we want to throttle them more aggressively
//               // For other updates (spectators, etc), apply immediately
//               const minUpdateInterval = isPnLUpdate ? 1000 : 200; // 1 second for PnL, 200ms for others
              
//               if (!isPnLUpdate || now - lastUpdateTimeRef.current > minUpdateInterval) {
//                 lastUpdateTimeRef.current = now;
//                 // TypeScript safe version of the update
//                 setActiveMatch((prev: Match | null) => {
//                   if (!prev) return null;
//                   return { ...prev, ...data.update };
//                 });
//               }
//             }
//             break;
            
//           case 'match_ended':
//             // Match ended - important, don't throttle
//             setMatchEnded(true);
//             setMatchSummary(data.summary);
//             setTimeRemaining(0);
//             if (timer) clearInterval(timer);
            
//             toast({
//               title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
//               description: 'Match has ended. View your results.',
//             });
//             break;
            
//           case 'spectate_join':
//             // Someone joined as spectator
//             if (activeMatch?.id === data.matchId) {
//               setActiveMatch(prev => prev ? {
//                 ...prev,
//                 spectators: [...prev.spectators, data.spectator]
//               } : null);
//             }
//             break;
//         }
//       } catch (error) {
//         console.error('Failed to parse WebSocket message:', error);
//       }
//     };

//     socket.addEventListener('message', handleMessage);
    
//     return () => {
//       socket.removeEventListener('message', handleMessage);
//     };
//   }, [socket, activeMatch, startTimer, timer, toast]);

//   // Join match queue
//   const joinQueue = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/queue', { address });
      
//       toast({
//         title: 'Joined Queue',
//         description: 'Searching for an opponent...',
//       });
      
//       // Server will send match_found event via WebSocket when a match is found
//       return;
//     } catch (error) {
//       console.error('Failed to join queue:', error);
//       throw error;
//     }
//   }, [connected, address, toast]);

//   // Create a friend match (with invite code)
//   const createFriendMatch = useCallback(async () => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       const response = await apiRequest('POST', '/api/matches/create', { address });
//       const data = await response.json();
      
//       return data.inviteCode;
//     } catch (error) {
//       console.error('Failed to create friend match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Join an existing match by ID
//   const joinMatch = useCallback(async (matchId: string) => {
//     if (!connected) {
//       throw new Error('Wallet not connected');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/join`, { address });
      
//       // Server will send match_found event via WebSocket
//     } catch (error) {
//       console.error('Failed to join match:', error);
//       throw error;
//     }
//   }, [connected, address]);

//   // Spectate a match
//   const spectateMatch = useCallback(async (matchId: string) => {
//     try {
//       await apiRequest('POST', `/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
//       // Server will send match data via WebSocket
//     } catch (error) {
//       console.error('Failed to spectate match:', error);
//       throw error;
//     }
//   }, [address]);

//   // Forfeit current match
//   const forfeitMatch = useCallback(async () => {
//     if (!activeMatch) {
//       throw new Error('No active match');
//     }
    
//     try {
//       await apiRequest('POST', `/api/matches/${activeMatch.id}/forfeit`, { address });
      
//       // Server will send match_ended event via WebSocket
//     } catch (error) {
//       console.error('Failed to forfeit match:', error);
//       throw error;
//     }
//   }, [activeMatch, address]);

//   // Reset match state
//   const resetMatch = useCallback(() => {
//     setActiveMatch(null);
//     setMatchEnded(false);
//     setMatchSummary(null);
//     setTimeRemaining(0);
    
//     if (timer) {
//       clearInterval(timer);
//       setTimer(null);
//     }
    
//     // Invalidate match-related queries
//     queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
//   }, [timer]);

//   // Request a rematch
//   const rematch = useCallback(async () => {
//     if (!matchEnded || !matchSummary) {
//       throw new Error('Match not ended yet');
//     }
    
//     try {
//       await apiRequest('POST', '/api/matches/rematch', { 
//         address,
//         opponent: matchSummary.opponentName
//       });
      
//       // Server will send match_found event via WebSocket if opponent accepts
//       toast({
//         title: 'Rematch Requested',
//         description: 'Waiting for your opponent to accept...',
//       });
//     } catch (error) {
//       console.error('Failed to request rematch:', error);
//       throw error;
//     }
//   }, [matchEnded, matchSummary, address, toast]);

//   const value = {
//     activeMatch,
//     matchEnded,
//     matchSummary,
//     timeRemaining,
//     joinQueue,
//     createFriendMatch,
//     joinMatch,
//     spectateMatch,
//     forfeitMatch,
//     resetMatch,
//     rematch,
//     formatTime,
//   };

//   return React.createElement(MatchContext.Provider, { value }, children);
// };

// // Hook to use match context
// export const useMatch = () => {
//   const context = useContext(MatchContext);
//   if (context === undefined) {
//     throw new Error('useMatch must be used within a MatchProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

// Utility function to throttle high-frequency updates
function useThrottledState<T>(initialState: T, interval: number = 1000) {
  const [state, setState] = useState<T>(initialState);
  const pendingUpdatesRef = useRef<T | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Type-safe throttled setState function
  const throttledSetState = useCallback((newState: T | ((prevState: T) => T)) => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
    
    // Function to process updates
    const processUpdate = () => {
      if (pendingUpdatesRef.current !== null) {
        setState(pendingUpdatesRef.current);
        lastUpdateTimeRef.current = Date.now();
        pendingUpdatesRef.current = null;
      }
    };
    
    // Calculate new state (handling both function and direct value updates)
    const calculatedNewState = typeof newState === 'function'
      ? (newState as (prev: T) => T)(state)
      : newState;
    
    // Store the latest update
    pendingUpdatesRef.current = calculatedNewState;
    
    // If we're within the throttle window, set up a timeout
    if (timeSinceLastUpdate < interval) {
      // Clear existing timeout if any
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout for the remaining throttle time
      timeoutRef.current = setTimeout(processUpdate, interval - timeSinceLastUpdate);
    } else {
      // Outside throttle window, update immediately
      processUpdate();
    }
  }, [state, interval]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return [state, throttledSetState] as const;
}

// Types
type Player = {
  username: string;
  pnl: number;
};

type Match = {
  id: string;
  player: Player;
  opponent: Player;
  market: string;
  duration: number;
  startTime: number;
  spectators: string[];
};

type MatchSummary = {
  playerPnl: number;
  opponentPnl: number;
  opponentName: string;
  stats: {
    ordersPlaced: number;
    winRate: number;
    avgPositionSize: string;
    biggestWin: number;
  };
  rewards: {
    tokens: number;
    xp: number;
    leaderboardPoints: number;
    achievement?: string;
  };
};

type MatchContextType = {
  activeMatch: Match | null;
  matchEnded: boolean;
  matchSummary: MatchSummary | null;
  timeRemaining: number;
  joinQueue: () => Promise<void>;
  createFriendMatch: (market?: string, duration?: number) => Promise<string>;
  joinMatch: (matchId: string) => Promise<void>;
  spectateMatch: (matchId: string) => Promise<void>;
  forfeitMatch: () => Promise<void>;
  resetMatch: () => void;
  rematch: () => Promise<void>;
  formatTime: (seconds: number) => string;
  // Add function to set active match directly
  setActiveMatch: (match: Match | null) => void;
};

// Create context
const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Provider component
export const MatchProvider = ({ children }: { children: ReactNode }) => {
  const { socket, sendMessage } = useWebSocket();
  const { connected, address } = useWallet();
  const { toast } = useToast();
  
  // Use throttled state for match updates to prevent excessive re-renders
  const [activeMatch, setActiveMatchThrottled] = useThrottledState<Match | null>(null, 1000);
  const latestMatchRef = useRef<Match | null>(null);
  
  // Create a wrapper for setActiveMatch that both updates the throttled state
  // and keeps a reference to the latest value
  const setActiveMatch = useCallback((matchOrUpdater: Match | null | ((prev: Match | null) => Match | null)) => {
    if (typeof matchOrUpdater === 'function') {
      // If it's a function updater, call it with the current value
      const updaterFn = matchOrUpdater as ((prev: Match | null) => Match | null);
      const updatedMatch = updaterFn(latestMatchRef.current);
      latestMatchRef.current = updatedMatch;
      setActiveMatchThrottled(updatedMatch);
    } else {
      // If it's a direct value
      latestMatchRef.current = matchOrUpdater;
      setActiveMatchThrottled(matchOrUpdater);
    }
  }, [setActiveMatchThrottled]);
  
  const [matchEnded, setMatchEnded] = useState(false);
  const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Track the last update timestamp to prevent too frequent updates
  const lastUpdateTimeRef = useRef<number>(0);

  // Format time as mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start countdown timer for match
  const startTimer = useCallback((duration: number) => {
    // Clear existing timer if any
    if (timer) clearInterval(timer);
    
    setTimeRemaining(duration);
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(interval);
    
    return () => clearInterval(interval);
  }, [timer]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'match_found':
            // Match found, update match state
            console.log('WebSocket: match_found event received', data);
            const match: Match = data.match;
            setActiveMatch(match);
            setMatchEnded(false);
            startTimer(match.duration);
            
            toast({
              title: 'Match Found',
              description: `You are matched with ${match.opponent.username}`,
            });
            
            // Force redirect to match page
            console.log('Redirecting to match page due to match_found event');
            setTimeout(() => {
              window.location.href = '/match';
            }, 500);
            break;
            
          case 'match_update':
            // Update match state (PnL changes, new spectators, etc.)
            // Get current timestamp to limit update frequency
            const now = Date.now();
            
            // Check if this is a frequent update (like PnL changes)
            const isPnLUpdate = data.update?.player?.pnl !== undefined || 
                              data.update?.opponent?.pnl !== undefined;
            
            // For PnL updates, we want to throttle them more aggressively
            // For other updates (spectators, etc), apply immediately
            const minUpdateInterval = isPnLUpdate ? 1000 : 200; // 1 second for PnL, 200ms for others
            
            if (!isPnLUpdate || now - lastUpdateTimeRef.current > minUpdateInterval) {
              lastUpdateTimeRef.current = now;
              // Apply updates directly with careful type handling
              if (latestMatchRef.current) {
                const updatedMatch = { ...latestMatchRef.current, ...data.update };
                setActiveMatch(updatedMatch);
              }
            }
            break;
            
          case 'match_ended':
            // Match ended, show summary
            setMatchEnded(true);
            setMatchSummary(data.summary);
            setTimeRemaining(0);
            if (timer) clearInterval(timer);
            
            toast({
              title: data.summary.playerPnl > data.summary.opponentPnl ? 'Victory!' : 'Defeat!',
              description: 'Match has ended. View your results.',
            });
            break;
            
          case 'spectate_join':
            // Someone joined as spectator
            if (activeMatch?.id === data.matchId) {
              setActiveMatch(prev => prev ? {
                ...prev,
                spectators: [...prev.spectators, data.spectator]
              } : null);
            }
            break;
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    socket.addEventListener('message', handleMessage);
    
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket, activeMatch, startTimer, timer, toast]);

  // Join match queue
  const joinQueue = useCallback(async () => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      await apiRequest('/api/matches/queue', { address });
      
      toast({
        title: 'Joined Queue',
        description: 'Searching for an opponent...',
      });
      
      // Server will send match_found event via WebSocket when a match is found
      return;
    } catch (error) {
      console.error('Failed to join queue:', error);
      throw error;
    }
  }, [connected, address, toast]);

  // Create a friend match (with invite code)
  const createFriendMatch = useCallback(async (market = 'BTC/USDC', duration = 1800) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const response = await apiRequest({
        url: '/api/matches/create',
        method: 'POST',
        body: { 
          address,
          market,
          duration 
        },
      });
      const data = await response.json();
      
      return data.inviteCode;
    } catch (error) {
      console.error('Failed to create friend match:', error);
      throw error;
    }
  }, [connected, address]);

  // Join an existing match by invite code
  const joinMatch = useCallback(async (inviteCode: string) => {
    if (!connected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // First, look up the match ID using the invite code
      console.log('Looking up match with invite code:', inviteCode);
      const lookupResponse = await apiRequest({
        url: `/api/matches/code/${inviteCode}`,
        method: 'GET'
      });
      const lookupData = await lookupResponse.json();
      
      if (!lookupData.matchId) {
        throw new Error('Invalid invite code');
      }
      
      console.log('Found match with ID:', lookupData.matchId);
      
      // Now join the match using the actual match ID
      await apiRequest({
        url: `/api/matches/${lookupData.matchId}/join`,
        method: 'POST',
        body: { address }
      });
      
      // Server will send match_found event via WebSocket
    } catch (error) {
      console.error('Failed to join match:', error);
      throw error;
    }
  }, [connected, address]);

  // Spectate a match
  const spectateMatch = useCallback(async (matchId: string) => {
    try {
      await apiRequest(`/api/matches/${matchId}/spectate`, { address: address || 'anonymous' });
      
      // Server will send match data via WebSocket
    } catch (error) {
      console.error('Failed to spectate match:', error);
      throw error;
    }
  }, [address]);

  // Forfeit current match
  const forfeitMatch = useCallback(async () => {
    if (!activeMatch) {
      throw new Error('No active match');
    }
    
    try {
      await apiRequest(`/api/matches/${activeMatch.id}/forfeit`, { address });
      
      // Server will send match_ended event via WebSocket
    } catch (error) {
      console.error('Failed to forfeit match:', error);
      throw error;
    }
  }, [activeMatch, address]);

  // Reset match state
  const resetMatch = useCallback(() => {
    setActiveMatch(null);
    setMatchEnded(false);
    setMatchSummary(null);
    setTimeRemaining(0);
    
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    
    // Invalidate match-related queries
    queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
  }, [timer]);

  // Request a rematch
  const rematch = useCallback(async () => {
    if (!matchEnded || !matchSummary) {
      throw new Error('Match not ended yet');
    }
    
    try {
      await apiRequest('/api/matches/rematch', { 
        address,
        opponent: matchSummary.opponentName
      });
      
      // Server will send match_found event via WebSocket if opponent accepts
      toast({
        title: 'Rematch Requested',
        description: 'Waiting for your opponent to accept...',
      });
    } catch (error) {
      console.error('Failed to request rematch:', error);
      throw error;
    }
  }, [matchEnded, matchSummary, address, toast]);

  const value = {
    activeMatch,
    matchEnded,
    matchSummary,
    timeRemaining,
    joinQueue,
    createFriendMatch,
    joinMatch,
    spectateMatch,
    forfeitMatch,
    resetMatch,
    rematch,
    formatTime,
    // Expose setActiveMatch to allow direct updates
    setActiveMatch,
  };

  return <MatchContext.Provider value={value}>{children}</MatchContext.Provider>;
};

// Hook to use match context
export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
};









