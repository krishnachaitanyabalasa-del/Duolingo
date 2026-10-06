'use client';

import React from 'react';
import { SkillNode as SkillNodeType } from '@/types/course';
import { Check, Lock, BookOpen, Headphones, Star, MessageSquare, Utensils, Users, Compass, ShoppingBag, Smile, Home as HomeIcon, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

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
  const IconComponent = ICON_MAP[skill.icon] || Star;
  const isLocked = skill.status === 'LOCKED';
  const isCompleted = skill.status === 'COMPLETED';
  const isCurrent = skill.status === 'CURRENT';

  return (
    <div
      className="relative flex flex-col items-center my-5 group"
      style={{ transform: `translateX(${skill.positionOffset}px)` }}
    >
      {/* Animated Character Mascot riding on active node (Matching Screenshot 3!) */}
      {isCurrent && (
        <div className="absolute -top-12 z-20 flex flex-col items-center animate-bob">
          <div className="w-12 h-12 bg-amber-400 rounded-full border-2 border-amber-600 flex items-center justify-center text-xl shadow-lg">
            🏍️
          </div>
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
            isLocked && 'bg-[#182730] border-[#20323d] text-[#52656d] cursor-not-allowed'
          )}
        >
          {isLocked ? (
            <Lock className="w-8 h-8 text-[#52656d]" />
          ) : isCompleted ? (
            <Check className="w-9 h-9 stroke-[3.5]" />
          ) : (
            <IconComponent className="w-8 h-8" />
          )}
        </motion.button>
      </div>

      <span className="mt-2 text-xs font-black text-[#93a7b1] text-center tracking-wide max-w-[120px]">
        {skill.title}
      </span>
    </div>
  );
};
