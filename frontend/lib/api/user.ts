import { apiFetch } from './client';
import { UserProfile, Achievement } from '@/types/user';
import { MOCK_USER, MOCK_ACHIEVEMENTS } from '../mockData';

interface RawBackendUser {
  id: number | string;
  username: string;
  email?: string;
  xp: number;
  streak: number;
  longest_streak?: number;
  hearts: number;
  gems: number;
  avatar_url?: string;
  joined_date?: string;
  completed_skills?: number;
  total_skills?: number;
}

interface RawBackendAchievement {
  id: number | string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  max_progress: number;
  unlocked: boolean;
  reward_gems: number;
}

export async function getUserProfile(): Promise<UserProfile> {
  const data = await apiFetch<RawBackendUser>('/api/user');
  if (!data) return MOCK_USER;

  try {
    return {
      id: data.id.toString(),
      username: data.username,
      avatarUrl: data.avatar_url || MOCK_USER.avatarUrl,
      streak: data.streak,
      longestStreak: data.longest_streak || data.streak,
      xp: data.xp,
      hearts: data.hearts,
      maxHearts: 5,
      gems: data.gems,
      completedSkills: data.completed_skills || 6,
      totalSkills: data.total_skills || 18,
      dailyGoal: 50,
      dailyGoalProgress: 35,
      league: 'Gold League',
      leagueRank: 4,
      joinedDate: data.joined_date || 'October 2024',
    };
  } catch (err) {
    console.warn('Error parsing user payload:', err);
    return MOCK_USER;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  const data = await apiFetch<RawBackendAchievement[]>('/api/achievements');
  if (!data) return MOCK_ACHIEVEMENTS;

  try {
    return data.map((a) => ({
      id: a.id.toString(),
      title: a.title,
      description: a.description,
      icon: a.icon,
      progress: a.progress,
      maxProgress: a.max_progress,
      unlocked: a.unlocked,
      rewardGems: a.reward_gems,
    }));
  } catch {
    return MOCK_ACHIEVEMENTS;
  }
}

export async function refillHearts(): Promise<{ success: boolean; hearts: number; gems: number }> {
  const data = await apiFetch<{ success: boolean; hearts: number; gems: number }>('/api/hearts/refill', {
    method: 'POST',
  });

  if (data) return data;

  return {
    success: true,
    hearts: 5,
    gems: Math.max(0, MOCK_USER.gems - 100),
  };
}
