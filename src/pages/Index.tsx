import { useState } from "react";
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

  const handleOpenTutorial = (move: RuedaMove) => {
    setTutorialMove(move);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-8">
        <Header />
        
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left column - Moves list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 lg:order-1 max-h-[calc(100vh-200px)] overflow-hidden"
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

          {/* Center column - Main display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-1 lg:order-2 lg:col-span-1 flex flex-col items-center"
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
            
            <div className="w-full max-w-md mt-8">
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

          {/* Right column - Music & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="order-3 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {/* Music Panel */}
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
            />

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-2xl tracking-wider text-foreground mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Click 📖 on any move for a tutorial</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Upload salsa music to sync calls to the beat</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Enable audio for smooth voice calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Practice with partners for the full experience!</span>
                </li>
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-2xl tracking-wider text-foreground mb-2">
                Session Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-3xl font-display text-primary">{selectedMoves.size}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Active Moves</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/50">
                  <p className="text-3xl font-display text-secondary">
                    {syncToMusic && bpmDetector.bpm 
                      ? `${getEffectiveTempo().toFixed(1)}s`
                      : `${tempo}s`
                    }
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {syncToMusic && bpmDetector.bpm ? "Beat Sync" : "Interval"}
                  </p>
                </div>
              </div>
            </div>
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
