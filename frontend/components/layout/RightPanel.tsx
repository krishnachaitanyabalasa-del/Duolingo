'use client';

import React from 'react';
import Link from 'next/link';
import { StreakDisplay } from '../gamification/StreakDisplay';
import { XPDisplay } from '../gamification/XPDisplay';
import { HeartsDisplay } from '../gamification/HeartsDisplay';
import { GemsDisplay } from '../gamification/GemsDisplay';
import { UserProfile } from '@/types/user';
import { Sparkles, Shield } from 'lucide-react';

interface RightPanelProps {
  user: UserProfile;
}

export const RightPanel: React.FC<RightPanelProps> = ({ user }) => {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 p-6 bg-[#131f24] border-l-2 border-[#20323d] space-y-6 overflow-y-auto">
      {/* Top Stats Bar Row (Matching Screenshot 3) */}
      <div className="flex items-center justify-between gap-2 bg-[#131f24] p-1 rounded-2xl">
        <div className="flex items-center gap-1">
          <span className="text-xl">🇺🇸</span>
          <span className="font-extrabold text-xs text-[#93a7b1]">63</span>
        </div>
        <StreakDisplay streak={user.streak} />
        <GemsDisplay gems={user.gems} />
        <HeartsDisplay hearts={user.hearts} />
      </div>

      {/* Super Duolingo Promotion Widget (Matching Screenshot 3) */}
      <div className="duo-card-dark bg-[#182730] p-5 rounded-3xl border-2 border-[#20323d] space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-block bg-gradient-to-r from-[#1cb0f6] via-[#ce82ff] to-[#ff4b4b] text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-md tracking-wider">
            SUPER
          </span>
          <Sparkles className="w-6 h-6 text-[#ce82ff] animate-pulse" />
        </div>

        <div>
          <h4 className="font-extrabold text-lg text-white mb-1">Try Super for free</h4>
          <p className="text-xs font-bold text-[#93a7b1] leading-relaxed">
            No ads, personalized practice, and unlimited Legendary!
          </p>
        </div>

        <button className="w-full duo-button duo-button-blue text-xs font-black py-3">
          TRY 1 WEEK FREE
        </button>
      </div>

      {/* Leaderboards Status Widget (Matching Screenshot 3) */}
      <div className="duo-card-dark bg-[#182730] p-5 rounded-3xl border-2 border-[#20323d] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-extrabold text-[10px] uppercase tracking-wider text-[#52656d] block mb-1">
              LEADERBOARDS
            </span>
            <h4 className="font-extrabold text-base text-white">Better luck next time!</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#ce82ff]/20 border-2 border-[#ce82ff] flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#ce82ff] fill-[#ce82ff]" />
          </div>
        </div>

        <p className="text-xs font-bold text-[#93a7b1] leading-relaxed">
          You finished #14 and dropped down to the Amethyst League
        </p>

        <Link
          href="/leaderboard"
          className="w-full duo-button duo-button-dark text-xs font-black py-3 text-center text-[#1cb0f6] border-[#20323d]"
        >
          GO TO LEADERBOARDS
        </Link>
      </div>
    </aside>
  );
};
