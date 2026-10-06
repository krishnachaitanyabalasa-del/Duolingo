'use client';

import React from 'react';
import { Exercise } from '@/types/lesson';
import { MultipleChoice } from './MultipleChoice';
import { TranslateExercise } from './TranslateExercise';
import { MatchPairs } from './MatchPairs';
import { FillBlank } from './FillBlank';
import { TypeAnswer } from './TypeAnswer';

interface ExerciseRendererProps {
  exercise: Exercise;
  selectedAnswer: unknown;
  onSelect: (answer: unknown) => void;
  disabled: boolean;
}

export const ExerciseRenderer: React.FC<ExerciseRendererProps> = ({
  exercise,
  selectedAnswer,
  onSelect,
  disabled,
}) => {
  switch (exercise.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoice
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onSelect={onSelect}
          disabled={disabled}
        />
      );
    case 'TRANSLATE':
      return (
        <TranslateExercise
          exercise={exercise}
          onSelect={onSelect}
          disabled={disabled}
        />
      );
    case 'MATCH_PAIRS':
      return (
        <MatchPairs
          exercise={exercise}
          onSelect={onSelect}
          disabled={disabled}
        />
      );
    case 'FILL_BLANK':
      return (
        <FillBlank
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          onSelect={onSelect}
          disabled={disabled}
        />
      );
    case 'TYPE_ANSWER':
      return (
        <TypeAnswer
          exercise={exercise}
          onSelect={onSelect}
          disabled={disabled}
        />
      );
    default:
      return <div className="text-center font-bold text-gray-400">Unknown exercise type</div>;
  }
};
