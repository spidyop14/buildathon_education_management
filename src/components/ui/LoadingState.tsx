import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({ text = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cobalt-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-cobalt-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-cobalt-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      {text && <p className="mt-4 text-sm text-ink-500 font-medium">{text}</p>}
    </div>
  );
}
