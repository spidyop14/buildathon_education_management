import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-ink-900 text-white hover:bg-ink-800 shadow-xs',
    accent: 'bg-gradient-cobalt text-white hover:shadow-glow shadow-xs',
    secondary: 'bg-white text-ink-800 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 shadow-xs',
    ghost: 'text-ink-600 hover:text-ink-900 hover:bg-ink-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-6 py-3'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <Icon name={icon as any} className={cn(size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />}
      {children}
    </button>
  );
}
