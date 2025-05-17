// import { useState } from "react";
// import { useLocation, Link } from "wouter";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import WalletConnect from "@/components/WalletConnect";
// import { useWallet } from "@/hooks/useWallet";
// import { useToast } from "@/hooks/use-toast";

// export default function NavigationBar() {
//   const [location] = useLocation();
//   const { connected, userProfile, disconnect } = useWallet();
//   const { toast } = useToast();
//   const [notificationsOpen, setNotificationsOpen] = useState(false);

//   const handleDisconnect = async () => {
//     await disconnect();
//     toast({
//       title: "Wallet Disconnected",
//       description: "Your wallet has been disconnected",
//     });
//   };

//   return (
//     <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-bg-secondary border-b border-neutral/20 sticky top-0 z-50">
//       <div className="flex items-center">
//         <Link href="/">
//           <h1 className="text-2xl font-bold font-manrope text-text-primary mr-8 cursor-pointer">CryptoArena</h1>
//         </Link>
//         <nav className="flex space-x-8">
//           <Link href="/">
//             <span className={location === "/" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
//               Home
//             </span>
//           </Link>
//           <Link href="/match">
//             <span className={location === "/match" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
//               Match
//             </span>
//           </Link>
//           <Link href="/leaderboard">
//             <span className={location === "/leaderboard" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
//               Leaderboard
//             </span>
//           </Link>
//           <Link href="/reels">
//             <span className={location === "/reels" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
//               Reels
//             </span>
//           </Link>
//         </nav>
//       </div>
//       <div className="flex items-center space-x-4">
//         <WalletConnect />
        
//         {connected && (
//           <>
//             <div className="relative">
//               <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="icon" className="relative rounded-full">
//                     <i className="ri-notification-3-line text-xl"></i>
//                     <span className="absolute top-0 right-0 w-2 h-2 bg-accent-primary rounded-full"></span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-80">
//                   <div className="p-4 text-center">
//                     <p className="text-text-secondary">No new notifications</p>
//                   </div>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
            
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Avatar className="h-9 w-9 bg-accent-secondary/20 cursor-pointer">
//                   <AvatarFallback>{userProfile?.username?.slice(0, 2) || "JD"}</AvatarFallback>
//                 </Avatar>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <Link href="/profile">
//                   <DropdownMenuItem className="cursor-pointer">
//                     <i className="ri-user-3-line mr-2"></i> Profile
//                   </DropdownMenuItem>
//                 </Link>
//                 <Link href="/wallet">
//                   <DropdownMenuItem className="cursor-pointer">
//                     <i className="ri-wallet-3-line mr-2"></i> Wallet
//                   </DropdownMenuItem>
//                 </Link>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
//                   <i className="ri-logout-box-line mr-2"></i> Disconnect
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </>
//         )}
//       </div>
//     </header>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useMatch } from "@/hooks/useMatch";
import { ScrollArea } from "@/components/ui/scroll-area";

// Define notification types
type NotificationType = 'match_invite' | 'match_forfeit' | 'match_end' | 'leaderboard_update' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

export default function NavigationBar() {
  const [location, setLocation] = useLocation();
  const { connected, userProfile, disconnect, address } = useWallet();
  const { toast } = useToast();
  const { activeMatch, matchEnded, matchSummary } = useMatch();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  
  // Function to add a new notification (memoized to prevent unnecessary re-renders)
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    console.log('Adding notification:', notification.title);
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 20)); // Keep only the 20 most recent
    setHasUnread(true);
    
    // Also show a toast for important notifications like match forfeit
    if (notification.type === 'match_forfeit' || notification.type === 'match_end') {
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  }, [toast]);
  
  // Mark all notifications as read when dropdown is opened
  useEffect(() => {
    if (notificationsOpen && hasUnread) {
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setHasUnread(false);
    }
  }, [notificationsOpen, hasUnread]);
  
  // Listen for match events to create notifications
  useEffect(() => {
    // Listen for WebSocket messages for real-time notifications
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        // Safely parse the data, handling both string and object formats
        let data;
        if (typeof event.data === 'string') {
          try {
            data = JSON.parse(event.data);
          } catch (e) {
            // Invalid JSON string, skip processing
            return;
          }
        } else if (typeof event.data === 'object') {
          // Data is already an object
          data = event.data;
        } else {
          // Unsupported data type
          return;
        }
        
        // Validate that we have a proper data object with a type
        if (!data || !data.type) return;
        
        console.log('WebSocket notification received:', data.type);
        
        // Match invite notification
        if (data.type === 'match_invite' && data.invitee === address) {
          addNotification({
            type: 'match_invite',
            title: 'New Match Invite',
            message: `${data.inviter} has invited you to a match!`,
            actionUrl: `/match?code=${data.inviteCode}`
          });
        }
        
        // Match forfeit notification (for invitee)
        if (data.type === 'match_forfeited' && data.matchId === activeMatch?.id) {
          addNotification({
            type: 'match_forfeit',
            title: 'Match Forfeited',
            message: 'Your opponent has forfeited the match.',
            actionUrl: '/'
          });
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    window.addEventListener('message', handleWebSocketMessage);
    
    return () => {
      window.removeEventListener('message', handleWebSocketMessage);
    };
  }, [activeMatch, address, addNotification]);
  
  // Create notification when a match ends
  useEffect(() => {
    if (matchEnded && matchSummary) {
      const isWinner = matchSummary.playerPnl > matchSummary.opponentPnl;
      
      addNotification({
        type: 'match_end',
        title: isWinner ? '🏆 Victory!' : '😞 Defeat',
        message: `Match vs ${matchSummary.opponentName} has ended. ${isWinner ? 'You won!' : 'Better luck next time!'}`,
        actionUrl: '/'
      });
    }
  }, [matchEnded, matchSummary, addNotification]);
  
  // Add direct method to handle forfeit - this gets exported and can be used by Match components
  const addForfeitNotification = useCallback((opponentName: string = 'Opponent') => {
    addNotification({
      type: 'match_forfeit',
      title: 'Match Forfeited',
      message: `${opponentName} has forfeited the match.`,
      actionUrl: '/'
    });
  }, [addNotification]);
  
  // Expose the notification functions to window for component communication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // This allows other components to trigger notifications without direct imports
      (window as any).cryptoArenaNotifications = {
        addForfeitNotification,
        addNotification: (data: any) => {
          if (data && data.type && data.title && data.message) {
            addNotification(data);
          }
        }
      };
    }
    
    return () => {
      // Clean up when component unmounts
      if (typeof window !== 'undefined') {
        delete (window as any).cryptoArenaNotifications;
      }
    };
  }, [addForfeitNotification, addNotification]);
  
  // Sample notification for testing - this adds a notification 5 seconds after component mounts
  useEffect(() => {
    if (!connected) return;
    
    // Add a welcome notification after a delay
    const timer = setTimeout(() => {
      addNotification({
        type: 'system',
        title: 'Welcome to CryptoArena',
        message: 'Ready to challenge other traders? Join a match now!',
        actionUrl: '/'
      });
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [connected]);
  
  // Function to handle navigation that works even during active matches
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Force navigation to home page regardless of match state
    setLocation("/");
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <header className="hidden lg:flex items-center justify-between px-6 py-4 bg-bg-secondary border-b border-neutral/20 sticky top-0 z-50">
      <div className="flex items-center">
        <div onClick={handleHomeClick}>
          <h1 className="text-2xl font-bold font-manrope text-text-primary mr-8 cursor-pointer">CryptoArena</h1>
        </div>
        <nav className="flex space-x-8">
          <div onClick={handleHomeClick}>
            <span className={location === "/" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
              Home
            </span>
          </div>
          <Link href="/match">
            <span className={location === "/match" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
              Match
            </span>
          </Link>
          <Link href="/leaderboard">
            <span className={location === "/leaderboard" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
              Leaderboard
            </span>
          </Link>
          <Link href="/reels">
            <span className={location === "/reels" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
              Reels
            </span>
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <WalletConnect />
        
        {connected && (
          <>
            <div className="relative">
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <i className="ri-notification-3-line text-xl"></i>
                    {hasUnread && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-accent-primary rounded-full animate-pulse"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="py-2 px-4 border-b border-neutral/20">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  
                  {notifications.length > 0 ? (
                    <ScrollArea className="h-[300px]">
                      {notifications.map(notification => {
                        // Get icon based on notification type
                        let icon = "ri-information-line";
                        if (notification.type === 'match_invite') icon = "ri-user-add-line";
                        if (notification.type === 'match_forfeit') icon = "ri-flag-line";
                        if (notification.type === 'match_end') icon = notification.title.includes('Victory') ? "ri-trophy-line" : "ri-emotion-sad-line";
                        if (notification.type === 'leaderboard_update') icon = "ri-bar-chart-line";
                        
                        return (
                          <div 
                            key={notification.id} 
                            className={`py-3 px-4 border-b border-neutral/10 hover:bg-bg-secondary ${!notification.read ? 'bg-bg-secondary/50' : ''}`}
                            onClick={() => {
                              if (notification.actionUrl) {
                                setLocation(notification.actionUrl);
                                setNotificationsOpen(false);
                              }
                            }}
                          >
                            <div className="flex items-start">
                              <div className={`mr-3 p-1.5 rounded-full bg-accent-secondary/20 ${!notification.read ? 'text-accent-primary' : 'text-text-secondary'}`}>
                                <i className={`${icon} text-lg`}></i>
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium text-sm ${!notification.read ? 'text-text-primary' : 'text-text-secondary'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-text-secondary mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-text-tertiary mt-2">
                                  {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </ScrollArea>
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-text-secondary">No notifications</p>
                    </div>
                  )}
                  
                  {notifications.length > 0 && (
                    <div className="py-2 px-4 border-t border-neutral/20">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => setNotifications([])}
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 bg-accent-secondary/20 cursor-pointer">
                  <AvatarFallback>{userProfile?.username?.slice(0, 2) || "JD"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <i className="ri-user-3-line mr-2"></i> Profile
                  </DropdownMenuItem>
                </Link>
                <Link href="/wallet">
                  <DropdownMenuItem className="cursor-pointer">
                    <i className="ri-wallet-3-line mr-2"></i> Wallet
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer">
                  <i className="ri-logout-box-line mr-2"></i> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}

