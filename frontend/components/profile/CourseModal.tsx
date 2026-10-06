'use client';

import React from 'react';
import { UserCourse } from '@/types/user';
import { X, BookOpen, Award, CheckCircle } from 'lucide-react';

interface CourseModalProps {
  course: UserCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-[#20323d] pb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{course.flag}</span>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              {course.name} Course
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-[#20323d] hover:bg-gray-200 dark:hover:bg-[#283b47] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-[#1cb0f6]" />
            <div>
              <div className="font-extrabold text-xs text-gray-900 dark:text-white">
                Active Learning Path
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Unit 1: Basics & Foundations
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] flex items-center gap-3">
            <Award className="w-6 h-6 text-[#ffc800]" />
            <div>
              <div className="font-extrabold text-xs text-gray-900 dark:text-white">
                Course Progress
              </div>
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Active on Duolingo
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46a302] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4 stroke-[3]" />
          <span>CLOSE</span>
        </button>
      </div>
    </div>
  );
};
