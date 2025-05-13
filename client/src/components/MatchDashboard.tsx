import { useState } from "react";
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
  const { activeMatch, forfeitMatch, timeRemaining, formatTime } = useMatch();
  const { toast } = useToast();
  const [showSpectators, setShowSpectators] = useState(false);

  const handleForfeit = async () => {
    if (!activeMatch) return;
    
    try {
      await forfeitMatch();
      toast({
        title: "Match Forfeited",
        description: "You have forfeited the current match",
      });
    } catch (error) {
      toast({
        title: "Failed to Forfeit",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  if (!activeMatch) {
    return (
      <div className="text-center py-12">
        <div className="text-text-secondary">No active match available</div>
      </div>
    );
  }

  const leadingPlayer = activeMatch.player.pnl >= activeMatch.opponent.pnl ? 'player' : 'opponent';
  const progressWidth = Math.abs(activeMatch.player.pnl) / (Math.abs(activeMatch.player.pnl) + Math.abs(activeMatch.opponent.pnl) + 0.01) * 100;

  return (
    <div>
      <Card className="gradient-card rounded-xl p-5 border border-neutral/20 mb-6">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl font-manrope font-bold mb-2">Live Match: You vs {activeMatch.opponent.username}</h2>
              <div className="flex items-center text-sm text-text-secondary">
                <span className="flex items-center mr-4">
                  <i className="ri-time-line mr-1"></i>
                  {formatTime(timeRemaining)} remaining
                </span>
                <span className="flex items-center">
                  <i className="ri-coin-line mr-1"></i>
                  Trading {activeMatch.market}
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                className="bg-bg-primary"
                onClick={() => setShowSpectators(!showSpectators)}
              >
                <i className="ri-eye-line mr-1"></i>
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
          
          {showSpectators && activeMatch.spectators.length > 0 && (
            <div className="mb-4 p-3 bg-bg-primary rounded-lg">
              <p className="font-medium mb-2">Spectators</p>
              <div className="flex flex-wrap gap-2">
                {activeMatch.spectators.map((spectator, index) => (
                  <div key={index} className="flex items-center bg-bg-secondary rounded-full px-3 py-1">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarFallback className="text-xs">{spectator.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{spectator}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg mb-6">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${activeMatch.player.pnl >= 0 ? 'border-profit' : 'border-loss'} flex items-center justify-center overflow-hidden mr-3`}>
                <span className="text-sm font-medium">You</span>
              </div>
              <div>
                <p className="font-medium">Your PnL</p>
                <p className={`${activeMatch.player.pnl >= 0 ? 'text-profit' : 'text-loss'} font-mono font-medium`}>
                  {activeMatch.player.pnl >= 0 ? '+' : ''}{activeMatch.player.pnl}%
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="relative w-48 h-1.5 bg-bg-secondary rounded-full mb-1">
                <div 
                  className={`absolute top-0 ${leadingPlayer === 'player' ? 'left-0' : 'right-0'} h-full ${leadingPlayer === 'player' ? 'bg-profit' : 'bg-loss'} rounded-full`}
                  style={{ width: `${progressWidth}%` }}
                ></div>
              </div>
              <p className="text-xs text-text-secondary">
                {leadingPlayer === 'player' ? "You're leading!" : "Your opponent is ahead!"}
              </p>
            </div>
            <div className="flex items-center">
              <div>
                <p className="font-medium text-right">Opponent PnL</p>
                <p className={`${activeMatch.opponent.pnl >= 0 ? 'text-profit' : 'text-loss'} font-mono font-medium text-right`}>
                  {activeMatch.opponent.pnl >= 0 ? '+' : ''}{activeMatch.opponent.pnl}%
                </p>
              </div>
              <div className={`h-10 w-10 rounded-full bg-bg-secondary border-2 ${activeMatch.opponent.pnl >= 0 ? 'border-profit' : 'border-loss'} flex items-center justify-center overflow-hidden ml-3`}>
                <span className="text-sm font-medium">{activeMatch.opponent.username.slice(0, 2).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart and Trading Panel */}
        <div className="lg:col-span-2">
          {/* Trading Chart */}
          <TradingChart market={activeMatch.market} />
          
          {/* Order Panel */}
          <OrderPanel />
        </div>
        
        {/* Position & Activity Panel */}
        <div className="lg:col-span-1">
          {/* Current Position */}
          <PositionPanel />
          
          {/* Activity Feed */}
          <ActivityFeed matchId={activeMatch.id} />
        </div>
      </div>
    </div>
  );
}
