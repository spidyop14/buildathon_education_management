import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'dark';
  hover?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function Card({ variant = 'default', hover, className, onClick, children, ...props }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'transition-all duration-200',
        variant === 'default' && 'bg-white border border-ink-150 rounded-2xl shadow-card',
        variant === 'elevated' && 'bg-white border border-ink-150/60 rounded-2xl shadow-elevated',
        variant === 'glass' && 'glass border border-white/20 rounded-2xl',
        variant === 'dark' && 'bg-gradient-ai border border-white/[0.06] rounded-2xl text-white shadow-inner-glow',
        hover && 'card-hover-lift cursor-pointer',
        hover && variant === 'dark' && 'hover:border-white/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
