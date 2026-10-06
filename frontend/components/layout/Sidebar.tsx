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
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-[#20323d] p-4 bg-[#131f24] z-20">
      {/* Duolingo Brand Logo Header */}
      <Link href="/learn" className="flex items-center gap-2 px-3 py-4 mb-4">
        <span className="font-black text-3xl tracking-tight text-[#58cc02]">duolingo</span>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/learn' && pathname === '/');

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                'flex items-center gap-4 px-4 py-3 rounded-2xl font-black text-xs tracking-wider transition-all border-2',
                isActive
                  ? 'bg-[#182c34] text-[#1cb0f6] border-[#1cb0f6]'
                  : 'text-[#52656d] border-transparent hover:bg-[#182730] hover:text-[#93a7b1]'
              )}
            >
              <Icon className={clsx('w-6 h-6', isActive ? 'text-[#1cb0f6]' : 'text-[#52656d]')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
