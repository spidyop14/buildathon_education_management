import React from 'react';
import { cn } from '@/lib/utils';
import { Icon, IconName } from './Icon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconName;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
              <Icon name={icon} size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400",
              "focus:outline-none focus:ring-2 focus:ring-cobalt-300 focus:border-cobalt-500 transition-shadow",
              "disabled:opacity-50 disabled:bg-ink-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              error && "border-rose-300 focus:ring-rose-200 focus:border-rose-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-rose-500">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
