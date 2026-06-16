import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-3xl p-4',
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : '',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
