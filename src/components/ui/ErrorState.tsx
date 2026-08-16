import React from 'react';
import { Icon } from './Icon';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'There was a problem loading the data. Please try again.',
  onRetry,
  className 
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 mb-4 text-rose-500">
        <Icon name="alert" size={24} />
      </div>
      <h3 className="text-base font-medium text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-6" icon="arrowRight">
          Try Again
        </Button>
      )}
    </div>
  );
}
