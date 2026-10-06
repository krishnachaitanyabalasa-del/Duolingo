'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { MobileNav } from './MobileNav';
import { useUserContext } from '@/context/UserContext';
import { OutOfHearts } from '../lesson/OutOfHearts';

export const AppLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refillHearts, authLoading, isAuthenticated } = useUserContext();
  const [showRefillModal, setShowRefillModal] = useState(false);

  const isLoginRoute = pathname === '/login';
  const isLessonRoute = pathname?.startsWith('/lesson/');

  // Route protection effect
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated && !isLoginRoute) {
      // Unauthenticated user attempting to access protected route -> redirect to /login
      router.replace('/login');
    } else if (isAuthenticated && isLoginRoute) {
      // Already authenticated user visiting /login -> redirect to /learn
      router.replace('/learn');
    }
  }, [authLoading, isAuthenticated, isLoginRoute, router]);

  // Initial loading screen while Firebase/auth initializes
  if (authLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#131f24] text-[#3c3c3c] dark:text-[#f7f9fa] transition-colors duration-150">
        <div className="w-20 h-20 bg-[#58cc02] rounded-3xl flex items-center justify-center text-4xl shadow-lg shadow-green-500/20 animate-bounce mb-4">
          🦉
        </div>
        <p className="font-black text-sm text-gray-500 dark:text-[#93a7b1] tracking-wider uppercase animate-pulse">
          Loading Duolingo...
        </p>
      </div>
    );
  }

  // If unauthenticated and trying to access any page other than /login, prevent flashing protected UI
  if (!isAuthenticated && !isLoginRoute) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#131f24] text-[#3c3c3c] dark:text-[#f7f9fa]">
        <div className="w-16 h-16 bg-[#58cc02] rounded-2xl flex items-center justify-center text-3xl shadow-md animate-pulse mb-3">
          🦉
        </div>
        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Redirecting to login...
        </p>
      </div>
    );
  }

  // If already authenticated and currently on /login, show redirecting state
  if (isAuthenticated && isLoginRoute) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#131f24] text-[#3c3c3c] dark:text-[#f7f9fa]">
        <div className="w-16 h-16 bg-[#58cc02] rounded-2xl flex items-center justify-center text-3xl shadow-md animate-pulse mb-3">
          🦉
        </div>
        <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Entering Duolingo...
        </p>
      </div>
    );
  }

  // Standalone full-screen pages: Login page or Lesson exercise screen
  if (isLoginRoute || isLessonRoute) {
    return (
      <main className="w-full min-h-screen bg-white dark:bg-[#131f24] text-gray-800 dark:text-[#f7f9fa] transition-colors duration-150">
        {children}
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#131f24] text-gray-800 dark:text-[#f7f9fa] transition-colors duration-150">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Center Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">{children}</main>
        <MobileNav />
      </div>

      {/* Right Information Panel for Desktop */}
      <RightPanel user={user} />

      {/* Hearts Refill Modal */}
      {showRefillModal && (
        <OutOfHearts
          onRefill={async () => {
            await refillHearts();
            setShowRefillModal(false);
          }}
        />
      )}
    </div>
  );
};
