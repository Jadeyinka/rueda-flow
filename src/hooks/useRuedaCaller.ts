import { useState, useEffect, useCallback, useRef } from "react";
import { RuedaMove, ruedaMoves, getRandomMove } from "@/data/ruedaMoves";

export const useRuedaCaller = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMove, setCurrentMove] = useState<RuedaMove | null>(null);
  const [tempo, setTempo] = useState(5); // seconds between calls
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMoves, setSelectedMoves] = useState<Set<string>>(
    new Set(ruedaMoves.map(m => m.name))
  );
  const [progress, setProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getActiveMoves = useCallback(() => {
    return ruedaMoves.filter(m => selectedMoves.has(m.name));
  }, [selectedMoves]);

  const speakMove = useCallback((move: RuedaMove) => {
    if (isMuted || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(move.name);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const callNextMove = useCallback(() => {
    const activeMoves = getActiveMoves();
    if (activeMoves.length === 0) return;
    
    const move = getRandomMove(activeMoves);
    setCurrentMove(move);
    speakMove(move);
    setProgress(0);
  }, [getActiveMoves, speakMove]);

  const startCalling = useCallback(() => {
    if (getActiveMoves().length === 0) return;
    
    setIsPlaying(true);
    callNextMove();
    
    // Set up interval for next moves
    intervalRef.current = setInterval(() => {
      callNextMove();
    }, tempo * 1000);

    // Set up progress updates
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (tempo * 10); // Update 10 times per second
        return Math.min(prev + increment, 100);
      });
    }, 100);
  }, [tempo, callNextMove, getActiveMoves]);

  const stopCalling = useCallback(() => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setProgress(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      stopCalling();
    } else {
      startCalling();
    }
  }, [isPlaying, startCalling, stopCalling]);

  const skipToNext = useCallback(() => {
    if (!isPlaying) {
      callNextMove();
      return;
    }
    
    // Reset the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
    }
    
    callNextMove();
    
    intervalRef.current = setInterval(() => {
      callNextMove();
    }, tempo * 1000);

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (tempo * 10);
        return Math.min(prev + increment, 100);
      });
    }, 100);
  }, [isPlaying, callNextMove, tempo]);

  const toggleMove = useCallback((moveName: string) => {
    setSelectedMoves(prev => {
      const next = new Set(prev);
      if (next.has(moveName)) {
        next.delete(moveName);
      } else {
        next.add(moveName);
      }
      return next;
    });
  }, []);

  const selectAllMoves = useCallback(() => {
    setSelectedMoves(new Set(ruedaMoves.map(m => m.name)));
  }, []);

  const selectNoMoves = useCallback(() => {
    setSelectedMoves(new Set());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Restart interval when tempo changes while playing
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      
      intervalRef.current = setInterval(() => {
        callNextMove();
      }, tempo * 1000);

      progressRef.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (tempo * 10);
          return Math.min(prev + increment, 100);
        });
      }, 100);
    }
  }, [tempo, isPlaying, callNextMove]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  return {
    isPlaying,
    currentMove,
    tempo,
    setTempo,
    isMuted,
    setIsMuted,
    selectedMoves,
    progress,
    togglePlayPause,
    skipToNext,
    toggleMove,
    selectAllMoves,
    selectNoMoves,
    allMoves: ruedaMoves,
  };
};
