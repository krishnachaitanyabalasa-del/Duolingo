'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface XPDisplayProps {
  xp: number;
}

export const XPDisplay: React.FC<XPDisplayProps> = ({ xp }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-yellow-200 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 font-bold hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors cursor-pointer group">
      <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-extrabold">{xp} XP</span>
    </div>
  );
};
