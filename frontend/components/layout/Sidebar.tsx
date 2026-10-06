'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Volume2, Dumbbell, Shield, Gift, ShoppingBag, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
    { label: 'SETTINGS', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r-2 border-gray-200 dark:border-[#20323d] p-4 bg-white dark:bg-[#131f24] z-20 shrink-0 select-none justify-between transition-colors duration-150 pb-6">
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
                    ? 'bg-sky-50 dark:bg-[#182c34] text-[#1cb0f6] border-[#1cb0f6] shadow-[0_2px_0_0_#1cb0f6]'
                    : 'text-gray-500 dark:text-[#52656d] border-transparent hover:bg-gray-100 dark:hover:bg-[#182730] hover:text-gray-900 dark:hover:text-[#93a7b1]'
                )}
              >
                <Icon className={clsx('w-6 h-6', isActive ? 'text-[#1cb0f6]' : 'text-gray-400 dark:text-[#52656d]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        {/* Bottom Promo Card */}
        <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] space-y-1.5 text-center group hover:border-gray-300 dark:hover:border-[#37464f] transition-all cursor-pointer">
          <div className="flex justify-center text-2xl">
            ♟️
          </div>
          <div className="font-black text-xs text-gray-800 dark:text-white group-hover:text-[#1cb0f6] transition-colors">
            Want to learn chess?
          </div>
        </div>

        {/* Sidebar Footer with Theme Mode Switch */}
        <div className="pt-3 border-t-2 border-gray-100 dark:border-[#20323d] flex items-center justify-between px-2">
          <span className="text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider">
            THEME
          </span>
          <ThemeToggle variant="switch" />
        </div>
      </div>
    </aside>
  );
};
