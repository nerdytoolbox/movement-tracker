import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50',
        {
          'bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-500/25': variant === 'primary',
          'bg-zinc-800 text-zinc-100 hover:bg-zinc-700': variant === 'secondary',
          'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800': variant === 'ghost',
          'bg-red-500/20 text-red-400 hover:bg-red-500/30': variant === 'danger',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2.5 text-base': size === 'md',
          'px-6 py-3.5 text-lg': size === 'lg',
          'px-8 py-5 text-xl w-full': size === 'xl',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
