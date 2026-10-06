'use client';

import React, { useState } from 'react';
import { Flame, Zap, Shield, Award, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { ProfileStats } from '@/types/user';

interface StatsCardProps {
  stats: ProfileStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="space-y-3 select-none">
      <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
        Statistics
      </h2>

      {/* Main 2-Column Grid matching Screenshot 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: Day Streak */}
        <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-gray-300 dark:hover:border-[#37464f]">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] flex items-center justify-center shrink-0">
            <Flame
              className={`w-6 h-6 ${
                stats.streak > 0 ? 'text-[#ff9600] fill-[#ff9600]' : 'text-gray-400 dark:text-[#52656d]'
              }`}
            />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {stats.streak}
            </div>
            <div className="text-xs font-extrabold text-gray-400 dark:text-[#52656d]">
              Day streak
            </div>
          </div>
        </div>

        {/* Card 2: Total XP */}
        <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-gray-300 dark:hover:border-[#37464f]">
          <div className="w-12 h-12 rounded-xl bg-[#ffc800]/15 dark:bg-[#ffc800]/20 border-2 border-[#ffc800]/40 dark:border-[#ffc800] flex items-center justify-center text-[#ffc800] shrink-0">
            <Zap className="w-6 h-6 fill-[#ffc800]" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {stats.total_xp.toLocaleString()}
            </div>
            <div className="text-xs font-extrabold text-gray-400 dark:text-[#52656d]">
              Total XP
            </div>
          </div>
        </div>

        {/* Card 3: Current League */}
        <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-gray-300 dark:hover:border-[#37464f]">
          <div className="w-12 h-12 rounded-xl bg-[#ce82ff]/15 dark:bg-[#ce82ff]/20 border-2 border-[#ce82ff]/40 dark:border-[#ce82ff] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-[#ce82ff] fill-[#ce82ff]" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {stats.league}
            </div>
            <div className="text-xs font-extrabold text-gray-400 dark:text-[#52656d]">
              Current league
            </div>
          </div>
        </div>

        {/* Card 4: Top 3 Finishes */}
        <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:border-gray-300 dark:hover:border-[#37464f]">
          <div className="w-12 h-12 rounded-xl bg-[#ffc800]/15 dark:bg-[#ffc800]/20 border-2 border-[#ffc800]/40 dark:border-[#ffc800] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 text-[#ffc800]" />
          </div>
          <div>
            <div className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {stats.top_three_finishes}
            </div>
            <div className="text-xs font-extrabold text-gray-400 dark:text-[#52656d]">
              Top 3 finishes
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Stats Toggle */}
      {showMore && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 animate-in fade-in duration-200">
          <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#58cc02]" />
            <div>
              <div className="text-base font-black text-gray-900 dark:text-white">
                {stats.lessons_completed ?? 0}
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Lessons completed
              </div>
            </div>
          </div>

          <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-3.5 flex items-center gap-3">
            <Layers className="w-5 h-5 text-[#1cb0f6]" />
            <div>
              <div className="text-base font-black text-gray-900 dark:text-white">
                {stats.skills_completed ?? 0}
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Skills completed
              </div>
            </div>
          </div>

          <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-3.5 flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#ff9600]" />
            <div>
              <div className="text-base font-black text-gray-900 dark:text-white">
                {stats.words_learned ?? 0}
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Words learned
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show More Button */}
      <div className="flex justify-center pt-0.5">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-xs font-black text-[#1cb0f6] hover:text-[#1899d6] uppercase tracking-wider transition-colors cursor-pointer"
        >
          {showMore ? 'HIDE EXTRA STATS' : 'VIEW MORE STATS'}
        </button>
      </div>
    </div>
  );
};
