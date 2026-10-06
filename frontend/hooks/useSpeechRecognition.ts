'use client';

import { useState, useEffect, useCallback } from 'react';

// Extend window interface for WebkitSpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionWindow = (
      window as unknown as {
        SpeechRecognition: new () => SpeechRecognitionInstance;
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
      }
    ).SpeechRecognition || (
      window as unknown as {
        webkitSpeechRecognition: new () => SpeechRecognitionInstance;
      }
    ).webkitSpeechRecognition;

    if (SpeechRecognitionWindow) {
      setIsSupported(true);
      const instance = new SpeechRecognitionWindow();
      instance.continuous = false;
      instance.interimResults = true;
      instance.lang = 'es-ES';

      instance.onresult = (event: SpeechRecognitionEvent) => {
        const text = Array.from(Object.keys(event.results))
          .map(key => event.results[Number(key)][0].transcript)
          .join('');
        setTranscript(text);
      };

      instance.onerror = (evt: SpeechRecognitionErrorEvent) => {
        setError(evt.error || 'Speech recognition error');
        setIsListening(false);
      };

      instance.onend = () => {
        setIsListening(false);
      };

      setRecognition(instance);
    } else {
      setIsSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      setTranscript('');
      setError(null);
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // Ignore stop error
    }
    setIsListening(false);
  }, [recognition]);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    error,
    isSupported,
  };
}
