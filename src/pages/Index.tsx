import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import MoveDisplay from "@/components/MoveDisplay";
import ControlPanel from "@/components/ControlPanel";
import MovesList from "@/components/MovesList";
import ProgressRing from "@/components/ProgressRing";
import MusicPanel from "@/components/MusicPanel";
import AudioVisualizer from "@/components/AudioVisualizer";
import TutorialModal from "@/components/TutorialModal";
import { useRuedaCaller } from "@/hooks/useRuedaCaller";
import { Mic } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RuedaMove } from "@/data/ruedaMoves";
import { SALSA_TRACKS, SalsaTrack } from "@/data/salsaTracks";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const {
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
    allMoves,
    bpmDetector,
    syncToMusic,
    setSyncToMusic,
    getEffectiveTempo,
    voices,
    selectedVoice,
    setSelectedVoice,
    callCount,
  } = useRuedaCaller();

  const [tutorialMove, setTutorialMove] = useState<RuedaMove | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>();

  const handleOpenTutorial = (move: RuedaMove) => setTutorialMove(move);

  const handleTrackSelect = useCallback(async (track: SalsaTrack) => {
    setSelectedTrackId(track.id);
    const { data } = supabase.storage.from('tracks').getPublicUrl(track.storagePath);
    if (data?.publicUrl) {
      await bpmDetector.loadAudioFromUrl(data.publicUrl, track.bpm);
    }
  }, [bpmDetector]);

  const effectiveTempo = syncToMusic && bpmDetector.bpm ? getEffectiveTempo() : tempo;

  return (
    <div className="min-h-screen lg:h-screen bg-background overflow-x-hidden lg:overflow-hidden flex flex-col">
      {/* Subtle background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top nav */}
        <Header />

        {/* Main content — single column on mobile, 3-column grid on desktop */}
        <div className="flex-1 container mx-auto px-4 pb-8 lg:pb-4 lg:overflow-hidden">
          <div className="flex flex-col gap-4 lg:h-full lg:grid lg:grid-cols-[320px_1fr_320px] lg:gap-6 lg:items-start">

            {/* ── 1st on mobile: Caller ── (centre column on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="w-full lg:order-2 flex flex-col items-center lg:h-full lg:overflow-y-auto lg:scrollbar-thin"
            >
              {/* Ring + Move display */}
              <div className="relative w-full flex-shrink-0">
                <ProgressRing progress={progress / 100} isPlaying={isPlaying} />
                <MoveDisplay
                  currentMove={currentMove}
                  isPlaying={isPlaying}
                  onOpenTutorial={handleOpenTutorial}
                />
              </div>

              {/* Audio visualizer */}
              {bpmDetector.isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md mt-3"
                >
                  <AudioVisualizer
                    getAnalyserData={bpmDetector.getAnalyserData}
                    isPlaying={bpmDetector.isPlaying}
                  />
                </motion.div>
              )}

              {/* Controls */}
              <div className="w-full max-w-md mt-4">
                <ControlPanel
                  isPlaying={isPlaying}
                  tempo={effectiveTempo}
                  isMuted={isMuted}
                  onPlayPause={togglePlayPause}
                  onNext={skipToNext}
                  onTempoChange={(value) => setTempo(value[0])}
                  onMuteToggle={() => setIsMuted(!isMuted)}
                />
              </div>
            </motion.div>

            {/* ── 2nd on mobile: Music + Session + Voice ── (right column on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-full lg:order-3 lg:h-full lg:overflow-y-auto lg:scrollbar-thin space-y-4"
            >
              <MusicPanel
                bpm={bpmDetector.bpm}
                isPlaying={bpmDetector.isPlaying}
                isAnalyzing={bpmDetector.isAnalyzing}
                audioLoaded={bpmDetector.audioLoaded}
                volume={bpmDetector.volume}
                onFileSelect={bpmDetector.loadAudio}
                onToggleMusic={bpmDetector.toggleMusic}
                onBPMChange={bpmDetector.setBPM}
                onVolumeChange={bpmDetector.setVolume}
                syncEnabled={syncToMusic}
                onSyncToggle={() => setSyncToMusic(!syncToMusic)}
                tracks={SALSA_TRACKS}
                onTrackSelect={handleTrackSelect}
                selectedTrackId={selectedTrackId}
              />

              {/* Session stats */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-display text-lg tracking-widest text-foreground uppercase mb-4">
                  Session
                </h3>
                <div className="grid grid-cols-4 lg:grid-cols-2 gap-3">
                  {[
                    { value: selectedMoves.size,              label: "Moves",    color: "text-primary" },
                    { value: `${effectiveTempo.toFixed(0)}s`, label: "Interval", color: "text-secondary" },
                    { value: callCount,                       label: "Called",   color: "text-primary" },
                    { value: bpmDetector.bpm ?? "—",          label: "BPM",      color: "text-green-400" },
                  ].map(({ value, label, color }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-muted/40">
                      <p className={`text-2xl font-display ${color}`}>{value}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caller voice picker */}
              {voices.length > 0 && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-display text-lg tracking-widest text-foreground uppercase mb-1 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    Caller Voice
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Choose the voice that calls your moves
                  </p>
                  <Select
                    value={selectedVoice?.name ?? ""}
                    onValueChange={(name) => {
                      const voice = voices.find(v => v.name === name);
                      if (voice) setSelectedVoice(voice);
                    }}
                  >
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select a voice..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover max-h-60">
                      {voices.map((voice) => (
                        <SelectItem key={voice.name} value={voice.name}>
                          <div className="flex items-center justify-between w-full gap-2">
                            <span>{voice.name}</span>
                            <span className="text-xs text-muted-foreground">{voice.lang}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </motion.div>

            {/* ── 3rd on mobile: Moves list ── (left column on desktop) */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="w-full lg:order-1 lg:h-full lg:overflow-y-auto lg:scrollbar-thin"
            >
              <MovesList
                moves={allMoves}
                selectedMoves={selectedMoves}
                onToggleMove={toggleMove}
                onSelectAll={selectAllMoves}
                onSelectNone={selectNoMoves}
                onOpenTutorial={handleOpenTutorial}
              />
            </motion.div>

          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-2 text-muted-foreground text-xs shrink-0"
        >
          ¡Que siga la Rueda! 💃🕺
        </motion.footer>
      </div>

      <TutorialModal
        move={tutorialMove}
        isOpen={!!tutorialMove}
        onClose={() => setTutorialMove(null)}
      />
    </div>
  );
};

export default Index;
