export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatarUrl: string;
  xp: number;
  isCurrentUser: boolean;
  streak: number;
}

export interface LeaderboardData {
  league: string;
  timeRemainingDays: number;
  entries: LeaderboardEntry[];
}
