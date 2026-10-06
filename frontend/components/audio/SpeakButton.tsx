'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { clsx } from 'clsx';

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  lang = 'es-ES',
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={isPlaying ? stop : speak}
      aria-label="Listen to audio"
      className={clsx(
        'p-3.5 bg-[#1cb0f6] hover:bg-[#1899d6] text-white rounded-2xl shadow-md border-b-4 border-[#1899d6] active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center cursor-pointer shrink-0',
        isPlaying && 'ring-4 ring-[#1cb0f6]/50 animate-pulse',
        className
      )}
    >
      {isPlaying ? (
        <VolumeX className="w-6 h-6 stroke-[2.5]" />
      ) : (
        <Volume2 className="w-6 h-6 stroke-[2.5]" />
      )}
    </button>
  );
};
