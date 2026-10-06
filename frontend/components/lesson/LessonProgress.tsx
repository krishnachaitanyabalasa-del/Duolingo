'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface LessonProgressProps {
  current: number;
  total: number;
}

export const LessonProgress: React.FC<LessonProgressProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex-1 h-3.5 bg-gray-200 rounded-full overflow-hidden p-0.5 relative">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-full bg-green-500 rounded-full shadow-inner relative"
      >
        {/* Highlight sheen top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full" />
      </motion.div>
    </div>
  );
};
