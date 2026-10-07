'use client';

import React from 'react';
import { AnswerResult } from '@/types/lesson';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { DuoMascot } from '../mascot/DuoMascot';

interface AnswerFeedbackProps {
  hasAnswer: boolean;
  isSubmitted: boolean;
  isChecking?: boolean;
  result: AnswerResult | null;
  onCheck: () => void;
  onContinue: () => void;
  onSkip?: () => void;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  hasAnswer,
  isSubmitted,
  isChecking = false,
  result,
  onCheck,
  onContinue,
  onSkip,
}) => {
  const isEvaluated = isSubmitted && result !== null;

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 border-t-2 py-5 px-6 transition-colors duration-300',
        !isEvaluated && 'bg-white dark:bg-[#131f24] border-gray-200 dark:border-[#20323d]',
        isEvaluated && result.isCorrect && 'bg-[#d7ffb8] dark:bg-[#052b14] border-[#b8f28b] dark:border-[#0c401f] text-[#2c7a00] dark:text-green-300',
        isEvaluated && !result.isCorrect && 'bg-[#ffdfe0] dark:bg-[#3b1219] border-[#ffb8b8] dark:border-[#571922] text-[#ea2b2b] dark:text-rose-300'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between min-h-[64px]">
        {/* Left Side Feedback Message or SKIP Button */}
        <AnimatePresence mode="wait">
          {!isEvaluated ? (
            <button
              onClick={onSkip}
              disabled={isChecking}
              className="duo-button duo-button-neutral px-8 py-3.5 text-xs font-black text-gray-500 dark:text-[#52656d]"
            >
              SKIP
            </button>
          ) : result.isCorrect ? (
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
                <p className="text-xs font-bold text-[#2c7a00] dark:text-green-300">+{result.xpEarned || 1} XP</p>
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
                <p className="text-sm font-bold text-gray-800 dark:text-white">{result.correctAnswer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side Action Button */}
        <div>
          {!isEvaluated ? (
            <button
              disabled={!hasAnswer || isChecking}
              onClick={onCheck}
              className="duo-button duo-button-green text-xs px-10 py-3.5 flex items-center justify-center gap-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CHECKING...</span>
                </>
              ) : (
                'CHECK'
              )}
            </button>
          ) : (
            <button
              onClick={onContinue}
              className={clsx(
                'duo-button text-xs px-10 py-3.5',
                result.isCorrect ? 'duo-button-green' : 'duo-button-rose'
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
