import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

type LeaderboardUser = {
  id: number;
  username: string;
  rank: number;
  winRate: number;
  totalPnl: number;
  arenaTokens: number;
};

export default function Leaderboard() {
  const { data, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/leaderboard'],
  });

  return (
    <div className="container mx-auto px-4 lg:px-6 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold font-manrope mb-6">Leaderboard</h1>
      
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Trader</TableHead>
                  <TableHead className="text-right">Win Rate</TableHead>
                  <TableHead className="text-right">Total PnL</TableHead>
                  <TableHead className="text-right">ARENA Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : data?.length ? (
                  data.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.rank}</TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="text-right">{user.winRate}%</TableCell>
                      <TableCell className={`text-right ${user.totalPnl >= 0 ? 'text-profit' : 'text-loss'} font-mono`}>
                        {user.totalPnl >= 0 ? '+' : ''}{user.totalPnl.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right font-mono">{user.arenaTokens}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-text-secondary py-8">
                      No leaderboard data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
