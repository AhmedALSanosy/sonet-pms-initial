// ============================================================
// Sonet PMS — Sound Wave Visualization
// Pure CSS + controlled bar heights for performance
// ============================================================
import { useMemo } from 'react';
import type { VoiceState } from '../../types';

interface SoundWaveProps {
  state: VoiceState;
  barCount?: number;
}

// Pre-generate bar configurations for deterministic rendering
const BAR_CONFIGS = [
  { h: 18, delay: 0 },
  { h: 28, delay: 0.08 },
  { h: 22, delay: 0.16 },
  { h: 32, delay: 0.12 },
  { h: 14, delay: 0.24 },
  { h: 26, delay: 0.04 },
  { h: 30, delay: 0.2 },
  { h: 16, delay: 0.28 },
  { h: 24, delay: 0.06 },
  { h: 20, delay: 0.18 },
  { h: 34, delay: 0.1 },
  { h: 12, delay: 0.22 },
  { h: 28, delay: 0.14 },
  { h: 18, delay: 0.26 },
  { h: 32, delay: 0.08 },
  { h: 22, delay: 0.2 },
  { h: 26, delay: 0.04 },
  { h: 14, delay: 0.16 },
  { h: 30, delay: 0.12 },
  { h: 20, delay: 0.24 },
  { h: 36, delay: 0.06 },
  { h: 16, delay: 0.18 },
  { h: 24, delay: 0.1 },
  { h: 28, delay: 0.22 },
  { h: 12, delay: 0.14 },
  { h: 32, delay: 0.26 },
  { h: 20, delay: 0.08 },
  { h: 26, delay: 0.2 },
  { h: 18, delay: 0.04 },
  { h: 34, delay: 0.16 },
  { h: 22, delay: 0.12 },
  { h: 16, delay: 0.24 },
];

export default function SoundWave({ state, barCount = 32 }: SoundWaveProps) {
  const isActive = state === 'listening' || state === 'processing' || state === 'speaking';
  const bars = useMemo(() => BAR_CONFIGS.slice(0, barCount), [barCount]);

  return (
    <div className="flex items-center justify-center gap-[2px] h-14 w-full" dir="ltr">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`
            rounded-full transition-all duration-300
            ${isActive ? 'voice-bar active' : ''}
          `}
          style={{
            width: 3,
            height: isActive ? undefined : 3,
            minHeight: 3,
            background: isActive
              ? undefined // handled by CSS class
              : '#2D2D4E',
            ...(isActive
              ? {
                  '--bar-h': `${bar.h}px`,
                  animationDelay: `${bar.delay}s`,
                } as React.CSSProperties
              : {}),
          }}
        />
      ))}
    </div>
  );
}

// ─── Mic Pulse Ring ───
interface MicPulseProps {
  isActive: boolean;
}

export function MicPulse({ isActive }: MicPulseProps) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center" dir="ltr">
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" />
          <div
            className="absolute inset-[-6px] rounded-full border border-primary/20"
            style={{ animation: 'pulse-ring 2s cubic-bezier(0.25,0.46,0.45,0.94) infinite 0.3s' }}
          />
          <div
            className="absolute inset-[-12px] rounded-full border border-primary/10"
            style={{ animation: 'pulse-ring 2s cubic-bezier(0.25,0.46,0.45,0.94) infinite 0.6s' }}
          />
        </>
      )}
      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center glow-purple-sm z-10">
        {isActive && (
          <div className="absolute inset-0 rounded-full gradient-primary animate-pulse-ring opacity-30" />
        )}
      </div>
    </div>
  );
}
