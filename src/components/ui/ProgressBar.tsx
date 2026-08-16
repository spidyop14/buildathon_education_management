import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
  value: number;
  tone?: 'cobalt' | 'sage' | 'amber' | 'rose' | 'neutral';
  className?: string;
}

export function ProgressBar({ value, tone = 'cobalt', className }: ProgressBarProps) {
  const tones = {
    neutral: "bg-ink-500",
    cobalt: "bg-cobalt-500",
    sage: "bg-sage-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
  };

  const safeValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("h-2 w-full bg-ink-100 rounded-full overflow-hidden", className)}>
      <motion.div
        className={cn("h-full rounded-full", tones[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${safeValue}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
