import { apiFetch } from './client';
import { Lesson, AnswerResult } from '@/types/lesson';
import { MOCK_LESSONS } from '../mockData';

interface RawBackendLesson {
  id: number;
  title: string;
  skill_id?: number | string;
  skill_title?: string;
  exercises: {
    id: number;
    type: string;
    question: string;
    prompt?: string;
    audio_text?: string;
    options?: string[];
    correct_answer?: string | number;
    original_text?: string;
    word_bank?: string[];
    pairs?: { id: string; left: string; right: string }[];
    sentence_prefix?: string;
    sentence_suffix?: string;
    acceptable_answers?: string[];
  }[];
}

interface RawAnswerResponse {
  correct: boolean;
  correct_answer: string;
  explanation?: string;
  hearts: number;
  xp_earned: number;
}

interface RawCompleteResponse {
  completed: boolean;
  xp_awarded: number;
  total_xp: number;
  skill_completed: boolean;
  current_streak: number;
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const data = await apiFetch<RawBackendLesson>(`/api/lessons/${lessonId}`);
  if (!data) {
    return MOCK_LESSONS[lessonId] || MOCK_LESSONS['sk_food'] || null;
  }

  try {
    return {
      id: data.id,
      skillId: data.skill_id?.toString() || lessonId,
      skillTitle: data.skill_title || 'Lesson Session',
      totalExercises: data.exercises.length,
      xpReward: 15,
      exercises: data.exercises.map((ex) => {
        const typeStr = ex.type.toUpperCase();
        if (typeStr === 'MULTIPLE_CHOICE') {
          return {
            id: ex.id,
            type: 'MULTIPLE_CHOICE',
            question: ex.question,
            prompt: ex.prompt,
            audioText: ex.audio_text,
            options: ex.options || [],
            correctAnswer: Number(ex.correct_answer || 0),
          };
        } else if (typeStr === 'TRANSLATE') {
          return {
            id: ex.id,
            type: 'TRANSLATE',
            question: ex.question,
            originalText: ex.original_text || ex.prompt || '',
            audioText: ex.audio_text,
            wordBank: ex.word_bank || [],
            correctAnswer: String(ex.correct_answer || ''),
          };
        } else if (typeStr === 'MATCH_PAIRS') {
          return {
            id: ex.id,
            type: 'MATCH_PAIRS',
            question: ex.question,
            pairs: ex.pairs || [],
          };
        } else if (typeStr === 'FILL_BLANK') {
          return {
            id: ex.id,
            type: 'FILL_BLANK',
            question: ex.question,
            sentencePrefix: ex.sentence_prefix || '',
            sentenceSuffix: ex.sentence_suffix || '',
            options: ex.options || [],
            correctAnswer: String(ex.correct_answer || ''),
          };
        } else {
          return {
            id: ex.id,
            type: 'TYPE_ANSWER',
            question: ex.question,
            prompt: ex.prompt,
            audioText: ex.audio_text,
            correctAnswer: String(ex.correct_answer || ''),
            acceptableAnswers: ex.acceptable_answers || [],
          };
        }
      }),
    };
  } catch (err) {
    console.warn('Error mapping backend lesson payload:', err);
    return MOCK_LESSONS[lessonId] || MOCK_LESSONS['sk_food'];
  }
}

export async function startLesson(lessonId: string): Promise<{ success: boolean; lesson: Lesson | null }> {
  const data = await apiFetch<{ success: boolean; lesson: RawBackendLesson }>(`/api/lessons/${lessonId}/start`, {
    method: 'POST',
  });

  if (data) {
    const parsed = await getLesson(lessonId);
    return { success: true, lesson: parsed };
  }

  const mockLesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS['sk_food'];
  return { success: true, lesson: mockLesson };
}

export async function submitAnswer(
  lessonId: string,
  exerciseId: number,
  userAnswer: unknown,
  currentHearts: number
): Promise<AnswerResult> {
  const data = await apiFetch<RawAnswerResponse>(`/api/lessons/${lessonId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id: exerciseId, answer: userAnswer }),
  });

  if (data) {
    return {
      isCorrect: data.correct,
      correctAnswer: data.correct_answer,
      explanation: data.explanation,
      xpEarned: data.xp_earned || (data.correct ? 1 : 0),
      heartsRemaining: data.hearts,
      isOutOfHearts: data.hearts <= 0,
    };
  }

  // Fallback local mock evaluation engine
  const lesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS['sk_food'];
  const exercise = lesson?.exercises.find((ex) => ex.id === exerciseId);

  let isCorrect = false;
  let correctAnswerStr = '';

  if (exercise) {
    if (exercise.type === 'MULTIPLE_CHOICE') {
      isCorrect = Number(userAnswer) === exercise.correctAnswer;
      correctAnswerStr = exercise.options[exercise.correctAnswer];
    } else if (exercise.type === 'TRANSLATE') {
      isCorrect = String(userAnswer).trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
      correctAnswerStr = exercise.correctAnswer;
    } else if (exercise.type === 'MATCH_PAIRS') {
      isCorrect = Boolean(userAnswer);
      correctAnswerStr = 'All pairs matched!';
    } else if (exercise.type === 'FILL_BLANK') {
      isCorrect = String(userAnswer).trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
      correctAnswerStr = exercise.correctAnswer;
    } else if (exercise.type === 'TYPE_ANSWER') {
      const formatted = String(userAnswer).trim().toLowerCase();
      const acceptable = (exercise.acceptableAnswers || [exercise.correctAnswer]).map(a => a.toLowerCase());
      isCorrect = acceptable.includes(formatted);
      correctAnswerStr = exercise.correctAnswer;
    }
  }

  const nextHearts = isCorrect ? currentHearts : Math.max(0, currentHearts - 1);

  return {
    isCorrect,
    correctAnswer: correctAnswerStr,
    xpEarned: isCorrect ? 3 : 0,
    heartsRemaining: nextHearts,
    isOutOfHearts: nextHearts <= 0,
  };
}

export async function completeLesson(lessonId: string): Promise<{ xpEarned: number; newTotalXp: number; streak: number }> {
  const data = await apiFetch<RawCompleteResponse>(`/api/lessons/${lessonId}/complete`, {
    method: 'POST',
  });

  if (data) {
    return {
      xpEarned: data.xp_awarded || 10,
      newTotalXp: data.total_xp || 130,
      streak: data.current_streak || 5,
    };
  }

  return {
    xpEarned: 15,
    newTotalXp: 1265,
    streak: 15,
  };
}
