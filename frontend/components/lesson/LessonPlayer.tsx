'use client';

import React from 'react';
import { useLesson } from '@/hooks/useLesson';
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
    streakEarned,
    accuracyEarned,
    handleSelectAnswer,
    handleCheckAnswer,
    handleNextExercise,
    refillHeartsInLesson,
  } = useLesson(lessonId);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#131f24] text-gray-500 dark:text-gray-400 transition-colors duration-150">
        <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
        <p className="font-extrabold text-gray-500 dark:text-gray-400">Loading lesson...</p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <LessonComplete
        xpEarned={xpEarnedTotal}
        streak={streakEarned}
        accuracy={accuracyEarned}
      />
    );
  }

  if (!lesson || !currentExercise) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#131f24] text-gray-500 dark:text-gray-400 transition-colors duration-150">
        <p className="font-extrabold text-gray-500 dark:text-gray-400">Lesson not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#131f24] text-gray-800 dark:text-[#f7f9fa] flex flex-col justify-between pb-32 transition-colors duration-150">
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
        <OutOfHearts onRefill={refillHeartsInLesson} />
      )}

      {/* Answer Feedback Bottom Bar */}
      <AnswerFeedback
        hasAnswer={selectedAnswer !== null && selectedAnswer !== ''}
        isSubmitted={isSubmitted}
        result={answerResult}
        onCheck={handleCheckAnswer}
        onContinue={handleNextExercise}
      />
    </div>
  );
};
