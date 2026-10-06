'use client';

import React, { useState } from 'react';
import type { FullProfile, FollowerUser } from '@/types/user';
import { UserPlus, Share2, UserCheck, UserX } from 'lucide-react';
import { clsx } from 'clsx';

interface ProfileRightPanelProps {
  profile: FullProfile;
  followers: FollowerUser[];
  following: FollowerUser[];
  onFindFriendsClick?: () => void;
  onInviteFriendsClick?: () => void;
  onToggleFollow?: (userId: number | string) => void;
  activeTab?: 'following' | 'followers';
  onTabChange?: (tab: 'following' | 'followers') => void;
}

export const ProfileRightPanel: React.FC<ProfileRightPanelProps> = ({
  profile,
  followers,
  following,
  onFindFriendsClick,
  onInviteFriendsClick,
  onToggleFollow,
  activeTab: externalTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'following' | 'followers'>('following');
  const activeTab = externalTab ?? internalTab;

  const handleTabClick = (tab: 'following' | 'followers') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const currentList = activeTab === 'following' ? following : followers;

  return (
    <aside className="w-full lg:w-[360px] flex flex-col space-y-5 select-none">
      {/* 1. Add Friends Buttons */}
      <div className="duo-card p-4 rounded-3xl bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] space-y-3">
        <h3 className="font-extrabold text-base text-gray-900 dark:text-white mb-2">
          Friends
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onFindFriendsClick}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-[#20323d] hover:bg-gray-100 dark:hover:bg-[#283b47] border-2 border-gray-200 dark:border-[#2b3d49] transition-all cursor-pointer font-black text-xs text-[#1cb0f6]"
          >
            <UserPlus className="w-4 h-4" />
            <span>FIND FRIENDS</span>
          </button>

          <button
            onClick={onInviteFriendsClick}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-[#20323d] hover:bg-gray-100 dark:hover:bg-[#283b47] border-2 border-gray-200 dark:border-[#2b3d49] transition-all cursor-pointer font-black text-xs text-[#1cb0f6]"
          >
            <Share2 className="w-4 h-4" />
            <span>INVITE</span>
          </button>
        </div>
      </div>

      {/* 2. Followers / Following List */}
      <div className="duo-card p-5 rounded-3xl bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] space-y-4">
        {/* Tab Headers */}
        <div className="flex border-b-2 border-gray-100 dark:border-[#20323d]">
          <button
            onClick={() => handleTabClick('following')}
            className={clsx(
              'flex-1 py-2.5 font-black text-xs uppercase tracking-wider text-center transition-colors border-b-2 -mb-[2px]',
              activeTab === 'following'
                ? 'border-[#1cb0f6] text-[#1cb0f6]'
                : 'border-transparent text-gray-400 dark:text-[#52656d] hover:text-gray-600 dark:hover:text-[#93a7b1]'
            )}
          >
            Following ({following.length || profile.following_count})
          </button>

          <button
            onClick={() => handleTabClick('followers')}
            className={clsx(
              'flex-1 py-2.5 font-black text-xs uppercase tracking-wider text-center transition-colors border-b-2 -mb-[2px]',
              activeTab === 'followers'
                ? 'border-[#1cb0f6] text-[#1cb0f6]'
                : 'border-transparent text-gray-400 dark:text-[#52656d] hover:text-gray-600 dark:hover:text-[#93a7b1]'
            )}
          >
            Followers ({followers.length || profile.followers_count})
          </button>
        </div>

        {/* User Items */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {currentList.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-gray-400 dark:text-[#52656d]">
              {activeTab === 'following'
                ? "You aren't following anyone yet."
                : 'No followers yet.'}
            </div>
          ) : (
            currentList.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-[#20323d] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1cb0f6] to-[#58cc02] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
                    {user.display_name ? user.display_name[0].toUpperCase() : 'U'}
                  </div>

                  <div>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white">
                      {user.display_name || user.username}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                      {user.xp} XP
                    </div>
                  </div>
                </div>

                {onToggleFollow && (
                  <button
                    onClick={() => onToggleFollow(user.id)}
                    className={clsx(
                      'px-3 py-1.5 rounded-xl font-black text-[11px] tracking-wider transition-all border-2 cursor-pointer flex items-center gap-1.5',
                      user.is_following
                        ? 'bg-gray-100 dark:bg-[#20323d] text-gray-600 dark:text-[#93a7b1] border-gray-200 dark:border-[#2b3d49] hover:border-red-400 hover:text-red-500'
                        : 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-transparent shadow-[0_2px_0_0_#1899d6]'
                    )}
                  >
                    {user.is_following ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>FOLLOWING</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>FOLLOW</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
