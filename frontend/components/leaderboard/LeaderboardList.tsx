'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { Zap, Flame } from 'lucide-react';
import { clsx } from 'clsx';

interface LeaderboardListProps {
  entries: LeaderboardEntry[];
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({ entries }) => {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={clsx(
            'flex items-center gap-4 p-4 rounded-2xl border-2 border-b-4 transition-all',
            entry.isCurrentUser
              ? 'bg-sky-50 dark:bg-[#183445] border-sky-300 dark:border-sky-500 shadow-md ring-2 ring-sky-300 dark:ring-sky-500'
              : 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d]'
          )}
        >
          {/* Rank Number */}
          <span className="w-8 font-black text-lg text-gray-500 dark:text-[#93a7b1] text-center">{entry.rank}</span>

          {/* Avatar */}
          <img
            src={entry.avatarUrl}
            alt={entry.username}
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-200 dark:border-[#20323d]"
          />

          {/* Username & Streak */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-gray-900 dark:text-white text-base">{entry.username}</span>
              {entry.isCurrentUser && (
                <span className="bg-[#1cb0f6] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  YOU
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{entry.streak} day streak</span>
            </div>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1 font-black text-gray-700 dark:text-[#dce6eb] text-base">
            <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
            <span>{entry.xp} XP</span>
          </div>
        </div>
      ))}
    </div>
  );
};
