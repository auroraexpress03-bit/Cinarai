import { useCallback, useEffect, useState } from 'react';

type TtsState = {
  isSpeaking: boolean;
  text: string | null;
};

type TtsListener = (state: TtsState) => void;

class GlobalTtsController {
  private listeners = new Set<TtsListener>();
  private state: TtsState = { isSpeaking: false, text: null };
  private readonly supported: boolean;

  constructor() {
    this.supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    if (typeof window !== 'undefined') {
      const cleanup = () => {
        this.stop();
      };

      window.addEventListener('beforeunload', cleanup);
      window.addEventListener('pagehide', cleanup);
    }
  }

  subscribe(listener: TtsListener) {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return this.state;
  }

  speak(text: string) {
    const normalizedText = text.trim();

    if (!this.supported || !normalizedText) {
      return false;
    }

    this.stop(false);

    if (typeof window === 'undefined') {
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      this.setState({ isSpeaking: true, text: normalizedText });
    };

    utterance.onend = () => {
      this.finish();
    };

    utterance.onerror = () => {
      this.finish();
    };

    this.setState({ isSpeaking: true, text: normalizedText });
    window.speechSynthesis.speak(utterance);

    return true;
  }

  toggle(text: string) {
    if (this.state.isSpeaking) {
      this.stop();
      return false;
    }

    return this.speak(text);
  }

  stop(emit = true) {
    if (typeof window !== 'undefined' && this.supported) {
      window.speechSynthesis.cancel();
    }

    if (emit) {
      this.setState({ isSpeaking: false, text: null });
    }
  }

  private finish() {
    this.setState({ isSpeaking: false, text: null });
  }

  private setState(nextState: TtsState) {
    this.state = nextState;

    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

const globalTtsController = new GlobalTtsController();

export function useGlobalTts() {
  const [state, setState] = useState<TtsState>(() => globalTtsController.getState());

  useEffect(() => globalTtsController.subscribe(setState), []);

  const speak = useCallback((text: string) => globalTtsController.speak(text), []);
  const stop = useCallback(() => globalTtsController.stop(), []);
  const toggle = useCallback((text: string) => globalTtsController.toggle(text), []);

  return {
    isSpeaking: state.isSpeaking,
    speak,
    stop,
    toggle,
  };
}

export function stopGlobalTts() {
  globalTtsController.stop();
}
