'use client';

import React from 'react';
import { useUser } from '@/hooks/useUser';
import { UserCard } from '@/components/profile/UserCard';
import { StatsCard } from '@/components/profile/StatsCard';
import { AchievementsGrid } from '@/components/profile/AchievementsGrid';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, achievements, loading } = useUser();

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
        <p className="font-extrabold text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      <UserCard user={user} />
      <StatsCard user={user} />
      <AchievementsGrid achievements={achievements} />
    </div>
  );
}
