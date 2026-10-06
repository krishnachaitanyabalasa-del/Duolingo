'use client';

import React, { useEffect } from 'react';
import { MultipleChoiceExercise } from '@/types/lesson';
import { SpeakButton } from '../audio/SpeakButton';
import { clsx } from 'clsx';

interface MultipleChoiceProps {
  exercise: MultipleChoiceExercise;
  selectedAnswer: unknown;
  onSelect: (answer: number) => void;
  disabled: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  const selectedIndex = typeof selectedAnswer === 'number' ? selectedAnswer : null;

  // Keyboard shortcut listener (keys 1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= exercise.options.length) {
        onSelect(num - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, exercise.options.length, onSelect]);

  const words = (exercise.prompt || exercise.audioText || '').split(' ');

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start px-4">
      {/* Exercise Section Title */}
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Read and respond</h1>

      {/* Audio Prompt Card with Dotted Words */}
      {exercise.audioText && (
        <div className="flex items-start gap-4 mb-8 p-4 bg-gray-50 dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl w-full">
          <SpeakButton text={exercise.audioText} />
          <div className="text-lg font-bold text-gray-800 dark:text-[#dce6eb] leading-relaxed pt-1 flex flex-wrap gap-1.5">
            {words.map((word, i) => (
              <span key={i} className="dotted-word">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Question Prompt */}
      <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-6">
        {exercise.question}
      </h2>

      {/* Options Stack */}
      <div className="flex flex-col gap-3.5 w-full">
        {exercise.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelect(idx)}
              className={clsx(
                'flex items-center gap-6 p-4 sm:p-5 rounded-2xl border-2 border-b-4 font-bold text-base transition-all text-left cursor-pointer',
                isSelected
                  ? 'bg-sky-50 dark:bg-[#183445] border-[#1cb0f6] text-sky-600 dark:text-white shadow-md'
                  : 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d] hover:bg-gray-50 dark:hover:bg-[#20323d] text-gray-800 dark:text-[#dce6eb]'
              )}
            >
              <span
                className={clsx(
                  'w-8 h-8 rounded-xl border-2 flex items-center justify-center text-xs font-black shrink-0',
                  isSelected
                    ? 'border-[#1cb0f6] text-[#1cb0f6] bg-white dark:bg-[#131f24]'
                    : 'border-gray-300 dark:border-[#37464f] text-gray-400 dark:text-[#52656d]'
                )}
              >
                {idx + 1}
              </span>
              <span className="flex-1 font-extrabold">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
