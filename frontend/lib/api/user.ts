import { apiFetch } from './client';
import { UserProfile, Achievement, FullProfile, FollowerUser, DailyQuest, QuestClaimResponse } from '@/types/user';
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
  avatar_id?: string;
  display_name?: string;
  bio?: string;
  joined_date?: string;
  league?: string;
  top_three_finishes?: number;
  following_count?: number;
  followers_count?: number;
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
  let data = await apiFetch<RawBackendUser>('/api/me');
  if (!data) {
    data = await apiFetch<RawBackendUser>('/api/user');
  }
  if (!data) return MOCK_USER;

  try {
    return {
      id: data.id.toString(),
      username: data.username,
      displayName: data.display_name || data.username || 'Learner',
      avatarId: data.avatar_id || 'avatar_01',
      avatarUrl: data.avatar_url || MOCK_USER.avatarUrl,
      streak: data.streak,
      longestStreak: data.longest_streak ?? data.streak,
      xp: data.xp,
      hearts: data.hearts,
      maxHearts: 5,
      gems: data.gems,
      completedSkills: data.completed_skills ?? 0,
      totalSkills: data.total_skills ?? 10,
      dailyGoal: 50,
      dailyGoalProgress: Math.min(50, data.xp),
      league: data.league || 'Bronze',
      leagueRank: 4,
      topThreeFinishes: data.top_three_finishes ?? 0,
      joinedDate: data.joined_date || 'Joined April 2025',
      followingCount: data.following_count ?? 0,
      followersCount: data.followers_count ?? 0,
    };
  } catch (err) {
    console.warn('Error parsing user payload:', err);
    return MOCK_USER;
  }
}

export async function getDailyQuests(): Promise<DailyQuest[]> {
  const data = await apiFetch<DailyQuest[]>('/api/daily-quests');
  if (data) return data;
  return [];
}

export async function claimDailyQuest(questId: number): Promise<QuestClaimResponse> {
  const data = await apiFetch<QuestClaimResponse>(`/api/daily-quests/${questId}/claim`, {
    method: 'POST',
  });
  if (data) return data;
  throw new Error('Failed to claim quest');
}

export async function getFullProfile(): Promise<FullProfile> {
  const data = await apiFetch<FullProfile>('/api/profile');
  if (data) return data;

  return {
    id: 1,
    username: 'learner',
    display_name: 'Learner',
    avatar_id: 'avatar_01',
    bio: 'Learning languages every day!',
    joined_date: 'Joined April 2025',
    following_count: 0,
    followers_count: 0,
    stats: {
      streak: 0,
      total_xp: 0,
      league: 'Bronze',
      top_three_finishes: 0,
      gems: 100,
      hearts: 5,
      lessons_completed: 0,
      skills_completed: 0,
      words_learned: 0,
    },
    courses: [
      { id: 'en', name: 'English Foundations', flag: '🇬🇧' },
    ],
  };
}

export async function updateProfile(updateData: {
  display_name?: string;
  username?: string;
  bio?: string;
  avatar_id?: string;
}): Promise<FullProfile> {
  const data = await apiFetch<FullProfile>('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });

  if (data) return data;

  // Fallback local update simulation if offline/mock
  const current = await getFullProfile();
  return {
    ...current,
    display_name: updateData.display_name ?? current.display_name,
    username: updateData.username ?? current.username,
    bio: updateData.bio ?? current.bio,
    avatar_id: updateData.avatar_id ?? current.avatar_id,
  };
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
      level: 10,
      color: a.unlocked ? 'gold' : 'gray',
    }));
  } catch {
    return MOCK_ACHIEVEMENTS;
  }
}

export async function getFollowers(): Promise<FollowerUser[]> {
  const data = await apiFetch<FollowerUser[]>('/api/profile/followers');
  if (data) return data;

  return [
    {
      id: 2,
      username: 'Orion',
      display_name: 'Orion Star',
      avatar_id: 'avatar_03',
      xp: 1250,
      is_following: false,
    },
  ];
}

export async function getFollowing(): Promise<FollowerUser[]> {
  const data = await apiFetch<FollowerUser[]>('/api/profile/following');
  if (data) return data;

  return [];
}

export async function toggleFollow(userId: number | string): Promise<{ success: boolean; is_following: boolean }> {
  const data = await apiFetch<{ success: boolean; is_following: boolean }>(`/api/profile/follow/${userId}`, {
    method: 'POST',
  });

  if (data) return data;

  return { success: true, is_following: true };
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
