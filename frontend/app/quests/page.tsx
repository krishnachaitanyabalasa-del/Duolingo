'use client';

import React, { useState } from 'react';
import { Gift, Zap, Clock, CheckCircle2, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import { clsx } from 'clsx';

interface QuestItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  rewardGems: number;
  claimed: boolean;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<QuestItem[]>([
    {
      id: 'q1',
      title: 'Earn 30 XP Today',
      description: 'Complete lessons or practice sessions to reach 30 XP.',
      progress: 35,
      maxProgress: 30,
      rewardGems: 40,
      claimed: false,
    },
    {
      id: 'q2',
      title: 'Complete 2 Lessons',
      description: 'Finish 2 language lessons with high accuracy.',
      progress: 1,
      maxProgress: 2,
      rewardGems: 25,
      claimed: false,
    },
    {
      id: 'q3',
      title: 'Get 90% Accuracy',
      description: 'Maintain 90% accuracy across your daily practice.',
      progress: 1,
      maxProgress: 1,
      rewardGems: 50,
      claimed: false,
    },
  ]);

  const claimQuest = (id: string) => {
    sounds.playFanfare();
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Confetti fallback
    }

    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q))
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="duo-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ff9600] text-xs font-black uppercase mb-1">
            <Gift className="w-4 h-4" /> Daily Quests
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Daily Challenges</h1>
          <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Quests reset in 14 hours
          </p>
        </div>

        <div className="p-4 bg-[#ff9600]/10 border-2 border-[#ff9600] rounded-2xl shrink-0 text-center flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#ff9600] fill-[#ff9600] animate-bounce" />
          <span className="text-xs font-black text-gray-900 dark:text-white">3 Active Quests</span>
        </div>
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {quests.map((quest) => {
          const isComplete = quest.progress >= quest.maxProgress;
          const percent = Math.min(100, (quest.progress / quest.maxProgress) * 100);

          return (
            <div
              key={quest.id}
              className={clsx(
                'duo-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all',
                quest.claimed ? 'opacity-60' : 'opacity-100'
              )}
            >
              <div className="flex items-start gap-4 flex-1 w-full">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] flex items-center justify-center text-2xl shrink-0">
                  {isComplete ? '🎯' : '📜'}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white">{quest.title}</h3>
                    <span className="flex items-center gap-1 text-xs font-black text-[#1cb0f6]">
                      <Gem className="w-3.5 h-3.5 fill-[#1cb0f6]" /> +{quest.rewardGems}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mb-2">{quest.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-100 dark:bg-[#131f24] rounded-full overflow-hidden border border-gray-200 dark:border-[#20323d]">
                    <div
                      className="h-full bg-[#58cc02] transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-gray-400 dark:text-[#52656d] block mt-1 text-right">
                    {quest.progress} / {quest.maxProgress}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full sm:w-auto">
                {quest.claimed ? (
                  <span className="flex items-center justify-center gap-1 text-xs font-black text-[#58cc02] bg-[#58cc02]/10 border border-[#58cc02] px-4 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" /> CLAIMED
                  </span>
                ) : isComplete ? (
                  <button
                    onClick={() => claimQuest(quest.id)}
                    className="w-full duo-button duo-button-amber text-xs py-2.5 px-6"
                  >
                    CLAIM GIFT
                  </button>
                ) : (
                  <span className="text-xs font-bold text-gray-500 dark:text-[#52656d] bg-gray-100 dark:bg-[#131f24] px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#20323d] block text-center">
                    IN PROGRESS
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
