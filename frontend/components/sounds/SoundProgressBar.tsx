import React from 'react';
import { clsx } from 'clsx';

interface SoundProgressBarProps {
  progressPercent: number;
  mastered?: boolean;
  className?: string;
}

export const SoundProgressBar: React.FC<SoundProgressBarProps> = ({
  progressPercent,
  mastered = false,
  className,
}) => {
  const clamped = Math.min(Math.max(progressPercent, 0), 100);

  // Dynamic bar color: green if mastered/full, yellow/orange if in progress, muted dark if empty
  const barColor = mastered || clamped === 100
    ? 'bg-[#58cc02]'
    : clamped > 0
    ? 'bg-[#ffc800]'
    : 'bg-transparent';

  return (
    <div className={clsx('w-10 sm:w-16 h-1.5 bg-gray-200 dark:bg-[#20323d] rounded-full overflow-hidden shrink-0', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', barColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
