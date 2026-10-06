'use client';

import React from 'react';
import { Achievement } from '@/types/user';
import { Gem } from 'lucide-react';
import { clsx } from 'clsx';

interface AchievementsGridProps {
  achievements: Achievement[];
}

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({ achievements }) => {
  return (
    <div>
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">Achievements</h3>
      <div className="space-y-4">
        {achievements.map((ach) => {
          const progressPercent = (ach.progress / ach.maxProgress) * 100;

          return (
            <div
              key={ach.id}
              className={clsx(
                'duo-card flex items-center gap-4 p-4 transition-all',
                ach.unlocked ? 'bg-white' : 'bg-gray-50 opacity-80'
              )}
            >
              <div className="text-4xl p-3 bg-gray-100 rounded-2xl border-2 border-gray-200">
                {ach.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-extrabold text-base text-gray-800">{ach.title}</h4>
                  <span className="flex items-center gap-1 text-xs font-black text-sky-600">
                    <Gem className="w-3.5 h-3.5 fill-sky-400" /> +{ach.rewardGems}
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-500 mb-2">{ach.description}</p>

                {/* Progress bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full transition-all duration-500',
                      ach.unlocked ? 'bg-amber-400' : 'bg-sky-400'
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
