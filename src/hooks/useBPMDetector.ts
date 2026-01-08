import { useState, useRef, useCallback, useEffect } from "react";

interface BPMState {
  bpm: number | null;
  isAnalyzing: boolean;
  isPlaying: boolean;
  audioLoaded: boolean;
  volume: number;
}

export const useBPMDetector = () => {
  const [state, setState] = useState<BPMState>({
    bpm: null,
    isAnalyzing: false,
    isPlaying: false,
    audioLoaded: false,
    volume: 0.3, // Lower default volume so voice calls are audible
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const detectBPM = useCallback((audioBuffer: AudioBuffer): number => {
    // Get audio data from the first channel
    const audioData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Use a low-pass filter simulation by downsampling
    const downsampleFactor = 4;
    const downsampledLength = Math.floor(audioData.length / downsampleFactor);
    const downsampled = new Float32Array(downsampledLength);
    
    for (let i = 0; i < downsampledLength; i++) {
      let sum = 0;
      for (let j = 0; j < downsampleFactor; j++) {
        sum += Math.abs(audioData[i * downsampleFactor + j]);
      }
      downsampled[i] = sum / downsampleFactor;
    }
    
    // Find peaks (beats) in the audio
    const peaks: number[] = [];
    const threshold = 0.3;
    const minPeakDistance = Math.floor((sampleRate / downsampleFactor) * 0.25); // 250ms minimum between beats
    
    let lastPeak = -minPeakDistance;
    for (let i = 1; i < downsampled.length - 1; i++) {
      if (
        downsampled[i] > threshold &&
        downsampled[i] > downsampled[i - 1] &&
        downsampled[i] > downsampled[i + 1] &&
        i - lastPeak > minPeakDistance
      ) {
        peaks.push(i);
        lastPeak = i;
      }
    }
    
    if (peaks.length < 2) {
      // Default salsa BPM if detection fails
      return 180;
    }
    
    // Calculate average interval between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = (60 * (sampleRate / downsampleFactor)) / avgInterval;
    
    // Salsa typically ranges from 150-220 BPM
    // Adjust if outside this range
    let adjustedBPM = bpm;
    if (bpm < 100) adjustedBPM = bpm * 2;
    if (bpm > 250) adjustedBPM = bpm / 2;
    
    return Math.round(adjustedBPM);
  }, []);

  const loadAudio = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const audioContext = audioContextRef.current;
      
      // Create audio element for playback
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.loop = false; // Don't loop - stop when finished
      audioElementRef.current = audio;
      
      // Use actual audio events as source of truth for isPlaying state
      // This ensures consistent behavior across mobile and desktop
      audio.addEventListener('playing', () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      });
      
      audio.addEventListener('pause', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      audio.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      // Handle errors (mobile autoplay restrictions, etc.)
      audio.addEventListener('error', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      
      // Wait for audio to load
      await new Promise((resolve, reject) => {
        audio.oncanplaythrough = resolve;
        audio.onerror = reject;
      });
      
      // Create source, gain node and analyser for visualization
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContext.createMediaElementSource(audio);
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Create gain node for volume control
        gainNodeRef.current = audioContext.createGain();
        gainNodeRef.current.gain.value = state.volume;
        
        sourceNodeRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContext.destination);
      }
      
      // Analyze a portion of the audio for BPM
      const response = await fetch(audio.src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const detectedBPM = detectBPM(audioBuffer);
      
      setState(prev => ({
        ...prev,
        bpm: detectedBPM,
        isAnalyzing: false,
        isPlaying: false,
        audioLoaded: true,
      }));
      
      return detectedBPM;
    } catch (error) {
      console.error("Error loading audio:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
      return null;
    }
  }, [detectBPM, state.volume]);

  const playMusic = useCallback(async () => {
    if (audioElementRef.current && audioContextRef.current) {
      // Resume audio context if suspended (browser autoplay policy)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      try {
        // Don't set state here - let the 'playing' event handle it
        // This ensures state only updates when audio actually starts
        await audioElementRef.current.play();
      } catch (error) {
        // Handle autoplay restrictions on mobile
        console.warn('Audio play failed:', error);
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioElementRef.current) {
      // Don't set state here - let the 'pause' event handle it
      audioElementRef.current.pause();
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (state.isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [state.isPlaying, playMusic, pauseMusic]);

  const setBPM = useCallback((bpm: number) => {
    setState(prev => ({ ...prev, bpm }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, []);

  const getAnalyserData = useCallback((): Uint8Array | null => {
    if (!analyserRef.current) return null;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  // Calculate interval from BPM (assuming 8-count phrases)
  const getIntervalFromBPM = useCallback((bpm: number, beats: number = 8): number => {
    // Time for one beat in seconds
    const beatDuration = 60 / bpm;
    // Return time for specified number of beats
    return beatDuration * beats;
  }, []);

  return {
    ...state,
    loadAudio,
    playMusic,
    pauseMusic,
    toggleMusic,
    setBPM,
    setVolume,
    getAnalyserData,
    getIntervalFromBPM,
    analyser: analyserRef.current,
  };
};
