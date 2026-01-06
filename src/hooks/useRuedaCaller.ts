import { useState, useEffect, useCallback, useRef } from "react";
import { RuedaMove, ruedaMoves, getRandomMove } from "@/data/ruedaMoves";
import { useSmoothVoice } from "./useSmoothVoice";
import { useBPMDetector } from "./useBPMDetector";

export const useRuedaCaller = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMove, setCurrentMove] = useState<RuedaMove | null>(null);
  const [tempo, setTempo] = useState(5); // seconds between calls
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMoves, setSelectedMoves] = useState<Set<string>>(
    new Set(ruedaMoves.map(m => m.name))
  );
  const [progress, setProgress] = useState(0);
  const [syncToMusic, setSyncToMusic] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Use smooth voice hook
  const { speak, stop: stopSpeech } = useSmoothVoice();
  
  // Use BPM detector hook
  const bpmDetector = useBPMDetector();

  const getActiveMoves = useCallback(() => {
    return ruedaMoves.filter(m => selectedMoves.has(m.name));
  }, [selectedMoves]);

  const speakMove = useCallback((move: RuedaMove) => {
    if (isMuted) return;
    speak(move.name, { rate: 0.85, pitch: 1.0 });
  }, [isMuted, speak]);

  // Calculate effective tempo (considering BPM sync)
  const getEffectiveTempo = useCallback(() => {
    if (syncToMusic && bpmDetector.bpm) {
      return bpmDetector.getIntervalFromBPM(bpmDetector.bpm, 8);
    }
    return tempo;
  }, [syncToMusic, bpmDetector, tempo]);

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
    
    const effectiveTempo = getEffectiveTempo();
    
    // Set up interval for next moves
    intervalRef.current = setInterval(() => {
      callNextMove();
    }, effectiveTempo * 1000);

    // Set up progress updates
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (effectiveTempo * 10);
        return Math.min(prev + increment, 100);
      });
    }, 100);
  }, [getEffectiveTempo, callNextMove, getActiveMoves]);

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
    stopSpeech();
    setProgress(0);
  }, [stopSpeech]);

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
    
    const effectiveTempo = getEffectiveTempo();
    
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
    }, effectiveTempo * 1000);

    progressRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (effectiveTempo * 10);
        return Math.min(prev + increment, 100);
      });
    }, 100);
  }, [isPlaying, callNextMove, getEffectiveTempo]);

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
      stopSpeech();
    };
  }, [stopSpeech]);

  // Restart interval when tempo or sync changes while playing
  useEffect(() => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      
      const effectiveTempo = getEffectiveTempo();
      
      intervalRef.current = setInterval(() => {
        callNextMove();
      }, effectiveTempo * 1000);

      progressRef.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (effectiveTempo * 10);
          return Math.min(prev + increment, 100);
        });
      }, 100);
    }
  }, [tempo, syncToMusic, bpmDetector.bpm, isPlaying, callNextMove, getEffectiveTempo]);

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
    // Music/BPM features
    bpmDetector,
    syncToMusic,
    setSyncToMusic,
    getEffectiveTempo,
  };
};
