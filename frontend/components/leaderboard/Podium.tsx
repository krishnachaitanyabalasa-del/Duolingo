'use client';

import React from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';
import { Crown, Zap } from 'lucide-react';

interface PodiumProps {
  topThree: LeaderboardEntry[];
}

export const Podium: React.FC<PodiumProps> = ({ topThree }) => {
  if (topThree.length < 3) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="flex items-end justify-center gap-4 mb-8 pt-6">
      {/* 2nd Place */}
      <div className="flex flex-col items-center flex-1 max-w-[110px]">
        <div className="relative mb-2">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥈</span>
          <img
            src={second.avatarUrl}
            alt={second.username}
            className="w-16 h-16 rounded-full border-4 border-slate-300 object-cover shadow-md"
          />
        </div>
        <span className="font-extrabold text-sm text-gray-800 truncate w-full text-center">{second.username}</span>
        <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
          <Zap className="w-3 h-3 fill-amber-400" /> {second.xp}
        </span>
        <div className="w-full h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-2xl border-2 border-b-0 border-slate-300 flex items-center justify-center font-black text-2xl text-slate-400 mt-2">
          2
        </div>
      </div>

      {/* 1st Place */}
      <div className="flex flex-col items-center flex-1 max-w-[130px] z-10">
        <div className="relative mb-2">
          <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-amber-500 fill-amber-400 animate-bounce" />
          <img
            src={first.avatarUrl}
            alt={first.username}
            className="w-20 h-20 rounded-full border-4 border-amber-400 object-cover shadow-xl ring-4 ring-amber-200"
          />
        </div>
        <span className="font-black text-base text-gray-800 truncate w-full text-center">{first.username}</span>
        <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
          <Zap className="w-3.5 h-3.5 fill-amber-400" /> {first.xp}
        </span>
        <div className="w-full h-32 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-2xl border-2 border-b-0 border-amber-300 flex items-center justify-center font-black text-3xl text-amber-600 mt-2 shadow-inner">
          1
        </div>
      </div>

      {/* 3rd Place */}
      <div className="flex flex-col items-center flex-1 max-w-[110px]">
        <div className="relative mb-2">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">🥉</span>
          <img
            src={third.avatarUrl}
            alt={third.username}
            className="w-16 h-16 rounded-full border-4 border-amber-700/40 object-cover shadow-md"
          />
        </div>
        <span className="font-extrabold text-sm text-gray-800 truncate w-full text-center">{third.username}</span>
        <span className="text-xs font-black text-amber-600 flex items-center gap-0.5">
          <Zap className="w-3 h-3 fill-amber-400" /> {third.xp}
        </span>
        <div className="w-full h-20 bg-gradient-to-t from-amber-900/10 to-amber-900/5 rounded-t-2xl border-2 border-b-0 border-amber-900/20 flex items-center justify-center font-black text-2xl text-amber-800/40 mt-2">
          3
        </div>
      </div>
    </div>
  );
};
