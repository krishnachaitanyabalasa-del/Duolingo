'use client';

import React from 'react';
import { AnswerResult } from '@/types/lesson';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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
        !isSubmitted && 'bg-[#131f24] border-[#20323d]',
        isSubmitted && result?.isCorrect && 'bg-[#052b14] border-[#0c401f] text-green-300',
        isSubmitted && !result?.isCorrect && 'bg-[#3b1219] border-[#571922] text-rose-300'
      )}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between min-h-[64px]">
        {/* Left Side Feedback Message or SKIP Button (Matching Screenshots 1 & 2) */}
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <button
              onClick={onSkip}
              className="duo-button duo-button-dark px-8 py-3.5 text-xs font-black text-[#52656d]"
            >
              SKIP
            </button>
          ) : result?.isCorrect ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="w-10 h-10 text-[#58cc02] fill-[#58cc02]/20 shrink-0" />
              <div>
                <h4 className="text-xl font-black text-[#58cc02]">Great job!</h4>
                <p className="text-xs font-bold text-green-300">+10 XP</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <XCircle className="w-10 h-10 text-[#ff4b4b] fill-[#ff4b4b]/20 shrink-0" />
              <div>
                <h4 className="text-lg font-black text-[#ff4b4b]">Correct solution:</h4>
                <p className="text-sm font-bold text-white">{result?.correctAnswer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Side Action Button (Matching Screenshots 1 & 2) */}
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
