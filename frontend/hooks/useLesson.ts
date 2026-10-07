'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Lesson, AnswerResult } from '@/types/lesson';
import { getLesson, startLesson, submitAnswer as apiSubmitAnswer, completeLesson as apiCompleteLesson } from '@/lib/api/lesson';
import { sounds } from '@/lib/sound';
import { useUserContext } from '@/context/UserContext';

export function useLesson(lessonId: string, initialHearts = 5) {
  const { user, refreshUser } = useUserContext();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<unknown>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [hearts, setHearts] = useState(initialHearts);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculated session statistics
  const [xpEarnedTotal, setXpEarnedTotal] = useState(0);
  const [streakEarned, setStreakEarned] = useState(user?.streak || 1);
  const [accuracyEarned, setAccuracyEarned] = useState(100);

  // Refs for tracking attempt accurately across closures
  const correctCountRef = useRef(0);
  const answersXpRef = useRef(0);

  const fetchLessonData = useCallback(async () => {
    setLoading(true);
    correctCountRef.current = 0;
    answersXpRef.current = 0;
    setXpEarnedTotal(0);
    setAccuracyEarned(100);
    setStreakEarned(user?.streak || 1);
    setIsSubmitted(false);
    setIsChecking(false);
    setSelectedAnswer(null);
    setAnswerResult(null);

    // Register lesson start on backend (marks status IN_PROGRESS)
    try {
      await startLesson(lessonId);
    } catch (err) {
      console.warn('startLesson failed:', err);
    }

    const data = await getLesson(lessonId);
    setLesson(data);
    setLoading(false);
  }, [lessonId, user?.streak]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  const currentExercise = lesson ? lesson.exercises[currentIndex] : null;

  const handleSelectAnswer = (ans: unknown) => {
    if (isSubmitted || isChecking) return;
    sounds.playClick();
    setSelectedAnswer(ans);
  };

  const handleCheckAnswer = async () => {
    if (!lesson || !currentExercise || selectedAnswer === null || isSubmitted || isChecking) return;

    setIsChecking(true);

    try {
      const result = await apiSubmitAnswer(
        lesson.id.toString(),
        currentExercise.id,
        selectedAnswer,
        hearts,
        currentExercise
      );

      setAnswerResult(result);
      setIsSubmitted(true);
      setHearts(result.heartsRemaining);

      if (result.isCorrect) {
        sounds.playCorrect();
        const gained = result.xpEarned || 1;
        answersXpRef.current += gained;
        correctCountRef.current += 1;
        setXpEarnedTotal(answersXpRef.current);
      } else {
        sounds.playIncorrect();
        if (result.isOutOfHearts) {
          setIsOutOfHearts(true);
        }
      }
    } catch (err) {
      console.error('Error in handleCheckAnswer:', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleNextExercise = async () => {
    if (!lesson) return;

    sounds.playClick();
    setIsSubmitted(false);
    setIsChecking(false);
    setSelectedAnswer(null);
    setAnswerResult(null);

    if (currentIndex + 1 < lesson.exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Lesson Complete! Calculate real stats
      sounds.playFanfare();
      const compRes = await apiCompleteLesson(lesson.id.toString());

      // 1. Calculated Total Session XP
      const bonusXp = typeof compRes?.xpEarned === 'number' ? compRes.xpEarned : 10;
      const totalSessionXp =
        typeof compRes?.sessionXp === 'number'
          ? compRes.sessionXp
          : answersXpRef.current + bonusXp;
      setXpEarnedTotal(totalSessionXp);

      // 2. Persistent User Streak
      const streakVal =
        typeof compRes?.streak === 'number' && compRes.streak > 0
          ? compRes.streak
          : user?.streak || 1;
      setStreakEarned(streakVal);

      // 3. Calculated Accuracy Percentage
      const totalEx = lesson.exercises.length || 1;
      const calculatedAccuracy =
        typeof compRes?.accuracy === 'number'
          ? Math.round(compRes.accuracy)
          : Math.min(100, Math.max(0, Math.round((correctCountRef.current / totalEx) * 100)));
      setAccuracyEarned(calculatedAccuracy);

      setIsCompleted(true);
      refreshUser();
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
    isChecking,
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
  };
}
