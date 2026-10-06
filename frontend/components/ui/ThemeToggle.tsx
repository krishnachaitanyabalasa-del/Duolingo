'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, Theme } from '@/context/ThemeContext';
import { sounds } from '@/lib/sound';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ThemeToggleProps {
  variant?: 'icon' | 'switch' | 'segmented';
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className,
  showLabel = false,
}) => {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();

  const handleToggle = () => {
    try {
      sounds.playClick();
    } catch {
      // Audio fallback
    }
    toggleTheme();
  };

  const handleSetTheme = (newTheme: Theme) => {
    try {
      sounds.playClick();
    } catch {
      // Audio fallback
    }
    setTheme(newTheme);
  };

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle theme mode"
        onClick={handleToggle}
        className={clsx(
          'w-14 h-7 rounded-full transition-colors relative p-1 cursor-pointer flex items-center border-2',
          isDark
            ? 'bg-[#1cb0f6] border-[#1899d6]'
            : 'bg-amber-400 border-amber-500',
          className
        )}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={clsx(
            'w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center',
            isDark ? 'translate-x-7' : 'translate-x-0'
          )}
        >
          {isDark ? (
            <Moon className="w-3 h-3 text-[#1899d6] fill-[#1899d6]" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />
          )}
        </motion.div>
      </button>
    );
  }

  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.ElementType }[] = [
      { value: 'light', label: 'Light', icon: Sun },
      { value: 'dark', label: 'Dark', icon: Moon },
      { value: 'system', label: 'System', icon: Laptop },
    ];

    return (
      <div className={clsx('flex items-center p-1 bg-gray-100 dark:bg-[#131f24] rounded-2xl border-2 border-gray-200 dark:border-[#20323d] gap-1', className)}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSetTheme(opt.value)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer',
                isSelected
                  ? 'bg-white dark:bg-[#182730] text-[#1cb0f6] shadow-sm border border-gray-200 dark:border-[#20323d]'
                  : 'text-gray-500 dark:text-[#52656d] hover:text-gray-900 dark:hover:text-[#93a7b1]'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'icon' button
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={clsx(
        'p-2.5 rounded-2xl border-2 border-b-4 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:translate-y-0.5',
        isDark
          ? 'bg-[#182730] border-[#20323d] text-amber-400 hover:bg-[#20323d] hover:border-amber-400/40'
          : 'bg-white border-gray-200 text-amber-500 hover:bg-amber-50/50 hover:border-amber-300',
        className
      )}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-5 h-5 fill-amber-400 text-amber-400" />
        ) : (
          <Sun className="w-5 h-5 fill-amber-400 text-amber-500" />
        )}
      </motion.div>
      {showLabel && (
        <span className="text-xs font-black tracking-wide text-gray-700 dark:text-gray-200">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};
