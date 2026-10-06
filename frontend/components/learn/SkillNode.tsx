'use client';

import React from 'react';
import { SkillNode as SkillNodeType } from '@/types/course';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import {
  Check,
  Lock,
  BookOpen,
  Headphones,
  Star,
  MessageSquare,
  Utensils,
  Users,
  Compass,
  ShoppingBag,
  Smile,
  Home as HomeIcon,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { getUnitTheme } from '@/lib/unitTheme';

interface SkillNodeProps {
  skill: SkillNodeType;
  onClick: () => void;
  unitNumber?: number;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Book: BookOpen,
  Headphones: Headphones,
  MessageSquare,
  UserCheck,
  Utensils,
  Users,
  Compass,
  ShoppingBag,
  Smile,
  Home: HomeIcon,
};

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, onClick, unitNumber = 1 }) => {
  const isEmoji = skill.icon && /\p{Extended_Pictographic}/u.test(skill.icon);
  const IconComponent = !isEmoji ? (ICON_MAP[skill.icon] || Star) : null;
  const theme = getUnitTheme(unitNumber);

  const isLocked = skill.status === 'LOCKED';
  const isCompleted = skill.status === 'COMPLETED';
  const isCurrent = skill.status === 'CURRENT' || (skill.status as string) === 'IN_PROGRESS';
  const isAvailable = skill.status === 'AVAILABLE';

  // Calculate progress percentage for active in-progress node ring
  const progressFraction =
    skill.totalLessons > 0 ? skill.completedLessons / skill.totalLessons : 0;
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div
      className="relative flex flex-col items-center my-6 group"
      style={{ transform: `translateX(${skill.positionOffset}px)` }}
    >
      <div className="relative flex items-center justify-center">
        {/* IN_PROGRESS: Animated Circular Progress Ring */}
        {isCurrent && (
          <div className="absolute -inset-3.5 pointer-events-none z-10">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 104 104">
              {/* Background Ring */}
              <circle
                cx="52"
                cy="52"
                r="46"
                fill="none"
                stroke="currentColor"
                className="text-black/10 dark:text-white/10"
                strokeWidth="6"
              />
              {/* Progress Fill */}
              <motion.circle
                cx="52"
                cy="52"
                r="46"
                fill="none"
                stroke="#ffc800"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
          </div>
        )}

        {/* COMPLETED: Sparkle Celebration Accents */}
        {isCompleted && (
          <motion.div
            animate={{ rotate: 360, scale: [0.9, 1.1, 0.9] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute -top-1.5 -right-1.5 text-amber-400 z-10 pointer-events-none"
          >
            <Sparkles className="w-5 h-5 fill-amber-300" />
          </motion.div>
        )}

        {/* Main Interactive Skill Node Button */}
        <motion.button
          whileHover={!isLocked ? { scale: 1.08 } : {}}
          whileTap={!isLocked ? { scale: 0.94 } : {}}
          animate={
            isAvailable
              ? { y: [0, -4, 0] }
              : isCurrent
              ? { scale: [1, 1.03, 1] }
              : {}
          }
          transition={{
            repeat: Infinity,
            duration: isAvailable ? 2.2 : 1.8,
            ease: 'easeInOut',
          }}
          onClick={!isLocked ? onClick : undefined}
          disabled={isLocked}
          className={clsx(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer border-b-4 relative z-0',
            // LOCKED state
            isLocked &&
              'bg-[#e5e5e5] dark:bg-[#182730] border-[#d0d0d0] dark:border-[#20323d] text-[#afafaf] dark:text-[#52656d] opacity-80 cursor-not-allowed',
            // IN_PROGRESS / CURRENT state
            isCurrent &&
              `${theme.bg} ${theme.border} text-white ring-4 ${theme.ring} shadow-2xl`,
            // COMPLETED state
            isCompleted &&
              `${theme.bg} ${theme.border} text-white shadow-lg`,
            // AVAILABLE state
            isAvailable &&
              `${theme.bg} ${theme.border} text-white hover:brightness-105 shadow-xl`
          )}
        >
          {isLocked ? (
            <Lock className="w-8 h-8 text-[#afafaf] dark:text-[#52656d]" />
          ) : isCompleted ? (
            <Check className="w-9 h-9 stroke-[3.5]" />
          ) : isEmoji ? (
            <span className="text-3xl">{skill.icon}</span>
          ) : IconComponent ? (
            <IconComponent className="w-8 h-8 stroke-[2.5]" />
          ) : (
            <Star className="w-8 h-8 fill-current" />
          )}
        </motion.button>
      </div>

      {/* Skill Title Banner */}
      <span
        className={clsx(
          'mt-2.5 text-xs font-black text-center tracking-wide max-w-[130px] leading-snug select-none',
          isLocked
            ? 'text-gray-400 dark:text-[#52656d]'
            : isCurrent
            ? 'text-gray-900 dark:text-white font-extrabold'
            : 'text-gray-700 dark:text-[#93a7b1]'
        )}
      >
        {skill.title}
      </span>
    </div>
  );
};
