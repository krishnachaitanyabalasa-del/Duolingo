'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getSounds, SoundsOverviewResponse } from '@/lib/api/sounds';
import { SoundSection } from './SoundSection';
import { SoundCardData } from './SoundCard';
import { SoundPracticeModal } from './SoundPracticeModal';
import { Volume2, RefreshCw, AlertCircle } from 'lucide-react';

// Fallback seed data in exact specified order if backend is unreachable
const FALLBACK_VOWELS: SoundCardData[] = [
  { id: 1, symbol: 'a', example_word: 'hot', progress_percent: 20, mastered: false },
  { id: 2, symbol: 'æ', example_word: 'cat', progress_percent: 40, mastered: false },
  { id: 3, symbol: 'ʌ', example_word: 'but', progress_percent: 10, mastered: false },
  { id: 4, symbol: 'ɛ', example_word: 'bed', progress_percent: 30, mastered: false },
  { id: 5, symbol: 'eɪ', example_word: 'say', progress_percent: 0, mastered: false },
  { id: 6, symbol: 'ɝ', example_word: 'bird', progress_percent: 0, mastered: false },
  { id: 7, symbol: 'ɪ', example_word: 'ship', progress_percent: 0, mastered: false },
  { id: 8, symbol: 'i', example_word: 'sheep', progress_percent: 0, mastered: false },
  { id: 9, symbol: 'ə', example_word: 'about', progress_percent: 0, mastered: false },
  { id: 10, symbol: 'oʊ', example_word: 'boat', progress_percent: 0, mastered: false },
  { id: 11, symbol: 'ʊ', example_word: 'foot', progress_percent: 0, mastered: false },
  { id: 12, symbol: 'u', example_word: 'food', progress_percent: 0, mastered: false },
  { id: 13, symbol: 'aʊ', example_word: 'cow', progress_percent: 0, mastered: false },
  { id: 14, symbol: 'aɪ', example_word: 'time', progress_percent: 0, mastered: false },
  { id: 15, symbol: 'ɔɪ', example_word: 'boy', progress_percent: 0, mastered: false },
];

const FALLBACK_CONSONANTS: SoundCardData[] = [
  { id: 16, symbol: 'b', example_word: 'book', progress_percent: 0, mastered: false },
  { id: 17, symbol: 'tʃ', example_word: 'chair', progress_percent: 0, mastered: false },
  { id: 18, symbol: 'd', example_word: 'day', progress_percent: 0, mastered: false },
  { id: 19, symbol: 'f', example_word: 'fish', progress_percent: 0, mastered: false },
  { id: 20, symbol: 'g', example_word: 'go', progress_percent: 0, mastered: false },
  { id: 21, symbol: 'h', example_word: 'home', progress_percent: 0, mastered: false },
  { id: 22, symbol: 'dʒ', example_word: 'job', progress_percent: 0, mastered: false },
  { id: 23, symbol: 'k', example_word: 'key', progress_percent: 0, mastered: false },
  { id: 24, symbol: 'l', example_word: 'lion', progress_percent: 0, mastered: false },
  { id: 25, symbol: 'm', example_word: 'moon', progress_percent: 0, mastered: false },
  { id: 26, symbol: 'n', example_word: 'nose', progress_percent: 0, mastered: false },
  { id: 27, symbol: 'ŋ', example_word: 'sing', progress_percent: 0, mastered: false },
  { id: 28, symbol: 'p', example_word: 'pig', progress_percent: 0, mastered: false },
  { id: 29, symbol: 'r', example_word: 'red', progress_percent: 0, mastered: false },
  { id: 30, symbol: 's', example_word: 'see', progress_percent: 0, mastered: false },
  { id: 31, symbol: 'ʒ', example_word: 'measure', progress_percent: 0, mastered: false },
  { id: 32, symbol: 'ʃ', example_word: 'shoe', progress_percent: 0, mastered: false },
  { id: 33, symbol: 't', example_word: 'time', progress_percent: 0, mastered: false },
  { id: 34, symbol: 'ð', example_word: 'then', progress_percent: 0, mastered: false },
  { id: 35, symbol: 'θ', example_word: 'think', progress_percent: 0, mastered: false },
  { id: 36, symbol: 'v', example_word: 'very', progress_percent: 0, mastered: false },
  { id: 37, symbol: 'w', example_word: 'water', progress_percent: 0, mastered: false },
  { id: 38, symbol: 'j', example_word: 'you', progress_percent: 0, mastered: false },
  { id: 39, symbol: 'z', example_word: 'zoo', progress_percent: 0, mastered: false },
];

export const SoundsPage: React.FC = () => {
  const [vowels, setVowels] = useState<SoundCardData[]>([]);
  const [consonants, setConsonants] = useState<SoundCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<SoundCardData | null>(null);

  const fetchSoundsData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res: SoundsOverviewResponse | null = await getSounds();

      if (res && res.categories && res.categories.length > 0) {
        const vCat = res.categories.find(
          (c) => c.name.toLowerCase() === 'vowels' || c.slug === 'vowels'
        );
        const cCat = res.categories.find(
          (c) => c.name.toLowerCase() === 'consonants' || c.slug === 'consonants'
        );

        setVowels(vCat ? vCat.sounds : []);
        setConsonants(cCat ? cCat.sounds : []);
      } else {
        // Fallback to mock data if API returns null/empty
        setVowels(FALLBACK_VOWELS);
        setConsonants(FALLBACK_CONSONANTS);
      }
    } catch (err) {
      console.warn('Failed to load sounds from backend API:', err);
      setError(true);
      setVowels(FALLBACK_VOWELS);
      setConsonants(FALLBACK_CONSONANTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSoundsData();
  }, [fetchSoundsData]);

  // Handle live progress updates after practicing a sound
  const handleProgressUpdated = (soundId: number, newProgress: number, mastered: boolean) => {
    setVowels((prev) =>
      prev.map((s) =>
        s.id === soundId
          ? { ...s, progress_percent: newProgress, mastered }
          : s
      )
    );
    setConsonants((prev) =>
      prev.map((s) =>
        s.id === soundId
          ? { ...s, progress_percent: newProgress, mastered }
          : s
      )
    );
  };

  const allSounds = [...vowels, ...consonants];

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-6 select-none">
      {/* Loading Skeleton State */}
      {loading && (
        <div className="space-y-8 animate-pulse">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex-1 h-0.5 bg-[#20323d]" />
            <div className="h-6 w-24 bg-[#20323d] rounded-lg" />
            <div className="flex-1 h-0.5 bg-[#20323d]" />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[110px] sm:h-[120px] rounded-2xl bg-[#182730] border-2 border-[#20323d]"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 w-full pt-4">
            <div className="flex-1 h-0.5 bg-[#20323d]" />
            <div className="h-6 w-32 bg-[#20323d] rounded-lg" />
            <div className="flex-1 h-0.5 bg-[#20323d]" />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl mx-auto">
            {Array.from({ length: 24 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[110px] sm:h-[120px] rounded-2xl bg-[#182730] border-2 border-[#20323d]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Alert Bar if API fails */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-[#ff4b4b]/10 border-2 border-[#ff4b4b]/40 flex items-center justify-between gap-3 text-xs font-bold text-[#ff4b4b]">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>Unable to connect to backend API. Showing offline sounds cache.</span>
          </div>
          <button
            onClick={fetchSoundsData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff4b4b] text-white font-black text-xs hover:bg-[#ff3333] transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Main Sound Content */}
      {!loading && (
        <>
          {vowels.length === 0 && consonants.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Volume2 className="w-12 h-12 text-[#52656d] mx-auto" />
              <h3 className="text-lg font-black text-white">No sounds available yet.</h3>
              <button
                onClick={fetchSoundsData}
                className="px-5 py-2.5 rounded-2xl bg-[#1cb0f6] text-white font-black text-xs uppercase"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Vowels Section */}
              <SoundSection
                title="Vowels"
                sounds={vowels}
                onSelectSound={(sound) => setSelectedSound(sound)}
              />

              {/* Consonants Section */}
              <SoundSection
                title="Consonants"
                sounds={consonants}
                onSelectSound={(sound) => setSelectedSound(sound)}
              />
            </div>
          )}
        </>
      )}

      {/* Interactive Practice Modal */}
      {selectedSound && (
        <SoundPracticeModal
          sound={selectedSound}
          allSounds={allSounds}
          onClose={() => setSelectedSound(null)}
          onProgressUpdated={handleProgressUpdated}
        />
      )}
    </div>
  );
};
