'use client';

import React from 'react';
import { FillBlankExercise } from '@/types/lesson';
import { clsx } from 'clsx';
import { sounds } from '@/lib/sound';

interface FillBlankProps {
  exercise: FillBlankExercise;
  selectedAnswer: unknown;
  onSelect: (answer: string) => void;
  disabled: boolean;
}

export const FillBlank: React.FC<FillBlankProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  const selectedStr = typeof selectedAnswer === 'string' ? selectedAnswer : '';

  const handleChoice = (opt: string) => {
    if (disabled) return;
    sounds.playClick();
    onSelect(opt);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
        {exercise.question}
      </h2>

      {/* Sentence with Blank Space Card */}
      <div className="p-6 bg-white dark:bg-[#182730] border-2 border-b-4 border-gray-200 dark:border-[#20323d] rounded-3xl w-full text-center mb-8 text-xl font-extrabold leading-relaxed text-gray-800 dark:text-white">
        <span>{exercise.sentencePrefix}</span>
        <span className="inline-block mx-2 min-w-[120px] px-3 py-1 bg-sky-50 dark:bg-[#183445] border-b-4 border-sky-400 dark:border-[#1cb0f6] text-sky-600 dark:text-sky-300 rounded-xl">
          {selectedStr || '______'}
        </span>
        <span>{exercise.sentenceSuffix}</span>
      </div>

      {/* Options */}
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {exercise.options.map((opt, idx) => {
          const isSelected = selectedStr === opt;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => handleChoice(opt)}
              className={clsx(
                'px-6 py-3.5 rounded-2xl border-2 border-b-4 font-extrabold text-lg transition-all cursor-pointer',
                isSelected
                  ? 'bg-sky-100 dark:bg-[#183445] border-sky-400 dark:border-[#1cb0f6] text-sky-700 dark:text-white shadow-md'
                  : 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d] hover:bg-gray-50 dark:hover:bg-[#20323d] text-gray-800 dark:text-white'
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
