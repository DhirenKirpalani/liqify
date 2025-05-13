import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/hooks/use-toast";

export default function NavigationBar() {
  const [location] = useLocation();
  const { connected, userProfile, disconnect } = useWallet();
  const { toast } = useToast();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        <Link href="/">
          <h1 className="text-2xl font-bold font-manrope text-text-primary mr-8 cursor-pointer">CryptoArena</h1>
        </Link>
        <nav className="flex space-x-8">
          <Link href="/">
            <span className={location === "/" ? "text-accent-primary font-medium cursor-pointer" : "text-text-secondary hover:text-text-primary transition-colors cursor-pointer"}>
              Home
            </span>
          </Link>
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
                    <span className="absolute top-0 right-0 w-2 h-2 bg-accent-primary rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 text-center">
                    <p className="text-text-secondary">No new notifications</p>
                  </div>
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
