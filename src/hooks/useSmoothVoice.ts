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
      
      // Prioritize smooth, natural-sounding voices
      // Spanish voices first, then look for high-quality English voices
      const preferredVoices = [
        // Spanish voices (for authentic Cuban Rueda calls)
        ...availableVoices.filter(v => v.lang.startsWith('es')),
        // Premium English voices (often smoother)
        ...availableVoices.filter(v => 
          v.name.includes('Premium') || 
          v.name.includes('Enhanced') ||
          v.name.includes('Natural') ||
          v.name.includes('Neural')
        ),
        // Google voices tend to be smoother
        ...availableVoices.filter(v => v.name.includes('Google')),
        // Microsoft voices
        ...availableVoices.filter(v => v.name.includes('Microsoft')),
      ];

      // Pick the first preferred voice or fall back to any available
      const bestVoice = preferredVoices[0] || availableVoices[0] || null;
      setSelectedVoice(bestVoice);
    };

    loadVoices();
    
    // Voices may load asynchronously
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
    
    // Apply smooth voice settings
    utterance.rate = options?.rate ?? 0.85; // Slower for clarity
    utterance.pitch = options?.pitch ?? 1.0; // Natural pitch
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
