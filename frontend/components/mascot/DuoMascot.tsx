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
  size = 105,
}) => {
  if (variant === 'scooter') {
    return (
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className={clsx('relative flex items-center justify-center select-none', className)}
        style={{ width: size, height: size }}
      >
        {/* Shadow */}
        <div className="absolute bottom-1 w-4/5 h-3 bg-black/20 rounded-full blur-xs" />

        {/* Speed lines */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3], x: [-6, 4, -6] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="absolute -left-6 bottom-4 space-y-1"
        >
          <div className="w-5 h-1 bg-[#1cb0f6] rounded-full" />
          <div className="w-3 h-1 bg-[#1cb0f6] rounded-full ml-2" />
        </motion.div>

        {/* Official Duo Owl Image */}
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
        {/* Glowing Super Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1cb0f6] via-[#ce82ff] to-[#ff4b4b] opacity-40 blur-md animate-pulse" />

        {/* Official Duo Owl Image */}
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
        {/* Shadow */}
        <div className="absolute bottom-1 w-3/4 h-2.5 bg-black/15 rounded-full" />

        {/* Official Duo Owl Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascot/duo_owl_official.svg"
          alt="Sleeping Duo Owl"
          className="w-full h-full object-contain relative z-10 opacity-90 scale-95"
        />

        {/* Z z Z Sleeping floating text */}
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2], y: [-5, -18, -5], scale: [0.8, 1.15, 0.8] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="absolute -top-2 -right-1 font-black text-sm text-[#1cb0f6] drop-shadow-xs z-20"
        >
          Z z
        </motion.span>
      </div>
    );
  }

  // Default Standing Official Duo Owl Mascot (Beside active lesson node)
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
      className={clsx('relative flex items-center justify-center select-none', className)}
      style={{ width: size, height: size }}
    >
      {/* Soft floor shadow */}
      <div className="absolute -bottom-1 w-4/5 h-3 bg-black/20 rounded-full blur-xs" />

      {/* Official Duo Owl SVG Graphic */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mascot/duo_owl_official.svg"
        alt="Duo the Owl Mascot"
        className="w-full h-full object-contain relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-200"
      />
    </motion.div>
  );
};
