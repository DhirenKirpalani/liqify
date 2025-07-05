import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export function NotificationTest() {
  const { toast } = useToast();

  const showSuccessNotification = () => {
    toast({
      title: "Success!",
      description: "Your trade was executed successfully.",
      duration: 3000,
    });
  };

  const showWarningNotification = () => {
    toast({
      title: "Warning",
      description: "Your position is approaching liquidation threshold.",
      variant: "destructive",
      duration: 4000,
    });
  };

  const showInfoNotification = () => {
    toast({
      title: "Market Update",
      description: "BTC price has increased by 5% in the last hour.",
      duration: 5000,
    });
  };

  const showErrorNotification = () => {
    toast({
      title: "Error",
      description: "Failed to execute trade. Insufficient balance.",
      variant: "destructive",
      duration: 6000,
    });
  };

  const showLeaderboardUpdate = () => {
    toast({
      title: "Leaderboard Update!",
      description: "You've moved up to rank #3! Keep trading!",
      duration: 4000,
    });
  };

  const showChallengReminder = () => {
    toast({
      title: "Challenge Starting Soon!",
      description: "The trading competition starts in 5 minutes.",
      duration: 8000,
    });
  };

  return (
    <div className="gaming-card nft-card p-6 rounded-xl space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-6 w-6 text-cyber-blue" />
        <h3 className="text-xl font-bold gradient-text-primary">Notification Test Center</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          onClick={showSuccessNotification}
          className="gaming-button flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Success
        </Button>
        
        <Button 
          onClick={showWarningNotification}
          className="gaming-button flex items-center gap-2"
          variant="destructive"
        >
          <AlertTriangle className="h-4 w-4" />
          Warning
        </Button>
        
        <Button 
          onClick={showInfoNotification}
          className="gaming-button flex items-center gap-2"
          variant="secondary"
        >
          <Info className="h-4 w-4" />
          Info
        </Button>
        
        <Button 
          onClick={showErrorNotification}
          className="gaming-button flex items-center gap-2"
          variant="destructive"
        >
          <X className="h-4 w-4" />
          Error
        </Button>
        
        <Button 
          onClick={showLeaderboardUpdate}
          className="gaming-button flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Rank Update
        </Button>
        
        <Button 
          onClick={showChallengReminder}
          className="gaming-button flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          Challenge Alert
        </Button>
      </div>
      
      <p className="text-sm text-gray-400 mt-4">
        Click any button to test different notification types. Notifications will appear in the top-right corner.
      </p>
    </div>
  );
}