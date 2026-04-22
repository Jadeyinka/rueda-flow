import { useCallback, useEffect, useRef, useState } from "react";

export const useSmoothVoice = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis?.getVoices() || [];
      setVoices(availableVoices);

      const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));

      // The browser doesn't expose gender directly, so we match against known
      // male Spanish voice names across Mac, Windows, and Google voices.
      const MALE_NAMES = [
        'jorge', 'diego', 'pablo', 'raul', 'raúl', 'carlos', 'juan',
        'miguel', 'andrés', 'andres', 'javier', 'ricardo', 'rodrigo',
        'enrique', 'antonio', 'alejandro', 'luca', 'felix', 'félix',
        'angel', 'ángel', 'sergio', 'daniel', 'marco', 'alberto',
      ];

      const isMale = (v: SpeechSynthesisVoice) => {
        const name = v.name.toLowerCase();
        return MALE_NAMES.some(n => name.includes(n));
      };

      const isLatinAm = (v: SpeechSynthesisVoice) =>
        v.lang.includes('MX') || v.lang.includes('CU') || v.lang.includes('CO') ||
        v.lang.includes('AR') || v.lang.includes('VE') || v.lang.includes('419') ||
        v.lang.includes('US');

      const isPremium = (v: SpeechSynthesisVoice) => {
        const name = v.name.toLowerCase();
        return name.includes('neural') || name.includes('natural') ||
               name.includes('premium') || v.name.includes('Google') ||
               v.name.includes('Microsoft');
      };

      // Selection priority: male first, then quality, then region
      const bestVoice =
        spanishVoices.find(v => isMale(v) && isLatinAm(v) && isPremium(v)) ||
        spanishVoices.find(v => isMale(v) && isLatinAm(v))                 ||
        spanishVoices.find(v => isMale(v) && isPremium(v))                 ||
        spanishVoices.find(v => isMale(v))                                 ||
        spanishVoices.find(v => isLatinAm(v) && isPremium(v))             ||
        spanishVoices.find(v => isLatinAm(v))                             ||
        spanishVoices[0]                                                   ||
        null;

      setSelectedVoice(bestVoice);

      console.log('Available Spanish voices:', spanishVoices.map(v => `${v.name} (${v.lang})`));
      console.log('Selected voice:', bestVoice?.name, bestVoice?.lang);
    };

    loadVoices();

    // Voices may load asynchronously on some browsers
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const speak = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Setting lang is the most important line — it tells the speech engine
    // to pronounce words using Spanish phonetics. This helps even when the
    // system has no dedicated Spanish voice installed.
    utterance.lang = selectedVoice?.lang ?? 'es-MX';

    utterance.rate = options?.rate ?? 0.9;
    utterance.pitch = options?.pitch ?? 0.85; // Lower = deeper, more authoritative caller voice
    utterance.volume = options?.volume ?? 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice]);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  return {
    speak,
    stop,
    voices,
    selectedVoice,
    setSelectedVoice,
  };
};
