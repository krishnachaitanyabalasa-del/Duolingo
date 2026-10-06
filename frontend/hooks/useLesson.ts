'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lesson, AnswerResult } from '@/types/lesson';
import { getLesson, submitAnswer as apiSubmitAnswer, completeLesson as apiCompleteLesson } from '@/lib/api/lesson';
import { sounds } from '@/lib/sound';

export function useLesson(lessonId: string, initialHearts = 5) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [hearts, setHearts] = useState(initialHearts);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);

  const fetchLessonData = useCallback(async () => {
    setLoading(true);
    const data = await getLesson(lessonId);
    setLesson(data);
    setLoading(false);
  }, [lessonId]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  const currentExercise = lesson ? lesson.exercises[currentIndex] : null;

  const handleSelectAnswer = (ans: unknown) => {
    if (isSubmitted) return;
    sounds.playClick();
    setSelectedAnswer(ans);
  };

  const handleCheckAnswer = async () => {
    if (!lesson || !currentExercise || selectedAnswer === null || isSubmitted) return;

    setIsSubmitted(true);

    const result = await apiSubmitAnswer(
      lesson.id.toString(),
      currentExercise.id,
      selectedAnswer,
      hearts
    );

    setAnswerResult(result);
    setHearts(result.heartsRemaining);

    if (result.isCorrect) {
      sounds.playCorrect();
      setXpEarnedTotal((prev) => prev + (result.xpEarned || 3));
    } else {
      sounds.playIncorrect();
      if (result.isOutOfHearts) {
        setIsOutOfHearts(true);
      }
    }
  };

  const handleNextExercise = async () => {
    if (!lesson) return;

    sounds.playClick();
    setIsSubmitted(false);
    setSelectedAnswer(null);
    setAnswerResult(null);

    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Lesson Complete!
      sounds.playFanfare();
      await apiCompleteLesson(lesson.id.toString());
      setIsCompleted(true);
    }
  };

  const refillHeartsInLesson = () => {
    setHearts(5);
    setIsOutOfHearts(false);
  };

  return {
    lesson,
    loading,
    currentIndex,
    currentExercise,
    totalExercises: lesson?.exercises.length || 0,
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
  };
}
