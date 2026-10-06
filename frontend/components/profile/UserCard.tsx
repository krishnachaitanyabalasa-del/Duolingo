'use client';

import React, { useState } from 'react';
import { Pencil, Calendar, Users, Globe } from 'lucide-react';
import { FullProfile, UserCourse } from '@/types/user';
import { CartoonAvatar } from './Avatars';

interface UserCardProps {
  profile: FullProfile;
  onEditClick: () => void;
  onFollowersClick: (tab: 'following' | 'followers') => void;
  onCourseClick: (course: UserCourse) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  profile,
  onEditClick,
  onFollowersClick,
  onCourseClick,
}) => {
  return (
    <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
      {/* 1. Large Top Avatar Banner Container */}
      <div className="relative w-full bg-gray-100 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl h-48 sm:h-56 flex items-center justify-center overflow-hidden">
        {/* Cartoon Avatar Centered */}
        <div className="relative group cursor-pointer" onClick={onEditClick}>
          <CartoonAvatar
            avatarId={profile.avatar_id}
            size={120}
            showDashedBorder={true}
            className="transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* Edit Pencil Button Top Right */}
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] flex items-center justify-center text-gray-700 dark:text-[#93a7b1] hover:text-[#1cb0f6] dark:hover:text-[#1cb0f6] hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] shadow-sm transition-all active:scale-95 cursor-pointer"
          title="Edit Profile"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Profile Details & Language Badges Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: User Identity */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight break-all">
            {profile.display_name}
          </h1>

          <p className="text-sm font-bold text-gray-400 dark:text-[#52656d]">
            @{profile.username}
          </p>

          <div className="flex items-center gap-2 pt-1 text-sm font-extrabold text-gray-500 dark:text-[#93a7b1]">
            <Calendar className="w-4 h-4 text-gray-400 dark:text-[#52656d]" />
            <span>{profile.joined_date}</span>
          </div>

          {/* Followers & Following Counts */}
          <div className="flex items-center gap-4 pt-2 text-sm font-extrabold">
            <button
              onClick={() => onFollowersClick('following')}
              className="text-[#1cb0f6] hover:underline transition-all cursor-pointer"
            >
              {profile.following_count} Following
            </button>
            <button
              onClick={() => onFollowersClick('followers')}
              className="text-[#1cb0f6] hover:underline transition-all cursor-pointer"
            >
              {profile.followers_count} Follower{profile.followers_count === 1 ? '' : 's'}
            </button>
          </div>
        </div>

        {/* Right: Language / Course Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {profile.courses && profile.courses.length > 0 ? (
            profile.courses.map((course) => (
              <button
                key={course.id}
                onClick={() => onCourseClick(course)}
                className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] hover:border-[#1cb0f6] dark:hover:border-[#1cb0f6] flex items-center justify-center text-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                title={`${course.name} Course`}
              >
                {course.flag}
              </button>
            ))
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-[#131f24] text-xs font-bold text-gray-400">
              <Globe className="w-4 h-4" /> 🇪🇸 🇺🇸
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
