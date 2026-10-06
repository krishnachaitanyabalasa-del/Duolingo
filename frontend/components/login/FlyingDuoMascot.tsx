'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FlyingDuoMascotProps {
  className?: string;
  size?: number;
}

export const FlyingDuoMascot: React.FC<FlyingDuoMascotProps> = ({
  className = '',
  size = 140,
}) => {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 0.9 }}
    >
      <svg
        viewBox="0 0 160 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_8px_16px_rgba(88,204,2,0.15)]"
      >
        {/* Floating Sparkles & Burst Rays around Duo */}
        {/* Sparkle 1: Top Left Golden Star */}
        <path
          d="M 28 42 Q 28 36, 32 36 Q 28 36, 28 30 Q 28 36, 24 36 Q 28 36, 28 42 Z"
          fill="#FFC200"
        />

        {/* Sparkle 2: Mid Left Golden Star */}
        <path
          d="M 32 88 Q 32 82, 36 82 Q 32 82, 32 76 Q 32 82, 28 82 Q 32 82, 32 88 Z"
          fill="#FFC200"
        />

        {/* Sparkle 3: Lower Right Golden Star */}
        <path
          d="M 128 92 Q 128 87, 132 87 Q 128 87, 128 82 Q 128 87, 124 87 Q 128 87, 128 92 Z"
          fill="#FFC200"
        />

        {/* Sparkle 4: Small Orange Diamond near right wing */}
        <polygon points="126,62 130,66 126,70 122,66" fill="#FF9600" />

        {/* Energy Rays (Top Right Joy Burst - 4 rays matching reference screenshot) */}
        <g stroke="#FFC200" strokeWidth="3.6" strokeLinecap="round">
          {/* Ray 1 (Upper-diagonal) */}
          <line x1="120" y1="36" x2="129" y2="27" />
          {/* Ray 2 (Upper-horizontal) */}
          <line x1="130" y1="44" x2="142" y2="40" />
          {/* Ray 3 (Middle-horizontal) */}
          <line x1="131" y1="54" x2="143" y2="55" />
          {/* Ray 4 (Lower-diagonal) */}
          <line x1="127" y1="64" x2="137" y2="71" />
        </g>

        {/* Feet (Orange dangling kicking feet) */}
        {/* Left Foot */}
        <g id="left-foot">
          <ellipse cx="64" cy="112" rx="7" ry="5" fill="#FF9600" />
          <ellipse cx="60" cy="114" rx="4" ry="4" fill="#FF9600" />
          <ellipse cx="68" cy="113" rx="4" ry="4" fill="#FF9600" />
        </g>

        {/* Right Foot */}
        <g id="right-foot">
          <ellipse cx="96" cy="112" rx="7" ry="5" fill="#FF9600" />
          <ellipse cx="92" cy="113" rx="4" ry="4" fill="#FF9600" />
          <ellipse cx="100" cy="114" rx="4" ry="4" fill="#FF9600" />
        </g>

        {/* Main Body Silhouette with Wings */}
        {/* Left Wing (Raised Upwards in Joy) */}
        <path
          d="M 58 72 C 45 65, 32 50, 36 38 C 39 30, 48 35, 54 44 C 60 52, 64 62, 66 70 Z"
          fill="#58CC02"
        />
        {/* Left Wing Inner Feather details */}
        <path
          d="M 40 40 C 44 34, 52 40, 56 48"
          stroke="#46A302"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Wing (Stretched Outwards) */}
        <path
          d="M 102 70 C 114 62, 128 54, 136 58 C 142 61, 138 72, 128 78 C 118 84, 108 82, 100 78 Z"
          fill="#58CC02"
        />
        {/* Right Wing Inner Feather details */}
        <path
          d="M 126 62 C 132 66, 128 74, 120 76"
          stroke="#46A302"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Main Body & Head */}
        <path
          d="M 52 45 
             C 48 32, 62 26, 70 34 
             C 74 37, 86 37, 90 34 
             C 98 26, 112 32, 108 45 
             C 118 55, 120 85, 110 102 
             C 102 114, 58 114, 50 102 
             C 40 85, 42 55, 52 45 Z"
          fill="#58CC02"
        />

        {/* Belly Patch (Lighter Lime Green) */}
        <path
          d="M 60 68 
             C 60 58, 100 58, 100 68 
             C 104 88, 100 108, 80 108 
             C 60 108, 56 88, 60 68 Z"
          fill="#8EE000"
        />

        {/* Belly Feather Markings (3 Darker Green Chevron/U arcs) */}
        <g stroke="#52A300" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M 74 76 Q 80 81 86 76" />
          <path d="M 69 88 Q 74 93 79 88" />
          <path d="M 81 88 Q 86 93 91 88" />
        </g>

        {/* Eyes (Two Big White Circles) */}
        {/* Left Eye */}
        <ellipse cx="67" cy="56" rx="14" ry="16" fill="#FFFFFF" />
        {/* Right Eye */}
        <ellipse cx="93" cy="56" rx="14" ry="16" fill="#FFFFFF" />

        {/* Pupils (Dark Slate / Black, looking up-right) */}
        {/* Left Pupil */}
        <ellipse cx="69.5" cy="54" rx="8" ry="9" fill="#1E293B" />
        {/* Left Pupil Highlight Dots */}
        <circle cx="72" cy="51" r="3" fill="#FFFFFF" />
        <circle cx="67" cy="57" r="1.5" fill="#FFFFFF" />

        {/* Right Pupil */}
        <ellipse cx="95.5" cy="54" rx="8" ry="9" fill="#1E293B" />
        {/* Right Pupil Highlight Dots */}
        <circle cx="98" cy="51" r="3" fill="#FFFFFF" />
        <circle cx="93" cy="57" r="1.5" fill="#FFFFFF" />

        {/* Cheerful Eyebrows / Eyelids */}
        <path
          d="M 55 45 C 60 41, 74 41, 78 46"
          stroke="#46A302"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 82 46 C 86 41, 100 41, 105 45"
          stroke="#46A302"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Beak (Curved Golden-Orange Triangle) */}
        <path
          d="M 75 58 C 77 56, 83 56, 85 58 C 86 64, 82 72, 80 73 C 78 72, 74 64, 75 58 Z"
          fill="#FF9600"
        />
        {/* Beak Highlight */}
        <path
          d="M 77 58 C 79 57, 81 57, 83 58 C 82 61, 80 63, 80 63 C 80 63, 78 61, 77 58 Z"
          fill="#FFC200"
        />
      </svg>
    </motion.div>
  );
};
