import { RuedaMove } from "@/data/ruedaMoves";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MoveDisplayProps {
  currentMove: RuedaMove | null;
  isPlaying: boolean;
  onOpenTutorial: (move: RuedaMove) => void;
}

const MoveDisplay = ({ currentMove, isPlaying, onOpenTutorial }: MoveDisplayProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[200px] md:min-h-[280px] py-4">
      {/* Background glow effect */}
      <div className="absolute inset-0 radial-glow opacity-60" />
      
      <AnimatePresence mode="wait">
        {currentMove ? (
          <motion.div
            key={currentMove.name}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-center z-10 px-4"
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
              {currentMove.name}
            </h2>
            {currentMove.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-lg md:text-xl"
              >
                {currentMove.description}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex flex-col items-center gap-3"
            >
              <span className={`
                inline-block px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider
                ${currentMove.difficulty === 'beginner' ? 'bg-secondary/20 text-secondary' : ''}
                ${currentMove.difficulty === 'intermediate' ? 'bg-primary/20 text-primary' : ''}
                ${currentMove.difficulty === 'advanced' ? 'bg-accent/20 text-accent' : ''}
              `}>
                {currentMove.difficulty}
              </span>
              
              {/* Tutorial button */}
              {currentMove.tutorial && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onOpenTutorial(currentMove)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    How to do this move
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center z-10"
          >
            <p className="text-muted-foreground text-2xl md:text-3xl font-display tracking-wider">
              {isPlaying ? "Starting..." : "Press Play to Begin"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoveDisplay;
