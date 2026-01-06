import { RuedaMove } from "@/data/ruedaMoves";
import { motion, AnimatePresence } from "framer-motion";

interface MoveDisplayProps {
  currentMove: RuedaMove | null;
  isPlaying: boolean;
}

const MoveDisplay = ({ currentMove, isPlaying }: MoveDisplayProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
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
            className="text-center z-10"
          >
            <h2 className="move-display mb-4">
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
              className="mt-4"
            >
              <span className={`
                inline-block px-4 py-1.5 rounded-full text-sm font-medium uppercase tracking-wider
                ${currentMove.difficulty === 'beginner' ? 'bg-secondary/20 text-secondary' : ''}
                ${currentMove.difficulty === 'intermediate' ? 'bg-primary/20 text-primary' : ''}
                ${currentMove.difficulty === 'advanced' ? 'bg-accent/20 text-accent' : ''}
              `}>
                {currentMove.difficulty}
              </span>
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
