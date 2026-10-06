'use client';

import React, { useState } from 'react';
import { X, Search, UserPlus, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface FindFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleFollow?: (userId: number | string) => void;
}

export const FindFriendsModal: React.FC<FindFriendsModalProps> = ({
  isOpen,
  onClose,
  onToggleFollow,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const mockUsers = [
    { id: 2, username: 'Orion', displayName: 'Orion Star', xp: 1250, isFollowing: false },
    { id: 3, username: 'Sarah', displayName: 'Sarah Parker', xp: 980, isFollowing: true },
    { id: 4, username: 'Rahul', displayName: 'Rahul Sharma', xp: 750, isFollowing: false },
  ];

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-[#20323d] pb-4">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Find Friends
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-[#20323d] hover:bg-gray-200 dark:hover:bg-[#283b47] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 dark:text-[#52656d]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] text-gray-900 dark:text-white font-bold text-sm outline-none transition-all"
          />
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {filteredUsers.length === 0 ? (
            <div className="py-6 text-center text-xs font-bold text-gray-400">
              No matching learners found.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1cb0f6] flex items-center justify-center text-white font-black text-sm">
                    {user.displayName[0]}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white">
                      {user.displayName}
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 dark:text-[#52656d]">
                      @{user.username} • {user.xp} XP
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow?.(user.id)}
                  className={clsx(
                    'px-3 py-1.5 rounded-xl font-black text-[11px] tracking-wider transition-all border-2 cursor-pointer flex items-center gap-1.5',
                    user.isFollowing
                      ? 'bg-gray-100 dark:bg-[#20323d] text-gray-600 dark:text-[#93a7b1] border-gray-200 dark:border-[#2b3d49]'
                      : 'bg-[#1cb0f6] text-white border-transparent'
                  )}
                >
                  {user.isFollowing ? (
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
