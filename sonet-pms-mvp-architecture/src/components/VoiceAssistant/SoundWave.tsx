import { motion } from 'framer-motion';

interface SoundWaveProps {
  isActive: boolean;
  barCount?: number;
  color?: string;
}

export default function SoundWave({ isActive, barCount = 32, color = '#7C3AED' }: SoundWaveProps) {
  return (
    <div className="flex items-center justify-center gap-[2px] h-16 w-full">
      {Array.from({ length: barCount }).map((_, i) => {
        const isCenter = Math.abs(i - barCount / 2) < barCount / 4;
        const maxH = isCenter ? 56 : 32;
        const minH = isActive ? 6 : 3;
        
        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: 3,
              background: isActive
                ? `linear-gradient(to top, ${color}, #3B82F6)`
                : '#2D2D4A',
            }}
            animate={
              isActive
                ? {
                    height: [minH, Math.random() * maxH + minH, minH],
                    opacity: [0.5, 1, 0.5],
                  }
                : {
                    height: [3, 6, 3],
                    opacity: 0.4,
                  }
            }
            transition={
              isActive
                ? {
                    duration: 0.4 + Math.random() * 0.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: Math.random() * 0.3,
                  }
                : {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: i * 0.05,
                  }
            }
          />
        );
      })}
    </div>
  );
}

interface CircularWaveProps {
  isActive: boolean;
}

export function CircularWave({ isActive }: CircularWaveProps) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-[-8px] rounded-full border border-primary/20"
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          <motion.div
            className="absolute inset-[-16px] rounded-full border border-primary/10"
            animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
          />
        </>
      )}
      <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <motion.div
          animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {/* Mic icon will be placed by parent */}
        </motion.div>
      </div>
    </div>
  );
}
