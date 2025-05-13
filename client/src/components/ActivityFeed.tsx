import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";

interface ActivityFeedProps {
  matchId: string;
}

type ActivityItem = {
  id: string;
  type: 'open_position' | 'close_position' | 'match_started' | 'player_joined' | 'other';
  user: string;
  isCurrentUser: boolean;
  details: string;
  timestamp: number;
};

export default function ActivityFeed({ matchId }: ActivityFeedProps) {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const { socket } = useWebSocket();
  
  const { data: activities, isLoading } = useQuery<ActivityItem[]>({
    queryKey: [`/api/matches/${matchId}/activity`],
  });

  // Subscribe to match activity updates
  useEffect(() => {
    if (!socket) return;

    const handleActivityUpdate = (data: any) => {
      if (data.matchId === matchId) {
        // Could invalidate the query cache here to trigger a refetch
      }
    };
    
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'activity') {
          handleActivityUpdate(data);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    });
    
    return () => {
      // No need to remove event listener as the socket itself will be cleaned up
      // in the useWebSocket hook
    };
  }, [socket, matchId]);

  // Auto scroll to bottom when new activities come in
  useEffect(() => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTop = feedContainerRef.current.scrollHeight;
    }
  }, [activities]);

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case 'open_position':
        return "ri-arrow-up-line";
      case 'close_position':
        return "ri-close-circle-line";
      case 'match_started':
        return "ri-flag-line";
      case 'player_joined':
        return "ri-user-add-line";
      default:
        return "ri-information-line";
    }
  };

  const getColorForActivityType = (type: string) => {
    switch (type) {
      case 'open_position':
        return "bg-profit/20 text-profit";
      case 'close_position':
        return "bg-loss/20 text-loss";
      case 'match_started':
        return "bg-neutral/20 text-neutral";
      case 'player_joined':
        return "bg-accent-secondary/20 text-accent-secondary";
      default:
        return "bg-neutral/20 text-neutral";
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} minutes ago`;
    } else {
      return `${Math.floor(diff / 3600000)} hours ago`;
    }
  };

  return (
    <Card className="gradient-card rounded-xl p-4 border border-neutral/20">
      <CardContent className="p-0">
        <h3 className="font-medium mb-4">Activity Feed</h3>
        <div ref={feedContainerRef} className="space-y-4 h-96 overflow-y-auto pr-2">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))
          ) : activities?.length ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start p-3 bg-bg-primary rounded-lg">
                <div className={`w-8 h-8 rounded-full ${getColorForActivityType(activity.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
                  <i className={getIconForActivityType(activity.type)}></i>
                </div>
                <div>
                  <p className="font-medium">
                    {activity.isCurrentUser ? 'You' : activity.user} {activity.type.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-text-secondary">{activity.details}</p>
                  <p className="text-xs text-text-secondary mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-text-secondary">
              No activity yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
