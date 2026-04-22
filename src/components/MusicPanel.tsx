import { Upload, Play, Pause, Gauge, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SalsaTrack } from "@/data/salsaTracks";

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
  tracks: SalsaTrack[];
  onTrackSelect: (track: SalsaTrack) => void;
  selectedTrackId?: string;
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
  tracks,
  onTrackSelect,
  selectedTrackId,
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

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);
  const displayLabel = fileName ?? selectedTrack?.name ?? undefined;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      {/* Section title */}
      <h3 className="font-display text-lg tracking-widest text-foreground uppercase">
        Music
      </h3>

      {/* Track selector dropdown */}
      <Select
        value={selectedTrackId ?? ""}
        onValueChange={(id) => {
          const track = tracks.find(t => t.id === id);
          if (track && !isAnalyzing) onTrackSelect(track);
        }}
        disabled={isAnalyzing}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Choose a track…">
            {displayLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {tracks.map((track) => (
            <SelectItem key={track.id} value={track.id}>
              <div className="flex items-center justify-between w-full gap-4">
                <span>{track.name}</span>
                {track.bpm && (
                  <span className="text-xs text-muted-foreground">{track.bpm} BPM</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Upload button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.flac,.aac,.m4a,.wma,.aiff,.opus,.webm"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl border border-dashed border-border hover:border-primary/50 hover:text-primary transition-colors text-muted-foreground text-sm"
      >
        <Upload className="w-4 h-4" />
        {isAnalyzing ? "Analyzing…" : "Upload your music"}
      </button>

      {/* Controls — shown when audio is loaded */}
      <AnimatePresence>
        {audioLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="space-y-3"
          >
            {/* Volume */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wide">
                  <Volume2 className="w-3.5 h-3.5" /> Volume
                </span>
                <span className="text-xs text-primary font-medium">{Math.round(volume * 100)}%</span>
              </div>
              <Slider value={[volume]} onValueChange={(v) => onVolumeChange(v[0])} min={0} max={1} step={0.05} className="w-full" />
            </div>

            {/* Play / Pause music */}
            <button
              onClick={onToggleMusic}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors
                ${isPlaying ? "bg-secondary/20 text-secondary hover:bg-secondary/30" : "bg-primary/20 text-primary hover:bg-primary/30"}`}
            >
              {isPlaying
                ? <><Pause className="w-4 h-4" fill="currentColor" /> Pause Music</>
                : <><Play className="w-4 h-4" fill="currentColor" /> Play Music</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BPM controls */}
      <AnimatePresence>
        {bpm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3 pt-1 border-t border-border"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wide">
                <Gauge className="w-3.5 h-3.5" /> BPM
              </span>
              <span className="font-display text-xl text-primary">{bpm}</span>
            </div>
            <Slider value={[bpm]} onValueChange={(v) => onBPMChange(v[0])} min={100} max={240} step={1} className="w-full" />
            <button
              onClick={onSyncToggle}
              className={`w-full py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors
                ${syncEnabled ? "bg-primary text-white" : "border border-border text-muted-foreground hover:text-foreground"}`}
            >
              {syncEnabled ? "✓ Syncing to Beat" : "Sync Calls to Beat"}
            </button>
            {syncEnabled && (
              <p className="text-xs text-center text-muted-foreground">
                Calls every 8 beats ({((60 / bpm) * 8).toFixed(1)}s)
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPanel;
