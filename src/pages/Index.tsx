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
  } = useRuedaCaller();

  const [tutorialMove, setTutorialMove] = useState<RuedaMove | null>(null);
  const [selectedTrackId, setSelectedTrackId] = useState<string | undefined>();

  const handleOpenTutorial = (move: RuedaMove) => {
    setTutorialMove(move);
  };

  const handleTrackSelect = useCallback(async (track: SalsaTrack) => {
    setSelectedTrackId(track.id);
    
    // Get public URL from storage
    const { data } = supabase.storage
      .from('tracks')
      .getPublicUrl(track.storagePath);
    
    if (data?.publicUrl) {
      await bpmDetector.loadAudioFromUrl(data.publicUrl, track.bpm);
    }
  }, [bpmDetector]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 md:w-96 h-48 md:h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-40 md:w-80 h-40 md:h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-32 md:w-64 h-32 md:h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-3 sm:px-4 pb-8">
        <Header />
        
        {/* Mobile: Stack vertically, Desktop: 3-column grid */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 items-start">
          
          {/* Center column - Main display (First on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:order-2 lg:col-span-1 flex flex-col items-center"
          >
            <div className="relative w-full flex-shrink-0">
              <ProgressRing progress={progress / 100} isPlaying={isPlaying} />
              <MoveDisplay 
                currentMove={currentMove} 
                isPlaying={isPlaying}
                onOpenTutorial={handleOpenTutorial}
              />
            </div>
            
            {/* Audio Visualizer */}
            {bpmDetector.isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mt-4"
              >
                <AudioVisualizer
                  getAnalyserData={bpmDetector.getAnalyserData}
                  isPlaying={bpmDetector.isPlaying}
                />
              </motion.div>
            )}
            
            <div className="w-full max-w-md mt-4 sm:mt-8">
              <ControlPanel
                isPlaying={isPlaying}
                tempo={syncToMusic && bpmDetector.bpm ? getEffectiveTempo() : tempo}
                isMuted={isMuted}
                onPlayPause={togglePlayPause}
                onNext={skipToNext}
                onTempoChange={(value) => setTempo(value[0])}
                onMuteToggle={() => setIsMuted(!isMuted)}
              />
            </div>
          </motion.div>

          {/* Music Panel (Second on mobile, Right on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full lg:order-3 space-y-4"
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

            {/* Session Stats - inline on mobile */}
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h3 className="font-display text-xl sm:text-2xl tracking-wider text-foreground mb-2">
                Session Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl sm:text-3xl font-display text-primary">{selectedMoves.size}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">Active Moves</p>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-xl bg-muted/50">
                  <p className="text-2xl sm:text-3xl font-display text-secondary">
                    {syncToMusic && bpmDetector.bpm 
                      ? `${getEffectiveTempo().toFixed(1)}s`
                      : `${tempo}s`
                    }
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {syncToMusic && bpmDetector.bpm ? "Beat Sync" : "Interval"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Moves list (Last on mobile, Left on desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full lg:order-1"
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

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12 text-muted-foreground text-sm"
        >
          <p>¡Que siga la Rueda! 💃🕺</p>
        </motion.footer>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        move={tutorialMove}
        isOpen={!!tutorialMove}
        onClose={() => setTutorialMove(null)}
      />
    </div>
  );
};

export default Index;
