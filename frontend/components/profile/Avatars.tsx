'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CartoonAvatarProps {
  avatarId?: string;
  size?: number;
  showDashedBorder?: boolean;
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  avatarId = 'avatar_1',
  size = 100,
  showDashedBorder = false,
  className = '',
}) => {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={clsx(
        'rounded-full flex items-center justify-center bg-gradient-to-tr from-[#1cb0f6] via-[#58cc02] to-[#ffc800] p-1 shadow-lg shrink-0 relative select-none',
        showDashedBorder && 'border-4 border-dashed border-[#1cb0f6]',
        className
      )}
    >
      <div className="w-full h-full rounded-full bg-white dark:bg-[#182730] flex items-center justify-center text-5xl overflow-hidden shadow-inner">
        <span>🦉</span>
      </div>
    </div>
  );
};
