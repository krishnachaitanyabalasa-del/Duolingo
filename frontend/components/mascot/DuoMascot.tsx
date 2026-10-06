'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface DuoMascotProps {
  variant?: 'standing' | 'happy' | 'celebrate' | 'sad' | 'crying' | 'confused' | 'scooter' | 'super' | 'sleeping';
  className?: string;
  size?: number;
}

export const DuoMascot: React.FC<DuoMascotProps> = ({
  variant = 'standing',
  className = '',
  size = 105,
}) => {
  // Happy / Celebrate Variant (Correct Answers / Lesson Complete)
  if (variant === 'happy' || variant === 'celebrate') {
    return (
      <motion.div
        animate={{ y: [0, -12, 0], scale: [1, 1.06, 1], rotate: [0, -3, 3, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        {/* Celebration Sparkles background */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute -top-3 -right-3 text-amber-400 text-xl font-bold"
        >
          ✨
        </motion.div>

        {/* Floor Shadow */}
        <div className="absolute -bottom-1 w-4/5 h-3 bg-black/20 rounded-full blur-xs" />

        {/* Official Duo Owl Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Happy Duo Owl"
          className="w-full h-full object-contain relative z-10 drop-shadow-xl"
        />
      </motion.div>
    );
  }

  // Sad / Crying Variant (Wrong Answer / Out of Hearts)
  if (variant === 'sad' || variant === 'crying') {
    return (
      <motion.div
        animate={{ y: [0, 3, 0], scale: [1, 0.96, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        {/* Falling Tear Drops */}
        <motion.div
          animate={{ y: [0, 15, 25], opacity: [1, 0.8, 0] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="absolute top-1/3 left-2 text-sky-400 text-sm z-20 font-black"
        >
          💧
        </motion.div>

        {/* Shadow */}
        <div className="absolute -bottom-1 w-3/4 h-2.5 bg-black/20 rounded-full blur-xs" />

        {/* Official Duo Owl Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Sad Duo Owl"
          className="w-full h-full object-contain relative z-10 drop-shadow-md grayscale-25 brightness-95"
        />
      </motion.div>
    );
  }

  // Confused / Thinking Variant
  if (variant === 'confused') {
    return (
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3], y: [-4, -12, -4] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="absolute -top-4 right-0 text-sky-500 font-black text-lg z-20"
        >
          ❓
        </motion.span>

        <div className="absolute -bottom-1 w-3/4 h-2.5 bg-black/20 rounded-full blur-xs" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Confused Duo Owl"
          className="w-full h-full object-contain relative z-10 drop-shadow-md"
        />
      </motion.div>
    );
  }

  if (variant === 'scooter') {
    return (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        <div className="absolute bottom-1 w-4/5 h-3 bg-black/20 rounded-full blur-xs" />

        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], x: [-6, 4, -6] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute -left-6 bottom-4 space-y-1"
        >
          <div className="w-5 h-1 bg-[#1cb0f6] rounded-full" />
          <div className="w-3 h-1 bg-[#1cb0f6] rounded-full ml-2" />
        </motion.div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Duo Owl Scooter"
          className="w-full h-full object-contain relative z-10 drop-shadow-md"
        />
      </motion.div>
    );
  }

  if (variant === 'super') {
    return (
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 2, 0, -2, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1cb0f6] via-[#ce82ff] to-[#ff4b4b] opacity-40 blur-md animate-pulse" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Super Duo Owl"
          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_10px_rgba(206,130,255,0.8)] filter contrast-125 saturate-150"
        />
      </motion.div>
    );
  }

  if (variant === 'sleeping') {
    return (
      <div className={clsx('relative flex items-center justify-center select-none', className)} style={{ width: size, height: size }}>
        {/* Soft Pillow & Shadow */}
        <div className="absolute bottom-1 w-5/6 h-4 bg-sky-100 dark:bg-[#131f24] rounded-full border-2 border-sky-200 dark:border-[#20323d] shadow-xs" />

        {/* Sleeping Duo Owl SVG */}
        <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible relative z-10 drop-shadow-md">
          {/* Main Sleeping Owl Body */}
          <ellipse cx="50" cy="46" rx="28" ry="22" fill="#58cc02" />
          <ellipse cx="50" cy="51" rx="20" ry="14" fill="#8ee000" />

          {/* Sleeping Nightcap */}
          <path d="M 32 38 C 25 18, 55 12, 68 38 Z" fill="#1cb0f6" />
          <circle cx="68" cy="38" r="4" fill="#ffc800" />

          {/* Closed Sleeping Eyes ^ ^ */}
          <path d="M 38 43 Q 43 48 48 43" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 52 43 Q 57 48 62 43" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Beak */}
          <polygon points="50,46 46,51 54,51" fill="#ffb700" />
        </svg>

        {/* Z z Z Sleeping floating text */}
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2], y: [-6, -20, -6], scale: [0.8, 1.2, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -top-3 -right-1 font-black text-base text-[#1cb0f6] drop-shadow-xs z-20"
        >
          Z z Z
        </motion.span>
      </div>
    );
  }

  // Default Standing Official Duo Owl Mascot
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      className={clsx('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      <div className="absolute -bottom-1 w-4/5 h-3 bg-black/20 rounded-full blur-xs" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mascot/duo_owl_official.svg"
        alt="Duo the Owl Mascot"
        className="w-full h-full object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-200"
      />
    </motion.div>
  );
};
