import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0 to 1
  isPlaying: boolean;
}

const ProgressRing = ({ progress, isPlaying }: ProgressRingProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] -rotate-90">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
          opacity="0.3"
        />
        {/* Progress circle */}
        {isPlaying && (
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ProgressRing;
