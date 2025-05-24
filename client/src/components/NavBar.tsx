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

export default function NavBar() {
  const [location, setLocation] = useLocation();
  const { connected, userProfile, disconnect, address } = useWallet();
  const { toast } = useToast();
  const { activeMatch, matchEnded, matchSummary } = useMatch();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Initialize activeSection from localStorage for persistence
  const [activeSection, setActiveSection] = useState<string | null>(() => {
    try {
      const savedSection = localStorage.getItem('activeNavSection');
      return savedSection || null;
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      return null;
    }
  });
  
  // Save activeSection to localStorage whenever it changes
  useEffect(() => {
    try {
      if (activeSection) {
        localStorage.setItem('activeNavSection', activeSection);
      } else {
        localStorage.removeItem('activeNavSection');
      }
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [activeSection]);
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  
  // Function to add a new notification
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
    
    // Show toast for important notifications
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
  
  // Listen for WebSocket messages for notifications
  useEffect(() => {
    const handleWebSocketMessage = (event: MessageEvent) => {
      try {
        // Safely parse the data
        let data;
        if (typeof event.data === 'string') {
          try {
            data = JSON.parse(event.data);
          } catch (e) {
            return;
          }
        } else if (typeof event.data === 'object') {
          data = event.data;
        } else {
          return;
        }
        
        if (!data || !data.type) return;
        
        // Handle different notification types
        if (data.type === 'match_invite' && data.invitee === address) {
          addNotification({
            type: 'match_invite',
            title: 'New Match Invite',
            message: `${data.inviter} has invited you to a match!`,
            actionUrl: `/match?code=${data.inviteCode}`
          });
        }
        
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
  
  // Function to handle navigation
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <header className="sticky top-0 z-50 w-full border-b border-neutral/20" style={{ backgroundColor: "#000C28" }}>
      <div className="container flex h-16 items-center px-8 max-w-screen-xl mx-auto">
        <div className="flex w-full justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3" onClick={handleHomeClick}>
            <span className="text-xl font-bold cursor-pointer text-white">P2P PERPS</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 ml-14">
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('home');
                
                // Define a function to handle scrolling to top with smooth behavior
                const scrollToTop = () => {
                  try {
                    // Use smooth scrolling for better user experience
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    });
                    
                    // Also try to find the main element and scroll it smoothly
                    const mainElement = document.querySelector('main');
                    if (mainElement) {
                      mainElement.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }
                  } catch (err) {
                    // Fallback to regular scroll if smooth scroll fails
                    console.error('Error smooth scrolling:', err);
                    window.scrollTo(0, 0);
                  }
                };
                
                // If not on homepage, navigate to home first
                if (location !== '/') {
                  setLocation('/');
                  // Wait a bit longer after navigation
                  setTimeout(scrollToTop, 100);
                  return;
                }
                
                // On homepage, scroll immediately and also after a delay to be sure
                scrollToTop();
                setTimeout(scrollToTop, 50);
              }}
              className="cursor-pointer"
            >
              <span className={`text-base font-medium hover:text-white transition-colors ${location === '/' && activeSection !== 'leaderboard' ? 'text-white' : 'text-text-secondary'}`}>
                Home
              </span>
            </a>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // Set leaderboard as active section
                setActiveSection('leaderboard');
                
                // Use a direct hardcoded approach for more reliability
                const scrollToLeaderboard = () => {
                  // Scroll to a position where we're sure the leaderboard will be visible
                  // This is a simpler approach that should be more reliable than calculating positions
                  window.scrollTo(0, 900);
                };
                
                // If not on homepage, navigate to home first then scroll
                if (location !== '/') {
                  setLocation('/');
                  // Use a timeout to ensure navigation completes
                  setTimeout(scrollToLeaderboard, 100);
                } else {
                  // Already on homepage, scroll immediately
                  scrollToLeaderboard();
                }
              }}
              className="cursor-pointer"
            >
              <span className={`text-base font-medium hover:text-white transition-colors ${activeSection === 'leaderboard' ? 'text-white' : 'text-text-secondary'}`}>
                Leaderboard
              </span>
            </a>
            <Link href="/games" onClick={() => setActiveSection(null)}>
              <span className={`text-base font-medium hover:text-white transition-colors ${location === '/games' ? 'text-white' : 'text-text-secondary'}`}>
                Games
              </span>
            </Link>
            <Link href="/watch" onClick={() => setActiveSection(null)}>
              <span className={`text-base font-medium hover:text-white transition-colors ${location === '/watch' ? 'text-white' : 'text-text-secondary'}`}>
                Watch
              </span>
            </Link>
          </nav>
          
          {/* Right Section - Connect Wallet Button or Profile */}
          <div className="flex items-center gap-5">
            {!connected ? (
              <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white rounded-md py-2 px-6 h-10 font-medium">
                Connect Wallet
              </Button>
            ) : (
              <>
                {/* Notifications */}
                <div className="relative">
                  <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <i className="ri-notification-3-line text-xl"></i>
                        {hasUnread && (
                          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-accent-primary"></span>
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
                
                {/* Profile dropdown */}
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
        </div>
      </div>
    </header>
  );
}
