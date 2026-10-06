'use client';

import React, { useEffect } from 'react';
import { useLesson } from '@/hooks/useLesson';
import { useUserContext } from '@/context/UserContext';
import { LessonHeader } from './LessonHeader';
import { ExerciseRenderer } from './ExerciseRenderer';
import { AnswerFeedback } from './AnswerFeedback';
import { OutOfHearts } from './OutOfHearts';
import { LessonComplete } from './LessonComplete';
import { Loader2 } from 'lucide-react';

interface LessonPlayerProps {
  lessonId: string;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId }) => {
  const { addXp, deductHeart, refillHearts } = useUserContext();
  const {
    lesson,
    loading,
    currentIndex,
    currentExercise,
    totalExercises,
    selectedAnswer,
    isSubmitted,
    answerResult,
    hearts,
    isOutOfHearts,
    isCompleted,
    xpEarnedTotal,
    handleSelectAnswer,
    handleCheckAnswer,
    handleNextExercise,
    refillHeartsInLesson,
  } = useLesson(lessonId);

  // Sync answer results with global context
  useEffect(() => {
    if (answerResult) {
      if (answerResult.isCorrect) {
        addXp(answerResult.xpEarned || 1);
      } else {
        deductHeart();
      }
    }
  }, [answerResult]);

  // Global Keyboard Enter Listener for CHECK / CONTINUE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isSubmitted && selectedAnswer !== null && selectedAnswer !== '') {
          e.preventDefault();
          handleCheckAnswer();
        } else if (isSubmitted) {
          e.preventDefault();
          handleNextExercise();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubmitted, selectedAnswer, handleCheckAnswer, handleNextExercise]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#131f24]">
        <Loader2 className="w-12 h-12 text-[#58cc02] animate-spin" />
        <p className="font-extrabold text-[#93a7b1]">Loading lesson...</p>
      </div>
    );
  }

  if (isCompleted) {
    return <LessonComplete xpEarned={xpEarnedTotal || 15} />;
  }

  if (!lesson || !currentExercise) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-[#131f24]">
        <p className="font-extrabold text-[#93a7b1]">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131f24] flex flex-col justify-between pb-32">
      {/* Top Header */}
      <LessonHeader
        current={currentIndex + 1}
        total={totalExercises}
        hearts={hearts}
      />

      {/* Exercise Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex items-center justify-center">
        <ExerciseRenderer
          exercise={currentExercise}
          selectedAnswer={selectedAnswer}
          onSelect={handleSelectAnswer}
          disabled={isSubmitted}
        />
      </main>

      {/* Out of Hearts Dialog */}
      {isOutOfHearts && (
        <OutOfHearts
          onRefill={() => {
            refillHearts();
            refillHeartsInLesson();
          }}
        />
      )}

      {/* Answer Feedback Bottom Bar */}
      <AnswerFeedback
        hasAnswer={selectedAnswer !== null && selectedAnswer !== ''}
        isSubmitted={isSubmitted}
        result={answerResult}
        onCheck={handleCheckAnswer}
        onContinue={handleNextExercise}
        onSkip={handleNextExercise}
      />
    </div>
  );
};
