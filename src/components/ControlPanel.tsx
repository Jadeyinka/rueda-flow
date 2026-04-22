import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface ControlPanelProps {
  isPlaying: boolean;
  tempo: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onTempoChange: (value: number[]) => void;
  onMuteToggle: () => void;
}

const ControlPanel = ({
  isPlaying,
  tempo,
  isMuted,
  onPlayPause,
  onNext,
  onTempoChange,
  onMuteToggle,
}: ControlPanelProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 glow-border">
      {/* Main controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={onMuteToggle}
          className="h-12 w-12 rounded-full border-muted-foreground/20 hover:bg-muted"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <Button
          onClick={onPlayPause}
          className="h-20 w-20 rounded-full bg-primary hover:brightness-90 transition-all duration-300"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-primary-foreground" fill="currentColor" />
          ) : (
            <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-12 w-12 rounded-full border-muted-foreground/20 hover:bg-muted"
        >
          <SkipForward className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>

      {/* Tempo slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Interval
          </span>
          <span className="text-lg font-display text-foreground">
            {tempo}s
          </span>
        </div>
        <Slider
          value={[tempo]}
          onValueChange={onTempoChange}
          min={2}
          max={15}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Fast (2s)</span>
          <span>Slow (15s)</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
