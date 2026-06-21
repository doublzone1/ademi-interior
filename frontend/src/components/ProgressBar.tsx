import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  active: boolean;
  /** Ожидаемое время выполнения, мс. По умолчанию 15 секунд. */
  expectedMs?: number;
  /** Подписи стадий */
  stages: { at: number; label: string }[];
}

/**
 * Реалистичный прогресс-бар с эффектом «асимптотического приближения к 95%».
 */
export function ProgressBar({ active, expectedMs = 15000, stages }: Props) {
  const [pct, setPct] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const startedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setPct(0);
      setStageIndex(0);
      startedAt.current = null;
      return;
    }
    startedAt.current = Date.now();
    let raf = 0;
    const tick = () => {
      const elapsed = Date.now() - (startedAt.current ?? Date.now());
      // Логарифмическая кривая, асимптотически до 95%
      const ratio = elapsed / expectedMs;
      const next = 95 * (1 - Math.exp(-2.2 * ratio));
      setPct(next);
      const newStage = stages.findIndex((s, i) =>
        next < s.at && (i === 0 || next >= stages[i - 1].at)
      );
      if (newStage !== -1) setStageIndex(newStage);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, expectedMs, stages]);

  if (!active) return null;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-xs mb-2">
        <span className="text-fg-2 font-medium">{stages[stageIndex]?.label ?? ''}</span>
        <span className="text-fg-3 tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elev-strong)' }}>
        <motion.div
          className="h-full bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600"
          animate={{ width: `${pct}%` }}
          transition={{ ease: 'linear', duration: 0.1 }}
        />
      </div>
    </div>
  );
}
