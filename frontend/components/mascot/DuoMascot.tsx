'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface DuoMascotProps {
  variant?: 'standing' | 'scooter' | 'super' | 'sleeping';
  className?: string;
  size?: number;
}

export const DuoMascot: React.FC<DuoMascotProps> = ({
  variant = 'standing',
  className = '',
  size = 110,
}) => {
  if (variant === 'scooter') {
    return (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        {/* Red Motorcycle & Duo Rider Illustration */}
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible drop-shadow-md">
          {/* Shadow beneath scooter */}
          <ellipse cx="60" cy="102" rx="42" ry="9" fill="rgba(0,0,0,0.18)" />

          {/* Speed wind lines trailing */}
          <motion.path
            d="M 10 95 L 30 95 M 5 100 L 22 100"
            stroke="#1cb0f6"
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3], x: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />

          {/* Motorcycle Wheels */}
          <circle cx="35" cy="92" r="14" fill="#2c3e50" stroke="#7f8c8d" strokeWidth="3" />
          <circle cx="85" cy="92" r="14" fill="#2c3e50" stroke="#7f8c8d" strokeWidth="3" />
          <circle cx="35" cy="92" r="6" fill="#bdc3c7" />
          <circle cx="85" cy="92" r="6" fill="#bdc3c7" />

          {/* Bike Frame */}
          <path d="M 35 92 L 60 70 L 85 92 M 60 70 L 60 55 M 75 58 L 90 48" stroke="#ff4b4b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <rect x="52" y="65" width="22" height="12" rx="4" fill="#d63031" />

          {/* Duo Owl Body on Scooter */}
          <ellipse cx="60" cy="46" rx="20" ry="24" fill="#58cc02" />
          <ellipse cx="60" cy="50" rx="14" ry="16" fill="#8ee000" />

          {/* Face Eyes */}
          <circle cx="53" cy="40" r="7" fill="white" />
          <circle cx="67" cy="40" r="7" fill="white" />
          <circle cx="55" cy="40" r="3.5" fill="#2d3436" />
          <circle cx="69" cy="40" r="3.5" fill="#2d3436" />

          {/* Beak */}
          <polygon points="60,43 56,48 64,48" fill="#ffb700" />

          {/* Helmet */}
          <path d="M 38 38 C 38 22, 82 22, 82 38 Z" fill="#ff4b4b" />
          <rect x="36" y="35" width="48" height="6" rx="3" fill="#d63031" />
        </svg>
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
        {/* Neon Super Duo Flying Owl Graphic */}
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(206,130,255,0.6)]">
          <defs>
            <linearGradient id="superGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1cb0f6" />
              <stop offset="50%" stopColor="#ce82ff" />
              <stop offset="100%" stopColor="#ff4b4b" />
            </linearGradient>
          </defs>

          {/* Wings */}
          <motion.path
            d="M 15 45 C 5 25, 30 20, 35 40 Z"
            fill="url(#superGrad)"
            animate={{ rotate: [-5, 10, -5] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 85 45 C 95 25, 70 20, 65 40 Z"
            fill="url(#superGrad)"
            animate={{ rotate: [5, -10, 5] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          />

          {/* Body */}
          <ellipse cx="50" cy="50" rx="26" ry="30" fill="url(#superGrad)" />
          <ellipse cx="50" cy="55" rx="18" ry="20" fill="rgba(255,255,255,0.25)" />

          {/* Glowing Super Eyes */}
          <circle cx="41" cy="44" r="8" fill="white" />
          <circle cx="59" cy="44" r="8" fill="white" />
          <circle cx="43" cy="44" r="4" fill="#7d5fff" />
          <circle cx="61" cy="44" r="4" fill="#7d5fff" />

          {/* Orange Beak */}
          <polygon points="50,48 45,54 55,54" fill="#ffc800" />
        </svg>
      </motion.div>
    );
  }

  if (variant === 'sleeping') {
    return (
      <div className={clsx('relative flex items-center justify-center select-none', className)} style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 80" className="w-full h-full overflow-visible">
          {/* Sleeping pillow / shadow */}
          <ellipse cx="50" cy="65" rx="35" ry="8" fill="rgba(0,0,0,0.15)" />

          {/* Sleeping Duo Green Owl */}
          <ellipse cx="50" cy="45" rx="28" ry="22" fill="#58cc02" />
          <ellipse cx="50" cy="50" rx="20" ry="14" fill="#8ee000" />

          {/* Closed Sleeping Eyes ^ ^ */}
          <path d="M 38 42 Q 43 47 48 42" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 52 42 Q 57 47 62 42" stroke="#2c3e50" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Beak */}
          <polygon points="50,45 46,50 54,50" fill="#ffb700" />

          {/* Z z Z Sleeping floating text */}
          <motion.text
            x="72"
            y="25"
            fill="#1cb0f6"
            fontWeight="900"
            fontSize="18"
            animate={{ opacity: [0.2, 1, 0.2], y: [25, 12, 25], scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
          >
            Z z
          </motion.text>
        </svg>
      </div>
    );
  }

  // Default Standing Duo Owl Mascot (Beside active lesson node)
  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      className={clsx('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 110" className="w-full h-full overflow-visible drop-shadow-lg">
        {/* Soft shadow */}
        <ellipse cx="50" cy="98" rx="30" ry="8" fill="rgba(0,0,0,0.2)" />

        {/* Orange Feet */}
        <path d="M 36 90 L 32 98 M 36 90 L 36 99 M 36 90 L 40 98" stroke="#ffb700" strokeWidth="4" strokeLinecap="round" />
        <path d="M 64 90 L 60 98 M 64 90 L 64 99 M 64 90 L 68 98" stroke="#ffb700" strokeWidth="4" strokeLinecap="round" />

        {/* Left Wing Flapping */}
        <motion.path
          d="M 22 50 C 8 40, 10 68, 24 64 Z"
          fill="#46a302"
          animate={{ rotate: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Right Wing Flapping */}
        <motion.path
          d="M 78 50 C 92 40, 90 68, 76 64 Z"
          fill="#46a302"
          animate={{ rotate: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Main Body */}
        <ellipse cx="50" cy="54" rx="30" ry="36" fill="#58cc02" />

        {/* Light Green Belly Feather Plate */}
        <ellipse cx="50" cy="62" rx="21" ry="24" fill="#8ee000" />
        <path d="M 42 60 Q 50 66 58 60" stroke="#58cc02" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 45 70 Q 50 75 55 70" stroke="#58cc02" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Big Characteristic Duo Eyes */}
        <circle cx="39" cy="44" r="11" fill="white" />
        <circle cx="61" cy="44" r="11" fill="white" />

        {/* Eye Pupils with Blinking */}
        <motion.circle
          cx="41"
          cy="44"
          r="5.5"
          fill="#2d3436"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.93, 0.96, 1] }}
        />
        <motion.circle
          cx="63"
          cy="44"
          r="5.5"
          fill="#2d3436"
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.9, 0.93, 0.96, 1] }}
        />

        {/* Pupil shine dots */}
        <circle cx="39.5" cy="42" r="2" fill="white" />
        <circle cx="61.5" cy="42" r="2" fill="white" />

        {/* Beak */}
        <polygon points="50,47 43,55 57,55" fill="#ffb700" />
      </svg>
    </motion.div>
  );
};
