// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import TradingChart from "@/components/TradingChart";
// import OrderPanel from "@/components/OrderPanel";
// import PositionPanel from "@/components/PositionPanel";
// import ActivityFeed from "@/components/ActivityFeed";
// import { useMatch } from "@/hooks/useMatch";
// import { useToast } from "@/hooks/use-toast";

// export default function MatchDashboard() {
//   const { activeMatch, forfeitMatch, timeRemaining, formatTime } = useMatch();
//   const { toast } = useToast();
//   const [showSpectators, setShowSpectators] = useState(false);

//   const handleForfeit = async () => {
//     if (!activeMatch) return;

//     try {
//       await forfeitMatch();
//       toast({
//         title: "Match Forfeited",
//         description: "You have forfeited the current match",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Forfeit",
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//         variant: "destructive",
//       });
//     }
//   };

//   if (!activeMatch) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-text-secondary">No active match available</div>
//       </div>
//     );
//   }

//   const playerPnL = activeMatch.player.pnl;
//   const opponentPnL = activeMatch.opponent.pnl;
//   const leadingPlayer = playerPnL >= opponentPnL ? "player" : "opponent";

//   const total = Math.abs(playerPnL) + Math.abs(opponentPnL) + 0.01;
//   const playerProgress = (Math.abs(playerPnL) / total) * 100;

//   return (
//     <div>
//       {/* Match Header Card */}
//       <Card className="gradient-card rounded-xl p-5 border border-neutral/20 mb-6">
//         <CardContent className="p-0">
//           {/* Header */}
//           <div className="flex flex-col lg:flex-row justify-between mb-4">
//             <div className="mb-4 lg:mb-0">
//               <h2 className="text-2xl font-manrope font-bold mb-2">
//                 Live Match: You vs {activeMatch.opponent.username}
//               </h2>
//               <div className="flex items-center text-sm text-text-secondary">
//                 <span className="flex items-center mr-4">
//                   <i className="ri-time-line mr-1" />
//                   {formatTime(timeRemaining)} remaining
//                 </span>
//                 <span className="flex items-center">
//                   <i className="ri-coin-line mr-1" />
//                   Trading {activeMatch.market}
//                 </span>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <Button
//                 variant="outline"
//                 className="bg-bg-primary"
//                 onClick={() => setShowSpectators(!showSpectators)}
//               >
//                 <i className="ri-eye-line mr-1" />
//                 Spectators ({activeMatch.spectators.length})
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="hover:bg-loss"
//                 onClick={handleForfeit}
//               >
//                 <i className="ri-close-line mr-1" />
//                 Forfeit
//               </Button>
//             </div>
//           </div>

//           {/* Spectators List */}
//           {showSpectators && activeMatch.spectators.length > 0 && (
//             <div className="mb-4 p-3 bg-bg-primary rounded-lg">
//               <p className="font-medium mb-2">Spectators</p>
//               <div className="flex flex-wrap gap-2">
//                 {activeMatch.spectators.map((spectator, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center bg-bg-secondary rounded-full px-3 py-1"
//                     title={spectator}
//                   >
//                     <Avatar className="h-5 w-5 mr-2">
//                       <AvatarFallback className="text-xs">
//                         {spectator.slice(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm truncate">{spectator}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* PnL Progress Bar */}
//           <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg mb-6">
//             {/* Player */}
//             <div className="flex items-center">
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   playerPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden mr-3`}
//               >
//                 <span className="text-sm font-medium">You</span>
//               </div>
//               <div>
//                 <p className="font-medium">Your PnL</p>
//                 <p
//                   className={`${
//                     playerPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium`}
//                 >
//                   {playerPnL >= 0 ? "+" : ""}
//                   {playerPnL}%
//                 </p>
//               </div>
//             </div>

//             {/* Progress Indicator */}
//             <div className="text-center">
//               <div className="relative w-48 h-1.5 bg-bg-secondary rounded-full mb-1">
//                 <div
//                   className={`absolute top-0 h-full ${
//                     leadingPlayer === "player" ? "bg-profit left-0" : "bg-loss right-0"
//                   } rounded-full`}
//                   style={{ width: `${playerProgress}%` }}
//                 />
//               </div>
//               <p className="text-xs text-text-secondary">
//                 {leadingPlayer === "player"
//                   ? "You're leading!"
//                   : "Your opponent is ahead!"}
//               </p>
//             </div>

//             {/* Opponent */}
//             <div className="flex items-center">
//               <div>
//                 <p className="font-medium text-right">Opponent PnL</p>
//                 <p
//                   className={`${
//                     opponentPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium text-right`}
//                 >
//                   {opponentPnL >= 0 ? "+" : ""}
//                   {opponentPnL}%
//                 </p>
//               </div>
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   opponentPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden ml-3`}
//               >
//                 <span className="text-sm font-medium">
//                   {activeMatch.opponent.username.slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart and Order Panel */}
//         <div className="lg:col-span-2 space-y-6">
//           <TradingChart market={activeMatch.market} />
//           <OrderPanel />
//         </div>

//         {/* Position & Activity */}
//         <div className="lg:col-span-1 space-y-6">
//           <PositionPanel />
//           <ActivityFeed matchId={activeMatch.id} />
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import TradingChart from "@/components/TradingChart";
// import OrderPanel from "@/components/OrderPanel";
// import PositionPanel from "@/components/PositionPanel";
// import ActivityFeed from "@/components/ActivityFeed";
// import { useMatch } from "@/hooks/useMatch";
// import { useToast } from "@/hooks/use-toast";

// export default function MatchDashboard() {
//   const { activeMatch, forfeitMatch, timeRemaining, formatTime, setActiveMatch } = useMatch();
//   const { toast } = useToast();
//   const [showSpectators, setShowSpectators] = useState(false);
  
//   // Add debug logging to track activeMatch state
//   useEffect(() => {
//     console.log('MatchDashboard - activeMatch state:', activeMatch);
    
//     // Try to restore from localStorage if activeMatch is null
//     if (!activeMatch) {
//       const storedMatchData = localStorage.getItem('activeMatchData');
//       if (storedMatchData) {
//         try {
//           console.log('MatchDashboard - Restoring from localStorage');
//           const matchData = JSON.parse(storedMatchData);
//           setActiveMatch(matchData);
//         } catch (error) {
//           console.error('Failed to parse stored match data:', error);
//         }
//       }
//     }
//   }, [activeMatch, setActiveMatch]);

//   const handleForfeit = async () => {
//     if (!activeMatch) return;

//     try {
//       await forfeitMatch();
//       toast({
//         title: "Match Forfeited",
//         description: "You have forfeited the current match",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Forfeit",
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//         variant: "destructive",
//       });
//     }
//   };

//   // Check for match data
//   if (!activeMatch) {
//     return (
//       <div className="text-center py-12">
//         <div className="mb-4">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
//         </div>
//         <div className="text-text-secondary">Loading match data...</div>
//         <div className="text-xs text-text-secondary mt-2">If this persists, please go back to the home page and try again.</div>
//       </div>
//     );
//   }

//   const playerPnL = activeMatch.player.pnl;
//   const opponentPnL = activeMatch.opponent.pnl;
//   const leadingPlayer = playerPnL >= opponentPnL ? "player" : "opponent";

//   const total = Math.abs(playerPnL) + Math.abs(opponentPnL) + 0.01;
//   const playerProgress = (Math.abs(playerPnL) / total) * 100;

//   return (
//     <div>
//       {/* Match Header Card */}
//       <Card className="gradient-card rounded-xl p-5 border border-neutral/20 mb-6">
//         <CardContent className="p-0">
//           {/* Header */}
//           <div className="flex flex-col lg:flex-row justify-between mb-4">
//             <div className="mb-4 lg:mb-0">
//               <h2 className="text-2xl font-manrope font-bold mb-2">
//                 Live Match: You vs {activeMatch.opponent.username}
//               </h2>
//               <div className="flex items-center text-sm text-text-secondary">
//                 <span className="flex items-center mr-4">
//                   <i className="ri-time-line mr-1" />
//                   {formatTime(timeRemaining)} remaining
//                 </span>
//                 <span className="flex items-center">
//                   <i className="ri-coin-line mr-1" />
//                   Trading {activeMatch.market}
//                 </span>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <Button
//                 variant="outline"
//                 className="bg-bg-primary"
//                 onClick={() => setShowSpectators(!showSpectators)}
//               >
//                 <i className="ri-eye-line mr-1" />
//                 Spectators ({activeMatch.spectators.length})
//               </Button>
//               <Button
//                 variant="destructive"
//                 className="hover:bg-loss"
//                 onClick={handleForfeit}
//               >
//                 <i className="ri-close-line mr-1" />
//                 Forfeit
//               </Button>
//             </div>
//           </div>

//           {/* Spectators List */}
//           {showSpectators && activeMatch.spectators.length > 0 && (
//             <div className="mb-4 p-3 bg-bg-primary rounded-lg">
//               <p className="font-medium mb-2">Spectators</p>
//               <div className="flex flex-wrap gap-2">
//                 {activeMatch.spectators.map((spectator, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center bg-bg-secondary rounded-full px-3 py-1"
//                     title={spectator}
//                   >
//                     <Avatar className="h-5 w-5 mr-2">
//                       <AvatarFallback className="text-xs">
//                         {spectator.slice(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm truncate">{spectator}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* PnL Progress Bar */}
//           <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg mb-6">
//             {/* Player */}
//             <div className="flex items-center">
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   playerPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden mr-3`}
//               >
//                 <span className="text-sm font-medium">You</span>
//               </div>
//               <div>
//                 <p className="font-medium">Your PnL</p>
//                 <p
//                   className={`${
//                     playerPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium`}
//                 >
//                   {playerPnL >= 0 ? "+" : ""}
//                   {playerPnL}%
//                 </p>
//               </div>
//             </div>

//             {/* Progress Indicator */}
//             <div className="text-center">
//               <div className="relative w-48 h-1.5 bg-bg-secondary rounded-full mb-1">
//                 <div
//                   className={`absolute top-0 h-full ${
//                     leadingPlayer === "player" ? "bg-profit left-0" : "bg-loss right-0"
//                   } rounded-full`}
//                   style={{ width: `${playerProgress}%` }}
//                 />
//               </div>
//               <p className="text-xs text-text-secondary">
//                 {leadingPlayer === "player"
//                   ? "You're leading!"
//                   : "Your opponent is ahead!"}
//               </p>
//             </div>

//             {/* Opponent */}
//             <div className="flex items-center">
//               <div>
//                 <p className="font-medium text-right">Opponent PnL</p>
//                 <p
//                   className={`${
//                     opponentPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium text-right`}
//                 >
//                   {opponentPnL >= 0 ? "+" : ""}
//                   {opponentPnL}%
//                 </p>
//               </div>
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   opponentPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden ml-3`}
//               >
//                 <span className="text-sm font-medium">
//                   {activeMatch.opponent.username.slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart and Order Panel */}
//         <div className="lg:col-span-2 space-y-6">
//           <TradingChart market={activeMatch.market} />
//           <OrderPanel />
//         </div>

//         {/* Position & Activity */}
//         <div className="lg:col-span-1 space-y-6">
//           <PositionPanel />
//           <ActivityFeed matchId={activeMatch.id} />
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";
// import { useLocation } from "wouter";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import TradingChart from "@/components/TradingChart";
// import OrderPanel from "@/components/OrderPanel";
// import PositionPanel from "@/components/PositionPanel";
// import ActivityFeed from "@/components/ActivityFeed";
// import { useMatch } from "@/hooks/useMatch";
// import { useToast } from "@/hooks/use-toast";

// export default function MatchDashboard() {
//   const { activeMatch, forfeitMatch, timeRemaining, formatTime, setActiveMatch, resetMatch } = useMatch();
//   const { toast } = useToast();
//   const [, setLocation] = useLocation();
//   const [showSpectators, setShowSpectators] = useState(false);
  
//   // Add debug logging to track activeMatch state
//   useEffect(() => {
//     console.log('MatchDashboard - activeMatch state:', activeMatch);
    
//     // Try to restore from localStorage if activeMatch is null
//     if (!activeMatch) {
//       const storedMatchData = localStorage.getItem('activeMatchData');
//       if (storedMatchData) {
//         try {
//           console.log('MatchDashboard - Restoring from localStorage');
//           const matchData = JSON.parse(storedMatchData);
//           setActiveMatch(matchData);
//         } catch (error) {
//           console.error('Failed to parse stored match data:', error);
//         }
//       }
//     }
//   }, [activeMatch, setActiveMatch]);

//   const handleForfeit = async () => {
//     if (!activeMatch) return;
    
//     try {
//       // Call the forfeit API
//       await forfeitMatch();
      
//       // Manually update the match state
//       resetMatch(); // Clear active match state
//       localStorage.removeItem('activeMatchData'); // Remove from localStorage
      
//       // Show success message
//       toast({
//         title: "Match Forfeited",
//         description: "You have forfeited the current match",
//       });
      
//       // Force navigation to home page
//       window.location.href = window.location.origin;
//     } catch (error) {
//       toast({
//         title: "Failed to Forfeit",
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//         variant: "destructive",
//       });
//     }
//   };

//   // Check for match data
//   if (!activeMatch) {
//     return (
//       <div className="text-center py-12">
//         <div className="mb-4">
//           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
//         </div>
//         <div className="text-text-secondary">Loading match data...</div>
//         <div className="text-xs text-text-secondary mt-2">If this persists, please go back to the home page and try again.</div>
//       </div>
//     );
//   }

//   const playerPnL = activeMatch.player.pnl;
//   const opponentPnL = activeMatch.opponent.pnl;
//   const leadingPlayer = playerPnL >= opponentPnL ? "player" : "opponent";

//   const total = Math.abs(playerPnL) + Math.abs(opponentPnL) + 0.01;
//   const playerProgress = (Math.abs(playerPnL) / total) * 100;

//   return (
//     <div>
//       {/* Match Header Card */}
//       <Card className="gradient-card rounded-xl p-5 border border-neutral/20 mb-6">
//         <CardContent className="p-0">
//           {/* Header */}
//           <div className="flex flex-col lg:flex-row justify-between mb-4">
//             <div className="mb-4 lg:mb-0">
//               <h2 className="text-2xl font-manrope font-bold mb-2">
//                 Live Match: You vs {activeMatch.opponent.username}
//               </h2>
//               <div className="flex items-center text-sm text-text-secondary">
//                 <span className="flex items-center mr-4">
//                   <i className="ri-time-line mr-1" />
//                   {formatTime(timeRemaining)} remaining
//                 </span>
//                 <span className="flex items-center">
//                   <i className="ri-coin-line mr-1" />
//                   Trading {activeMatch.market}
//                 </span>
//               </div>
//             </div>
//             <div className="flex space-x-3">
//               <Button
//                 variant="outline"
//                 className="bg-bg-primary"
//                 onClick={() => setShowSpectators(!showSpectators)}
//               >
//                 <i className="ri-eye-line mr-1" />
//                 Spectators ({activeMatch.spectators.length})
//               </Button>
//               <Button 
//                 variant="outline"
//                 className="bg-bg-primary mr-2"
//                 onClick={() => {
//                   // Force navigate to home page
//                   localStorage.removeItem('activeMatchData'); // Clear match data
//                   setLocation('/');
//                 }}
//               >
//                 <i className="ri-home-line mr-1"></i>
//                 Return Home
//               </Button>
//               <Button 
//                 variant="destructive"
//                 className="hover:bg-loss"
//                 onClick={handleForfeit}
//               >
//                 <i className="ri-close-line mr-1"></i>
//                 Forfeit
//               </Button>
//             </div>
//           </div>

//           {/* Spectators List */}
//           {showSpectators && activeMatch.spectators.length > 0 && (
//             <div className="mb-4 p-3 bg-bg-primary rounded-lg">
//               <p className="font-medium mb-2">Spectators</p>
//               <div className="flex flex-wrap gap-2">
//                 {activeMatch.spectators.map((spectator, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center bg-bg-secondary rounded-full px-3 py-1"
//                     title={spectator}
//                   >
//                     <Avatar className="h-5 w-5 mr-2">
//                       <AvatarFallback className="text-xs">
//                         {spectator.slice(0, 2)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="text-sm truncate">{spectator}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* PnL Progress Bar */}
//           <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg mb-6">
//             {/* Player */}
//             <div className="flex items-center">
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   playerPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden mr-3`}
//               >
//                 <span className="text-sm font-medium">You</span>
//               </div>
//               <div>
//                 <p className="font-medium">Your PnL</p>
//                 <p
//                   className={`${
//                     playerPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium`}
//                 >
//                   {playerPnL >= 0 ? "+" : ""}
//                   {playerPnL}%
//                 </p>
//               </div>
//             </div>

//             {/* Progress Indicator */}
//             <div className="text-center">
//               <div className="relative w-48 h-1.5 bg-bg-secondary rounded-full mb-1">
//                 <div
//                   className={`absolute top-0 h-full ${
//                     leadingPlayer === "player" ? "bg-profit left-0" : "bg-loss right-0"
//                   } rounded-full`}
//                   style={{ width: `${playerProgress}%` }}
//                 />
//               </div>
//               <p className="text-xs text-text-secondary">
//                 {leadingPlayer === "player"
//                   ? "You're leading!"
//                   : "Your opponent is ahead!"}
//               </p>
//             </div>

//             {/* Opponent */}
//             <div className="flex items-center">
//               <div>
//                 <p className="font-medium text-right">Opponent PnL</p>
//                 <p
//                   className={`${
//                     opponentPnL >= 0 ? "text-profit" : "text-loss"
//                   } font-mono font-medium text-right`}
//                 >
//                   {opponentPnL >= 0 ? "+" : ""}
//                   {opponentPnL}%
//                 </p>
//               </div>
//               <div
//                 className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
//                   opponentPnL >= 0 ? "border-profit" : "border-loss"
//                 } flex items-center justify-center overflow-hidden ml-3`}
//               >
//                 <span className="text-sm font-medium">
//                   {activeMatch.opponent.username.slice(0, 2).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Chart and Order Panel */}
//         <div className="lg:col-span-2 space-y-6">
//           <TradingChart market={activeMatch.market} />
//           <OrderPanel />
//         </div>

//         {/* Position & Activity */}
//         <div className="lg:col-span-1 space-y-6">
//           <PositionPanel />
//           <ActivityFeed matchId={activeMatch.id} />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import TradingChart from "@/components/TradingChart";
import OrderPanel from "@/components/OrderPanel";
import PositionPanel from "@/components/PositionPanel";
import ActivityFeed from "@/components/ActivityFeed";
import { useMatch } from "@/hooks/useMatch";
import { useToast } from "@/hooks/use-toast";

export default function MatchDashboard() {
  const { activeMatch, forfeitMatch, timeRemaining, formatTime, setActiveMatch, resetMatch } = useMatch();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showSpectators, setShowSpectators] = useState(false);
  
  // Track and display timer locally to ensure it's accurate
  const [localTimeRemaining, setLocalTimeRemaining] = useState<number | null>(null);
  
  // Initialize and maintain a local timer based on match data
  useEffect(() => {
    if (!activeMatch) return;
    
    // Initialize by calculating remaining time from match data
    const calculateRemainingTime = () => {
      try {
        // Verify that we have valid times
        if (!activeMatch.startTime || !activeMatch.duration) {
          console.warn('Invalid match time data:', { 
            startTime: activeMatch.startTime, 
            duration: activeMatch.duration 
          });
          return 0;
        }
        
        // Ensure startTime is in seconds (not milliseconds)
        let startTimeSec = activeMatch.startTime;
        // If startTime is abnormally large (likely in milliseconds), convert to seconds
        if (startTimeSec > 9999999999) { // Larger than year 2286
          startTimeSec = Math.floor(startTimeSec / 1000);
        }
        
        const startTimeMs = startTimeSec * 1000; // Convert to milliseconds
        const durationSeconds = Math.min(3600, activeMatch.duration); // Cap duration at 1 hour
        const currentTimeMs = Date.now();
        const elapsedSeconds = Math.floor((currentTimeMs - startTimeMs) / 1000);
        
        // Validate the result is reasonable (between 0 and match duration)
        const remaining = Math.max(0, Math.min(durationSeconds, durationSeconds - elapsedSeconds));
        console.log('Time calculation:', { startTimeMs, now: currentTimeMs, elapsed: elapsedSeconds, remaining });
        return remaining;
      } catch (error) {
        console.error('Error calculating time:', error);
        return 0; // Default to 0 if calculation fails
      }
    };
    
    // Initial calculation
    const initialRemaining = calculateRemainingTime();
    console.log('Match timer - Initial calculation:', initialRemaining, 'seconds');
    setLocalTimeRemaining(initialRemaining);
    
    // Set up local timer that updates every second
    const timerInterval = setInterval(() => {
      setLocalTimeRemaining(prev => {
        if (prev === null || prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    // Clean up
    return () => clearInterval(timerInterval);
  }, [activeMatch]);
  
  // Use our local timer instead of the one from useMatch if it's working
  const displayTimeRemaining = localTimeRemaining !== null && localTimeRemaining > 0 
    ? localTimeRemaining 
    : timeRemaining;

  const handleForfeit = async () => {
    if (!activeMatch) return;
    
    try {
      // Call the forfeit API
      await forfeitMatch();
      
      // Manually update the match state
      resetMatch(); // Clear active match state
      localStorage.removeItem('activeMatchData'); // Remove from localStorage
      
      // Show success message
      toast({
        title: "Match Forfeited",
        description: "You have forfeited the current match",
      });
      
      // Force navigation to home page
      window.location.href = window.location.origin;
    } catch (error) {
      toast({
        title: "Failed to Forfeit",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  // Check for match data
  if (!activeMatch) {
    return (
      <div className="text-center py-12">
        <div className="mb-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
        <div className="text-text-secondary">Loading match data...</div>
        <div className="text-xs text-text-secondary mt-2">If this persists, please go back to the home page and try again.</div>
      </div>
    );
  }

  const playerPnL = activeMatch.player.pnl;
  const opponentPnL = activeMatch.opponent.pnl;
  const leadingPlayer = playerPnL >= opponentPnL ? "player" : "opponent";

  const total = Math.abs(playerPnL) + Math.abs(opponentPnL) + 0.01;
  const playerProgress = (Math.abs(playerPnL) / total) * 100;

  return (
    <div>
      {/* Match Header Card */}
      <Card className="gradient-card rounded-xl p-5 border border-neutral/20 mb-6">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-manrope font-bold mb-2">
                Live Match: You vs {activeMatch.opponent.username}
              </h2>
              <div className="flex items-center text-sm text-text-secondary">
                <span className="flex items-center mr-4">
                  <i className="ri-time-line mr-1" />
                  {formatTime(displayTimeRemaining)} remaining
                </span>
                <span className="flex items-center">
                  <i className="ri-coin-line mr-1" />
                  Trading {activeMatch.market}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="bg-bg-primary mr-2"
                onClick={() => setShowSpectators(!showSpectators)}
              >
                <i className="ri-eye-line mr-1" />
                Spectators ({activeMatch.spectators.length})
              </Button>
              <Button 
                variant="destructive"
                className="hover:bg-loss"
                onClick={handleForfeit}
              >
                <i className="ri-close-line mr-1"></i>
                Forfeit
              </Button>
            </div>
          </div>

          {/* Spectators List */}
          {showSpectators && activeMatch.spectators.length > 0 && (
            <div className="mb-4 p-3 bg-bg-primary rounded-lg">
              <p className="font-medium mb-2">Spectators</p>
              <div className="flex flex-wrap gap-2">
                {activeMatch.spectators.map((spectator, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-bg-secondary rounded-full px-3 py-1"
                    title={spectator}
                  >
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback className="text-xs">
                        {spectator.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{spectator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PnL Progress Bar */}
          <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg mb-6">
            {/* Player */}
            <div className="flex items-center">
              <div
                className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
                  playerPnL >= 0 ? "border-profit" : "border-loss"
                } flex items-center justify-center overflow-hidden mr-3`}
              >
                <span className="text-sm font-medium">You</span>
              </div>
              <div>
                <p className="font-medium">Your PnL</p>
                <p
                  className={`${
                    playerPnL >= 0 ? "text-profit" : "text-loss"
                  } font-mono font-medium`}
                >
                  {playerPnL >= 0 ? "+" : ""}
                  {playerPnL}%
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="text-center">
              <div className="relative w-48 h-1.5 bg-bg-secondary rounded-full mb-1">
                <div
                  className={`absolute top-0 h-full ${
                    leadingPlayer === "player" ? "bg-profit left-0" : "bg-loss right-0"
                  } rounded-full`}
                  style={{ width: `${playerProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-secondary">
                {leadingPlayer === "player"
                  ? "You're leading!"
                  : "Your opponent is ahead!"}
              </p>
            </div>

            {/* Opponent */}
            <div className="flex items-center">
              <div>
                <p className="font-medium text-right">Opponent PnL</p>
                <p
                  className={`${
                    opponentPnL >= 0 ? "text-profit" : "text-loss"
                  } font-mono font-medium text-right`}
                >
                  {opponentPnL >= 0 ? "+" : ""}
                  {opponentPnL}%
                </p>
              </div>
              <div
                className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${
                  opponentPnL >= 0 ? "border-profit" : "border-loss"
                } flex items-center justify-center overflow-hidden ml-3`}
              >
                <span className="text-sm font-medium">
                  {activeMatch.opponent.username.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Order Panel */}
        <div className="lg:col-span-2 space-y-6">
          <TradingChart market={activeMatch.market} />
          <OrderPanel />
        </div>

        {/* Position & Activity */}
        <div className="lg:col-span-1 space-y-6">
          <PositionPanel />
          <ActivityFeed matchId={activeMatch.id} />
        </div>
      </div>
    </div>
  );
}

