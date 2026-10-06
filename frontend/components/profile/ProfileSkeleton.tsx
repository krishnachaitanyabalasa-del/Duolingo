'use client';

import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto w-full animate-pulse space-y-6 select-none">
      <div className="bg-gray-200 dark:bg-[#182730] rounded-3xl h-64 w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-[#182730] rounded-2xl h-24" />
        ))}
      </div>
      <div className="bg-gray-200 dark:bg-[#182730] rounded-3xl h-48 w-full" />
    </div>
  );
};
