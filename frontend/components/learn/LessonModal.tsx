'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SkillNode } from '@/types/course';
import { X, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonModalProps {
  skill: SkillNode | null;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ skill, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!skill || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-[#182730] rounded-3xl p-6 shadow-2xl border-2 border-gray-200 dark:border-[#20323d]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 dark:text-[#52656d] hover:text-gray-700 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-[#20323d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mt-2 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-black uppercase rounded-full mb-3">
              <Zap className="w-3.5 h-3.5 fill-green-600 dark:fill-green-400" /> +15 XP
            </span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{skill.title}</h3>
            {skill.description && (
              <p className="text-sm text-gray-500 dark:text-[#93a7b1] font-medium mt-1">{skill.description}</p>
            )}
          </div>

          {/* Lesson Progress Status */}
          <div className="bg-gray-50 dark:bg-[#131f24] rounded-2xl p-4 border border-gray-200 dark:border-[#20323d] mb-6 flex items-center justify-between text-sm">
            <span className="font-extrabold text-gray-600 dark:text-gray-300">Lesson Progress</span>
            <span className="font-black text-green-600 dark:text-green-400">
              {skill.completedLessons} / {skill.totalLessons}
            </span>
          </div>

          {/* Action Button */}
          <Link
            href={`/lesson/${skill.id}`}
            className="w-full duo-button duo-button-green text-center font-extrabold text-base py-3.5 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            START LESSON
          </Link>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

