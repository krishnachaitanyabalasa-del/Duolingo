'use client';

import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { clsx } from 'clsx';

interface MicrophoneButtonProps {
  onTranscriptChange?: (text: string) => void;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ onTranscriptChange }) => {
  const { transcript, isListening, startListening, stopListening, isSupported, error } = useSpeechRecognition();
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleToggle = async () => {
    if (!isSupported) {
      setPermissionError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      try {
        setPermissionError(null);
        await navigator.mediaDevices.getUserMedia({ audio: true });
        startListening();
      } catch {
        setPermissionError('Microphone permission denied.');
      }
    }
  };

  React.useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleToggle}
        aria-label="Tap to speak"
        className={clsx(
          'p-4 rounded-full border-2 border-b-4 transition-all flex items-center justify-center cursor-pointer shadow-lg',
          isListening
            ? 'bg-rose-500 border-rose-600 text-white animate-pulse ring-4 ring-rose-300'
            : 'bg-[#182730] border-[#20323d] text-[#1cb0f6] hover:bg-[#20323d]'
        )}
      >
        {isListening ? (
          <Mic className="w-8 h-8 stroke-[2.5]" />
        ) : (
          <MicOff className="w-8 h-8 stroke-[2.5]" />
        )}
      </button>

      {isListening && (
        <span className="text-xs font-bold text-rose-400 animate-pulse">Recording... Speak now</span>
      )}

      {(permissionError || error) && (
        <span className="text-xs font-bold text-gray-400 text-center max-w-xs">
          {permissionError || error || 'Speech recognition not supported in this browser.'}
        </span>
      )}

      {transcript && (
        <div className="p-3 bg-[#182730] border border-[#20323d] rounded-xl text-sm font-extrabold text-[#1cb0f6] mt-1">
          &quot;{transcript}&quot;
        </div>
      )}
    </div>
  );
};
