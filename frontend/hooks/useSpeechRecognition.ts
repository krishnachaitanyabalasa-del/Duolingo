'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

export function useSpeechRecognition(lang: string = 'es-ES') {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

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
      try {
        const instance = new SpeechRecognitionWindow();
        instance.continuous = false;
        instance.interimResults = true;
        instance.lang = lang;

        instance.onresult = (event: SpeechRecognitionEvent) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          setTranscript(currentText);
        };

        instance.onerror = (evt: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition error:', evt.error);
          if (evt.error !== 'no-speech') {
            setError(evt.error || 'Speech recognition error');
          }
          setIsListening(false);
        };

        instance.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = instance;
      } catch (err) {
        console.error('Failed to initialize SpeechRecognition:', err);
        setIsSupported(false);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore abort error
        }
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    try {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore abort if not running
      }
      setIsListening(true);
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Speech start error:', err);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // Ignore stop error
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported,
  };
}
