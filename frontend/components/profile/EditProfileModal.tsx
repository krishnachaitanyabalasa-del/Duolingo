'use client';

import React, { useState } from 'react';
import { FullProfile } from '@/types/user';
import { X, Check } from 'lucide-react';

interface EditProfileModalProps {
  profile: FullProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: { display_name: string; username: string; bio: string; avatar_id: string }) => void | Promise<void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState(profile.display_name || profile.username);
  const [username, setUsername] = useState(profile.username || 'learner');
  const [bio, setBio] = useState(profile.bio || '');
  const [avatarId, setAvatarId] = useState(profile.avatar_id || 'avatar_1');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ display_name: displayName, username, bio, avatar_id: avatarId });
      onClose();
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-[#20323d] pb-4">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-[#20323d] hover:bg-gray-200 dark:hover:bg-[#283b47] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] text-gray-900 dark:text-white font-bold text-sm outline-none transition-all"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-gray-400 dark:text-[#52656d] tracking-wider mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] focus:border-[#1cb0f6] dark:focus:border-[#1cb0f6] text-gray-900 dark:text-white font-bold text-sm outline-none transition-all resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-[#20323d] hover:bg-gray-200 dark:hover:bg-[#283b47] text-gray-600 dark:text-[#93a7b1] font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#46a302] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSaving ? 'SAVING...' : 'SAVE'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
