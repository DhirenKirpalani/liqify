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

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import MatchDashboard from "@/components/MatchDashboard";
import { useMatch } from "@/hooks/useMatch";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Match() {
  const [, setLocation] = useLocation();
  const { activeMatch, matchEnded, resetMatch } = useMatch();
  const { connected, address } = useWallet();
  const [isLoading, setIsLoading] = useState(true);
  const [forcedMatch, setForcedMatch] = useState(null);
  
  // Attempt to fetch active matches for this user
  useEffect(() => {
    if (!connected || !address) return;
    
    const fetchActiveMatches = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching active matches for address:', address);
        
        // Try to get match data from API
        const response = await fetch('/api/matches/active?address=' + address);
        const data = await response.json();
        
        console.log('Active matches response:', data);
        
        if (data && data.match) {
          console.log('Active match found via API:', data.match);
          setForcedMatch(data.match);
          
          // Save to localStorage as backup
          localStorage.setItem('activeMatchData', JSON.stringify(data.match));
        } else {
          // If no active match found via API, try localStorage as fallback
          const storedMatchData = localStorage.getItem('activeMatchData');
          if (!activeMatch && storedMatchData) {
            try {
              console.log('Using backup match data from localStorage');
              const matchData = JSON.parse(storedMatchData);
              setForcedMatch(matchData);
            } catch (error) {
              console.error('Failed to parse stored match data:', error);
              localStorage.removeItem('activeMatchData');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching active matches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActiveMatches();
  }, [connected, address, activeMatch]);

  useEffect(() => {
    if (matchEnded) {
      // Redirect to home to show post-match summary
      setLocation("/");
      // Clear stored match data when match ends
      localStorage.removeItem('activeMatchData');
    }
  }, [matchEnded, setLocation]);
  
  // Store match data in localStorage when it's available
  useEffect(() => {
    if (activeMatch) {
      console.log('Storing active match data in localStorage');
      localStorage.setItem('activeMatchData', JSON.stringify(activeMatch));
    }
  }, [activeMatch]);

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

  // Use either the system activeMatch or our forced match
  // Pass the active match through context - the MatchDashboard component 
  // already reads from the useMatch hook, so we don't need to pass props
  return <MatchDashboard />;
}

