'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Gift, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';
import { clsx } from 'clsx';

interface RewardNodeProps {
  positionOffset?: number;
  isUnlocked?: boolean;
}

export const RewardNode: React.FC<RewardNodeProps> = ({
  positionOffset = 0,
  isUnlocked = false,
}) => {
  const [claimed, setClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLockedTooltip, setShowLockedTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (claimed) {
      return;
    }

    if (!isUnlocked) {
      setShowLockedTooltip(true);
      setTimeout(() => setShowLockedTooltip(false), 2500);
      return;
    }

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
      className="relative flex flex-col items-center my-6"
      style={{ transform: `translateX(${positionOffset}px)` }}
    >
      <motion.button
        whileHover={isUnlocked && !claimed ? { scale: 1.1 } : {}}
        whileTap={isUnlocked && !claimed ? { scale: 0.95 } : {}}
        onClick={handleClick}
        className={clsx(
          'w-20 h-20 rounded-2xl border-2 border-b-4 flex items-center justify-center shadow-lg transition-all relative',
          claimed
            ? 'bg-[#e5e5e5] dark:bg-[#182730] border-[#d0d0d0] dark:border-[#20323d] text-gray-400 dark:text-gray-500 cursor-default'
            : isUnlocked
            ? 'bg-[#ff9600] border-[#e07300] text-white animate-bounce cursor-pointer shadow-orange-500/20'
            : 'bg-gray-200 dark:bg-[#182730] border-gray-300 dark:border-[#20323d] text-gray-400 dark:text-[#52656d] cursor-pointer opacity-80'
        )}
      >
        <Gift className="w-10 h-10" />
        {!isUnlocked && !claimed && (
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-700/90 text-white flex items-center justify-center shadow-md">
            <Lock className="w-4 h-4" />
          </div>
        )}
      </motion.button>

      {/* Locked Helper Tooltip */}
      <AnimatePresence>
        {showLockedTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 z-30 whitespace-nowrap bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-gray-700 pointer-events-none"
          >
            Complete previous lessons to unlock!
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Claimed Modal (Mounted via Portal to escape parent transforms) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] p-6 rounded-3xl text-center max-w-xs w-full space-y-4 shadow-2xl"
                >
                  <Sparkles className="w-12 h-12 text-[#ff9600] mx-auto animate-pulse" />
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Chest Opened!</h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1]">You received +50 Gems!</p>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full duo-button duo-button-amber text-xs py-3"
                  >
                    AWESOME!
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
