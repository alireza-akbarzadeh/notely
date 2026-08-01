"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BrowserSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort?: () => void;
}

interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

interface BrowserSpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

interface BrowserSpeechRecognitionResultList {
  readonly length: number;
  [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionEvent extends Event {
  results: BrowserSpeechRecognitionResultList;
  resultIndex: number;
}

interface BrowserSpeechRecognitionErrorEvent extends Event {
  error: string;
}

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

function getSpeechRecognitionCtor(): BrowserSpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechDictationSupported() {
  return getSpeechRecognitionCtor() !== null;
}

type UseVoiceDictationOptions = {
  lang?: string;
  enabled?: boolean;
  onTranscript: (text: string) => void;
};

export function useVoiceDictation({
  lang = "en-US",
  enabled = true,
  onTranscript,
}: UseVoiceDictationOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported] = useState(() => isSpeechDictationSupported());
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const wantListeningRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    if (!enabled || !isSupported) return;

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    const handleResult = (event: Event) => {
      const speechEvent = event as BrowserSpeechRecognitionEvent;
      let finalTranscript = "";

      for (let i = speechEvent.resultIndex; i < speechEvent.results.length; i += 1) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        }
      }

      const trimmed = finalTranscript.trim();
      if (trimmed) {
        onTranscriptRef.current(trimmed);
      }
    };

    const handleError = (event: Event) => {
      const speechError = event as BrowserSpeechRecognitionErrorEvent;
      // "aborted" / "no-speech" are common while pausing; keep listening intent.
      if (speechError.error === "not-allowed") {
        setError("Microphone permission denied. Allow mic access to dictate.");
        wantListeningRef.current = false;
        setIsListening(false);
        return;
      }
      if (speechError.error === "service-not-allowed") {
        setError("Speech recognition is blocked in this browser.");
        wantListeningRef.current = false;
        setIsListening(false);
        return;
      }
      if (
        speechError.error === "aborted" ||
        speechError.error === "no-speech"
      ) {
        return;
      }
      setError("Voice dictation interrupted. Tap the mic to try again.");
      wantListeningRef.current = false;
      setIsListening(false);
    };

    const handleStart = () => {
      setIsListening(true);
      setError(null);
    };

    const handleEnd = () => {
      // Chrome often stops continuous sessions; restart while the user still wants dictation.
      if (wantListeningRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          wantListeningRef.current = false;
        }
      }
      setIsListening(false);
    };

    recognition.addEventListener("result", handleResult);
    recognition.addEventListener("error", handleError);
    recognition.addEventListener("start", handleStart);
    recognition.addEventListener("end", handleEnd);

    recognitionRef.current = recognition;

    return () => {
      wantListeningRef.current = false;
      recognition.removeEventListener("result", handleResult);
      recognition.removeEventListener("error", handleError);
      recognition.removeEventListener("start", handleStart);
      recognition.removeEventListener("end", handleEnd);
      try {
        if (typeof recognition.abort === "function") {
          recognition.abort();
        } else {
          recognition.stop();
        }
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      setIsListening(false);
    };
  }, [enabled, isSupported, lang]);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    const recognition = recognitionRef.current;
    if (!recognition) {
      setIsListening(false);
      return;
    }
    try {
      recognition.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (!enabled || !isSupported) {
      setError("Voice dictation is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    const recognition = recognitionRef.current;
    if (!recognition) return;

    setError(null);
    wantListeningRef.current = true;
    try {
      recognition.start();
    } catch {
      // Already started
      setIsListening(true);
    }
  }, [enabled, isSupported]);

  const toggle = useCallback(() => {
    if (wantListeningRef.current || isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  return {
    isListening,
    isSupported,
    error,
    clearError: () => setError(null),
    start,
    stop,
    toggle,
  };
}
