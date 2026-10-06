'use client';

import React, { useState } from 'react';
import { SpeakButton } from '@/components/audio/SpeakButton';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface SoundItem {
  symbol: string;
  example: string;
  translation: string;
  category: 'Vowels' | 'Consonants' | 'Special Accent';
}

const SPANISH_SOUNDS: SoundItem[] = [
  { symbol: 'a', example: 'agua', translation: 'water', category: 'Vowels' },
  { symbol: 'e', example: 'el', translation: 'the', category: 'Vowels' },
  { symbol: 'i', example: 'isla', translation: 'island', category: 'Vowels' },
  { symbol: 'o', example: 'hola', translation: 'hello', category: 'Vowels' },
  { symbol: 'u', example: 'uno', translation: 'one', category: 'Vowels' },
  
  { symbol: 'ñ', example: 'niño', translation: 'boy', category: 'Special Accent' },
  { symbol: 'rr', example: 'perro', translation: 'dog', category: 'Special Accent' },
  { symbol: 'll', example: 'llave', translation: 'key', category: 'Special Accent' },
  
  { symbol: 'b', example: 'bueno', translation: 'good', category: 'Consonants' },
  { symbol: 'c', example: 'casa', translation: 'house', category: 'Consonants' },
  { symbol: 'g', example: 'gato', translation: 'cat', category: 'Consonants' },
  { symbol: 'j', example: 'jardín', translation: 'garden', category: 'Consonants' },
];

export default function SoundsPage() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Vowels' | 'Consonants' | 'Special Accent'>('All');

  const filtered = activeCategory === 'All' 
    ? SPANISH_SOUNDS 
    : SPANISH_SOUNDS.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Header Banner */}
      <div className="duo-card-dark p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#1cb0f6] text-xs font-black uppercase mb-1">
            <Volume2 className="w-4 h-4" /> Phonetics & Pronunciation
          </div>
          <h1 className="text-3xl font-black text-white">Spanish Sound Chart</h1>
          <p className="text-xs font-bold text-[#93a7b1] mt-1">
            Tap any sound symbol to listen to its natural pronunciation and example word.
          </p>
        </div>
        <div className="p-4 bg-[#1cb0f6]/10 border-2 border-[#1cb0f6] rounded-2xl shrink-0 text-center">
          <Sparkles className="w-8 h-8 text-[#1cb0f6] mx-auto animate-pulse" />
          <span className="text-xs font-black text-[#1cb0f6]">12 Sounds</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b-2 border-[#20323d] pb-3 overflow-x-auto">
        {(['All', 'Vowels', 'Special Accent', 'Consonants'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#1cb0f6] text-white border-b-4 border-[#1899d6]'
                : 'bg-[#182730] text-[#52656d] hover:text-[#93a7b1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sound Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="duo-card-dark p-4 flex flex-col items-center justify-between gap-3 text-center group hover:border-[#1cb0f6] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#131f24] border-2 border-[#20323d] flex items-center justify-center font-black text-3xl text-[#1cb0f6] group-hover:scale-110 transition-transform">
              {item.symbol}
            </div>

            <div>
              <span className="font-extrabold text-white text-base block">{item.example}</span>
              <span className="text-xs font-bold text-[#52656d] block">{item.translation}</span>
            </div>

            <SpeakButton text={item.example} className="w-full text-xs py-2" />
          </div>
        ))}
      </div>

      {/* Tip Banner */}
      <div className="p-4 rounded-2xl bg-[#182730] border-2 border-[#20323d] flex items-center gap-3 text-xs font-bold text-[#93a7b1]">
        <CheckCircle2 className="w-5 h-5 text-[#58cc02] shrink-0" />
        <span>Tip: Repeat after listening to build strong accent pronunciation muscle memory!</span>
      </div>
    </div>
  );
}
