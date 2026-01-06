import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioVisualizerProps {
  getAnalyserData: () => Uint8Array | null;
  isPlaying: boolean;
}

const AudioVisualizer = ({ getAnalyserData, isPlaying }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const data = getAnalyserData();
      if (!data) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw bars
      const barCount = 32;
      const barWidth = width / barCount;
      const step = Math.floor(data.length / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = data[i * step];
        const barHeight = (value / 255) * height * 0.8;
        
        // Gradient color based on position
        const hue = 340 + (i / barCount) * 40; // Red to orange gradient
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        
        const x = i * barWidth;
        const y = height - barHeight;
        
        // Draw rounded bars
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, getAnalyserData]);

  if (!isPlaying) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      className="w-full h-16 rounded-lg overflow-hidden bg-muted/30"
    >
      <canvas
        ref={canvasRef}
        width={320}
        height={64}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default AudioVisualizer;
