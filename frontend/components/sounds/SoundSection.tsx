'use client';

import React from 'react';
import { SoundCard, SoundCardData } from './SoundCard';

interface SoundSectionProps {
  title: string;
  sounds: SoundCardData[];
  onSelectSound: (sound: SoundCardData) => void;
}

export const SoundSection: React.FC<SoundSectionProps> = ({
  title,
  sounds,
  onSelectSound,
}) => {
  if (!sounds || sounds.length === 0) return null;

  return (
    <section className="w-full my-6 sm:my-8 space-y-5">
      {/* Section Header with Horizontal Lines on Both Sides */}
      <div className="flex items-center justify-center gap-4 w-full px-2">
        <div className="flex-1 h-[2px] bg-[#20323d] rounded-full" />
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide text-center shrink-0">
          {title}
        </h2>
        <div className="flex-1 h-[2px] bg-[#20323d] rounded-full" />
      </div>

      {/* 3-Column Sound Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
        {sounds.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            onSelect={onSelectSound}
          />
        ))}
      </div>
    </section>
  );
};
