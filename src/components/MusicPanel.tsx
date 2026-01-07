import { Music, Upload, Play, Pause, Gauge, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicPanelProps {
  bpm: number | null;
  isPlaying: boolean;
  isAnalyzing: boolean;
  audioLoaded: boolean;
  volume: number;
  onFileSelect: (file: File) => void;
  onToggleMusic: () => void;
  onBPMChange: (bpm: number) => void;
  onVolumeChange: (volume: number) => void;
  syncEnabled: boolean;
  onSyncToggle: () => void;
}

const MusicPanel = ({
  bpm,
  isPlaying,
  isAnalyzing,
  audioLoaded,
  volume,
  onFileSelect,
  onToggleMusic,
  onBPMChange,
  onVolumeChange,
  syncEnabled,
  onSyncToggle,
}: MusicPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display text-xl tracking-wider text-foreground mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-primary" />
        Background Music
      </h3>

      {/* File upload - accepts all audio formats */}
      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.wma,.aiff,.opus,.webm"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5"
          disabled={isAnalyzing}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isAnalyzing ? "Analyzing..." : fileName ? "Change Track" : "Upload Music"}
        </Button>

        <AnimatePresence>
          {fileName && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-muted-foreground truncate"
            >
              🎵 {fileName}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Music controls */}
        {audioLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Button
              onClick={onToggleMusic}
              className={`w-full ${isPlaying ? 'bg-secondary hover:bg-secondary/90' : 'bg-primary hover:bg-primary/90'}`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" fill="currentColor" />
                  Pause Music
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" fill="currentColor" />
                  Play Music
                </>
              )}
            </Button>

            {/* Volume control */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Volume2 className="w-4 h-4" />
                  Music Volume
                </span>
                <span className="text-sm text-primary font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-center">
                Lower volume to hear voice calls clearly
              </p>
            </div>
          </motion.div>
        )}

        {/* BPM Display and Control */}
        {bpm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Gauge className="w-4 h-4" />
                Detected BPM
              </span>
              <span className="font-display text-2xl text-primary">{bpm}</span>
            </div>

            <Slider
              value={[bpm]}
              onValueChange={(value) => onBPMChange(value[0])}
              min={100}
              max={240}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slow (100)</span>
              <span>Fast (240)</span>
            </div>

            {/* Sync toggle */}
            <Button
              variant={syncEnabled ? "default" : "outline"}
              size="sm"
              onClick={onSyncToggle}
              className="w-full mt-2"
            >
              {syncEnabled ? "✓ Syncing to Beat" : "Sync Calls to Beat"}
            </Button>
            
            {syncEnabled && (
              <p className="text-xs text-center text-muted-foreground">
                Calls every 8 beats ({((60 / bpm) * 8).toFixed(1)}s)
              </p>
            )}
          </motion.div>
        )}

        {!audioLoaded && !isAnalyzing && (
          <p className="text-xs text-center text-muted-foreground">
            Upload a salsa track to auto-detect BPM
          </p>
        )}
      </div>
    </div>
  );
};

export default MusicPanel;
