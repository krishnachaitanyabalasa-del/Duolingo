'use client';

import React from 'react';
import { Flame, Star, Shield, GraduationCap, Award, Lock, CheckCircle2 } from 'lucide-react';
import { Achievement } from '@/types/user';

interface AchievementsGridProps {
  achievements: Achievement[];
  onViewAllClick?: () => void;
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
  onViewAllClick,
}) => {
  // Use achievements list or default fallback list matching user requirements
  const displayList =
    achievements && achievements.length > 0
      ? achievements
      : [
          {
            id: 'wildfire',
            title: 'Wildfire',
            description: 'Reach a 365-day streak',
            icon: '🔥',
            progress: 0,
            maxProgress: 365,
            unlocked: false,
            rewardGems: 100,
            level: 1,
            color: 'gray',
          },
          {
            id: 'sage',
            title: 'Sage',
            description: 'Earn 30,000 XP',
            icon: '⭐',
            progress: 0,
            maxProgress: 30000,
            unlocked: false,
            rewardGems: 100,
            level: 1,
            color: 'gray',
          },
          {
            id: 'champion',
            title: 'Champion',
            description: 'Reach 500 XP',
            icon: '🏆',
            progress: 0,
            maxProgress: 500,
            unlocked: false,
            rewardGems: 150,
            level: 1,
            color: 'purple',
          },
        ];

  const unlockedCount = displayList.filter(
    (item) => item.unlocked || (item.maxProgress && item.progress >= item.maxProgress)
  ).length;

  return (
    <div className="space-y-3 select-none">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            Achievements
          </h2>
          <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-[#182730] border border-gray-200 dark:border-[#20323d] text-gray-500 dark:text-[#8397a1]">
            {unlockedCount} / {displayList.length} achieved
          </span>
        </div>

        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            className="text-xs font-black text-[#1cb0f6] hover:text-[#1899d6] uppercase tracking-wider transition-colors cursor-pointer"
          >
            VIEW ALL
          </button>
        )}
      </div>

      {/* Main Bordered Container Box */}
      <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-5 space-y-4 shadow-sm">
        {/* Banner callout when 0 achievements are done */}
        {unlockedCount === 0 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-extrabold flex items-center gap-2.5">
            <Lock className="w-4 h-4 shrink-0 text-amber-500" />
            <span>No achievements achieved yet. Complete lessons to unlock badges!</span>
          </div>
        )}

        <div className="divide-y divide-gray-100 dark:divide-[#20323d]">
          {displayList.map((item, idx) => {
            const isCompleted = item.progress >= item.maxProgress || item.unlocked;
            const isPurpleBadge = item.color === 'purple' || item.id === 'champion';

            return (
              <div
                key={item.id || idx}
                className={`flex items-center gap-4 sm:gap-5 ${idx > 0 ? 'pt-5' : ''}`}
              >
                {/* Left Badge Container */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center border-2 shadow-sm transition-transform hover:scale-105 ${
                      isPurpleBadge && isCompleted
                        ? 'bg-gradient-to-b from-[#a855f7] to-[#7e22ce] border-[#c084fc] text-white'
                        : isCompleted
                        ? 'bg-gradient-to-b from-[#ffc800] to-[#ff9600] border-[#ffd700] text-gray-900'
                        : 'bg-gray-100 dark:bg-[#131f24] border-gray-200 dark:border-[#20323d] text-gray-400 dark:text-[#52656d]'
                    }`}
                  >
                    {item.id === 'wildfire' || item.id === 'ach_1' ? (
                      <Flame className="w-7 h-7 fill-current" />
                    ) : item.id === 'sage' || item.id === 'ach_2' ? (
                      <Star className="w-7 h-7 fill-current" />
                    ) : item.id === 'champion' || item.id === 'ach_5' ? (
                      <Shield className="w-7 h-7 fill-current" />
                    ) : item.id === 'scholar' || item.id === 'ach_3' ? (
                      <GraduationCap className="w-7 h-7 fill-current" />
                    ) : (
                      <Award className="w-7 h-7 fill-current" />
                    )}

                    {/* LEVEL Banner Pill */}
                    <div className="mt-0.5 bg-black/30 backdrop-blur-sm text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full text-white">
                      LEVEL {item.level || 1}
                    </div>
                  </div>
                </div>

                {/* Middle & Right Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      {/* Explicit Status Badge */}
                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#58cc02]/15 text-[#58cc02] text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                          Achieved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d] text-gray-400 dark:text-[#52656d] text-[10px] font-black uppercase tracking-wider">
                          <Lock className="w-2.5 h-2.5" />
                          Not achieved
                        </span>
                      )}
                    </div>

                    {/* Progress Fraction (e.g. 0/500) */}
                    {!isCompleted && item.maxProgress ? (
                      <span className="font-black text-xs text-gray-400 dark:text-[#52656d]">
                        {item.progress}/{item.maxProgress}
                      </span>
                    ) : null}
                  </div>

                  <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Progress Bar (Yellow) for in-progress / unachieved items */}
                  {!isCompleted && item.maxProgress ? (
                    <div className="w-full h-3 bg-gray-100 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d] rounded-full overflow-hidden p-0.5 mt-2">
                      <div
                        className="h-full bg-[#ffc800] rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.max(0, (item.progress / item.maxProgress) * 100))}%`,
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
