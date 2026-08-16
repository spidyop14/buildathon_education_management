import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';

export interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trendDir?: 'up' | 'down' | 'flat';
  delay?: number;
  className?: string;
}

export function StatCard({ label, value, sub, trendDir, delay = 0, className }: StatCardProps) {
  const trendColor = trendDir === 'up' ? 'text-sage-500' : trendDir === 'down' ? 'text-rose-500' : 'text-ink-400';
  const TrendIcon = trendDir === 'up' ? 'arrow-up-right' : trendDir === 'down' ? 'arrow-down-right' : 'minus';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col gap-1', className)}
    >
      <div className="text-[11px] font-medium text-ink-400 uppercase tracking-wider">
        {label}
      </div>
      <div className="flex items-end gap-3 mt-1">
        <div className="font-mono text-2xl font-semibold text-ink-900">
          {value}
        </div>
        {trendDir && (
          <div className={cn("flex items-center gap-1 mb-1 text-sm font-medium", trendColor)}>
            <Icon name={TrendIcon as any} className="w-4 h-4" />
          </div>
        )}
      </div>
      {sub && (
        <div className="text-xs text-ink-500 mt-1">
          {sub}
        </div>
      )}
    </motion.div>
  );
}
