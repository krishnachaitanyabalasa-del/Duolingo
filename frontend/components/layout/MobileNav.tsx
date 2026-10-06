'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, Settings, Dumbbell } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn' },
    { href: '/practice', icon: Dumbbell, label: 'Practice' },
    { href: '/leaderboard', icon: Trophy, label: 'Rank' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#131f24] border-t-2 border-gray-200 dark:border-[#20323d] px-2 py-2 flex items-center justify-around transition-colors duration-150">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === '/learn' && pathname === '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
              isActive
                ? 'text-[#1cb0f6] font-extrabold'
                : 'text-gray-400 dark:text-[#52656d] font-medium hover:text-gray-700 dark:hover:text-[#93a7b1]'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
