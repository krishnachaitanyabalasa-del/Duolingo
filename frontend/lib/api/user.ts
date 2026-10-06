import { apiFetch } from './client';
import { UserProfile, Achievement, FullProfile, FollowerUser } from '@/types/user';
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
      displayName: data.display_name || 'krishnachaitanyabalasa',
      avatarId: data.avatar_id || 'avatar_01',
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
      league: 'Amethyst',
      leagueRank: 4,
      joinedDate: data.joined_date || 'Joined April 2025',
      followingCount: 0,
      followersCount: 1,
    };
  } catch (err) {
    console.warn('Error parsing user payload:', err);
    return MOCK_USER;
  }
}

export async function getFullProfile(): Promise<FullProfile> {
  const data = await apiFetch<FullProfile>('/api/profile');
  if (data) return data;

  return {
    id: 1,
    username: 'krishnacha97971',
    display_name: 'krishnachaitanyabalasa',
    avatar_id: 'avatar_01',
    bio: 'Learning languages every day!',
    joined_date: 'Joined April 2025',
    following_count: 0,
    followers_count: 1,
    stats: {
      streak: 0,
      total_xp: 47458,
      league: 'Amethyst',
      top_three_finishes: 7,
      gems: 6450,
      hearts: 5,
      lessons_completed: 12,
      skills_completed: 4,
      words_learned: 150,
    },
    courses: [
      { id: 'es', name: 'Spanish', flag: '🇪🇸' },
      { id: 'en', name: 'English', flag: '🇺🇸' },
      { id: 'math', name: 'Math', flag: '➗' },
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
