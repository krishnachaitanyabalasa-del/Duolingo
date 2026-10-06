'use client';

import React from 'react';
import { UserProfile } from '@/types/user';
import { Flame, Zap, Award, BookOpen } from 'lucide-react';

interface StatsCardProps {
  user: UserProfile;
}

export const StatsCard: React.FC<StatsCardProps> = ({ user }) => {
  const stats = [
    { label: 'Day Streak', value: user.streak, icon: Flame, color: 'text-amber-500 bg-amber-50 border-amber-200' },
    { label: 'Total XP', value: user.xp, icon: Zap, color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
    { label: 'League Rank', value: `#${user.leagueRank}`, icon: Award, color: 'text-purple-500 bg-purple-50 border-purple-200' },
    { label: 'Skills Mastered', value: `${user.completedSkills}/${user.totalSkills}`, icon: BookOpen, color: 'text-sky-500 bg-sky-50 border-sky-200' },
  ];

  return (
    <div className="mb-8">
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div key={idx} className={`p-4 rounded-2xl border-2 border-b-4 flex items-center gap-4 ${st.color}`}>
              <div className="p-3 bg-white rounded-xl shadow-xs">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase text-gray-500 block">{st.label}</span>
                <span className="text-2xl font-black text-gray-800">{st.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
