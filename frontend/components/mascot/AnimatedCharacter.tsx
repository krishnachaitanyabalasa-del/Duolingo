'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Sparkles, Heart, Trophy, Star } from 'lucide-react';

export type CharacterType = 'mascot' | 'duo' | 'granny';

export type CharacterAnimation =
  | 'idle'
  | 'happy'
  | 'celebrating'
  | 'thinking'
  | 'encouraging'
  | 'sad'
  | 'locked'
  | 'lessonComplete';

export interface AnimatedCharacterProps {
  type?: CharacterType;
  animation?: CharacterAnimation;
  speech?: string;
  size?: number;
  className?: string;
  position?: 'left' | 'right';
  onClick?: () => void;
}

/**
 * Granny (Lucy) SVG Character Illustration
 */
const GrannyGraphic: React.FC<{ animation: CharacterAnimation; size: number }> = ({
  animation,
  size,
}) => {
  const isHappy = animation === 'happy' || animation === 'celebrating' || animation === 'lessonComplete';
  const isThinking = animation === 'thinking';
  const isSad = animation === 'sad';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size * 1.15 }}>
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full drop-shadow-lg overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair Bun Back */}
        <circle cx="60" cy="24" r="16" fill="#A78BFA" />
        <circle cx="60" cy="22" r="14" fill="#C4B5FD" />
        {/* Hair Pins */}
        <line x1="48" y1="20" x2="72" y2="20" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cardigan / Torso */}
        <path d="M28 125 C28 85, 45 76, 60 76 C75 76, 92 85, 92 125 Z" fill="#9333EA" />
        {/* Cardigan Collar / Inner Blouse */}
        <path d="M48 76 L60 98 L72 76 Z" fill="#F3E8FF" />
        {/* Pearl Necklace */}
        <circle cx="54" cy="85" r="2.5" fill="#FFFFFF" />
        <circle cx="60" cy="87" r="2.5" fill="#FFFFFF" />
        <circle cx="66" cy="85" r="2.5" fill="#FFFFFF" />
        {/* Cardigan Buttons */}
        <circle cx="60" cy="106" r="2.5" fill="#E9D5FF" />
        <circle cx="60" cy="118" r="2.5" fill="#E9D5FF" />

        {/* Head / Neck */}
        <rect x="52" y="60" width="16" height="18" rx="4" fill="#FCD34D" />
        <circle cx="60" cy="50" r="26" fill="#FCD34D" />

        {/* Hair Front / Sides (Silver-Violet Curls) */}
        <path d="M34 50 C34 26, 86 26, 86 50 C86 44, 76 34, 60 34 C44 34, 34 44, 34 50 Z" fill="#8B5CF6" />
        <circle cx="34" cy="48" r="10" fill="#8B5CF6" />
        <circle cx="86" cy="48" r="10" fill="#8B5CF6" />

        {/* Cat-eye Glasses */}
        <path
          d="M40 46 Q49 42 56 47 Q52 57 41 55 Z"
          fill="#EC4899"
          stroke="#BE185D"
          strokeWidth="2"
        />
        <path
          d="M64 47 Q71 42 80 46 Q79 55 68 57 Z"
          fill="#EC4899"
          stroke="#BE185D"
          strokeWidth="2"
        />
        <line x1="56" y1="47" x2="64" y2="47" stroke="#BE185D" strokeWidth="2.5" />

        {/* Eyes Behind Glasses */}
        {isSad ? (
          <>
            <path d="M44 51 Q48 48 52 51" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            <path d="M68 51 Q72 48 76 51" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : isHappy ? (
          <>
            {/* Happy Curved Eyes ^ ^ */}
            <path d="M43 51 Q47 46 51 51" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M69 51 Q73 46 77 51" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="47" cy="50" r="3" fill="#1F2937" />
            <circle cx="73" cy="50" r="3" fill="#1F2937" />
            <circle cx="48" cy="49" r="1" fill="#FFFFFF" />
            <circle cx="74" cy="49" r="1" fill="#FFFFFF" />
          </>
        )}

        {/* Cheeks */}
        <circle cx="39" cy="56" r="4" fill="#F472B6" opacity="0.6" />
        <circle cx="81" cy="56" r="4" fill="#F472B6" opacity="0.6" />

        {/* Mouth */}
        {isHappy ? (
          <path d="M53 62 Q60 69 67 62" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" fill="#EF4444" />
        ) : isThinking ? (
          <ellipse cx="60" cy="62" rx="3" ry="2" fill="#374151" />
        ) : isSad ? (
          <path d="M54 64 Q60 59 66 64" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M54 62 Q60 66 66 62" stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};

/**
 * Official Duo Owl Mascot Graphic
 */
const DuoGraphic: React.FC<{ animation: CharacterAnimation; size: number }> = ({
  animation,
  size,
}) => {
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mascot/duo_owl_official.svg"
        alt="Duo Owl"
        className={clsx(
          'w-full h-full object-contain relative z-10 drop-shadow-xl transition-all duration-300',
          animation === 'sad' && 'grayscale-30 brightness-95',
          animation === 'locked' && 'opacity-70 contrast-90',
          (animation === 'celebrating' || animation === 'lessonComplete') && 'scale-105'
        )}
      />
    </div>
  );
};

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  type = 'mascot',
  animation = 'idle',
  speech,
  size = 110,
  className = '',
  position = 'left',
  onClick,
}) => {
  // Motion configurations depending on animation state
  const getMotionConfig = () => {
    switch (animation) {
      case 'happy':
        return {
          animate: { y: [0, -14, 0], scale: [1, 1.05, 1], rotate: [0, -3, 3, 0] },
          transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' as const },
        };
      case 'celebrating':
      case 'lessonComplete':
        return {
          animate: { y: [0, -20, 0], scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] },
          transition: { repeat: Infinity, duration: 1.1, ease: 'easeInOut' as const },
        };
      case 'encouraging':
        return {
          animate: { y: [0, -8, 0], rotate: [-2, 2, -2] },
          transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' as const },
        };
      case 'thinking':
        return {
          animate: { rotate: [-4, 4, -4], y: [0, -4, 0] },
          transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' as const },
        };
      case 'sad':
        return {
          animate: { y: [0, 4, 0], scale: [1, 0.97, 1] },
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' as const },
        };
      case 'locked':
        return {
          animate: { y: [0, 2, 0] },
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
        };
      case 'idle':
      default:
        return {
          animate: { y: [0, -6, 0] },
          transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' as const },
        };
    }
  };

  const motionConfig = getMotionConfig();

  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative inline-flex flex-col items-center select-none z-20 group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Speech Bubble (Duolingo Style) */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={clsx(
              'absolute -top-16 z-30 max-w-[190px] px-3.5 py-2 rounded-2xl bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] shadow-lg pointer-events-none text-center',
              position === 'left' ? '-right-6 sm:-right-12' : '-left-6 sm:-left-12'
            )}
          >
            <p className="text-xs font-black text-gray-800 dark:text-white leading-tight">
              {speech}
            </p>
            {/* Bubble Tail */}
            <div
              className={clsx(
                'absolute -bottom-2 w-3.5 h-3.5 bg-white dark:bg-[#182730] border-r-2 border-b-2 border-gray-200 dark:border-[#20323d] transform rotate-45',
                position === 'left' ? 'left-6' : 'right-6'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* FX Overlay for Celebrations */}
      {(animation === 'celebrating' || animation === 'lessonComplete') && (
        <>
          <motion.div
            animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 1, 0.4], rotate: [0, 45, 90] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="absolute -top-3 -right-2 text-amber-400 z-30 text-xl font-bold"
          >
            ✨
          </motion.div>
          <motion.div
            animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.8, delay: 0.4 }}
            className="absolute -top-4 -left-2 text-yellow-500 z-30 text-lg font-bold"
          >
            ⭐
          </motion.div>
        </>
      )}

      {/* FX for Thinking */}
      {animation === 'thinking' && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], y: [-2, -10, -2] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute -top-4 right-2 text-sky-500 text-lg font-black z-30"
        >
          💡
        </motion.div>
      )}

      {/* FX for Sad */}
      {animation === 'sad' && (
        <motion.div
          animate={{ y: [0, 14, 24], opacity: [1, 0.7, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute top-8 left-3 text-sky-400 text-base z-30 font-black"
        >
          💧
        </motion.div>
      )}

      {/* Character Animation Body */}
      <motion.div
        animate={motionConfig.animate}
        transition={motionConfig.transition}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex items-center justify-center"
      >
        {/* Soft Floor Shadow */}
        <div className="absolute -bottom-1.5 w-4/5 h-3 bg-black/15 dark:bg-black/35 rounded-full blur-xs" />

        {/* Character Graphics by Type */}
        {type === 'granny' ? (
          <GrannyGraphic animation={animation} size={size} />
        ) : (
          <DuoGraphic animation={animation} size={size} />
        )}
      </motion.div>
    </div>
  );
};
