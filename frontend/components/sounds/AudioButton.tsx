'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { clsx } from 'clsx';
import { sounds } from '@/lib/sound';

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  lang = 'en-US',
  size = 'md',
  className,
  onClick,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setHasError(true);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        // Fallback to WebAudio synthesizer sound
        sounds.playClick();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
      sounds.playClick();
    }
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <button
      type="button"
      onClick={handlePlay}
      title={`Listen to "${text}"`}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl transition-all cursor-pointer select-none',
        'bg-[#182c34] hover:bg-[#203a46] text-[#1cb0f6] border border-[#20323d] active:scale-95',
        isPlaying && 'ring-2 ring-[#1cb0f6] animate-pulse',
        size === 'sm' && 'p-1.5',
        size === 'md' && 'p-2.5',
        size === 'lg' && 'p-4',
        className
      )}
    >
      {hasError ? (
        <VolumeX className={iconSizes[size]} />
      ) : (
        <Volume2 className={clsx(iconSizes[size], isPlaying && 'scale-110')} />
      )}
    </button>
  );
};
