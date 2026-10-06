'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { clsx } from 'clsx';

interface MicrophoneButtonProps {
  lang?: string;
  onTranscriptChange?: (text: string) => void;
}

export const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  lang = 'es-ES',
  onTranscriptChange,
}) => {
  const { transcript, isListening, startListening, stopListening, isSupported, error } =
    useSpeechRecognition(lang);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Store latest callback in ref to prevent infinite dependency loops
  const onTranscriptChangeRef = useRef(onTranscriptChange);
  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange;
  }, [onTranscriptChange]);

  const lastReportedTranscriptRef = useRef('');

  // Call onTranscriptChange only when transcript value actually changes
  useEffect(() => {
    if (transcript && transcript !== lastReportedTranscriptRef.current) {
      lastReportedTranscriptRef.current = transcript;
      onTranscriptChangeRef.current?.(transcript);
    }
  }, [transcript]);

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
        lastReportedTranscriptRef.current = '';
        if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        startListening();
      } catch {
        setPermissionError('Microphone permission denied.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Tap to speak"
        className={clsx(
          'p-4 rounded-full border-2 border-b-4 transition-all flex items-center justify-center cursor-pointer shadow-lg',
          isListening
            ? 'bg-rose-500 border-rose-600 text-white animate-pulse ring-4 ring-rose-300'
            : 'bg-white dark:bg-[#182730] border-gray-200 dark:border-[#20323d] text-[#1cb0f6] hover:bg-sky-50 dark:hover:bg-[#20323d]'
        )}
      >
        {isListening ? (
          <Mic className="w-8 h-8 stroke-[2.5]" />
        ) : (
          <MicOff className="w-8 h-8 stroke-[2.5]" />
        )}
      </button>

      {isListening && (
        <span className="text-xs font-bold text-rose-500 dark:text-rose-400 animate-pulse">
          Recording... Speak now
        </span>
      )}

      {(permissionError || error) && (
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 text-center max-w-xs">
          {permissionError || error || 'Speech recognition not supported in this browser.'}
        </span>
      )}

      {transcript && (
        <div className="p-3 bg-white dark:bg-[#182730] border border-gray-200 dark:border-[#20323d] rounded-xl text-sm font-extrabold text-[#1cb0f6] mt-1 shadow-xs max-w-xs text-center">
          &quot;{transcript}&quot;
        </div>
      )}
    </div>
  );
};
