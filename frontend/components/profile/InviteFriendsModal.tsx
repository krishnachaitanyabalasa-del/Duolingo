'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface InviteFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const InviteFriendsModal: React.FC<InviteFriendsModalProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/invite/${username}`
      : `https://duolingo.clone/invite/${username}`;

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(inviteUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl w-full max-w-md overflow-hidden shadow-xl space-y-0 text-center">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 dark:border-[#20323d]">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#1cb0f6]" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Invite Friends
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#131f24] hover:bg-gray-200 dark:hover:bg-[#20323d] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="w-20 h-20 rounded-full bg-[#1cb0f6]/15 border-2 border-[#1cb0f6]/40 flex items-center justify-center mx-auto text-4xl">
            ✉️
          </div>

          <div>
            <h3 className="font-black text-lg text-gray-900 dark:text-white mb-1">
              Invite your friends to learn together!
            </h3>
            <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] leading-relaxed max-w-xs mx-auto">
              Share your personal invite link with friends to compare XP, streak goals, and climb leaderboards together.
            </p>
          </div>

          {/* Shareable Link Box */}
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d]">
            <input
              type="text"
              readOnly
              value={inviteUrl}
              className="flex-1 bg-transparent px-2 text-xs font-bold text-gray-700 dark:text-gray-300 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase tracking-wider shadow-[0_2px_0_0_#1899d6] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY LINK</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
