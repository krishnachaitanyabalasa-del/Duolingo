export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rewardGems: number;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  streak: number;
  longestStreak: number;
  xp: number;
  hearts: number;
  maxHearts: number;
  gems: number;
  completedSkills: number;
  totalSkills: number;
  dailyGoal: number; // e.g., 50 XP
  dailyGoalProgress: number; // e.g., 30 XP
  league: string; // e.g., 'Gold League'
  leagueRank: number; // e.g., 4
  joinedDate: string;
}
