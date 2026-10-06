'use client';

import React from 'react';
import { UserProfile } from '@/types/user';
import { Calendar, Shield } from 'lucide-react';

interface UserCardProps {
  user: UserProfile;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="duo-card flex flex-col sm:flex-row items-center gap-6 p-6 mb-8">
      <img
        src={user.avatarUrl}
        alt={user.username}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-green-500 object-cover shadow-lg"
      />
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h1 className="text-3xl font-black text-gray-800">{user.username}</h1>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full border border-amber-300 w-fit mx-auto sm:mx-0">
            <Shield className="w-3.5 h-3.5 fill-amber-500" /> {user.league}
          </span>
        </div>
        <p className="text-sm font-extrabold text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
          <Calendar className="w-4 h-4" /> Joined {user.joinedDate}
        </p>
      </div>
    </div>
  );
};
