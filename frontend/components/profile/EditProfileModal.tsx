'use client';

import React, { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { FullProfile } from '@/types/user';
import { CartoonAvatar, AVATAR_OPTIONS } from './Avatars';

interface EditProfileModalProps {
  profile: FullProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: {
    display_name: string;
    username: string;
    bio: string;
    avatar_id: string;
  }) => Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [username, setUsername] = useState(profile.username || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [selectedAvatarId, setSelectedAvatarId] = useState(profile.avatar_id || 'avatar_01');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave({
        display_name: displayName,
        username,
        bio,
        avatar_id: selectedAvatarId,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update profile. Username may be taken.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl w-full max-w-lg overflow-hidden shadow-xl my-8 space-y-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 dark:border-[#20323d]">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#131f24] hover:bg-gray-200 dark:hover:bg-[#20323d] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-bold text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* 1. Cartoon Avatar Selection */}
          <div className="space-y-2.5">
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider">
              Choose Avatar
            </label>
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-gray-50 dark:bg-[#131f24] border border-gray-200 dark:border-[#20323d]">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => setSelectedAvatarId(avatar.id)}
                    className={`relative p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-[#182c34] border-[#1cb0f6] shadow-[0_2px_0_0_#1cb0f6]'
                        : 'bg-white dark:bg-[#182730] border-transparent hover:border-gray-200 dark:hover:border-[#20323d]'
                    }`}
                  >
                    <CartoonAvatar avatarId={avatar.id} size={48} />
                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 mt-1 truncate max-w-[50px]">
                      {avatar.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1cb0f6] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Display Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] transition-colors"
              placeholder="e.g. Krishna Chaitanya"
            />
          </div>

          {/* 3. Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider">
              Username / Handle
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] transition-colors"
              placeholder="e.g. krishnacha97971"
            />
          </div>

          {/* 4. Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] transition-colors resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-gray-100 dark:border-[#20323d]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-500 dark:text-[#93a7b1] hover:bg-gray-100 dark:hover:bg-[#20323d] transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46a302] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>SAVE CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
