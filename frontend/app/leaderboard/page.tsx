'use client';

import React from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Podium } from '@/components/leaderboard/Podium';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { Shield, Clock, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const { data, loading } = useLeaderboard();

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        <p className="font-extrabold text-gray-500 dark:text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }

  const topThree = data.entries.slice(0, 3);
  const rest = data.entries.slice(3);

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Header Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-full mb-2 border border-amber-200 dark:border-amber-700/50">
          <Shield className="w-4 h-4 fill-amber-500 text-amber-600" />
          {data.league}
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Weekly Leaderboard</h1>
        <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mt-1 flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Resetting in {data.timeRemainingDays} days
        </p>
      </div>

      {/* Top 3 Podium */}
      <Podium topThree={topThree} />

      {/* Remaining Leaderboard List */}
      <LeaderboardList entries={rest} />
    </div>
  );
}
