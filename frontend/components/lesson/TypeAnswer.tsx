'use client';

import React, { useState, useEffect } from 'react';
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

  const handleChange = (val: string) => {
    if (disabled) return;
    setText(val);
    onSelect(val);
  };

  const insertChar = (char: string) => {
    if (disabled) return;
    const newText = text + char;
    setText(newText);
    onSelect(newText);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-start px-4">
      <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Type in Spanish</h1>

      {/* Audio Text Prompt */}
      {exercise.audioText && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-[#182730] border-2 border-[#20323d] rounded-2xl w-full">
          <SpeakButton text={exercise.audioText} />
          <span className="font-extrabold text-xl text-white">{exercise.prompt || exercise.audioText}</span>
        </div>
      )}

      {/* Input Area + Microphone Button */}
      <div className="w-full space-y-4 mb-6">
        <textarea
          disabled={disabled}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Type or speak your response..."
          rows={3}
          className="w-full p-4 rounded-2xl bg-[#182730] border-2 border-b-4 border-[#20323d] focus:border-[#1cb0f6] focus:outline-none font-extrabold text-lg text-white resize-none"
        />

        <div className="flex justify-center">
          <MicrophoneButton
            onTranscriptChange={(spoken) => handleChange(text ? `${text} ${spoken}` : spoken)}
          />
        </div>
      </div>

      {/* Character Shortcuts Row */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {SPECIAL_CHARS.map((char) => (
          <button
            key={char}
            disabled={disabled}
            onClick={() => insertChar(char)}
            className="px-3.5 py-2 bg-[#182730] border-2 border-b-4 border-[#20323d] rounded-xl font-extrabold text-base hover:bg-[#20323d] text-white cursor-pointer"
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};
