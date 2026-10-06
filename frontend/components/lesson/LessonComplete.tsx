'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Zap, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

import { DuoMascot } from '../mascot/DuoMascot';

interface LessonCompleteProps {
  xpEarned: number;
}

export const LessonComplete: React.FC<LessonCompleteProps> = ({ xpEarned }) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-[#131f24] flex flex-col items-center justify-center p-6 text-center transition-colors duration-150">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Celebration Mascot */}
        <div className="mb-4">
          <DuoMascot variant="celebrate" size={130} />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-amber-500 mb-2">Lesson Complete!</h1>
        <p className="text-gray-500 dark:text-[#93a7b1] font-extrabold text-base mb-8">You achieved fantastic progress today!</p>

        {/* Gamified Reward Cards */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border-2 border-b-4 border-amber-300 dark:border-amber-700/60 rounded-2xl flex flex-col items-center">
            <Zap className="w-7 h-7 text-amber-500 fill-amber-400 mb-1" />
            <span className="text-xs font-extrabold text-amber-800 dark:text-amber-300">TOTAL XP</span>
            <span className="text-xl font-black text-amber-900 dark:text-amber-100">+{xpEarned}</span>
          </div>

          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border-2 border-b-4 border-rose-300 dark:border-rose-700/60 rounded-2xl flex flex-col items-center">
            <Flame className="w-7 h-7 text-rose-500 fill-rose-400 mb-1" />
            <span className="text-xs font-extrabold text-rose-800 dark:text-rose-300">STREAK</span>
            <span className="text-xl font-black text-rose-900 dark:text-rose-100">15 Days</span>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950/30 border-2 border-b-4 border-green-300 dark:border-green-700/60 rounded-2xl flex flex-col items-center">
            <Target className="w-7 h-7 text-green-600 dark:text-green-400 mb-1" />
            <span className="text-xs font-extrabold text-green-800 dark:text-green-300">ACCURACY</span>
            <span className="text-xl font-black text-green-900 dark:text-green-100">100%</span>
          </div>
        </div>

        {/* Continue Button */}
        <Link
          href="/learn"
          className="w-full duo-button duo-button-green text-lg py-4 shadow-lg text-center"
        >
          CONTINUE
        </Link>
      </motion.div>
    </div>
  );
};
