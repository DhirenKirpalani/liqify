import { useEffect } from "react";
import { useLocation } from "wouter";
import MatchDashboard from "@/components/MatchDashboard";
import { useMatch } from "@/hooks/useMatch";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Match() {
  const [, setLocation] = useLocation();
  const { activeMatch, matchEnded } = useMatch();
  const { connected } = useWallet();

  useEffect(() => {
    if (matchEnded) {
      // Redirect to home to show post-match summary
      setLocation("/");
    }
  }, [matchEnded, setLocation]);

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

  if (!activeMatch) {
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

  return <MatchDashboard />;
}
