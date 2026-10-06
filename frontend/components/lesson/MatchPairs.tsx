'use client';

import React, { useState, useEffect } from 'react';
import { MatchPairsExercise } from '@/types/lesson';
import { sounds } from '@/lib/sound';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface MatchPairsProps {
  exercise: MatchPairsExercise;
  onSelect: (isComplete: boolean) => void;
  disabled: boolean;
}

export const MatchPairs: React.FC<MatchPairsProps> = ({
  exercise,
  onSelect,
  disabled,
}) => {
  const [leftOptions, setLeftOptions] = useState<{ id: string; text: string }[]>([]);
  const [rightOptions, setRightOptions] = useState<{ id: string; text: string }[]>([]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatchedPair, setMismatchedPair] = useState<[string, string] | null>(null);

  useEffect(() => {
    // Shuffle pairs for left and right columns
    const lefts = exercise.pairs.map((p) => ({ id: p.id, text: p.left }));
    const rights = [...exercise.pairs]
      .sort(() => Math.random() - 0.5)
      .map((p) => ({ id: p.id, text: p.right }));

    setLeftOptions(lefts);
    setRightOptions(rights);
    setMatchedIds([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMismatchedPair(null);
  }, [exercise.id, exercise.pairs]);

  const handleCardClick = (side: 'left' | 'right', id: string) => {
    if (disabled || matchedIds.includes(id)) return;

    sounds.playClick();

    if (side === 'left') {
      setSelectedLeft(id);
      if (selectedRight) {
        checkPair(id, selectedRight);
      }
    } else {
      setSelectedRight(id);
      if (selectedLeft) {
        checkPair(selectedLeft, id);
      }
    }
  };

  const checkPair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Match!
      sounds.playCorrect();
      const newMatched = [...matchedIds, leftId];
      setMatchedIds(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      if (newMatched.length === exercise.pairs.length) {
        onSelect(true);
      }
    } else {
      // Mismatch!
      sounds.playIncorrect();
      setMismatchedPair([leftId, rightId]);
      setTimeout(() => {
        setMismatchedPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center mb-6">
        {exercise.question}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftOptions.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedLeft === item.id;
            const isMismatch = mismatchedPair && mismatchedPair[0] === item.id;

            return (
              <motion.button
                key={`left-${item.id}`}
                disabled={disabled || isMatched}
                onClick={() => handleCardClick('left', item.id)}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                className={clsx(
                  'p-4 rounded-2xl border-2 border-b-4 font-extrabold text-base transition-all text-center cursor-pointer',
                  isMatched && 'bg-gray-100 dark:bg-[#131f24] border-gray-200 dark:border-[#20323d] text-gray-400 dark:text-gray-600 border-b-2 opacity-50 cursor-not-allowed',
                  isMismatch && 'bg-rose-100 dark:bg-[#3b1219] border-rose-400 dark:border-[#571922] text-rose-700 dark:text-rose-300 animate-shake',
                  isSelected && !isMismatch && 'bg-sky-100 dark:bg-[#183445] border-sky-400 dark:border-[#1cb0f6] text-sky-700 dark:text-sky-300 shadow-md',
                  !isMatched && !isSelected && !isMismatch && 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d] hover:bg-gray-50 dark:hover:bg-[#20323d] text-gray-800 dark:text-[#dce6eb]'
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightOptions.map((item) => {
            const isMatched = matchedIds.includes(item.id);
            const isSelected = selectedRight === item.id;
            const isMismatch = mismatchedPair && mismatchedPair[1] === item.id;

            return (
              <motion.button
                key={`right-${item.id}`}
                disabled={disabled || isMatched}
                onClick={() => handleCardClick('right', item.id)}
                whileTap={!isMatched ? { scale: 0.97 } : {}}
                className={clsx(
                  'p-4 rounded-2xl border-2 border-b-4 font-extrabold text-base transition-all text-center cursor-pointer',
                  isMatched && 'bg-gray-100 dark:bg-[#131f24] border-gray-200 dark:border-[#20323d] text-gray-400 dark:text-gray-600 border-b-2 opacity-50 cursor-not-allowed',
                  isMismatch && 'bg-rose-100 dark:bg-[#3b1219] border-rose-400 dark:border-[#571922] text-rose-700 dark:text-rose-300 animate-shake',
                  isSelected && !isMismatch && 'bg-sky-100 dark:bg-[#183445] border-sky-400 dark:border-[#1cb0f6] text-sky-700 dark:text-sky-300 shadow-md',
                  !isMatched && !isSelected && !isMismatch && 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d] hover:bg-gray-50 dark:hover:bg-[#20323d] text-gray-800 dark:text-[#dce6eb]'
                )}
              >
                {item.text}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
