'use client';

import React from 'react';
import Link from 'next/link';
import { SkillNode } from '@/types/course';
import { X, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonModalProps {
  skill: SkillNode | null;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-2 border-gray-200"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mt-2 mb-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase rounded-full mb-3">
              <Zap className="w-3.5 h-3.5 fill-green-600" /> +15 XP
            </span>
            <h3 className="text-2xl font-extrabold text-gray-800">{skill.title}</h3>
            {skill.description && (
              <p className="text-sm text-gray-500 font-medium mt-1">{skill.description}</p>
            )}
          </div>

          {/* Lesson Progress Status */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 flex items-center justify-between text-sm">
            <span className="font-extrabold text-gray-600">Lesson Progress</span>
            <span className="font-black text-green-600">
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
    </AnimatePresence>
  );
};
