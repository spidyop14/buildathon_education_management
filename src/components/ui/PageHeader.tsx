import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-row items-end justify-between pb-6", className)}>
      <div>
        <h1 className="text-xl font-display font-semibold text-ink-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-500 mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  );
}
