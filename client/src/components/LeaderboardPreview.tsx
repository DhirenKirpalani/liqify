import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type LeaderboardUser = {
  id: number;
  username: string;
  rank: number;
  winRate: number;
  totalPnl: number;
  arenaTokens: number;
};

// Sample data to use when no API data is available
const sampleLeaderboardData: LeaderboardUser[] = [
  { id: 1, username: "CryptoKing", rank: 1, winRate: 75.5, totalPnl: 248.32, arenaTokens: 12450 },
  { id: 2, username: "TradeMaster", rank: 2, winRate: 68.2, totalPnl: 187.49, arenaTokens: 9820 },
  { id: 3, username: "DiamondHands", rank: 3, winRate: 67.8, totalPnl: 156.21, arenaTokens: 8750 },
  { id: 4, username: "SatoshiJr", rank: 4, winRate: 65.3, totalPnl: 142.84, arenaTokens: 7630 },
  { id: 5, username: "CoinCollector", rank: 5, winRate: 63.1, totalPnl: -42.11, arenaTokens: 6540 },
];

export default function LeaderboardPreview() {
  // Use the same query as the main leaderboard
  const { data, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/leaderboard'],
  });
  
  // If API data is available, use it. Otherwise, use sample data
  const displayData = data?.length ? data.slice(0, 5) : sampleLeaderboardData;

  return (
    <div className="mt-10" id="leaderboard-section">
      <div className="p-4 bg-bg-darker rounded-xl border border-neutral/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">LEADERBOARD</h2>
        </div>
        
        <div className="overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-neutral/10">
                <TableHead className="w-[50px] py-2 text-xs text-neutral-400">Rank</TableHead>
                <TableHead className="py-2 text-xs text-neutral-400">Trader</TableHead>
                <TableHead className="text-right py-2 text-xs text-neutral-400">Win Rate</TableHead>
                <TableHead className="text-right py-2 text-xs text-neutral-400">PnL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b border-neutral/10 last:border-none">
                    <TableCell className="py-3"><Skeleton className="h-4 w-6" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right py-3"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                    <TableCell className="text-right py-3"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : (
                displayData.map((user) => (
                  <TableRow key={user.id} className="border-b border-neutral/10 last:border-none">
                    <TableCell className="py-3 font-medium text-white">{user.rank}</TableCell>
                    <TableCell className="py-3 font-medium text-white">{user.username}</TableCell>
                    <TableCell className="text-right py-3 text-white">{user.winRate}%</TableCell>
                    <TableCell className={`text-right py-3 ${user.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                      {user.totalPnl >= 0 ? '+' : ''}{user.totalPnl.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
