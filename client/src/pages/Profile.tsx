import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/hooks/useWallet";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

type UserProfile = {
  id: number;
  username: string;
  avatar?: string;
  bio?: string;
  stats: {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    totalPnl: number;
    arenaTokens: number;
    followers: number;
    following: number;
  };
  matchHistory: Array<{
    id: number;
    date: string;
    opponent: string;
    pnl: number;
    result: 'win' | 'loss';
  }>;
};

export default function Profile() {
  const { connected, address } = useWallet();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/profile'],
    enabled: connected,
  });

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-4">
              Please connect your wallet to view your profile.
            </p>
            <Button 
              className="w-full bg-accent-primary text-bg-primary"
              onClick={() => setLocation("/")}
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 max-w-5xl">
      <Card className="gradient-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {isLoading ? (
              <Skeleton className="w-24 h-24 rounded-full" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-accent-secondary/20 flex items-center justify-center text-2xl font-bold overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  profile?.username.slice(0, 2).toUpperCase()
                )}
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2" />
                  <Skeleton className="h-4 w-full max-w-md mx-auto md:mx-0 mb-4" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-1">{profile?.username}</h1>
                  <p className="text-text-secondary text-sm mb-2 font-mono">{address}</p>
                  {profile?.bio && <p className="text-text-secondary mb-4">{profile.bio}</p>}
                </>
              )}

              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-28" />
                  ))
                ) : profile && (
                  <>
                    <div className="bg-bg-primary/40 px-4 py-2 rounded-lg text-center">
                      <p className="text-sm text-text-secondary">Win Rate</p>
                      <p className="font-mono font-medium">{profile.stats.winRate}%</p>
                    </div>
                    <div className="bg-bg-primary/40 px-4 py-2 rounded-lg text-center">
                      <p className="text-sm text-text-secondary">Total PnL</p>
                      <p className={`font-mono font-medium ${profile.stats.totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {profile.stats.totalPnl >= 0 ? '+' : ''}{profile.stats.totalPnl}%
                      </p>
                    </div>
                    <div className="bg-bg-primary/40 px-4 py-2 rounded-lg text-center">
                      <p className="text-sm text-text-secondary">ARENA</p>
                      <p className="font-mono font-medium">{profile.stats.arenaTokens}</p>
                    </div>
                    <div className="bg-bg-primary/40 px-4 py-2 rounded-lg text-center">
                      <p className="text-sm text-text-secondary">Matches</p>
                      <p className="font-mono font-medium">{profile.stats.totalMatches}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="border-accent-primary text-accent-primary">
                <i className="ri-edit-line mr-2"></i>
                Edit Profile
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <span className="font-medium mr-1">{profile?.stats.followers || 0}</span> 
                  <span className="text-text-secondary">Followers</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <span className="font-medium mr-1">{profile?.stats.following || 0}</span>
                  <span className="text-text-secondary">Following</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="matches">
        <TabsList className="w-full bg-bg-secondary mb-6">
          <TabsTrigger value="matches" className="flex-1">Match History</TabsTrigger>
          <TabsTrigger value="reels" className="flex-1">Reels</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Recent Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : profile?.matchHistory.length ? (
                <div className="space-y-4">
                  {profile.matchHistory.map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-3 bg-bg-primary rounded-lg">
                      <div>
                        <p className="font-medium">Match vs {match.opponent}</p>
                        <p className="text-sm text-text-secondary">{new Date(match.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${match.result === 'win' ? 'text-profit' : 'text-loss'}`}>
                          {match.result === 'win' ? 'Win' : 'Loss'}
                        </p>
                        <p className={`text-sm font-mono ${match.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                          {match.pnl >= 0 ? '+' : ''}{match.pnl}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  No matches found. Join a match to start your trading journey!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reels">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Your Reels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-text-secondary">
                <i className="ri-film-line text-4xl mb-4 block"></i>
                <p className="mb-4">You haven't posted any reels yet</p>
                <Button className="bg-accent-primary text-bg-primary">
                  <i className="ri-add-line mr-2"></i>
                  Create Your First Reel
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card className="gradient-card">
            <CardHeader>
              <CardTitle>Trading Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="text-center py-8 text-text-secondary">
                  <i className="ri-line-chart-line text-4xl mb-4 block"></i>
                  <p>Statistics will be available after you complete more matches</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
