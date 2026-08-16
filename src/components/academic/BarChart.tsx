import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BarChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  className?: string;
}

export function BarChart({ data, labels, color = '#4361EE', height = 200, className }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxVal = Math.max(...data, 1);

  // Normalize color format safely
  const barBg = color.startsWith('#')
    ? `linear-gradient(to top, ${color}, ${color}bb)`
    : color.startsWith('rgba') || color.startsWith('rgb')
    ? color
    : '#4361EE';

  return (
    <div className={cn("flex items-end justify-between gap-4 w-full pt-6 pb-2", className)} style={{ height }}>
      {data.map((val, i) => {
        const percentage = Math.min(100, Math.max(5, (val / maxVal) * 100));
        const isHovered = hoveredIndex === i;

        return (
          <div
            key={i}
            className="relative flex flex-col items-center justify-end flex-1 h-full group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* HOVER TOOLTIP */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-9 bg-ink-950 text-white text-[11px] font-mono font-bold py-1 px-2.5 rounded-lg shadow-pop z-20 whitespace-nowrap border border-white/10"
              >
                {val}%
              </motion.div>
            )}

            {/* BAR CONTAINER */}
            <div className="w-full flex flex-col justify-end items-center h-full pb-1">
              <motion.div
                initial={{ height: '0%' }}
                animate={{ height: `${percentage}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[48px] rounded-t-xl transition-all duration-200 shadow-xs relative overflow-hidden flex items-start justify-center pt-1.5"
                style={{
                  background: barBg,
                  opacity: hoveredIndex === null || isHovered ? 1 : 0.65,
                }}
              >
                {/* VALUE LABEL INSIDE BAR IF SUFFICIENT HEIGHT */}
                {percentage > 25 && (
                  <span className="text-[10px] font-mono font-bold text-white/95 drop-shadow-xs">
                    {val}%
                  </span>
                )}
              </motion.div>
            </div>

            {/* X-AXIS LABEL */}
            <div className="mt-2 text-xs text-ink-600 font-semibold truncate w-full text-center">
              {labels[i] || `Item ${i + 1}`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
