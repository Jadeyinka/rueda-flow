import { RuedaMove } from "@/data/ruedaMoves";
import { BookOpen } from "lucide-react";

interface MovesListProps {
  moves: RuedaMove[];
  selectedMoves: Set<string>;
  onToggleMove: (moveName: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onOpenTutorial: (move: RuedaMove) => void;
}

const difficultyConfig = {
  beginner:     { dot: "bg-green-400",  label: "Beginner",     ring: "ring-green-400/40" },
  intermediate: { dot: "bg-secondary",  label: "Intermediate", ring: "ring-secondary/40" },
  advanced:     { dot: "bg-primary",    label: "Advanced",     ring: "ring-primary/40"   },
};

type Difficulty = keyof typeof difficultyConfig;

const MovesList = ({
  moves,
  selectedMoves,
  onToggleMove,
  onSelectAll,
  onSelectNone,
  onOpenTutorial,
}: MovesListProps) => {
  const groups: Difficulty[] = ["beginner", "intermediate", "advanced"];

  const allSelected  = moves.length > 0 && selectedMoves.size === moves.length;
  const noneSelected = selectedMoves.size === 0;

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg tracking-widest text-foreground uppercase">Moves</h3>
        <div className="flex gap-3">
          <button
            onClick={onSelectAll}
            className={`text-xs uppercase tracking-wider transition-colors ${
              allSelected
                ? "text-secondary font-semibold"
                : "text-muted-foreground hover:text-secondary"
            }`}
          >
            All
          </button>
          <button
            onClick={onSelectNone}
            className={`text-xs uppercase tracking-wider transition-colors ${
              noneSelected
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            None
          </button>
        </div>
      </div>

      {/* Groups */}
      {groups.map((diff) => {
        const group = moves.filter(m => m.difficulty === diff);
        if (!group.length) return null;
        const { dot, label } = difficultyConfig[diff];
        return (
          <div key={diff}>
            {/* Group label */}
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
            </div>
            {/* 3-per-row chip grid */}
            <div className="grid grid-cols-3 gap-1.5">
              {group.map((move) => {
                const active = selectedMoves.has(move.name);
                return (
                  <div key={move.name} className="relative group">
                    <button
                      onClick={() => onToggleMove(move.name)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-all truncate
                        ${active
                          ? "bg-muted text-foreground border border-border"
                          : "bg-transparent text-muted-foreground border border-transparent hover:border-border hover:text-foreground"
                        }`}
                    >
                      {active && <span className="text-primary mr-1">✓</span>}
                      {move.name}
                    </button>
                    {/* Tutorial icon — appears on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onOpenTutorial(move); }}
                      className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-muted rounded-full p-0.5"
                      title={`Learn ${move.name}`}
                    >
                      <BookOpen className="w-2.5 h-2.5 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MovesList;
