'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, User, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn' },
    { href: '/leaderboard', icon: Trophy, label: 'Rank' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-gray-200 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === '/learn' && pathname === '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center gap-1 p-2 rounded-xl transition-colors',
              isActive ? 'text-sky-500 font-extrabold' : 'text-gray-400 font-medium hover:text-gray-600'
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
