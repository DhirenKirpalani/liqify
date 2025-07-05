import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/wallet-provider";
import { NotificationProvider } from "@/components/notification-modal";
import { SplashScreenProvider } from "@/components/splash-screen";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Legal from "@/pages/legal";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/legal" component={Legal} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <WalletProvider>
          <TooltipProvider>
            <SplashScreenProvider>
              <div className="dark min-h-screen bg-dark-bg text-white">
                <Router />
              </div>
            </SplashScreenProvider>
          </TooltipProvider>
        </WalletProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
