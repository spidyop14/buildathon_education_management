import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'cobalt' | 'sage' | 'amber' | 'rose';
}

export function Badge({ tone = 'neutral', className, children, ...props }: BadgeProps) {
  const toneClasses = {
    neutral: 'bg-ink-100 text-ink-600',
    cobalt: 'bg-cobalt-50 text-cobalt-600 ring-1 ring-inset ring-cobalt-100',
    sage: 'bg-sage-50 text-sage-600 ring-1 ring-inset ring-sage-100',
    amber: 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100',
    rose: 'bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-100'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
