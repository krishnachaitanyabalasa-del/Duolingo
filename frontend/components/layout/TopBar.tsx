'use client';

import React from 'react';
import Link from 'next/link';
import { StreakDisplay } from '../gamification/StreakDisplay';
import { XPDisplay } from '../gamification/XPDisplay';
import { HeartsDisplay } from '../gamification/HeartsDisplay';
import { GemsDisplay } from '../gamification/GemsDisplay';
import { UserProfile } from '@/types/user';

interface TopBarProps {
  user: UserProfile;
  onRefillClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ user, onRefillClick }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Flag / Course Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
          <span className="text-xl">🇪🇸</span>
          <span className="font-extrabold text-sm text-gray-700 hidden sm:inline">Spanish</span>
        </div>
      </div>

      {/* Persistent Gamification Stats */}
      <div className="flex items-center gap-2 sm:gap-4">
        <StreakDisplay streak={user.streak} />
        <XPDisplay xp={user.xp} />
        <GemsDisplay gems={user.gems} />
        <HeartsDisplay hearts={user.hearts} onClick={onRefillClick} />
      </div>

      {/* User Avatar */}
      <Link href="/profile" className="flex items-center">
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="w-9 h-9 rounded-full border-2 border-green-500 object-cover hover:scale-105 transition-transform"
        />
      </Link>
    </header>
  );
};
