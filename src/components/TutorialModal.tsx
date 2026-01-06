import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RuedaMove } from "@/data/ruedaMoves";
import { motion } from "framer-motion";

interface TutorialModalProps {
  move: RuedaMove | null;
  isOpen: boolean;
  onClose: () => void;
}

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  advanced: "bg-red-500/20 text-red-400 border-red-500/30",
};

const TutorialModal = ({ move, isOpen, onClose }: TutorialModalProps) => {
  if (!move) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-muted-foreground/20 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle className="font-display text-3xl tracking-wider text-foreground">
              {move.name}
            </DialogTitle>
            <Badge className={difficultyColors[move.difficulty]}>
              {move.difficulty}
            </Badge>
          </div>
          {move.description && (
            <p className="text-muted-foreground mt-2">{move.description}</p>
          )}
        </DialogHeader>

        {move.tutorial && (
          <div className="space-y-6 mt-4">
            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-display text-lg tracking-wider text-primary mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm">
                  1
                </span>
                Steps
              </h3>
              <ol className="space-y-2 ml-8">
                {move.tutorial.steps.map((step, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3 text-foreground/90"
                  >
                    <span className="text-muted-foreground font-mono text-sm mt-0.5">
                      {index + 1}.
                    </span>
                    <span>{step}</span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-display text-lg tracking-wider text-secondary mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-sm">
                  💡
                </span>
                Tips
              </h3>
              <ul className="space-y-2 ml-8">
                {move.tutorial.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="flex items-start gap-3 text-foreground/80"
                  >
                    <span className="text-secondary">•</span>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Practice reminder */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20"
            >
              <p className="text-sm text-accent flex items-center gap-2">
                <span>🎵</span>
                <span>Practice this move slowly with the music before adding speed!</span>
              </p>
            </motion.div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;
