'use client';

import React from 'react';
import { Gem } from 'lucide-react';

interface GemsDisplayProps {
  gems: number;
}

export const GemsDisplay: React.FC<GemsDisplayProps> = ({ gems }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-sky-200 bg-sky-50 text-sky-600 font-bold hover:bg-sky-100 transition-colors cursor-pointer group">
      <Gem className="w-5 h-5 text-sky-500 fill-sky-400 group-hover:scale-110 transition-transform" />
      <span className="text-sm font-extrabold">{gems}</span>
    </div>
  );
};
