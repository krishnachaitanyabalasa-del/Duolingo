'use client';

import React from 'react';
import { AnswerResult } from '@/types/lesson';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { DuoMascot } from '../mascot/DuoMascot';

interface AnswerFeedbackProps {
  hasAnswer: boolean;
  isSubmitted: boolean;
  result: AnswerResult | null;
  onCheck: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  hasAnswer,
  isSubmitted,
  result,
  onCheck,
  onContinue,
  onSkip,
}) => {
  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 border-t-2 py-5 px-6 transition-colors duration-300',
        !isSubmitted && 'bg-white dark:bg-[#131f24] border-gray-200 dark:border-[#20323d]',
        isSubmitted && result?.isCorrect && 'bg-[#d7ffb8] dark:bg-[#052b14] border-[#b8f28b] dark:border-[#0c401f] text-[#2c7a00] dark:text-green-300',
        isSubmitted && !result?.isCorrect && 'bg-[#ffdfe0] dark:bg-[#3b1219] border-[#ffb8b8] dark:border-[#571922] text-[#ea2b2b] dark:text-rose-300'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between min-h-[64px]">
        {/* Left Side Feedback Message or SKIP Button */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <button
              onClick={onSkip}
              className="duo-button duo-button-neutral px-8 py-3.5 text-xs font-black text-gray-500 dark:text-[#52656d]"
            >
              SKIP
            </button>
          ) : result?.isCorrect ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3.5"
            >
              <DuoMascot variant="happy" size={68} />
              <CheckCircle2 className="w-9 h-9 text-[#58cc02] fill-[#58cc02]/20 shrink-0" />
              <div>
                <h4 className="text-xl font-black text-[#58cc02]">Great job!</h4>
                <p className="text-xs font-bold text-[#2c7a00] dark:text-green-300">+{result?.xpEarned || 1} XP</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3.5"
            >
              <DuoMascot variant="sad" size={68} />
              <XCircle className="w-9 h-9 text-[#ff4b4b] fill-[#ff4b4b]/20 shrink-0" />
              <div>
                <h4 className="text-lg font-black text-[#ff4b4b]">Correct solution:</h4>
                <p className="text-sm font-bold text-gray-800 dark:text-white">{result?.correctAnswer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side Action Button */}
        <div>
          {!isSubmitted ? (
            <button
              disabled={!hasAnswer}
              onClick={onCheck}
              className="duo-button duo-button-green text-xs px-10 py-3.5"
            >
              CHECK
            </button>
          ) : (
            <button
              onClick={onContinue}
              className={clsx(
                'duo-button text-xs px-10 py-3.5',
                result?.isCorrect ? 'duo-button-green' : 'duo-button-rose'
              )}
            >
              CONTINUE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
