import { apiFetch } from './client';

export interface UserProgressOverview {
  totalXp: number;
  completedLessonsCount: number;
  unlockedSkillsCount: number;
  accuracyRatePercentage: number;
}

export async function getUserProgress(): Promise<UserProgressOverview> {
  const data = await apiFetch<UserProgressOverview>('/api/progress');
  if (data) return data;

  return {
    totalXp: 1250,
    completedLessonsCount: 24,
    unlockedSkillsCount: 6,
    accuracyRatePercentage: 94,
  };
}
