'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TypeAnswerExercise } from '@/types/lesson';
import { SpeakButton } from '../audio/SpeakButton';
import { MicrophoneButton } from '../audio/MicrophoneButton';

interface TypeAnswerProps {
  exercise: TypeAnswerExercise;
  onSelect: (answer: string) => void;
  disabled: boolean;
}

const SPECIAL_CHARS = ['á', 'é', 'í', 'ó', 'ú', 'ñ', '¿', '¡'];

export const TypeAnswer: React.FC<TypeAnswerProps> = ({
  exercise,
  onSelect,
  disabled,
}) => {
  const [text, setText] = useState('');

  useEffect(() => {
    setText('');
  }, [exercise.id]);

  const handleChange = useCallback(
    (val: string) => {
      if (disabled) return;
      setText(val);
      onSelect(val);
    },
    [disabled, onSelect]
  );

  const handleSpeechTranscript = useCallback(
    (spoken: string) => {
      if (disabled || !spoken) return;
      handleChange(spoken);
    },
    [disabled, handleChange]
  );

  const insertChar = (char: string) => {
    if (disabled) return;
    const newText = text + char;
    handleChange(newText);
  };

  const displayPromptText = exercise.prompt || exercise.question || exercise.audioText || '';

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start px-4">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">
        {exercise.question || 'Type your answer'}
      </h1>

      {/* Text/Audio Prompt Card */}
      {displayPromptText ? (
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-[#182730] border-2 border-gray-200 dark:border-[#20323d] rounded-2xl w-full">
          {exercise.audioText ? <SpeakButton text={exercise.audioText} /> : null}
          <span className="font-extrabold text-xl text-gray-900 dark:text-white">
            {displayPromptText}
          </span>
        </div>
      ) : null}

      {/* Input Area + Microphone Button */}
      <div className="w-full space-y-4 mb-6">
        <textarea
          disabled={disabled}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type or speak your response..."
          rows={3}
          className="w-full p-4 rounded-2xl bg-white dark:bg-[#182730] border-2 border-b-4 border-gray-200 dark:border-[#20323d] focus:border-[#1cb0f6] focus:outline-none font-extrabold text-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#52656d] resize-none transition-colors"
        />

        <div className="flex justify-center">
          <MicrophoneButton lang="es-ES" onTranscriptChange={handleSpeechTranscript} />
        </div>
      </div>

      {/* Character Shortcuts Row */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {SPECIAL_CHARS.map((char) => (
          <button
            key={char}
            type="button"
            disabled={disabled}
            onClick={() => insertChar(char)}
            className="px-3.5 py-2 bg-white dark:bg-[#182730] border-2 border-b-4 border-gray-200 dark:border-[#20323d] rounded-xl font-extrabold text-base hover:bg-gray-100 dark:hover:bg-[#20323d] text-gray-800 dark:text-white cursor-pointer transition-all active:translate-y-0.5 shadow-xs"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};
