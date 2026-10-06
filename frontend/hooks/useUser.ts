'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, Achievement } from '@/types/user';
import { getUserProfile, getAchievements, refillHearts as apiRefillHearts } from '@/lib/api/user';
import { MOCK_USER, MOCK_ACHIEVEMENTS } from '@/lib/mockData';

export function useUser() {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [uProfile, achs] = await Promise.all([
      getUserProfile(),
      getAchievements(),
    ]);
    if (uProfile) setUser(uProfile);
    if (achs) setAchievements(achs);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refillHeartsAction = async () => {
    const res = await apiRefillHearts();
    if (res.success) {
      setUser((prev) => ({
        ...prev,
        hearts: res.hearts,
        gems: res.gems,
      }));
    }
  };

  const deductHeart = () => {
    setUser((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  const addXp = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      dailyGoalProgress: Math.min(prev.dailyGoal, prev.dailyGoalProgress + amount),
    }));
  };

  return {
    user,
    achievements,
    loading,
    refillHearts: refillHeartsAction,
    deductHeart,
    addXp,
    refreshUser: loadData,
  };
}
