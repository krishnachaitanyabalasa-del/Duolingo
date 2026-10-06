'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Volume2, Dumbbell, Shield, Gift, ShoppingBag, User, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'LEARN', href: '/learn', icon: Home },
    { label: 'SOUNDS', href: '/sounds', icon: Volume2 },
    { label: 'PRACTICE', href: '/practice', icon: Dumbbell },
    { label: 'LEADERBOARDS', href: '/leaderboard', icon: Shield },
    { label: 'QUESTS', href: '/quests', icon: Gift },
    { label: 'SHOP', href: '/shop', icon: ShoppingBag },
    { label: 'PROFILE', href: '/profile', icon: User },
    { label: 'MORE', href: '/settings', icon: MoreHorizontal },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-[#20323d] p-4 bg-[#131f24] z-20 shrink-0 select-none justify-between">
      <div>
        {/* Duolingo Brand Logo Header */}
        <Link href="/learn" className="flex items-center gap-2 px-3 py-3 mb-2">
          <span className="font-black text-3xl tracking-tight text-[#58cc02] hover:opacity-90 transition-opacity">
            duolingo
          </span>
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/learn' && pathname === '/');

            return (
              <Link
                key={item.label}
                href={item.href}
                className={clsx(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2 cursor-pointer',
                  isActive
                    ? 'bg-[#182c34] text-[#1cb0f6] border-[#1cb0f6] shadow-[0_2px_0_0_#1cb0f6]'
                    : 'text-[#52656d] border-transparent hover:bg-[#182730] hover:text-[#93a7b1]'
                )}
              >
                <Icon className={clsx('w-6 h-6', isActive ? 'text-[#1cb0f6]' : 'text-[#52656d]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card (Matching Screenshot 1) */}
      <div className="mt-4 p-4 rounded-2xl bg-[#182730] border-2 border-[#20323d] space-y-2 text-center group hover:border-[#37464f] transition-all cursor-pointer">
        <div className="flex justify-center text-3xl">
          ♟️
        </div>
        <div className="font-black text-xs text-white group-hover:text-[#1cb0f6] transition-colors">
          Want to learn chess?
        </div>
      </div>
    </aside>
  );
};
