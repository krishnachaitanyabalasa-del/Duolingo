'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Zap, Clock, CheckCircle2, Gem, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import { clsx } from 'clsx';
import { getDailyQuests, claimDailyQuest } from '@/lib/api/user';
import { DailyQuest } from '@/types/user';
import { useUserContext } from '@/context/UserContext';

export default function QuestsPage() {
  const { updateGemsAndXp, refreshUser } = useUserContext();
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchQuests = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await getDailyQuests();
      setQuests(data);
    } catch (err: any) {
      console.error('Failed to load daily quests:', err);
      setErrorMsg('Failed to load daily quests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleClaim = async (questId: number) => {
    if (claimingId !== null) return;
    setClaimingId(questId);
    setErrorMsg(null);

    try {
      const res = await claimDailyQuest(questId);
      sounds.playFanfare();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Fallback if canvas-confetti is unavailable
      }

      // Update central user context
      updateGemsAndXp(res.total_gems, res.total_xp);
      await refreshUser();

      // Update local quest state
      setQuests((prev) =>
        prev.map((q) =>
          q.id === questId
            ? { ...q, claimed: true, state: 'CLAIMED' as const }
            : q
        )
      );
    } catch (err: any) {
      console.error('Failed to claim quest reward:', err);
      setErrorMsg(err.message || 'Failed to claim reward.');
    } finally {
      setClaimingId(null);
    }
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
            <Clock className="w-3.5 h-3.5" /> Quests reset daily at midnight
          </p>
        </div>

        <div className="p-4 bg-[#ff9600]/10 border-2 border-[#ff9600] rounded-2xl shrink-0 text-center flex items-center gap-2">
          <Zap className="w-6 h-6 text-[#ff9600] fill-[#ff9600] animate-bounce" />
          <span className="text-xs font-black text-gray-900 dark:text-white">
            {quests.length > 0 ? `${quests.length} Active Quests` : 'Daily Challenges'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-500 text-xs font-bold text-center">
          {errorMsg}
        </div>
      )}

      {/* Quests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="duo-card p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#1cb0f6]" />
            <p className="text-xs font-bold text-gray-400">Loading daily quests...</p>
          </div>
        ) : quests.length === 0 ? (
          <div className="duo-card p-12 text-center">
            <p className="text-sm font-bold text-gray-400">No quests found for today.</p>
          </div>
        ) : (
          quests.map((quest) => {
            const isComplete = quest.completed || quest.current_progress >= quest.target;
            const percent = quest.target > 0
              ? Math.min(100, Math.round((quest.current_progress / quest.target) * 100))
              : 0;

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
                    {quest.icon || (isComplete ? '🎯' : '📜')}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                        {quest.title}
                      </h3>
                      <span className="flex items-center gap-1 text-xs font-black text-[#1cb0f6]">
                        <Gem className="w-3.5 h-3.5 fill-[#1cb0f6]" /> +{quest.reward_gems}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mb-2">
                      {quest.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-100 dark:bg-[#131f24] rounded-full overflow-hidden border border-gray-200 dark:border-[#20323d]">
                      <div
                        className="h-full bg-[#58cc02] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 dark:text-[#52656d] block mt-1 text-right">
                      {Math.min(quest.current_progress, quest.target)} / {quest.target}
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
                      onClick={() => handleClaim(quest.id)}
                      disabled={claimingId === quest.id}
                      className="w-full duo-button duo-button-amber text-xs py-2.5 px-6 flex items-center justify-center gap-2"
                    >
                      {claimingId === quest.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> CLAIMING...
                        </>
                      ) : (
                        'CLAIM GIFT'
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-gray-500 dark:text-[#52656d] bg-gray-100 dark:bg-[#131f24] px-4 py-2.5 rounded-xl border border-gray-200 dark:border-[#20323d] block text-center">
                      IN PROGRESS
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
