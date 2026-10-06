'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { RightPanel } from './RightPanel';
import { MobileNav } from './MobileNav';
import { useUser } from '@/hooks/useUser';
import { OutOfHearts } from '../lesson/OutOfHearts';

export const AppLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLessonRoute = pathname?.startsWith('/lesson/');
  const { user, refillHearts } = useUser();
  const [showRefillModal, setShowRefillModal] = useState(false);

  if (isLessonRoute) {
    return <main className="w-full min-h-screen bg-[#131f24]">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-[#131f24]">
      {/* Sidebar for Desktop (Matching Screenshot 3 Left Side) */}
      <Sidebar />

      {/* Center Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        <main className="flex-1 p-4 sm:p-6 max-w-4xl mx-auto w-full">{children}</main>
        <MobileNav />
      </div>

      {/* Right Information Panel for Desktop (Matching Screenshot 3 Right Side) */}
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
