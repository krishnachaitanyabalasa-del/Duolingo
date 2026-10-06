'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-600 font-bold hover:bg-amber-100 transition-colors cursor-pointer group">
      <Flame className="w-5 h-5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform animate-pulse" />
      <span className="text-sm font-extrabold">{streak}</span>
    </div>
  );
};
