'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Check, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import { clsx } from 'clsx';

interface RewardNodeProps {
  positionOffset?: number;
  isUnlocked?: boolean;
}

export const RewardNode: React.FC<RewardNodeProps> = ({ positionOffset = 0, isUnlocked = false }) => {
  const [claimed, setClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClaim = () => {
    if (!isUnlocked) {
      sounds.playClick();
      setShowLockedModal(true);
      return;
    }
    if (claimed) return;
    sounds.playFanfare();
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Confetti fallback
    }
    setClaimed(true);
    setShowModal(true);
  };

  return (
    <div
      className="relative flex flex-col items-center my-4 group z-10"
      style={{ transform: `translateX(${positionOffset}px)` }}
    >
      <motion.button
        whileHover={isUnlocked && !claimed ? { scale: 1.08 } : {}}
        whileTap={{ scale: 0.95 }}
        onClick={handleClaim}
        className={clsx(
          'relative w-20 h-20 rounded-2xl border-b-4 flex items-center justify-center shadow-lg transition-all cursor-pointer',
          claimed
            ? 'bg-[#e5e5e5] dark:bg-[#182730] border-[#d0d0d0] dark:border-[#20323d] text-gray-400 dark:text-gray-500 cursor-default'
            : isUnlocked
            ? 'bg-[#ffc800] border-[#e0a200] text-amber-950 hover:bg-[#ffd014]'
            : 'bg-[#e5e5e5] dark:bg-[#182730] border-[#d0d0d0] dark:border-[#20323d] opacity-90'
        )}
      >
        {claimed ? (
          <Check className="w-9 h-9 text-gray-400 dark:text-gray-500 stroke-[3]" />
        ) : isUnlocked ? (
          <span className="text-4xl select-none">🎁</span>
        ) : (
          <div className="relative flex items-center justify-center">
            <span className="text-4xl select-none grayscale opacity-40">🎁</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Lock className="w-7 h-7 text-gray-500 dark:text-gray-400 stroke-[2.5]" />
            </div>
          </div>
        )}
      </motion.button>

      {/* Unlocked Reward Claim Modal */}
      {mounted &&
        showModal &&
        createPortal(
          <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] p-6 rounded-3xl text-center max-w-sm w-full space-y-4 shadow-2xl"
              >
                <Sparkles className="w-12 h-12 text-[#ff9600] mx-auto animate-pulse" />
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Chest Opened!</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-[#93a7b1]">You received +50 Gems!</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full duo-button duo-button-amber text-sm py-3 cursor-pointer font-extrabold"
                >
                  AWESOME!
                </button>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}

      {/* Locked Chest Warning Modal */}
      {mounted &&
        showLockedModal &&
        createPortal(
          <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] p-6 rounded-3xl text-center max-w-sm w-full space-y-4 shadow-2xl"
              >
                <Lock className="w-12 h-12 text-[#ff9600] mx-auto" />
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Chest Locked</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-[#93a7b1]">
                  Complete all previous lessons in this unit to unlock this treasure chest!
                </p>
                <button
                  onClick={() => setShowLockedModal(false)}
                  className="w-full duo-button duo-button-blue text-sm py-3 cursor-pointer font-extrabold"
                >
                  GOT IT!
                </button>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};


