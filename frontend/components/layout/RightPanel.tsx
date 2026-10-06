'use client';

import React from 'react';
import Link from 'next/link';
import { StreakDisplay } from '../gamification/StreakDisplay';
import { HeartsDisplay } from '../gamification/HeartsDisplay';
import { GemsDisplay } from '../gamification/GemsDisplay';
import { UserProfile } from '@/types/user';
import { Sparkles, ChevronRight, Zap, Shield } from 'lucide-react';

interface RightPanelProps {
  user: UserProfile;
}

export const RightPanel: React.FC<RightPanelProps> = ({ user }) => {
  return (
    <aside className="hidden lg:flex flex-col w-[360px] h-screen sticky top-0 p-5 bg-[#131f24] border-l-2 border-[#20323d] space-y-5 overflow-y-auto shrink-0 select-none">
      {/* Top Stats Bar Row */}
      <div className="flex items-center justify-between gap-2 bg-[#131f24] p-1 rounded-2xl">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-[#182730] transition-colors cursor-pointer">
          <span className="text-2xl">🇺🇸</span>
          <span className="font-extrabold text-xs text-[#93a7b1]">63</span>
        </div>
        <StreakDisplay streak={user.streak} />
        <GemsDisplay gems={user.gems} />
        <HeartsDisplay hearts={user.hearts} />
      </div>

      {/* 1. Super Duolingo Promotional Card */}
      <div className="bg-[#182730] p-5 rounded-3xl border-2 border-[#20323d] space-y-3.5 relative overflow-hidden">
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

        <button className="w-full bg-[#4b4bff] hover:bg-[#3b3bff] text-white font-black text-xs py-3.5 rounded-2xl shadow-[0_4px_0_0_#3333cc] active:translate-y-1 active:shadow-none transition-all cursor-pointer">
          TRY 1 WEEK FREE
        </button>
      </div>

      {/* 2. League Card (Amethyst League) */}
      <div className="bg-[#182730] p-5 rounded-3xl border-2 border-[#20323d] space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-base text-white">Amethyst League</h4>
          <Link
            href="/leaderboard"
            className="text-[11px] font-black text-[#1cb0f6] hover:text-[#1899d6] uppercase tracking-wider transition-colors"
          >
            VIEW LEAGUE
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ce82ff]/20 border-2 border-[#ce82ff] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-[#ce82ff] fill-[#ce82ff]" />
          </div>
          <p className="text-xs font-bold text-[#93a7b1] leading-relaxed">
            Complete a lesson to join this week&apos;s leaderboard and compete against other learners
          </p>
        </div>
      </div>

      {/* 3. Daily Quests Card */}
      <div className="bg-[#182730] p-5 rounded-3xl border-2 border-[#20323d] space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-base text-white">Daily Quests</h4>
          <Link
            href="/quests"
            className="text-[11px] font-black text-[#1cb0f6] hover:text-[#1899d6] uppercase tracking-wider transition-colors"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffc800]/20 border-2 border-[#ffc800] flex items-center justify-center text-[#ffc800] shrink-0">
                <Zap className="w-5 h-5 fill-[#ffc800]" />
              </div>
              <span className="font-extrabold text-xs text-white">Earn 10 XP</span>
            </div>
            <span className="font-black text-xs text-[#52656d]">0 / 10</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-3.5 bg-[#20323d] rounded-full overflow-hidden p-0.5">
              <div className="h-full bg-[#ffc800] rounded-full w-0 transition-all duration-300" />
            </div>
            <span className="text-lg">📦</span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Links */}
      <div className="pt-2 px-1 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-extrabold text-[#52656d] uppercase tracking-wider">
        <Link href="#" className="hover:text-[#93a7b1]">ABOUT</Link>
        <Link href="#" className="hover:text-[#93a7b1]">BLOG</Link>
        <Link href="#" className="hover:text-[#93a7b1]">STORE</Link>
        <Link href="#" className="hover:text-[#93a7b1]">CAREERS</Link>
        <Link href="#" className="hover:text-[#93a7b1]">TERMS</Link>
        <Link href="#" className="hover:text-[#93a7b1]">PRIVACY</Link>
      </div>
    </aside>
  );
};
