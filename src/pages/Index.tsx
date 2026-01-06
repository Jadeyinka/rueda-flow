import { motion } from "framer-motion";
import Header from "@/components/Header";
import MoveDisplay from "@/components/MoveDisplay";
import ControlPanel from "@/components/ControlPanel";
import MovesList from "@/components/MovesList";
import ProgressRing from "@/components/ProgressRing";
import { useRuedaCaller } from "@/hooks/useRuedaCaller";

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
  } = useRuedaCaller();

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
        
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left column - Moves list */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <MovesList
              moves={allMoves}
              selectedMoves={selectedMoves}
              onToggleMove={toggleMove}
              onSelectAll={selectAllMoves}
              onSelectNone={selectNoMoves}
            />
          </motion.div>

          {/* Center column - Main display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-1 lg:order-2 lg:col-span-1 flex flex-col items-center"
          >
            <div className="relative w-full">
              <ProgressRing progress={progress / 100} isPlaying={isPlaying} />
              <MoveDisplay currentMove={currentMove} isPlaying={isPlaying} />
            </div>
            
            <div className="w-full max-w-md mt-8">
              <ControlPanel
                isPlaying={isPlaying}
                tempo={tempo}
                isMuted={isMuted}
                onPlayPause={togglePlayPause}
                onNext={skipToNext}
                onTempoChange={(value) => setTempo(value[0])}
                onMuteToggle={() => setIsMuted(!isMuted)}
              />
            </div>
          </motion.div>

          {/* Right column - Stats/Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="order-3 space-y-4"
          >
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-2xl tracking-wider text-foreground mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Select moves based on your skill level</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">•</span>
                  <span>Adjust the interval for faster or slower practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  <span>Enable audio for spoken calls</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Practice with partners for the full Rueda experience!</span>
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
                  <p className="text-3xl font-display text-secondary">{tempo}s</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Interval</p>
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
    </div>
  );
};

export default Index;
