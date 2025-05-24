// import { useEffect } from "react";
// import { useLocation } from "wouter";
// import MatchDashboard from "@/components/MatchDashboard";
// import { useMatch } from "@/hooks/useMatch";
// import { useWallet } from "@/hooks/useWallet";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function Match() {
//   const [, setLocation] = useLocation();
//   const { activeMatch, matchEnded } = useMatch();
//   const { connected } = useWallet();

//   useEffect(() => {
//     if (matchEnded) {
//       // Redirect to home to show post-match summary
//       setLocation("/");
//     }
//   }, [matchEnded, setLocation]);

//   if (!connected) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-md">
//         <Card className="gradient-card">
//           <CardHeader>
//             <CardTitle>Connect Wallet</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-text-secondary mb-4">
//               Please connect your wallet to participate in matches.
//             </p>
//             <Button 
//               className="w-full"
//               onClick={() => setLocation("/")}
//             >
//               Go Home
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (!activeMatch) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-md">
//         <Card className="gradient-card">
//           <CardHeader>
//             <CardTitle>No Active Match</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-text-secondary mb-4">
//               You are not currently in a match. Join a queue to start playing!
//             </p>
//             <Button 
//               className="w-full"
//               onClick={() => setLocation("/")}
//             >
//               Find a Match
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return <MatchDashboard />;
// }

// import { useEffect, useState } from "react";
// import { useLocation } from "wouter";
// import MatchDashboard from "@/components/MatchDashboard";
// import { useMatch } from "@/hooks/useMatch";
// import { useWallet } from "@/hooks/useWallet";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export default function Match() {
//   const [, setLocation] = useLocation();
//   const { activeMatch, matchEnded, resetMatch } = useMatch();
//   const { connected, address } = useWallet();
//   const [isLoading, setIsLoading] = useState(true);
//   const [forcedMatch, setForcedMatch] = useState(null);
  
//   // Attempt to fetch active matches for this user
//   useEffect(() => {
//     if (!connected || !address) return;
    
//     const fetchActiveMatches = async () => {
//       try {
//         setIsLoading(true);
//         console.log('Fetching active matches for address:', address);
        
//         // Try to get match data from API
//         const response = await fetch('/api/matches/active?address=' + address);
//         const data = await response.json();
        
//         console.log('Active matches response:', data);
        
//         if (data && data.match) {
//           console.log('Active match found via API:', data.match);
//           setForcedMatch(data.match);
          
//           // Save to localStorage as backup
//           localStorage.setItem('activeMatchData', JSON.stringify(data.match));
//         } else {
//           // If no active match found via API, try localStorage as fallback
//           const storedMatchData = localStorage.getItem('activeMatchData');
//           if (!activeMatch && storedMatchData) {
//             try {
//               console.log('Using backup match data from localStorage');
//               const matchData = JSON.parse(storedMatchData);
//               setForcedMatch(matchData);
//             } catch (error) {
//               console.error('Failed to parse stored match data:', error);
//               localStorage.removeItem('activeMatchData');
//             }
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching active matches:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchActiveMatches();
//   }, [connected, address, activeMatch]);

//   useEffect(() => {
//     if (matchEnded) {
//       // Redirect to home to show post-match summary
//       setLocation("/");
//       // Clear stored match data when match ends
//       localStorage.removeItem('activeMatchData');
//     }
//   }, [matchEnded, setLocation]);
  
//   // Store match data in localStorage when it's available
//   useEffect(() => {
//     if (activeMatch) {
//       console.log('Storing active match data in localStorage');
//       localStorage.setItem('activeMatchData', JSON.stringify(activeMatch));
//     }
//   }, [activeMatch]);

//   if (!connected) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-md">
//         <Card className="gradient-card">
//           <CardHeader>
//             <CardTitle>Connect Wallet</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-text-secondary mb-4">
//               Please connect your wallet to participate in matches.
//             </p>
//             <Button 
//               className="w-full"
//               onClick={() => setLocation("/")}
//             >
//               Go Home
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   if (isLoading) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-md">
//         <Card className="gradient-card">
//           <CardHeader>
//             <CardTitle>Loading Match</CardTitle>
//           </CardHeader>
//           <CardContent className="text-center">
//             <div className="flex items-center justify-center space-x-2 py-4">
//               <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse"></div>
//               <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse delay-150"></div>
//               <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse delay-300"></div>
//             </div>
//             <p className="text-text-secondary mb-4">
//               Loading your match data...
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
  
//   if (!activeMatch && !forcedMatch) {
//     return (
//       <div className="container mx-auto px-4 py-8 max-w-md">
//         <Card className="gradient-card">
//           <CardHeader>
//             <CardTitle>No Active Match</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <p className="text-text-secondary mb-4">
//               You are not currently in a match. Join a queue to start playing!
//             </p>
//             <Button 
//               className="w-full"
//               onClick={() => setLocation("/")}
//             >
//               Find a Match
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Use either the system activeMatch or our forced match
//   // Pass the active match through context - the MatchDashboard component 
//   // already reads from the useMatch hook, so we don't need to pass props
//   return <MatchDashboard />;
// }

import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import MatchDashboard from "@/components/MatchDashboard";
import { useMatch } from "@/hooks/useMatch";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Debounce function for localStorage operations
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Match() {
  // 1. First, define all state hooks
  const [, setLocation] = useLocation();
  const { activeMatch, matchEnded, resetMatch, setActiveMatch } = useMatch();
  const { connected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [forcedMatch, setForcedMatch] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // 2. Define all useEffect hooks (unconditionally)
  // Effect for logging and handling forcedMatch
  useEffect(() => {
    // Log current match state for debugging
    console.log('Current match state:', { activeMatch, forcedMatch });
    setDebugInfo(JSON.stringify({ activeMatch, forcedMatch }, null, 2));
    
    // If we have a forcedMatch but no activeMatch in the context, use it as a last resort
    if (forcedMatch && !activeMatch) {
      console.log('Using forcedMatch as activeMatch:', forcedMatch);
      setActiveMatch(forcedMatch);
    }
  }, [forcedMatch, activeMatch, setActiveMatch]);
  
  // Track if we've already loaded match data to prevent redundant API calls
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const previousAddress = useRef<string | null>(null);
  
  // Effect for fetching active matches - only runs once on mount and when address changes
  useEffect(() => {
    // Skip API calls if not connected
    if (!connected || !address) {
      setIsLoading(false);
      return;
    }
    
    // Only refetch if address changed or we haven't loaded yet
    const addressChanged = previousAddress.current !== address;
    if (initialLoadComplete && !addressChanged && activeMatch) {
      return;
    }
    
    previousAddress.current = address;
    
    const fetchActiveMatches = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching active matches for address:', address);
        
        // Try to get match data from API
        const apiUrl = `${window.location.protocol}//${window.location.host}/api/matches/active?address=${address}`;
        console.log('Fetching from URL:', apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Active matches response:', data);
        
        if (data && data.match) {
          console.log('Active match found via API:', data.match);
          setActiveMatch(data.match);
          // Use a more efficient localStorage write (moved to a separate effect with debouncing)
        } else {
          // If no active match found via API, try localStorage as fallback
          // But only if we don't already have a match loaded
          if (!activeMatch) {
            const storedMatchData = localStorage.getItem('activeMatchData');
            if (storedMatchData) {
              try {
                console.log('Using backup match data from localStorage');
                const matchData = JSON.parse(storedMatchData);
                setActiveMatch(matchData);
              } catch (error) {
                console.error('Failed to parse stored match data:', error);
                localStorage.removeItem('activeMatchData');
              }
            }
          }
        }
        
        // Mark initial load as complete
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error fetching active matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActiveMatches();
  }, [connected, address, setActiveMatch, initialLoadComplete, activeMatch]);

  // Effect for handling match end
  useEffect(() => {
    if (matchEnded) {
      console.log('Match ended detected, redirecting to home...');
      // Redirect to home to show post-match summary
      setLocation("/");
      // Clear stored match data when match ends
      localStorage.removeItem('activeMatchData');
      // Also reset match state
      resetMatch();
    }
  }, [matchEnded, setLocation, resetMatch]);
  
  // CRITICAL: Combined WebSocket + Basic polling approach for match forfeit detection
  // This is more reliable than either approach alone
  useEffect(() => {
    if (!activeMatch || !connected || !address) return;
    
    console.log('Match monitoring activated for ID:', activeMatch.id);
    let forceRedirectTriggered = false;
    
    // Function to perform redirection (used by both WebSocket and polling)
    const performMatchEndRedirection = (reason = 'unknown') => {
      // Prevent duplicate redirects
      if (forceRedirectTriggered) return;
      forceRedirectTriggered = true;
      
      console.log(`Match end detected (${reason}). Performing cleanup and redirect...`);
      
      // Send a notification using the global notification system
      if (typeof window !== 'undefined' && (window as any).cryptoArenaNotifications) {
        // Determine notification type based on the reason
        if (reason.includes('forfeit') || reason.includes('websocket')) {
          (window as any).cryptoArenaNotifications.addNotification({
            type: 'match_forfeit',
            title: 'Match Forfeited',
            message: 'Your opponent has forfeited the match.',
            actionUrl: '/'
          });
        } else {
          (window as any).cryptoArenaNotifications.addNotification({
            type: 'match_end',
            title: 'Match Ended',
            message: 'Your match has ended.',
            actionUrl: '/'
          });
        }
      }
      
      // Clean up match data
      localStorage.removeItem('activeMatchData');
      resetMatch();
      
      // Use direct location change for most reliable redirect
      window.location.href = '/';
    };
    
    // 1. WEBSOCKET APPROACH (Primary method)
    // Listen for match_forfeited events from WebSocket
    const handleWebsocketMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        // Check if this is a forfeit message for our match
        if (data.type === 'match_forfeited' && data.matchId === activeMatch.id) {
          console.log('WebSocket: Match forfeit notification received!');
          performMatchEndRedirection('websocket');
        }
        
        // Also check for general match end events
        if (data.type === 'match_ended' && data.matchId === activeMatch.id) {
          console.log('WebSocket: Match end notification received!');
          performMatchEndRedirection('websocket');
        }
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };
    
    // Add WebSocket event listener
    window.addEventListener('message', handleWebsocketMessage);
    
    // 2. MINIMAL POLLING FALLBACK (Backup method)
    // Only poll every 10 seconds as a last resort
    const pollMatchStatus = async () => {
      try {
        // Only check active match using most likely endpoint
        const response = await fetch(`/api/matches/active?address=${address}`);
        if (!response.ok) return;
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) return;
        
        const data = await response.json();
        
        // If we previously had a match but now there's none, it ended
        if (!data.match && activeMatch) {
          console.log('Polling: Active match no longer exists!');
          performMatchEndRedirection('polling_no_match');
          return;
        }
        
        // If match exists but status has changed from active
        if (data.match && data.match.id === activeMatch.id && data.match.status !== 'active') {
          console.log('Polling: Match status changed to:', data.match.status);
          performMatchEndRedirection('polling_status_change');
        }
      } catch (error) {
        // Silently ignore errors for polling - it's just a fallback
      }
    };
    
    // Fallback polling - run less frequently (every 10 seconds)
    const pollInterval = setInterval(pollMatchStatus, 10000);
    
    // Cleanup function
    return () => {
      window.removeEventListener('message', handleWebsocketMessage);
      clearInterval(pollInterval);
    };
  }, [activeMatch, connected, address, resetMatch]);

  
  // Create a debounced version of activeMatch for localStorage operations
  const debouncedMatch = useDebounce(activeMatch, 2000); // 2 second debounce
  const previousMatchStringRef = useRef<string>('');
  
  // Effect for storing match data (debounced to reduce excessive writes)
  useEffect(() => {
    if (!debouncedMatch) return;
    
    // Only write to localStorage if the match data has actually changed
    const matchString = JSON.stringify(debouncedMatch);
    if (matchString !== previousMatchStringRef.current) {
      console.log('Storing debounced match data in localStorage');
      localStorage.setItem('activeMatchData', matchString);
      previousMatchStringRef.current = matchString;
    }
  }, [debouncedMatch]);
  
  // 3. Define the render logic (after all hooks)
  // Not connected
  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-4">
              Please connect your wallet to participate in matches.
            </p>
            <Button 
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Loading Match</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center space-x-2 py-4">
              <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse"></div>
              <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse delay-150"></div>
              <div className="h-4 w-4 rounded-full bg-accent-primary animate-pulse delay-300"></div>
            </div>
            <p className="text-text-secondary mb-4">
              Loading your match data...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // No active match
  if (!activeMatch && !forcedMatch) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>No Active Match</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-4">
              You are not currently in a match. Join a queue to start playing!
            </p>
            <Button 
              className="w-full"
              onClick={() => setLocation("/")}
            >
              Find a Match
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Have active match - render dashboard
  return <MatchDashboard />;
}


