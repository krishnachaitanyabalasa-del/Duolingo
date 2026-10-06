export type ExerciseType = 
  | 'MULTIPLE_CHOICE'
  | 'TRANSLATE'
  | 'MATCH_PAIRS'
  | 'FILL_BLANK'
  | 'TYPE_ANSWER';

export interface BaseExercise {
  id: number;
  type: ExerciseType;
  question: string;
  prompt?: string;
  audioText?: string;
  correctAnswer?: any;
  explanation?: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'MULTIPLE_CHOICE';
  options: string[];
  correctAnswer: number; // 0-indexed option index
}

export interface TranslateExercise extends BaseExercise {
  type: 'TRANSLATE';
  originalText: string;
  wordBank: string[];
  correctAnswer: string; // e.g. "The cat drinks milk"
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchPairsExercise extends BaseExercise {
  type: 'MATCH_PAIRS';
  pairs: MatchPair[];
}

export interface FillBlankExercise extends BaseExercise {
  type: 'FILL_BLANK';
  sentencePrefix: string;
  sentenceSuffix: string;
  options: string[];
  correctAnswer: string;
}

export interface TypeAnswerExercise extends BaseExercise {
  type: 'TYPE_ANSWER';
  correctAnswer: string;
  acceptableAnswers?: string[];
  audioText?: string;
}

export type Exercise = 
  | MultipleChoiceExercise 
  | TranslateExercise 
  | MatchPairsExercise 
  | FillBlankExercise 
  | TypeAnswerExercise;

export interface Lesson {
  id: number;
  skillId: string;
  skillTitle: string;
  totalExercises: number;
  xpReward: number;
  exercises: Exercise[];
}

export interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  xpEarned: number;
  heartsRemaining: number;
  isOutOfHearts: boolean;
}
