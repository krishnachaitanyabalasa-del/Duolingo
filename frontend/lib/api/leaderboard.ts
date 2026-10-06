import { apiFetch } from './client';
import { LeaderboardData } from '@/types/leaderboard';
import { MOCK_LEADERBOARD } from '../mockData';

interface RawLeaderboardItem {
  rank: number;
  user_id: number | string;
  username: string;
  avatar_url?: string;
  xp: number;
  is_current_user: boolean;
  streak?: number;
}

export async function getLeaderboard(): Promise<LeaderboardData> {
  const data = await apiFetch<RawLeaderboardItem[]>('/api/leaderboard');
  if (!data) return MOCK_LEADERBOARD;

  try {
    return {
      league: 'Amethyst League',
      timeRemainingDays: 3,
      entries: data.map((item) => ({
        rank: item.rank,
        id: item.user_id.toString(),
        username: item.username,
        avatarUrl: item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`,
        xp: item.xp,
        isCurrentUser: item.is_current_user,
        streak: item.streak || 5,
      })),
    };
  } catch (err) {
    console.warn('Error parsing leaderboard payload:', err);
    return MOCK_LEADERBOARD;
  }
}
