'use client';

import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { SoundProgressBar } from './SoundProgressBar';
import { sounds } from '@/lib/sound';

export interface SoundCardData {
  id: number;
  symbol: string;
  example_word: string;
  example_translation?: string;
  audio_text?: string;
  progress_percent: number;
  mastered: boolean;
}

interface SoundCardProps {
  sound: SoundCardData;
  onSelect: (sound: SoundCardData) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({ sound, onSelect }) => {
  const handleClick = () => {
    // Play sound click feedback
    sounds.playClick();
    // Play spoken pronunciation
    sounds.speak(sound.example_word, 'en-US');
    // Trigger modal selection
    onSelect(sound);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={clsx(
        'group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none min-h-[110px] sm:min-h-[120px]',
        'bg-[#182730] border-[#20323d] shadow-[0_4px_0_0_#141f25]',
        'hover:-translate-y-1 hover:border-[#37464f] hover:bg-[#1a2d37] hover:shadow-[0_6px_0_0_#141f25]',
        'active:translate-y-0 active:shadow-none',
        sound.mastered && 'border-[#58cc02]/40 bg-[#16292b]'
      )}
    >
      {/* Mastered badge top right */}
      {sound.mastered && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#58cc02] flex items-center justify-center text-[#131f24]">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </div>
      )}

      {/* Phonetic Symbol (Large, Bright text, Centered) */}
      <div className="mt-1 font-extrabold text-2xl sm:text-3xl text-white tracking-wide group-hover:scale-105 transition-transform duration-150">
        {sound.symbol}
      </div>

      {/* Example word (Smaller, muted gray text, Centered) */}
      <div className="text-xs font-bold text-[#8397a1] group-hover:text-[#a0b5c0] transition-colors">
        {sound.example_word}
      </div>

      {/* Progress Bar (Small horizontal bar near bottom) */}
      <div className="w-full flex justify-center mt-2">
        <SoundProgressBar
          progressPercent={sound.progress_percent}
          mastered={sound.mastered}
        />
      </div>
    </div>
  );
};
