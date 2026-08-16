import React from 'react';
import { Icon, IconName } from './Icon';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-50 mb-4 text-ink-400">
        <Icon name={icon} size={32} />
      </div>
      <h3 className="text-lg font-medium text-ink-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-ink-500 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
