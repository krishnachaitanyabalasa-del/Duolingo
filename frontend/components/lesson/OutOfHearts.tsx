'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, RefreshCw, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

interface OutOfHeartsProps {
  onRefill: () => void;
}

export const OutOfHearts: React.FC<OutOfHeartsProps> = ({ onRefill }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white dark:bg-[#182730] rounded-3xl p-6 shadow-2xl text-center border-2 border-gray-200 dark:border-[#20323d]"
      >
        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/40 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-200 dark:border-rose-700/60">
          <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-bounce" />
        </div>

        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">You ran out of hearts!</h3>
        <p className="text-sm font-medium text-gray-500 dark:text-[#93a7b1] mb-6">
          Review previous lessons to earn hearts back, or refill now to keep practicing!
        </p>

        <div className="space-y-3">
          <button
            onClick={onRefill}
            className="w-full duo-button duo-button-blue text-sm py-3 flex items-center justify-center gap-2"
          >
            <Gem className="w-4 h-4 fill-sky-200" />
            REFILL HEARTS (100 GEMS)
          </button>

          <Link
            href="/learn"
            className="w-full duo-button duo-button-neutral text-sm py-3 flex items-center justify-center gap-2 border-gray-200 dark:border-[#20323d] text-gray-700 dark:text-gray-200 block"
          >
            <RefreshCw className="w-4 h-4" />
            PRACTICE TO EARN HEARTS
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
