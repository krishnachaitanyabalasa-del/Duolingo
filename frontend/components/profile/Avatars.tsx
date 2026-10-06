'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CartoonAvatarProps {
  avatarId?: string;
  avatarUrl?: string;
  size?: number;
  showDashedBorder?: boolean;
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  avatarId = 'avatar_01',
  avatarUrl,
  size = 100,
  showDashedBorder = false,
  className = '',
}) => {
  const url =
    avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={clsx(
        'rounded-full flex items-center justify-center bg-gradient-to-tr from-[#1cb0f6] via-[#58cc02] to-[#ffc800] p-1 shadow-lg shrink-0 relative select-none',
        showDashedBorder && 'border-4 border-dashed border-[#1cb0f6]',
        className
      )}
    >
      <div className="w-full h-full rounded-full bg-[#e5e5e5] dark:bg-[#182730] flex items-center justify-center overflow-hidden shadow-inner">
        <img src={url} alt="Cartoon Avatar Clipart" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

