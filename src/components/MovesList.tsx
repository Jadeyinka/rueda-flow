import { RuedaMove } from "@/data/ruedaMoves";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface MovesListProps {
  moves: RuedaMove[];
  selectedMoves: Set<string>;
  onToggleMove: (moveName: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
}

const MovesList = ({
  moves,
  selectedMoves,
  onToggleMove,
  onSelectAll,
  onSelectNone,
}: MovesListProps) => {
  const beginnerMoves = moves.filter(m => m.difficulty === 'beginner');
  const intermediateMoves = moves.filter(m => m.difficulty === 'intermediate');
  const advancedMoves = moves.filter(m => m.difficulty === 'advanced');

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl tracking-wider text-foreground">
          Moves ({selectedMoves.size}/{moves.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
          >
            All
          </button>
          <span className="text-muted-foreground">/</span>
          <button
            onClick={onSelectNone}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            None
          </button>
        </div>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <MoveCategory
          title="Beginner"
          moves={beginnerMoves}
          selectedMoves={selectedMoves}
          onToggleMove={onToggleMove}
          color="secondary"
        />
        <MoveCategory
          title="Intermediate"
          moves={intermediateMoves}
          selectedMoves={selectedMoves}
          onToggleMove={onToggleMove}
          color="primary"
        />
        <MoveCategory
          title="Advanced"
          moves={advancedMoves}
          selectedMoves={selectedMoves}
          onToggleMove={onToggleMove}
          color="accent"
        />
      </div>
    </div>
  );
};

interface MoveCategoryProps {
  title: string;
  moves: RuedaMove[];
  selectedMoves: Set<string>;
  onToggleMove: (moveName: string) => void;
  color: 'primary' | 'secondary' | 'accent';
}

const MoveCategory = ({ title, moves, selectedMoves, onToggleMove, color }: MoveCategoryProps) => {
  const colorClasses = {
    primary: 'bg-primary/10 border-primary/30 text-primary',
    secondary: 'bg-secondary/10 border-secondary/30 text-secondary',
    accent: 'bg-accent/10 border-accent/30 text-accent',
  };

  return (
    <div>
      <h4 className={`text-sm font-medium uppercase tracking-wider mb-3 ${
        color === 'primary' ? 'text-primary' : 
        color === 'secondary' ? 'text-secondary' : 'text-accent'
      }`}>
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {moves.map((move) => {
          const isSelected = selectedMoves.has(move.name);
          return (
            <motion.button
              key={move.name}
              onClick={() => onToggleMove(move.name)}
              whileTap={{ scale: 0.95 }}
              className={`
                relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                border
                ${isSelected 
                  ? colorClasses[color]
                  : 'bg-muted/50 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              {isSelected && (
                <Check className="absolute -top-1 -right-1 h-3 w-3 text-foreground bg-background rounded-full" />
              )}
              {move.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MovesList;
