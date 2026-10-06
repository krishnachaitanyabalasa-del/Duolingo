'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { SkillNode } from '@/types/course';
import { X, Play, Zap, CheckCircle2, Lock, RotateCcw } from 'lucide-react';
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

  const isLocked = skill.status === 'LOCKED';
  const isCompleted = skill.status === 'COMPLETED';
  const targetLessonId = skill.activeLessonId || skill.lessons?.[0]?.id || skill.id;

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
          <div className="text-center mt-2 mb-5">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-black uppercase rounded-full mb-3">
              <Zap className="w-3.5 h-3.5 fill-green-600 dark:fill-green-400" /> +10 XP
            </span>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">{skill.title}</h3>
            {skill.description && (
              <p className="text-sm text-gray-500 dark:text-[#93a7b1] font-medium mt-1">{skill.description}</p>
            )}
          </div>

          {/* Lesson Progress Status */}
          <div className="bg-gray-50 dark:bg-[#131f24] rounded-2xl p-3 border border-gray-200 dark:border-[#20323d] mb-4 flex items-center justify-between text-sm">
            <span className="font-extrabold text-gray-600 dark:text-gray-300">Skill Progress</span>
            <span className="font-black text-green-600 dark:text-green-400">
              {skill.completedLessons} / {skill.totalLessons} Lessons
            </span>
          </div>

          {/* Lessons List */}
          {skill.lessons && skill.lessons.length > 0 && (
            <div className="flex flex-col gap-2 mb-5 max-h-48 overflow-y-auto">
              {skill.lessons.map((lesson) => {
                const lessonLocked = lesson.status === 'LOCKED';
                const lessonDone = lesson.isCompleted || lesson.status === 'COMPLETED';

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold ${
                      lessonDone
                        ? 'bg-green-50/60 dark:bg-green-950/20 border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300'
                        : lessonLocked
                        ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-800 text-gray-400 dark:text-gray-600'
                        : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-400/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lessonDone ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : lessonLocked ? (
                        <Lock className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 fill-current" />
                      )}
                      <span>{lesson.title}</span>
                    </div>

                    {!lessonLocked && (
                      <Link
                        href={`/lesson/${lesson.id}`}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase ${
                          lessonDone
                            ? 'text-gray-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/40'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {lessonDone ? 'Practice' : 'Start'}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Primary Action Button */}
          {isLocked ? (
            <button
              disabled
              className="w-full bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-extrabold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Lock className="w-5 h-5" />
              LOCKED
            </button>
          ) : isCompleted ? (
            <Link
              href={`/lesson/${targetLessonId}`}
              className="w-full duo-button duo-button-green text-center font-extrabold text-base py-3.5 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
              PRACTICE SKILL
            </Link>
          ) : (
            <Link
              href={`/lesson/${targetLessonId}`}
              className="w-full duo-button duo-button-green text-center font-extrabold text-base py-3.5 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-white" />
              START LESSON
            </Link>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

