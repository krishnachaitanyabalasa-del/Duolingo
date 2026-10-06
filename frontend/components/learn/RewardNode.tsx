'use client';

import React, { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { sounds } from '@/lib/sound';

interface RewardNodeProps {
  positionOffset?: number;
}

export const RewardNode: React.FC<RewardNodeProps> = ({ positionOffset = 0 }) => {
  const [claimed, setClaimed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClaim = () => {
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClaim}
        className={`w-20 h-20 rounded-2xl border-2 border-b-4 flex items-center justify-center shadow-lg cursor-pointer ${
          claimed
            ? 'bg-[#182730] border-[#20323d] text-gray-500'
            : 'bg-[#ff9600] border-[#e07300] text-white animate-bounce'
        }`}
      >
        <Gift className="w-10 h-10" />
      </motion.button>

      {/* Claimed Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#182730] border-2 border-[#20323d] p-6 rounded-3xl text-center max-w-xs w-full space-y-4"
            >
              <Sparkles className="w-12 h-12 text-[#ff9600] mx-auto animate-pulse" />
              <h3 className="text-2xl font-black text-white">Chest Opened!</h3>
              <p className="text-xs font-bold text-[#93a7b1]">You received +50 Gems!</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full duo-button duo-button-amber text-xs py-3"
              >
                AWESOME!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
