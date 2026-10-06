export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardGems: number;
  level?: number;
  color?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName?: string;
  avatarId?: string;
  avatarUrl: string;
  bio?: string;
  streak: number;
  longestStreak: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  completedSkills: number;
  totalSkills: number;
  dailyGoal: number;
  dailyGoalProgress: number;
  league: string;
  leagueRank: number;
  topThreeFinishes?: number;
  joinedDate: string;
  followingCount?: number;
  followersCount?: number;
}

export interface UserCourse {
  id: string;
  name: string;
  flag: string;
}

export interface ProfileStats {
  streak: number;
  total_xp: number;
  league: string;
  top_three_finishes: number;
  gems: number;
  hearts: number;
  lessons_completed?: number;
  skills_completed?: number;
  words_learned?: number;
}

export interface FullProfile {
  id: number | string;
  username: string;
  display_name: string;
  avatar_id: string;
  bio: string;
  joined_date: string;
  following_count: number;
  followers_count: number;
  stats: ProfileStats;
  courses: UserCourse[];
}

export interface FollowerUser {
  id: number | string;
  username: string;
  display_name: string;
  avatar_id: string;
  xp: number;
  is_following: boolean;
}

export interface DailyQuest {
  id: number;
  user_id: number;
  type: string;
  title: string;
  description: string;
  icon?: string;
  target: number;
  current_progress: number;
  reward_xp: number;
  reward_gems: number;
  completed: boolean;
  claimed: boolean;
  state: 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';
  quest_date: string;
  completed_at?: string;
  claimed_at?: string;
}

export interface QuestClaimResponse {
  success: boolean;
  claimed: boolean;
  quest_id: number;
  reward_gems: number;
  reward_xp: number;
  total_gems: number;
  total_xp: number;
  message: string;
}
