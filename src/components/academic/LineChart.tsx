import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface LineChartProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function LineChart({ data, width = 400, height = 160, color = '#4361EE', className }: LineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0); 
  const range = maxVal - minVal;

  const padding = 20;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * usableWidth;
    const y = padding + usableHeight - ((val - minVal) / (range || 1)) * usableHeight;
    return { x, y, val };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const polygonPoints = `${points[0].x},${height} ${polylinePoints} ${points[points.length - 1].x},${height}`;

  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <polygon
          points={polygonPoints}
          fill={`url(#gradient-${color.replace('#', '')})`}
          className="anim-fadeUp opacity-0"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        />

        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="draw-line"
        />

        {points.map((p, i) => (
          <g 
            key={i} 
            onMouseEnter={() => setHoveredIndex(i)} 
            onMouseLeave={() => setHoveredIndex(null)}
            className="cursor-crosshair anim-fadeUp opacity-0"
            style={{ animationDelay: `${0.5 + i * 0.05}s`, animationFillMode: 'forwards' }}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? 5 : 3.5}
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="transition-all duration-200"
            />
          </g>
        ))}
      </svg>

      {hoveredIndex !== null && (
        <div
          className="absolute pointer-events-none bg-ink-900 text-white text-xs font-mono py-1 px-2 rounded shadow-pop z-10 whitespace-nowrap -translate-x-1/2 -translate-y-full"
          style={{
            left: points[hoveredIndex].x,
            top: points[hoveredIndex].y - 8
          }}
        >
          {points[hoveredIndex].val}
        </div>
      )}
    </div>
  );
}
