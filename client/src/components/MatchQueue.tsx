// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useWallet } from "@/hooks/useWallet";
// import { useMatch } from "@/hooks/useMatch";
// import { useToast } from "@/hooks/use-toast";

// export default function MatchQueue() {
//   const { connected } = useWallet();
//   const { joinQueue, createFriendMatch } = useMatch();
//   const { toast } = useToast();

//   const handleJoinQueue = async () => {
//     if (!connected) {
//       toast({
//         title: "Wallet Not Connected",
//         description: "Please connect your wallet to join a match",
//         variant: "destructive"
//       });
//       return;
//     }

//     try {
//       await joinQueue();
//       toast({
//         title: "Joined Queue",
//         description: "Looking for an opponent...",
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Join Queue",
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleCreateInvite = async () => {
//     if (!connected) {
//       toast({
//         title: "Wallet Not Connected",
//         description: "Please connect your wallet to create an invite",
//         variant: "destructive"
//       });
//       return;
//     }

//     try {
//       const inviteCode = await createFriendMatch();
//       toast({
//         title: "Invite Created",
//         description: `Share this code with your friend: ${inviteCode}`,
//       });
//     } catch (error) {
//       toast({
//         title: "Failed to Create Invite",
//         description: error instanceof Error ? error.message : "Unknown error occurred",
//         variant: "destructive"
//       });
//     }
//   };

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-manrope font-bold mb-4">Ready to Trade?</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {/* Quick Match Card */}
//         <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-accent-primary/50 transition-all">
//           <CardContent className="p-0">
//             <div className="flex justify-between items-start mb-4">
//               <div className="bg-accent-primary/20 p-2 rounded-lg">
//                 <i className="ri-sword-line text-xl text-accent-primary"></i>
//               </div>
//               <span className="bg-accent-primary/20 text-accent-primary text-xs px-2 py-1 rounded-full">Popular</span>
//             </div>
//             <h3 className="text-lg font-bold mb-1">Quick Match</h3>
//             <p className="text-text-secondary text-sm mb-4">Get matched with a random opponent and start trading instantly.</p>
//             <div className="flex items-center text-xs text-text-secondary mb-6">
//               <div className="flex items-center mr-4">
//                 <i className="ri-time-line mr-1"></i>
//                 <span>30 min</span>
//               </div>
//               <div className="flex items-center">
//                 <i className="ri-user-line mr-1"></i>
//                 <span>1v1</span>
//               </div>
//             </div>
//             <Button 
//               className="w-full py-2.5 px-4 bg-accent-primary text-bg-primary rounded-lg font-medium glow-button"
//               onClick={handleJoinQueue}
//             >
//               Join Queue
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Friend Match Card */}
//         <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-accent-secondary/50 transition-all">
//           <CardContent className="p-0">
//             <div className="flex justify-between items-start mb-4">
//               <div className="bg-accent-secondary/20 p-2 rounded-lg">
//                 <i className="ri-user-add-line text-xl text-accent-secondary"></i>
//               </div>
//             </div>
//             <h3 className="text-lg font-bold mb-1">Challenge a Friend</h3>
//             <p className="text-text-secondary text-sm mb-4">Invite a friend to a private trading match.</p>
//             <div className="flex items-center text-xs text-text-secondary mb-6">
//               <div className="flex items-center mr-4">
//                 <i className="ri-time-line mr-1"></i>
//                 <span>Custom</span>
//               </div>
//               <div className="flex items-center">
//                 <i className="ri-user-line mr-1"></i>
//                 <span>1v1</span>
//               </div>
//             </div>
//             <Button 
//               className="w-full py-2.5 px-4 bg-accent-secondary/90 hover:bg-accent-secondary text-text-primary rounded-lg font-medium transition-colors"
//               onClick={handleCreateInvite}
//             >
//               Create Invite
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Tournament Card */}
//         <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-neutral/50 transition-all">
//           <CardContent className="p-0">
//             <div className="flex justify-between items-start mb-4">
//               <div className="bg-neutral/20 p-2 rounded-lg">
//                 <i className="ri-trophy-line text-xl text-neutral"></i>
//               </div>
//               <span className="bg-neutral/20 text-neutral text-xs px-2 py-1 rounded-full">Coming Soon</span>
//             </div>
//             <h3 className="text-lg font-bold mb-1">Tournament</h3>
//             <p className="text-text-secondary text-sm mb-4">Compete in bracket-style tournaments for bigger prizes.</p>
//             <div className="flex items-center text-xs text-text-secondary mb-6">
//               <div className="flex items-center mr-4">
//                 <i className="ri-time-line mr-1"></i>
//                 <span>Varies</span>
//               </div>
//               <div className="flex items-center">
//                 <i className="ri-team-line mr-1"></i>
//                 <span>8+ players</span>
//               </div>
//             </div>
//             <Button 
//               className="w-full py-2.5 px-4 bg-neutral/30 text-neutral cursor-not-allowed rounded-lg font-medium"
//               disabled
//             >
//               Coming Soon
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { useMatch } from "@/hooks/useMatch";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function MatchQueue() {
  const { connected } = useWallet();
  const { joinQueue, createFriendMatch } = useMatch();
  const { toast } = useToast();
  
  // State for currency pair and duration
  const [currencyPair, setCurrencyPair] = useState("BTC/USDC");
  const [duration, setDuration] = useState("30"); // in minutes

  const handleJoinQueue = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to join a match",
        variant: "destructive"
      });
      return;
    }

    try {
      await joinQueue();
      toast({
        title: "Joined Queue",
        description: "Looking for an opponent...",
      });
    } catch (error) {
      toast({
        title: "Failed to Join Queue",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  const handleCreateInvite = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create an invite",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert duration from minutes to seconds
      const durationInSeconds = parseInt(duration) * 60;
      
      // Pass currency pair and duration to the createFriendMatch function
      const inviteCode = await createFriendMatch(currencyPair, durationInSeconds);
      toast({
        title: "Invite Created",
        description: `Share this code with your friend: ${inviteCode}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Create Invite",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-manrope font-bold mb-4">Ready to Trade?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Quick Match Card */}
        <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-accent-primary/50 transition-all">
          <CardContent className="p-0">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-accent-primary/20 p-2 rounded-lg">
                <i className="ri-sword-line text-xl text-accent-primary"></i>
              </div>
              <span className="bg-accent-primary/20 text-accent-primary text-xs px-2 py-1 rounded-full">Popular</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Quick Match</h3>
            <p className="text-text-secondary text-sm mb-4">Get matched with a random opponent and start trading instantly.</p>
            <div className="flex items-center text-xs text-text-secondary mb-6">
              <div className="flex items-center mr-4">
                <i className="ri-time-line mr-1"></i>
                <span>30 min</span>
              </div>
              <div className="flex items-center">
                <i className="ri-user-line mr-1"></i>
                <span>1v1</span>
              </div>
            </div>
            <Button 
              className="w-full py-2.5 px-4 bg-accent-primary text-bg-primary rounded-lg font-medium glow-button"
              onClick={handleJoinQueue}
            >
              Join Queue
            </Button>
          </CardContent>
        </Card>

        {/* Friend Match Card */}
        <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-accent-secondary/50 transition-all">
          <CardContent className="p-0">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-accent-secondary/20 p-2 rounded-lg">
                <i className="ri-user-add-line text-xl text-accent-secondary"></i>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">Challenge a Friend</h3>
            <p className="text-text-secondary text-sm mb-4">Invite a friend to a private trading match.</p>
            
            <div className="space-y-4 mb-4">
              <div>
                <Label htmlFor="currency-pair" className="text-sm">Currency Pair</Label>
                <Select 
                  value={currencyPair} 
                  onValueChange={setCurrencyPair}
                >
                  <SelectTrigger id="currency-pair" className="w-full mt-1">
                    <SelectValue placeholder="Select a currency pair" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BTC/USDC">BTC/USDC</SelectItem>
                    <SelectItem value="ETH/USDC">ETH/USDC</SelectItem>
                    <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                    <SelectItem value="ADA/USDC">ADA/USDC</SelectItem>
                    <SelectItem value="XRP/USDC">XRP/USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="match-duration" className="text-sm">Match Duration</Label>
                <Select 
                  value={duration} 
                  onValueChange={setDuration}
                >
                  <SelectTrigger id="match-duration" className="w-full mt-1">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Minutes</SelectItem>
                    <SelectItem value="30">30 Minutes</SelectItem>
                    <SelectItem value="60">60 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center text-xs text-text-secondary mb-4">
              <div className="flex items-center mr-4">
                <i className="ri-time-line mr-1"></i>
                <span>{duration} min</span>
              </div>
              <div className="flex items-center">
                <i className="ri-user-line mr-1"></i>
                <span>1v1</span>
              </div>
            </div>
            <Button 
              className="w-full py-2.5 px-4 bg-accent-secondary/90 hover:bg-accent-secondary text-text-primary rounded-lg font-medium transition-colors"
              onClick={handleCreateInvite}
            >
              Create Invite
            </Button>
          </CardContent>
        </Card>

        {/* Tournament Card */}
        <Card className="gradient-card rounded-xl p-5 border border-neutral/20 hover:border-neutral/50 transition-all">
          <CardContent className="p-0">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-neutral/20 p-2 rounded-lg">
                <i className="ri-trophy-line text-xl text-neutral"></i>
              </div>
              <span className="bg-neutral/20 text-neutral text-xs px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <h3 className="text-lg font-bold mb-1">Tournament</h3>
            <p className="text-text-secondary text-sm mb-4">Compete in bracket-style tournaments for bigger prizes.</p>
            <div className="flex items-center text-xs text-text-secondary mb-6">
              <div className="flex items-center mr-4">
                <i className="ri-time-line mr-1"></i>
                <span>Varies</span>
              </div>
              <div className="flex items-center">
                <i className="ri-team-line mr-1"></i>
                <span>8+ players</span>
              </div>
            </div>
            <Button 
              className="w-full py-2.5 px-4 bg-neutral/30 text-neutral cursor-not-allowed rounded-lg font-medium"
              disabled
            >
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

