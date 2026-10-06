'use client';

import React from 'react';
import { Heart } from 'lucide-react';

interface HeartsDisplayProps {
  hearts: number;
  maxHearts?: number;
  onClick?: () => void;
}

export const HeartsDisplay: React.FC<HeartsDisplayProps> = ({ hearts, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-rose-200 dark:border-rose-700/50 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors cursor-pointer group"
    >
      <Heart className="w-5 h-5 text-rose-500 fill-rose-500 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-extrabold">{hearts}</span>
    </button>
  );
};
