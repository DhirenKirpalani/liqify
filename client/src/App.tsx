import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/hooks/useWebSocket";
import { WalletProvider } from "@/hooks/useWallet";
import { MatchProvider } from "@/hooks/useMatch";

import NavigationBar from "@/components/NavigationBar";
import MobileNavigation from "@/components/MobileNavigation";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Leaderboard from "@/pages/Leaderboard";
import Reels from "@/pages/Reels";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import CandlestickChartPage from "@/pages/CandlestickChart";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex flex-col h-screen bg-bg-primary text-text-primary overflow-hidden">
      <NavigationBar />
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/match" component={Match} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/reels" component={Reels} />
          <Route path="/profile" component={Profile} />
          <Route path="/admin" component={Admin} />
          <Route path="/charts/:symbol" component={CandlestickChartPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <MobileNavigation />
    </div>
  );
}

function App() {
  useEffect(() => {
    // Set theme to dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <WalletProvider>
          <MatchProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </MatchProvider>
        </WalletProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  );
}

export default App;
