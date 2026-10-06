'use client';

import React from 'react';
import Link from 'next/link';
import { X, Heart } from 'lucide-react';
import { LessonProgress } from './LessonProgress';

interface LessonHeaderProps {
  current: number;
  total: number;
  hearts: number;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({ current, total, hearts }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 flex items-center gap-4 sm:gap-6">
      <Link
        href="/learn"
        className="p-2 text-gray-400 dark:text-[#52656d] hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#20323d] transition-colors"
      >
        <X className="w-6 h-6 stroke-[2.5]" />
      </Link>

      <LessonProgress current={current} total={total} />

      <div className="flex items-center gap-1.5 font-extrabold text-rose-500">
        <Heart className="w-6 h-6 fill-rose-500 text-rose-500 animate-pulse" />
        <span className="text-base">{hearts}</span>
      </div>
    </header>
  );
};
