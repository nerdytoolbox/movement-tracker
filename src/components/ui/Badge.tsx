import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'green' | 'blue' | 'orange' | 'zinc';
}

export function Badge({ children, variant = 'zinc' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      {
        'bg-violet-500/20 text-violet-300': variant === 'purple',
        'bg-emerald-500/20 text-emerald-300': variant === 'green',
        'bg-blue-500/20 text-blue-300': variant === 'blue',
        'bg-orange-500/20 text-orange-300': variant === 'orange',
        'bg-zinc-700 text-zinc-300': variant === 'zinc',
      }
    )}>
      {children}
    </span>
  );
}
