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

  const inviteUrl = `https://duolingo.clone/invite/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-3xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b-2 border-gray-100 dark:border-[#20323d] pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#1cb0f6]" />
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Invite Friends
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-gray-100 dark:bg-[#20323d] hover:bg-gray-200 dark:hover:bg-[#283b47] flex items-center justify-center text-gray-500 dark:text-[#93a7b1] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-bold text-gray-500 dark:text-[#93a7b1] leading-relaxed">
          Share your personal invite link to study together and compete on the weekly leaderboards!
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={inviteUrl}
            className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#131f24] border-2 border-gray-200 dark:border-[#20323d] text-gray-700 dark:text-[#93a7b1] font-bold text-xs outline-none"
          />

          <button
            onClick={handleCopy}
            className="px-5 py-3 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs uppercase tracking-wider shadow-[0_4px_0_0_#1899d6] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
