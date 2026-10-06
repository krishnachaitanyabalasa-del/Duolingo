'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Zap, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Celebration Trophy Icon */}
        <div className="w-28 h-28 bg-amber-100 rounded-full flex items-center justify-center mb-6 border-4 border-amber-300 shadow-xl">
          <span className="text-6xl animate-bounce">🎉</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-amber-500 mb-2">Lesson Complete!</h1>
        <p className="text-gray-500 font-extrabold text-base mb-8">You achieved fantastic progress today!</p>

        {/* Gamified Reward Cards */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          <div className="p-4 bg-amber-50 border-2 border-b-4 border-amber-300 rounded-2xl flex flex-col items-center">
            <Zap className="w-7 h-7 text-amber-500 fill-amber-400 mb-1" />
            <span className="text-xs font-extrabold text-amber-800">TOTAL XP</span>
            <span className="text-xl font-black text-amber-900">+{xpEarned}</span>
          </div>

          <div className="p-4 bg-rose-50 border-2 border-b-4 border-rose-300 rounded-2xl flex flex-col items-center">
            <Flame className="w-7 h-7 text-rose-500 fill-rose-400 mb-1" />
            <span className="text-xs font-extrabold text-rose-800">STREAK</span>
            <span className="text-xl font-black text-rose-900">15 Days</span>
          </div>

          <div className="p-4 bg-green-50 border-2 border-b-4 border-green-300 rounded-2xl flex flex-col items-center">
            <Target className="w-7 h-7 text-green-600 mb-1" />
            <span className="text-xs font-extrabold text-green-800">ACCURACY</span>
            <span className="text-xl font-black text-green-900">100%</span>
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
