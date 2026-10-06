'use client';

import React from 'react';
import { X, BookOpen, CheckCircle, Trophy } from 'lucide-react';
import { UserCourse } from '@/types/user';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl w-full max-w-sm overflow-hidden shadow-xl space-y-0 text-center">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 dark:border-[#20323d]">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <span>{course.flag}</span>
            <span>{course.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#131f24] hover:bg-gray-200 dark:hover:bg-[#20323d] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] flex items-center justify-center mx-auto text-4xl shadow-sm">
            {course.flag}
          </div>

          <div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white">
              {course.name} Course
            </h3>
            <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] mt-1">
              Active learning course on Duolingo
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d]">
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Crowns Earned
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white">
                👑 14
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d]">
              <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                Units Unlocked
              </div>
              <div className="text-lg font-black text-gray-900 dark:text-white">
                📚 2 / 2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
