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
      
      // Prioritize Spanish/Cuban voices for authentic Rueda calls
      // Order: Cuban Spanish > Latin American Spanish > Spain Spanish > Other Spanish
      const spanishVoices = availableVoices.filter(v => v.lang.startsWith('es'));
      
      // Prefer Latin American Spanish variants (closer to Cuban accent)
      const latinAmericanVoices = spanishVoices.filter(v => 
        v.lang.includes('MX') || // Mexico
        v.lang.includes('CU') || // Cuba
        v.lang.includes('CO') || // Colombia
        v.lang.includes('AR') || // Argentina
        v.lang.includes('VE') || // Venezuela
        v.lang.includes('419')   // Latin America generic
      );
      
      // Prefer natural/neural voices for smoother sound
      const naturalVoices = spanishVoices.filter(v =>
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('neural') ||
        v.name.toLowerCase().includes('premium') ||
        v.name.includes('Google') ||
        v.name.includes('Microsoft')
      );

      // Pick the best available Spanish voice
      const bestVoice = latinAmericanVoices[0] || naturalVoices[0] || spanishVoices[0] || availableVoices[0] || null;
      setSelectedVoice(bestVoice);
      
      console.log('Available Spanish voices:', spanishVoices.map(v => `${v.name} (${v.lang})`));
      console.log('Selected voice:', bestVoice?.name, bestVoice?.lang);
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
    
    // Apply natural Cuban/Spanish voice settings
    // Slightly slower rate for clarity, natural pitch, LOUD volume
    utterance.rate = options?.rate ?? 0.9; // Natural speaking pace
    utterance.pitch = options?.pitch ?? 1.1; // Slightly higher for energy
    utterance.volume = options?.volume ?? 1.0; // Maximum volume
    
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
