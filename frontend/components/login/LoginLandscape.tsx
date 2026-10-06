'use client';

import React from 'react';

export const LoginLandscape: React.FC = () => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full object-cover"
      >
        <defs>
          {/* Sky Gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8FCF9" />
            <stop offset="70%" stopColor="#EFF8F2" />
            <stop offset="100%" stopColor="#E3F4EA" />
          </linearGradient>

          {/* Dirt Trail Gradient */}
          <linearGradient id="pathGrad" x1="720" y1="770" x2="720" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F7EAAE" />
            <stop offset="100%" stopColor="#FAEEB5" />
          </linearGradient>

          {/* Cloud Color */}
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EBF7EE" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E2F3E7" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* 1. Base Sky Fill */}
        <rect width="1440" height="900" fill="url(#skyGrad)" />

        {/* 2. Clouds in the Sky */}
        {/* Upper Left Cloud */}
        <g fill="url(#cloudGrad)">
          <path d="M 50 200 Q 50 140 100 140 Q 130 110 170 135 Q 220 120 230 170 Q 250 200 220 225 Q 190 235 150 230 L 70 230 Q 50 230 50 200 Z" />
          <ellipse cx="140" cy="180" rx="60" ry="35" />
          <ellipse cx="90" cy="195" rx="40" ry="25" />
          <ellipse cx="190" cy="195" rx="40" ry="25" />
        </g>

        {/* Mid Left Cloud */}
        <g fill="url(#cloudGrad)">
          <path d="M 60 480 Q 60 430 110 430 Q 140 405 180 430 Q 220 420 230 460 Q 245 490 220 515 L 80 515 Q 60 515 60 480 Z" />
          <ellipse cx="145" cy="475" rx="55" ry="30" />
          <ellipse cx="100" cy="490" rx="35" ry="22" />
          <ellipse cx="190" cy="490" rx="35" ry="22" />
        </g>

        {/* Upper Right Cloud */}
        <g fill="url(#cloudGrad)">
          <path d="M 1240 170 Q 1250 120 1300 135 Q 1340 110 1370 140 Q 1420 140 1420 200 Q 1420 230 1370 230 L 1270 230 Q 1240 225 1240 170 Z" />
          <ellipse cx="1335" cy="180" rx="60" ry="35" />
          <ellipse cx="1285" cy="195" rx="40" ry="25" />
          <ellipse cx="1385" cy="195" rx="40" ry="25" />
        </g>

        {/* Mid Right Cloud */}
        <g fill="url(#cloudGrad)">
          <path d="M 1250 460 Q 1260 420 1300 430 Q 1340 405 1370 430 Q 1420 430 1420 480 L 1420 515 L 1280 515 Q 1250 500 1250 460 Z" />
          <ellipse cx="1335" cy="475" rx="55" ry="30" />
          <ellipse cx="1290" cy="490" rx="35" ry="22" />
          <ellipse cx="1380" cy="490" rx="35" ry="22" />
        </g>

        {/* 3. Floating Twinkling Stars in the Sky */}
        {/* Sparkle 1: Upper-left golden star */}
        <path
          d="M 230 365 Q 230 355 235 355 Q 230 355 230 345 Q 230 355 225 355 Q 230 355 230 365 Z"
          fill="#FED734"
        />

        {/* Sparkle 2: Mid-left lime star */}
        <path
          d="M 345 540 Q 345 530 350 530 Q 345 530 345 520 Q 345 530 340 530 Q 345 530 345 540 Z"
          fill="#86D73F"
        />

        {/* Sparkle 3: Upper-right golden star */}
        <path
          d="M 1150 360 Q 1150 350 1155 350 Q 1150 350 1150 340 Q 1150 350 1145 350 Q 1150 350 1150 360 Z"
          fill="#FED734"
        />

        {/* Sparkle 4: Mid-right lime star */}
        <path
          d="M 1235 500 Q 1235 492 1240 492 Q 1235 492 1235 484 Q 1235 492 1230 492 Q 1235 492 1235 500 Z"
          fill="#86D73F"
        />

        {/* 4. Background Rolling Hills (Layer 1 - Soft Pale Green) */}
        <path
          d="M 0 640 
             C 280 580, 560 670, 850 610 
             C 1140 550, 1340 630, 1440 620 
             L 1440 900 L 0 900 Z"
          fill="#CCECCC"
        />

        {/* 5. Midground Rolling Hills (Layer 2 - Vibrant Spring Green) */}
        <path
          d="M 0 710 
             C 240 630, 500 730, 780 670 
             C 1060 610, 1300 710, 1440 680 
             L 1440 900 L 0 900 Z"
          fill="#7ECC3B"
        />

        {/* Trees & Bushes on Midground Hills */}
        {/* Left Tree Cluster */}
        <g id="trees-left">
          {/* Tree 1 (Left-most) */}
          <rect x="178" y="650" width="8" height="20" rx="3" fill="#8B5A2B" />
          <ellipse cx="182" cy="640" rx="18" ry="24" fill="#3E9D29" />
          <circle cx="176" cy="645" r="12" fill="#358C22" />

          {/* Tree 2 (Round Bush beside it) */}
          <circle cx="210" cy="655" r="16" fill="#46A830" />
          <circle cx="222" cy="660" r="12" fill="#358C22" />
        </g>

        {/* Right Tree Cluster */}
        <g id="trees-right">
          {/* Tree 3 (Tall Oval Tree) */}
          <rect x="1334" y="625" width="8" height="24" rx="3" fill="#8B5A2B" />
          <ellipse cx="1338" cy="615" rx="18" ry="26" fill="#3E9D29" />
          <ellipse cx="1346" cy="622" rx="12" ry="16" fill="#4AA832" />

          {/* Tree 4 (Bush next to it) */}
          <circle cx="1312" cy="635" r="14" fill="#358C22" />
          <circle cx="1302" cy="642" r="10" fill="#46A830" />
        </g>

        {/* Far Right Foliage Clumps */}
        <g id="bushes-far-right">
          <circle cx="1180" cy="695" r="22" fill="#388E22" />
          <circle cx="1205" cy="690" r="28" fill="#42A22C" />
          <circle cx="1235" cy="700" r="20" fill="#32841F" />
        </g>

        {/* 6. Foreground Hill (Layer 3 - Duolingo Rich Lawn Green) */}
        <path
          d="M 0 780 
             C 320 690, 620 785, 720 785 
             C 820 785, 1120 670, 1440 760 
             L 1440 900 L 0 900 Z"
          fill="#58CC02"
        />

        {/* Sub-layer: Low Front Wave for Depth */}
        <path
          d="M 0 830 
             C 420 785, 1020 785, 1440 830 
             L 1440 900 L 0 900 Z"
          fill="#52BE02"
        />

        {/* Foliage & Bush Tuft Crests */}
        {/* Left Side Bush Tuft */}
        <g fill="#368A18">
          <circle cx="45" cy="770" r="32" />
          <circle cx="95" cy="780" r="24" />
          <circle cx="140" cy="795" r="20" />
        </g>

        {/* Right Side Bush Tuft */}
        <g fill="#368A18">
          <circle cx="1280" cy="805" r="28" />
          <circle cx="1335" cy="785" r="34" />
          <circle cx="1395" cy="780" r="36" />
        </g>

        {/* Yellow Buttercup Wildflowers scattered across grass */}
        <g fill="#FED734">
          <circle cx="70" cy="860" r="3.5" />
          <circle cx="135" cy="840" r="3" />
          <circle cx="185" cy="875" r="3.5" />
          <circle cx="280" cy="830" r="3" />
          <circle cx="340" cy="880" r="3.5" />
          <circle cx="420" cy="845" r="3" />
          <circle cx="520" cy="870" r="3.5" />
          <circle cx="920" cy="865" r="3.5" />
          <circle cx="1010" cy="840" r="3" />
          <circle cx="1120" cy="875" r="3.5" />
          <circle cx="1200" cy="835" r="3" />
          <circle cx="1260" cy="865" r="3.5" />
          <circle cx="1370" cy="850" r="3" />
        </g>

        {/* 7. The Winding Dirt Trail / Path */}
        <path
          d="M 698 775 
             C 703 775, 715 775, 715 775 
             C 718 805, 725 835, 742 860 
             C 758 880, 775 892, 785 900 
             L 655 900 
             C 668 890, 682 875, 688 850 
             C 695 825, 696 800, 698 775 Z"
          fill="url(#pathGrad)"
        />
      </svg>
    </div>
  );
};
