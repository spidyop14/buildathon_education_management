import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/Icon';
import { Insight } from '@/types';

export interface InsightCardProps {
  insight: Insight;
  delay?: number;
  className?: string;
}

export function InsightCard({ insight, delay = 0, className }: InsightCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const yOffset = shouldReduceMotion ? 0 : 10;

  const severityMap = {
    high: { border: 'border-l-rose-500', bg: 'bg-rose-50/30', dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]', icon: 'text-rose-500' },
    moderate: { border: 'border-l-amber-500', bg: 'bg-amber-50/30', dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]', icon: 'text-amber-500' },
    low: { border: 'border-l-sage-500', bg: 'bg-sage-50/30', dot: 'bg-sage-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]', icon: 'text-sage-500' },
    positive: { border: 'border-l-sage-500', bg: 'bg-sage-50/30', dot: 'bg-sage-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]', icon: 'text-sage-500' },
  };

  const s = severityMap[insight.severity as keyof typeof severityMap] || severityMap.low;
  const TrendIcon = insight.trend === 'improving' ? 'trendUp' : insight.trend === 'declining' ? 'trendDown' : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'group relative p-4 rounded-xl border-y border-r border-l-[3px] border-ink-150 transition-all duration-200',
        s.border,
        s.bg,
        'hover:-translate-y-[1px] hover:shadow-hover',
        className
      )}
    >
      <div className="flex gap-4">
        <div className="mt-1.5 flex-shrink-0 relative">
          <div className={cn("w-2 h-2 rounded-full pulse-dot", s.dot)} />
          <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", s.dot)} />
        </div>
        <div className="flex flex-col flex-1">
          <motion.h4 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: delay }}
            className="font-display font-semibold text-[15px] text-ink-900"
          >
            {insight.title}
          </motion.h4>
          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: delay + 0.1 }}
            className="mt-1 flex items-center gap-2"
          >
            <span className="font-mono text-xs text-ink-500">{insight.metric}</span>
            {TrendIcon && (
              <Icon name={TrendIcon} className={cn("w-3.5 h-3.5", s.icon)} />
            )}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: delay + 0.2 }}
            className="mt-2 text-sm text-ink-600 leading-relaxed"
          >
            {insight.recommendation}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
