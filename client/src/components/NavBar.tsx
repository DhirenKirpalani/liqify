import { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";
import { useMatch } from "@/hooks/useMatch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
  
  // Function to scroll to leaderboard section
  const scrollToLeaderboard = () => {
    // Find the leaderboard section by its ID
    const leaderboardSection = document.getElementById('leaderboard-section');
    
    if (leaderboardSection) {
      // If found, scroll to it with smooth behavior
      leaderboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to a reasonable scroll position if element not found
      console.log('Leaderboard section not found, using fallback scroll');
      window.scrollTo({ top: 900, behavior: 'smooth' });
    }
  };
  
  // Maintain persistence - scroll to leaderboard if it was the active section
  useEffect(() => {
    // Only execute on the homepage
    if (location === '/' && activeSection === 'leaderboard') {
      // Short delay to ensure DOM is fully loaded
      setTimeout(scrollToLeaderboard, 500);
    }
  }, [location]);
  
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
  
  // Define a function to handle scrolling to top with smooth behavior
  const scrollToTop = () => {
    console.log('Scrolling to top');
    try {
      // First, ensure the window position is reset
      window.scrollTo(0, 0);
      
      // Force browser-specific scrolling
      // For Safari
      if (document.body) {
        document.body.scrollTop = 0;
      }
      
      // For Chrome, Firefox, IE and Opera
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Reset any scrollable elements that might be causing issues
      document.querySelectorAll('.overflow-auto, .overflow-y-auto, .overflow-scroll, .overflow-y-scroll').forEach(element => {
        if (element instanceof HTMLElement) {
          element.scrollTop = 0;
        }
      });
      
      // Also try to scroll the main element if it exists
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
      
      // Try smooth scrolling for better user experience
      setTimeout(() => {
        try {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
          
          // Also ensure the document body/html are scrolled to top
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        } catch (error) {
          console.log('Smooth scroll not supported');
        }
      }, 50);
    } catch (err) {
      // Fallback to regular scroll if smooth scroll fails
      console.error('Error smooth scrolling:', err);
      window.scrollTo(0, 0);
    }
  };
  
  // Function to handle navigation and scroll to top
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If already on home page, just scroll to top
    if (location === '/') {
      scrollToTop();
    } else {
      // Navigate to home page
      setLocation("/");
      
      // Longer delay to ensure navigation and rendering completes before scrolling
      // This is important when switching between different pages/components
      setTimeout(() => {
        scrollToTop();
        
        // Additional safety check - try again after a slightly longer delay
        // This ensures the content has fully loaded before scrolling
        setTimeout(() => {
          scrollToTop();
        }, 300);
      }, 200);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[#00F0FF]/20 shadow-md" style={{ backgroundColor: "#0E0E10", height: "64px" }}>
      <div className="container flex h-16 items-center px-8 max-w-screen-xl mx-auto">
        <div className="flex w-full justify-between items-center">
          {/* Function to scroll to top of the page */}
          {(() => {
            const scrollToTop = () => {
  // Scroll to top with smooth behavior
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
  
  // Additional backup methods for older browsers that don't support smooth scrolling
  // These won't be smooth but serve as fallbacks
  setTimeout(() => {
    if (window.pageYOffset > 0) {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      
      // Also scroll the main element if it exists
      const mainElement = document.querySelector('main');
      if (mainElement && mainElement.scrollTop > 0) {
        mainElement.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, 100);
};
            
            // Make scrollToTop available globally for other components
            (window as any).scrollToTop = scrollToTop;
            
            return null;
          })()}
          
          <div className="flex items-center gap-3">
            {/* LIQIFY Logo and Brand for desktop - clicking navigates to home */}
            <div 
              className="hidden md:flex items-center gap-2 mr-8 cursor-pointer" 
              onClick={handleHomeClick}
            >
              <Logo size={28} />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#90D8E4]">LIQIFY</span>
            </div>
            
            {/* Mobile Hamburger Menu */}
            <div className="md:hidden mr-2">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#00F0FF]/10">
                    <i className="ri-menu-line text-xl"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#0E0E10] border-r border-[#00F0FF]/20 p-0 w-[280px]">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-[#00F0FF]/20">
                      <div 
                        className="flex items-center gap-2 cursor-pointer" 
                        onClick={() => {
                          setLocation("/"); // Navigate to home
                          setMobileMenuOpen(false);
                          // Use setTimeout to ensure navigation completes before scrolling
                          setTimeout(() => {
                            scrollToTop();
                          }, 300);
                        }}
                      >
                        <Logo size={24} />
                        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00F0FF] to-[#90D8E4]">LIQIFY</h3>
                      </div>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                      <nav className="flex flex-col space-y-4">
                        <div 
                          onClick={(e) => {
                            // Set home as active section
                            setActiveSection('home');
                            // Use handleHomeClick which handles both navigation and scrolling
                            handleHomeClick(e);
                            // Close mobile menu
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center p-2 rounded-md cursor-pointer ${location === '/' && activeSection !== 'leaderboard' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}
                        >
                          <i className="ri-home-5-line text-xl mr-3"></i>
                          <span className="font-medium">Home</span>
                        </div>
                        <Link href="/match" onClick={() => {
                          setActiveSection(null);
                          setMobileMenuOpen(false);
                        }}>
                          <div className={`flex items-center p-2 rounded-md ${location === '/match' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}>
                            <i className="ri-sword-line text-xl mr-3"></i>
                            <span className="font-medium">Play</span>
                          </div>
                        </Link>
                        <div 
                          onClick={(e) => {
                            e.preventDefault();
                            // Set leaderboard as active section
                            setActiveSection('leaderboard');
                            // Close mobile menu
                            setMobileMenuOpen(false);
                            
                            // If not on homepage, navigate to home first
                            if (location !== '/') {
                              setLocation('/');
                              // The scrollToLeaderboard will be triggered by the useEffect when location changes
                            } else {
                              // Already on homepage, scroll immediately to leaderboard section
                              // Using the same technique as in desktop navigation
                              const leaderboardSection = document.querySelector('#leaderboard-section');
                              if (leaderboardSection) {
                                leaderboardSection.scrollIntoView({ behavior: 'smooth' });
                              }
                            }
                          }}
                          className={`flex items-center p-2 rounded-md cursor-pointer ${activeSection === 'leaderboard' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}
                        >
                          <i className="ri-bar-chart-line text-xl mr-3"></i>
                          <span className="font-medium">Leaderboard</span>
                        </div>
                        <Link href="/games" onClick={() => {
                          setActiveSection(null);
                          setMobileMenuOpen(false);
                        }}>
                          <div className={`flex items-center p-2 rounded-md ${location === '/games' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}>
                            <i className="ri-gamepad-line text-xl mr-3"></i>
                            <span className="font-medium">Games</span>
                          </div>
                        </Link>
                        <Link href="/watch" onClick={() => {
                          setActiveSection(null);
                          setMobileMenuOpen(false);
                        }}>
                          <div className={`flex items-center p-2 rounded-md ${location === '/watch' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}>
                            <i className="ri-tv-line text-xl mr-3"></i>
                            <span className="font-medium">Watch</span>
                          </div>
                        </Link>
                        <Link href="/reels" onClick={() => {
                          setActiveSection(null);
                          setMobileMenuOpen(false);
                        }}>
                          <div className={`flex items-center p-2 rounded-md ${location === '/reels' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}>
                            <i className="ri-film-line text-xl mr-3"></i>
                            <span className="font-medium">Reels</span>
                          </div>
                        </Link>
                        <div 
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection(null);
                            setMobileMenuOpen(false);
                            // Check if wallet is connected before navigating to profile
                            if (connected) {
                              setLocation('/profile');
                            } else {
                              // If not connected, show a toast notification
                              toast({
                                title: "Wallet not connected",
                                description: "Please connect your wallet to view your profile",
                                variant: "destructive"
                              });
                            }
                          }}
                          className={`flex items-center p-2 rounded-md cursor-pointer ${location === '/profile' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}
                        >
                          <i className="ri-user-3-line text-xl mr-3"></i>
                          <span className="font-medium">Profile</span>
                        </div>
                        <div 
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection(null);
                            setMobileMenuOpen(false);
                            // Check if wallet is connected before navigating to wallet
                            if (connected) {
                              setLocation('/wallet');
                            } else {
                              // If not connected, show a toast notification
                              toast({
                                title: "Wallet not connected",
                                description: "Please connect your wallet to view your wallet",
                                variant: "destructive"
                              });
                            }
                          }}
                          className={`flex items-center p-2 rounded-md cursor-pointer ${location === '/wallet' ? 'bg-[#00F0FF]/10 text-white' : 'text-text-secondary'}`}
                        >
                          <i className="ri-wallet-3-line text-xl mr-3"></i>
                          <span className="font-medium">Wallet</span>
                        </div>
                      </nav>
                    </ScrollArea>
                    <div className="p-4 border-t border-[#00F0FF]/20">
                      {connected ? (
                        <Button 
                          onClick={() => {
                            handleDisconnect();
                            setMobileMenuOpen(false);
                          }} 
                          variant="ghost" 
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <i className="ri-logout-box-line mr-2"></i> Disconnect
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white"
                        >
                          Connect Wallet
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Mobile version of logo is handled in the mobile menu */}
          </div>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 ml-14">
            <a 
              href="#" 
              onClick={(e) => {
                setActiveSection('home');
                // Use handleHomeClick which handles both navigation and scrolling
                handleHomeClick(e);
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
                
                // If not on homepage, navigate to home first then scroll
                if (location !== '/') {
                  setLocation('/');
                  // The scrollToLeaderboard will be triggered by the useEffect when location changes
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
                    <DropdownMenuContent align="end" className="w-80 text-white rounded-md shadow-lg bg-[#0E0E10] border border-[#00F0FF]/20">
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
                  <DropdownMenuContent align="end" className="text-white rounded-md shadow-lg bg-[#0E0E10] border border-[#00F0FF]/20">
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">
                        <i className="ri-user-3-line mr-2"></i> Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/wallet">
                      <DropdownMenuItem className="cursor-pointer text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">
                        <i className="ri-wallet-3-line mr-2"></i> Wallet
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer text-white hover:bg-[#00F0FF]/10 py-3 transition-colors duration-200">
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
