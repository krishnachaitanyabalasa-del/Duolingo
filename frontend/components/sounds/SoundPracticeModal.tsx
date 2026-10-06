'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { SoundCardData } from './SoundCard';
import { practiceSound } from '@/lib/api/sounds';
import { sounds } from '@/lib/sound';

interface SoundPracticeModalProps {
  sound: SoundCardData | null;
  allSounds: SoundCardData[];
  onClose: () => void;
  onProgressUpdated: (soundId: number, newProgress: number, mastered: boolean) => void;
}

export const SoundPracticeModal: React.FC<SoundPracticeModalProps> = ({
  sound,
  allSounds,
  onClose,
  onProgressUpdated,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 4 multiple-choice options including the target sound symbol
  useEffect(() => {
    if (!sound) return;

    setSelectedOption(null);
    setHasSubmitted(false);
    setIsCorrect(null);

    // Play TTS speech automatically when opening modal
    sounds.speak(sound.example_word, 'en-US');

    // Collect distractor symbols from same category/all sounds
    const distractors = allSounds
      .filter((s) => s.symbol !== sound.symbol)
      .map((s) => s.symbol);

    // Shuffle and pick 3 unique distractors
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...shuffledDistractors, sound.symbol].sort(() => 0.5 - Math.random());

    setOptions(combined);
  }, [sound, allSounds]);

  if (!sound) return null;

  const handleSpeak = () => {
    sounds.speak(sound.example_word, 'en-US');
  };

  const handleCheck = async () => {
    if (!selectedOption || hasSubmitted || isSubmitting) return;

    setIsSubmitting(true);
    const correct = selectedOption === sound.symbol;
    setIsCorrect(correct);
    setHasSubmitted(true);

    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }

    // Call backend API to record practice result
    try {
      const res = await practiceSound(sound.id, correct);
      if (res) {
        onProgressUpdated(sound.id, res.progress_percent, res.mastered);
      }
    } catch (err) {
      console.error('Failed to update sound practice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={clsx(
          'relative w-full max-w-md bg-[#131f24] border-2 border-[#20323d] rounded-3xl p-6 shadow-2xl space-y-6',
          'transform transition-all duration-200 scale-100'
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#52656d] hover:text-white hover:bg-[#182730] transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Phonetic Header & Pronunciation */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 pt-2">
          {/* Symbol */}
          <div className="text-5xl font-black text-white tracking-wide">
            {sound.symbol}
          </div>

          {/* Speaker Button */}
          <button
            onClick={handleSpeak}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#182c34] border-2 border-[#1cb0f6] text-[#1cb0f6] font-black text-sm hover:bg-[#1cb0f6]/10 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>&quot;{sound.example_word}&quot;</span>
          </button>

          <p className="text-xs font-bold text-[#8397a1]">
            Listen carefully to the sound in the example word.
          </p>
        </div>

        {/* Prompt Question */}
        <div className="text-center">
          <h3 className="text-base font-extrabold text-white">
            What sound does this example use?
          </h3>
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const isSelected = selectedOption === opt;
            let buttonStyle = 'bg-[#182730] border-[#20323d] text-white hover:border-[#37464f]';

            if (hasSubmitted) {
              if (opt === sound.symbol) {
                buttonStyle = 'bg-[#58cc02]/20 border-[#58cc02] text-[#58cc02] font-black';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-[#ff4b4b]/20 border-[#ff4b4b] text-[#ff4b4b] font-black';
              } else {
                buttonStyle = 'bg-[#182730] border-[#20323d] text-[#52656d] opacity-50';
              }
            } else if (isSelected) {
              buttonStyle = 'bg-[#182c34] border-[#1cb0f6] text-[#1cb0f6] font-black shadow-[0_0_12px_rgba(28,176,246,0.3)]';
            }

            return (
              <button
                key={opt}
                disabled={hasSubmitted}
                onClick={() => {
                  sounds.playClick();
                  setSelectedOption(opt);
                }}
                className={clsx(
                  'h-16 rounded-2xl border-2 font-black text-2xl flex items-center justify-center transition-all cursor-pointer select-none',
                  buttonStyle
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback Area / Submit Button */}
        <div className="space-y-4 pt-2">
          {hasSubmitted && (
            <div
              className={clsx(
                'p-4 rounded-2xl border-2 flex items-center gap-3',
                isCorrect
                  ? 'bg-[#58cc02]/10 border-[#58cc02] text-[#58cc02]'
                  : 'bg-[#ff4b4b]/10 border-[#ff4b4b] text-[#ff4b4b]'
              )}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-7 h-7 shrink-0" />
                  <div>
                    <h4 className="font-black text-sm">Awesome job!</h4>
                    <p className="text-xs font-bold opacity-90">
                      You correctly identified the sound &quot;{sound.symbol}&quot;!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-7 h-7 shrink-0" />
                  <div>
                    <h4 className="font-black text-sm">Not quite!</h4>
                    <p className="text-xs font-bold opacity-90">
                      Correct sound: <span className="underline font-black">{sound.symbol}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {!hasSubmitted ? (
            <button
              disabled={!selectedOption || isSubmitting}
              onClick={handleCheck}
              className={clsx(
                'w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-[0_4px_0_0_#1899d6] active:translate-y-1 active:shadow-none cursor-pointer',
                selectedOption && !isSubmitting
                  ? 'bg-[#1cb0f6] text-white hover:bg-[#1bb4ff]'
                  : 'bg-[#20323d] text-[#52656d] shadow-none cursor-not-allowed'
              )}
            >
              CHECK
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSpeak}
                className="flex-1 py-3.5 rounded-2xl border-2 border-[#20323d] bg-[#182730] text-[#1cb0f6] font-black text-xs uppercase tracking-wider hover:bg-[#1a2d37] transition-all cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl bg-[#58cc02] text-[#131f24] font-black text-xs uppercase tracking-wider hover:bg-[#61e002] shadow-[0_4px_0_0_#46a302] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                I GOT IT
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
