'use client';

import React from 'react';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse select-none max-w-4xl mx-auto w-full">
      {/* 1. Header Card Skeleton */}
      <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-6 space-y-6">
        <div className="w-full h-48 sm:h-56 rounded-2xl bg-gray-200 dark:bg-[#131f24]" />
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2.5">
            <div className="h-8 w-64 bg-gray-200 dark:bg-[#20323d] rounded-xl" />
            <div className="h-4 w-36 bg-gray-200 dark:bg-[#20323d] rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-[#20323d] rounded-lg" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-[#20323d] rounded-lg" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-[#20323d]" />
            <div className="w-10 h-10 rounded-2xl bg-gray-200 dark:bg-[#20323d]" />
          </div>
        </div>
      </div>

      {/* 2. Statistics Grid Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-32 bg-gray-200 dark:bg-[#20323d] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl p-4 flex items-center gap-3.5"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-[#131f24]" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-20 bg-gray-200 dark:bg-[#20323d] rounded" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-[#20323d] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Achievements Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-36 bg-gray-200 dark:bg-[#20323d] rounded-lg" />
        <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-[#131f24]" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gray-200 dark:bg-[#20323d] rounded" />
                <div className="h-3 w-48 bg-gray-200 dark:bg-[#20323d] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
