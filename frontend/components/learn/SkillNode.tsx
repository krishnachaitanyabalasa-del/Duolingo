'use client';

import React from 'react';
import { SkillNode as SkillNodeType } from '@/types/course';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { Check, Lock, BookOpen, Headphones, Star, MessageSquare, Utensils, Users, Compass, ShoppingBag, Smile, Home as HomeIcon, UserCheck } from 'lucide-react';
import { DuoMascot } from '../mascot/DuoMascot';

interface SkillNodeProps {
  skill: SkillNodeType;
  onClick: () => void;
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

export const SkillNode: React.FC<SkillNodeProps> = ({ skill, onClick }) => {
  const isEmoji = skill.icon && /\p{Extended_Pictographic}/u.test(skill.icon);
  const IconComponent = !isEmoji ? (ICON_MAP[skill.icon] || Star) : null;

  const isLocked = skill.status === 'LOCKED';
  const isCompleted = skill.status === 'COMPLETED';
  const isCurrent = skill.status === 'CURRENT';

  return (
    <div
      className="relative flex flex-col items-center my-5 group"
      style={{ transform: `translateX(${skill.positionOffset}px)` }}
    >
      {/* Animated Mascot standing beside active node */}
      {isCurrent && (
        <div className="absolute -left-24 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden sm:block">
          <DuoMascot variant="standing" size={95} />
        </div>
      )}

      <div className="relative">
        <motion.button
          whileHover={!isLocked ? { scale: 1.08 } : {}}
          whileTap={!isLocked ? { scale: 0.95 } : {}}
          onClick={!isLocked ? onClick : undefined}
          disabled={isLocked}
          className={clsx(
            'w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl cursor-pointer border-b-4',
            isCurrent && 'bg-[#ff9600] border-[#e07300] text-white ring-4 ring-[#ff9600]/40 animate-pulse',
            isCompleted && 'bg-[#ff9600] border-[#e07300] text-white',
            skill.status === 'AVAILABLE' && 'bg-[#ff9600] border-[#e07300] text-white',
            isLocked && 'bg-[#e5e5e5] dark:bg-[#182730] border-[#d0d0d0] dark:border-[#20323d] text-[#afafaf] dark:text-[#52656d] cursor-not-allowed'
          )}
        >
          {isLocked ? (
            <Lock className="w-8 h-8 text-[#afafaf] dark:text-[#52656d]" />
          ) : isCompleted ? (
            <Check className="w-9 h-9 stroke-[3.5]" />
          ) : isEmoji ? (
            <span className="text-3xl">{skill.icon}</span>
          ) : IconComponent ? (
            <IconComponent className="w-8 h-8" />
          ) : (
            <Star className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      <span className="mt-2 text-xs font-black text-gray-700 dark:text-[#93a7b1] text-center tracking-wide max-w-[120px]">
        {skill.title}
      </span>
    </div>
  );
};
