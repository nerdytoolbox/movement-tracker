interface ProgressProps {
  value: number;
  className?: string;
  color?: string;
}

export function Progress({ value, className = '', color = 'bg-violet-500' }: ProgressProps) {
  return (
    <div className={`bg-zinc-800 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full ${color} transition-all duration-500 rounded-full`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
