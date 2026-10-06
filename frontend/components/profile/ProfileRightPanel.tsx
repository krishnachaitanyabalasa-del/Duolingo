'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Mail, UserPlus, UserCheck, Flame, Heart, Zap, Sparkles } from 'lucide-react';
import { FullProfile, FollowerUser } from '@/types/user';
import { CartoonAvatar } from './Avatars';

interface ProfileRightPanelProps {
  profile: FullProfile;
  followers: FollowerUser[];
  following: FollowerUser[];
  onFindFriendsClick: () => void;
  onInviteFriendsClick: () => void;
  onToggleFollow: (userId: number | string) => void;
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
  const activeTab = externalTab || internalTab;

  const handleTabClick = (tab: 'following' | 'followers') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const list = activeTab === 'following' ? following : followers;

  return (
    <aside className="hidden lg:flex flex-col w-[360px] h-screen sticky top-0 p-5 bg-white dark:bg-[#131f24] border-l-2 border-gray-200 dark:border-[#20323d] space-y-5 overflow-y-auto shrink-0 select-none transition-colors duration-150">
      {/* 1. Top Stats Bar Row matching Screenshot 1 */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-gray-50 dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d]">
        {/* Language Progress Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 font-extrabold text-xs text-gray-800 dark:text-white">
          <span className="text-base">🇺🇸</span>
          <span>63</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1.5 px-2 py-1 font-extrabold text-xs text-gray-500 dark:text-[#52656d]">
          <Flame className="w-4 h-4 text-gray-400 dark:text-[#52656d]" />
          <span>{profile.stats.streak}</span>
        </div>

        {/* Gems */}
        <div className="flex items-center gap-1.5 px-2 py-1 font-extrabold text-xs text-[#1cb0f6]">
          <span className="text-base">💎</span>
          <span>{profile.stats.gems}</span>
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 px-2 py-1 font-extrabold text-xs text-[#ff4b4b]">
          <Heart className="w-4 h-4 fill-[#ff4b4b] text-[#ff4b4b]" />
          <span>{profile.stats.hearts}</span>
        </div>
      </div>

      {/* 2. Following / Followers Card matching Screenshot 1 */}
      <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl overflow-hidden shadow-sm">
        {/* Tab Headers */}
        <div className="flex border-b-2 border-gray-100 dark:border-[#20323d]">
          <button
            onClick={() => handleTabClick('following')}
            className={`flex-1 py-3.5 font-black text-xs uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === 'following'
                ? 'text-[#1cb0f6]'
                : 'text-gray-400 dark:text-[#52656d] hover:text-gray-700 dark:hover:text-[#93a7b1]'
            }`}
          >
            FOLLOWING
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#1cb0f6] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('followers')}
            className={`flex-1 py-3.5 font-black text-xs uppercase tracking-wider transition-colors relative cursor-pointer ${
              activeTab === 'followers'
                ? 'text-[#1cb0f6]'
                : 'text-gray-400 dark:text-[#52656d] hover:text-gray-700 dark:hover:text-[#93a7b1]'
            }`}
          >
            FOLLOWERS
            {activeTab === 'followers' && (
              <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#1cb0f6] rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {list && list.length > 0 ? (
            <div className="space-y-3">
              {list.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <CartoonAvatar avatarId={u.avatar_id} size={40} />
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                        {u.display_name || u.username}
                      </div>
                      <div className="text-xs font-bold text-gray-400 dark:text-[#52656d]">
                        {u.xp} XP
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFollow(u.id)}
                    className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      u.is_following
                        ? 'bg-gray-100 dark:bg-[#131f24] text-gray-500 dark:text-[#93a7b1] border border-gray-200 dark:border-[#20323d]'
                        : 'bg-[#1cb0f6] text-white hover:bg-[#1899d6]'
                    }`}
                  >
                    {u.is_following ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            // Empty State with Friends Illustration matching Screenshot 1
            <div className="text-center py-4 space-y-4">
              {/* Group Friends SVG Illustration */}
              <div className="flex justify-center">
                <svg viewBox="0 0 200 90" className="w-48 h-24 select-none">
                  {/* Friend 1 (Pink) */}
                  <g transform="translate(20, 20)">
                    <circle cx="15" cy="15" r="12" fill="#EC4899" />
                    <rect x="5" y="27" width="20" height="35" rx="5" fill="#DB2777" />
                    <circle cx="11" cy="13" r="2" fill="#FFFFFF" />
                    <circle cx="19" cy="13" r="2" fill="#FFFFFF" />
                  </g>

                  {/* Friend 2 (Purple) */}
                  <g transform="translate(48, 15)">
                    <circle cx="15" cy="15" r="12" fill="#A855F7" />
                    <rect x="5" y="27" width="20" height="40" rx="5" fill="#7E22CE" />
                    <circle cx="11" cy="13" r="2" fill="#FFFFFF" />
                    <circle cx="19" cy="13" r="2" fill="#FFFFFF" />
                  </g>

                  {/* Friend 3 (Cyan Center) */}
                  <g transform="translate(80, 10)">
                    <circle cx="18" cy="18" r="14" fill="#38BDF8" />
                    <rect x="6" y="32" width="24" height="42" rx="6" fill="#0284C7" />
                    <circle cx="13" cy="16" r="2.5" fill="#FFFFFF" />
                    <circle cx="23" cy="16" r="2.5" fill="#FFFFFF" />
                    <path d="M14 22 Q18 27 22 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Friend 4 (Orange) */}
                  <g transform="translate(115, 18)">
                    <circle cx="15" cy="15" r="12" fill="#F97316" />
                    <rect x="5" y="27" width="20" height="38" rx="5" fill="#EA580C" />
                    <circle cx="11" cy="13" r="2" fill="#FFFFFF" />
                    <circle cx="19" cy="13" r="2" fill="#FFFFFF" />
                  </g>

                  {/* Friend 5 (Yellow) */}
                  <g transform="translate(145, 22)">
                    <circle cx="15" cy="15" r="12" fill="#EAB308" />
                    <rect x="5" y="27" width="20" height="34" rx="5" fill="#CA8A04" />
                    <circle cx="11" cy="13" r="2" fill="#FFFFFF" />
                    <circle cx="19" cy="13" r="2" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>

              <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] leading-relaxed max-w-[220px] mx-auto">
                Learning is more fun and effective when you connect with others.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Add Friends Card matching Screenshot 1 */}
      <div className="duo-card bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl p-5 space-y-3.5 shadow-sm">
        <h4 className="font-black text-base text-gray-900 dark:text-white">
          Add friends
        </h4>

        <div className="space-y-2">
          {/* Find Friends Button */}
          <button
            onClick={onFindFriendsClick}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] hover:bg-gray-100 dark:hover:bg-[#182c34] border border-gray-200 dark:border-[#20323d] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">🔍</div>
              <span className="font-extrabold text-xs text-gray-900 dark:text-white group-hover:text-[#1cb0f6] transition-colors">
                Find friends
              </span>
            </div>
            <span className="font-black text-sm text-gray-400 dark:text-[#52656d] group-hover:translate-x-0.5 transition-transform">
              ›
            </span>
          </button>

          {/* Invite Friends Button */}
          <button
            onClick={onInviteFriendsClick}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] hover:bg-gray-100 dark:hover:bg-[#182c34] border border-gray-200 dark:border-[#20323d] transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">✉️</div>
              <span className="font-extrabold text-xs text-gray-900 dark:text-white group-hover:text-[#1cb0f6] transition-colors">
                Invite friends
              </span>
            </div>
            <span className="font-black text-sm text-gray-400 dark:text-[#52656d] group-hover:translate-x-0.5 transition-transform">
              ›
            </span>
          </button>
        </div>
      </div>

      {/* 4. Footer Links matching Screenshot 2 */}
      <div className="pt-2 px-1 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] font-extrabold text-gray-400 dark:text-[#52656d] uppercase tracking-wider">
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">ABOUT</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">BLOG</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">STORE</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">EFFICACY</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">CAREERS</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">INVESTORS</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">TERMS</Link>
        <Link href="#" className="hover:text-gray-600 dark:hover:text-[#93a7b1] transition-colors">PRIVACY</Link>
      </div>
    </aside>
  );
};
