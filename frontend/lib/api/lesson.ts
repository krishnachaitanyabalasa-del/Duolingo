import { apiFetch } from './client';
import { Lesson, AnswerResult } from '@/types/lesson';
import { MOCK_LESSONS } from '../mockData';

interface RawBackendExerciseContent {
  question?: string;
  text?: string;
  speak_text?: string;
  options?: string[];
  word_bank?: string[];
  pairs?: { left: string; right: string; id?: string }[];
  sentence?: string;
  sentence_prefix?: string;
  sentence_suffix?: string;
}

interface RawBackendExercise {
  id: number;
  type: string;
  prompt: string;
  content?: RawBackendExerciseContent;
  explanation?: string;
  order: number;

  // Root properties fallback
  question?: string;
  audio_text?: string;
  options?: string[];
  correct_answer?: string | number | unknown;
  correctAnswer?: string | number | unknown;
  original_text?: string;
  word_bank?: string[];
  pairs?: { id: string; left: string; right: string }[];
  sentence_prefix?: string;
  sentence_suffix?: string;
}

interface RawBackendLessonDetail {
  id: number;
  skill_id: number;
  title: string;
  order: number;
  xp_reward: number;
  exercises: RawBackendExercise[];
}

interface RawAnswerResponse {
  correct: boolean;
  correct_answer: unknown;
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

function toNumericLessonId(lessonId: string): number {
  const parsed = parseInt(lessonId, 10);
  if (!isNaN(parsed)) return parsed;
  if (lessonId === 'sk_greetings') return 1;
  if (lessonId === 'sk_introductions') return 3;
  if (lessonId === 'sk_food') return 7;
  return 1;
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const numericId = toNumericLessonId(lessonId);
  const data = await apiFetch<RawBackendLessonDetail>(`/api/lessons/${numericId}`);

  if (!data || !data.exercises) {
    return MOCK_LESSONS[lessonId] || MOCK_LESSONS[numericId.toString()] || MOCK_LESSONS['sk_greetings'] || MOCK_LESSONS['sk_food'] || null;
  }

  try {
    return {
      id: data.id,
      skillId: data.skill_id?.toString() || lessonId,
      skillTitle: data.title || 'Lesson Session',
      totalExercises: data.exercises.length,
      xpReward: data.xp_reward || 10,
      exercises: data.exercises.map((ex) => {
        const typeStr = (ex.type || '').toUpperCase();
        const content = ex.content || {};

        const questionText = content.question || ex.prompt || ex.question || 'Answer the question';
        const audioText = content.speak_text || content.text || ex.audio_text || '';
        const rawCorrect = ex.correct_answer !== undefined ? ex.correct_answer : ex.correctAnswer;
        const explanation = ex.explanation;

        if (typeStr === 'MULTIPLE_CHOICE') {
          const options = content.options || ex.options || [];
          let correctIdx = 0;
          if (typeof rawCorrect === 'number') {
            correctIdx = rawCorrect;
          } else if (typeof rawCorrect === 'string') {
            if (/^\d+$/.test(rawCorrect)) {
              correctIdx = parseInt(rawCorrect, 10);
            } else {
              const foundIdx = options.findIndex(
                (opt: string) => opt.trim().toLowerCase() === rawCorrect.trim().toLowerCase()
              );
              if (foundIdx !== -1) correctIdx = foundIdx;
            }
          }
          return {
            id: ex.id,
            type: 'MULTIPLE_CHOICE',
            question: questionText,
            prompt: content.text || ex.prompt,
            audioText: audioText,
            options: options,
            correctAnswer: correctIdx,
            explanation,
          };
        } else if (typeStr === 'TRANSLATE') {
          let correctStr = '';
          if (Array.isArray(rawCorrect)) {
            correctStr = rawCorrect.join(' ');
          } else {
            correctStr = String(rawCorrect || '');
          }
          return {
            id: ex.id,
            type: 'TRANSLATE',
            question: questionText,
            originalText: content.text || ex.original_text || ex.prompt || '',
            audioText: audioText,
            wordBank: content.word_bank || ex.word_bank || [],
            correctAnswer: correctStr,
            explanation,
          };
        } else if (typeStr === 'MATCH_PAIRS') {
          const rawPairs = content.pairs || ex.pairs || [];
          const normalizedPairs = rawPairs.map((p, idx) => ({
            id: p.id || `p_${idx}`,
            left: p.left,
            right: p.right,
          }));
          return {
            id: ex.id,
            type: 'MATCH_PAIRS',
            question: questionText,
            pairs: normalizedPairs,
            correctAnswer: rawCorrect || 'All pairs matched!',
            explanation,
          };
        } else if (typeStr === 'FILL_BLANK') {
          let prefix = content.sentence_prefix || ex.sentence_prefix || '';
          let suffix = content.sentence_suffix || ex.sentence_suffix || '';

          if (!prefix && content.sentence) {
            const parts = content.sentence.split('_____');
            prefix = parts[0] || '';
            suffix = parts[1] || '';
          }

          let correctStr = '';
          if (Array.isArray(rawCorrect)) {
            correctStr = rawCorrect.join(' ');
          } else {
            correctStr = String(rawCorrect || '');
          }

          return {
            id: ex.id,
            type: 'FILL_BLANK',
            question: questionText,
            sentencePrefix: prefix,
            sentenceSuffix: suffix,
            options: content.options || ex.options || [],
            correctAnswer: correctStr,
            explanation,
          };
        } else {
          let correctStr = '';
          let acceptable: string[] = [];
          if (Array.isArray(rawCorrect)) {
            correctStr = String(rawCorrect[0] || '');
            acceptable = rawCorrect.map(String);
          } else {
            correctStr = String(rawCorrect || '');
            acceptable = [correctStr];
          }
          return {
            id: ex.id,
            type: 'TYPE_ANSWER',
            question: questionText,
            prompt: content.text || ex.prompt,
            audioText: audioText,
            correctAnswer: correctStr,
            acceptableAnswers: acceptable,
            explanation,
          };
        }
      }),
    };
  } catch (err) {
    console.warn('Error mapping backend lesson payload:', err);
    return MOCK_LESSONS[lessonId] || MOCK_LESSONS[numericId.toString()] || MOCK_LESSONS['sk_greetings'] || MOCK_LESSONS['sk_food'];
  }
}

export async function startLesson(lessonId: string): Promise<{ success: boolean; lesson: Lesson | null }> {
  const numericId = toNumericLessonId(lessonId);
  const data = await apiFetch<{ attempt_id: number; lesson: RawBackendLessonDetail; user_hearts: number }>(
    `/api/lessons/${numericId}/start`,
    { method: 'POST' }
  );

  if (data) {
    const parsed = await getLesson(lessonId);
    return { success: true, lesson: parsed };
  }

  const mockLesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS[numericId.toString()] || MOCK_LESSONS['sk_greetings'] || MOCK_LESSONS['sk_food'];
  return { success: true, lesson: mockLesson };
}

export async function submitAnswer(
  lessonId: string,
  exerciseId: number,
  userAnswer: unknown,
  currentHearts: number,
  currentExerciseObj?: any
): Promise<AnswerResult> {
  const numericId = toNumericLessonId(lessonId);
  const data = await apiFetch<RawAnswerResponse>(`/api/lessons/${numericId}/answer`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id: exerciseId, answer: userAnswer }),
  });

  if (data) {
    let formattedCorrect = '';
    if (typeof data.correct_answer === 'string') {
      formattedCorrect = data.correct_answer;
    } else if (Array.isArray(data.correct_answer)) {
      formattedCorrect = data.correct_answer
        .map(item => (typeof item === 'object' && item !== null ? `${item.left} -> ${item.right}` : String(item)))
        .join(', ');
    } else {
      formattedCorrect = String(data.correct_answer || '');
    }

    return {
      isCorrect: data.correct,
      correctAnswer: formattedCorrect,
      explanation: data.explanation,
      xpEarned: data.xp_earned || (data.correct ? 1 : 0),
      heartsRemaining: data.hearts,
      isOutOfHearts: data.hearts <= 0,
    };
  }

  // Fallback local mock evaluation engine
  const lesson = MOCK_LESSONS[lessonId] || MOCK_LESSONS[numericId.toString()] || MOCK_LESSONS['sk_greetings'] || MOCK_LESSONS['sk_food'];
  const exercise = currentExerciseObj || lesson?.exercises.find((ex) => ex.id === exerciseId);

  let isCorrect = false;
  let correctAnswerStr = '';

  if (exercise) {
    const normalize = (s: string) =>
      String(s || '')
        .toLowerCase()
        .replace(/[!?,.:;\-_"']/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (exercise.type === 'MULTIPLE_CHOICE') {
      const selectedIdx = typeof userAnswer === 'number' ? userAnswer : parseInt(String(userAnswer), 10);
      const expectedIdx = exercise.correctAnswer;
      const expectedOption = exercise.options[expectedIdx] || String(expectedIdx);

      if (!isNaN(selectedIdx)) {
        isCorrect = selectedIdx === expectedIdx;
      } else {
        isCorrect = normalize(String(userAnswer)) === normalize(expectedOption);
      }
      correctAnswerStr = expectedOption;
    } else if (exercise.type === 'TRANSLATE') {
      isCorrect = normalize(String(userAnswer)) === normalize(exercise.correctAnswer);
      correctAnswerStr = exercise.correctAnswer;
    } else if (exercise.type === 'MATCH_PAIRS') {
      isCorrect = Boolean(userAnswer);
      correctAnswerStr = 'All pairs matched!';
    } else if (exercise.type === 'FILL_BLANK') {
      isCorrect = normalize(String(userAnswer)) === normalize(exercise.correctAnswer);
      correctAnswerStr = exercise.correctAnswer;
    } else if (exercise.type === 'TYPE_ANSWER') {
      const userNorm = normalize(String(userAnswer));
      const acceptable = (exercise.acceptableAnswers || [exercise.correctAnswer]).map(normalize);
      isCorrect = acceptable.includes(userNorm);
      correctAnswerStr = exercise.correctAnswer;
    }
  }

  const nextHearts = isCorrect ? currentHearts : Math.max(0, currentHearts - 1);

  return {
    isCorrect,
    correctAnswer: correctAnswerStr,
    xpEarned: isCorrect ? 1 : 0,
    heartsRemaining: nextHearts,
    isOutOfHearts: nextHearts <= 0,
  };
}

export async function completeLesson(
  lessonId: string
): Promise<{ xpEarned: number; newTotalXp: number; streak: number }> {
  const numericId = toNumericLessonId(lessonId);
  const data = await apiFetch<RawCompleteResponse>(`/api/lessons/${numericId}/complete`, {
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
