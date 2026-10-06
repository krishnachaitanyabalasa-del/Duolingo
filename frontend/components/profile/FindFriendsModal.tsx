'use client';

import React, { useState } from 'react';
import { X, Search, UserPlus, UserCheck } from 'lucide-react';
import { CartoonAvatar } from './Avatars';

interface FindFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleFollow: (userId: number | string) => void;
}

export const FindFriendsModal: React.FC<FindFriendsModalProps> = ({
  isOpen,
  onClose,
  onToggleFollow,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mockFriends, setMockFriends] = useState([
    { id: 2, username: 'Orion', display_name: 'Orion Star', avatar_id: 'avatar_03', xp: 1250, is_following: false },
    { id: 3, username: 'Sarah', display_name: 'Sarah Miller', avatar_id: 'avatar_02', xp: 980, is_following: true },
    { id: 4, username: 'Rahul', display_name: 'Rahul Sharma', avatar_id: 'avatar_04', xp: 750, is_following: false },
    { id: 5, username: 'Elena', display_name: 'Elena Rostova', avatar_id: 'avatar_05', xp: 90, is_following: false },
    { id: 6, username: 'David', display_name: 'David Chen', avatar_id: 'avatar_06', xp: 45, is_following: false },
  ]);

  if (!isOpen) return null;

  const filtered = mockFriends.filter(
    (f) =>
      f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.display_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowClick = (id: number) => {
    setMockFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_following: !f.is_following } : f))
    );
    onToggleFollow(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl w-full max-w-md overflow-hidden shadow-xl space-y-0">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 dark:border-[#20323d]">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Find Friends
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#131f24] hover:bg-gray-200 dark:hover:bg-[#20323d] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 dark:text-[#52656d]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] transition-colors"
            />
          </div>

          {/* User List */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CartoonAvatar avatarId={user.avatar_id} size={40} />
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-gray-900 dark:text-white truncate">
                      {user.display_name}
                    </div>
                    <div className="text-xs font-bold text-gray-400 dark:text-[#52656d]">
                      @{user.username} • {user.xp} XP
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleFollowClick(user.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    user.is_following
                      ? 'bg-gray-200 dark:bg-[#20323d] text-gray-600 dark:text-[#93a7b1]'
                      : 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white shadow-[0_2px_0_0_#1899d6]'
                  }`}
                >
                  {user.is_following ? 'Following' : '+ Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
