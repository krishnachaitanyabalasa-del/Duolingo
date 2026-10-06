'use client';

import React, { useState, useEffect } from 'react';
import { TranslateExercise as TranslateExerciseType } from '@/types/lesson';
import { SpeakButton } from '../audio/SpeakButton';
import { sounds } from '@/lib/sound';
import { motion, AnimatePresence } from 'framer-motion';

interface TranslateProps {
  exercise: TranslateExerciseType;
  onSelect: (answer: string) => void;
  disabled: boolean;
}

export const TranslateExercise: React.FC<TranslateProps> = ({
  exercise,
  onSelect,
  disabled,
}) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);

  useEffect(() => {
    setSelectedWords([]);
    setAvailableWords([...exercise.wordBank]);
    if (exercise.audioText) {
      sounds.speak(exercise.audioText);
    }
  }, [exercise.id, exercise.wordBank]);

  const addWord = (word: string, indexInAvailable: number) => {
    if (disabled) return;
    sounds.playClick();
    const newSelected = [...selectedWords, word];
    const newAvailable = availableWords.filter((_, idx) => idx !== indexInAvailable);

    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    onSelect(newSelected.join(' '));
  };

  const removeWord = (word: string, indexInSelected: number) => {
    if (disabled) return;
    sounds.playClick();
    const newSelected = selectedWords.filter((_, idx) => idx !== indexInSelected);
    const newAvailable = [...availableWords, word];

    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);
    onSelect(newSelected.join(' '));
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start px-4">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Translate this sentence</h1>

      {/* Sentence Prompt Card */}
      <div className="flex items-center gap-4 mb-8 p-4 bg-[#182730] border-2 border-[#20323d] rounded-2xl w-full">
        {exercise.audioText && <SpeakButton text={exercise.audioText} />}
        <span className="font-extrabold text-xl text-white">{exercise.originalText}</span>
      </div>

      {/* Answer Slots Area */}
      <div className="w-full min-h-[90px] p-4 bg-[#182730] border-2 border-b-4 border-[#20323d] rounded-2xl mb-8 flex flex-wrap items-center gap-2.5">
        <AnimatePresence>
          {selectedWords.map((word, idx) => (
            <motion.button
              key={`${word}-${idx}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              disabled={disabled}
              onClick={() => removeWord(word, idx)}
              className="px-4 py-2.5 bg-[#20323d] border-2 border-b-4 border-[#1cb0f6] text-[#1cb0f6] font-extrabold text-base rounded-xl cursor-pointer hover:bg-[#283d4a] transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
        {selectedWords.length === 0 && (
          <span className="text-[#52656d] font-bold text-sm">Tap word chips to construct sentence</span>
        )}
      </div>

      {/* Available Word Bank Chips */}
      <div className="flex flex-wrap justify-center gap-3 w-full">
        {availableWords.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            disabled={disabled}
            onClick={() => addWord(word, idx)}
            className="px-4 py-3 bg-[#182730] border-2 border-b-4 border-[#20323d] text-white font-extrabold text-base rounded-xl cursor-pointer hover:bg-[#20323d] active:translate-y-1 transition-all"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};
