'use client';

import { useState, useEffect } from 'react';
import { LeaderboardData } from '@/types/leaderboard';
import { getLeaderboard } from '@/lib/api/leaderboard';
import { MOCK_LEADERBOARD } from '@/lib/mockData';

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData>(MOCK_LEADERBOARD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getLeaderboard();
      if (res) setData(res);
      setLoading(false);
    }
    load();
  }, []);

  return { data, loading };
}
