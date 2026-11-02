import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'live' | 'purple' | 'fuchsia' | 'token' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
  const variants = {
    live: 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold tracking-wider uppercase',
    purple: 'bg-purple-900/30 text-purple-300 border border-purple-500/30',
    fuchsia: 'bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-500/30',
    token: 'bg-amber-950/40 text-amber-300 border border-amber-500/40 font-semibold',
    success: 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-950/30 text-amber-200 border border-amber-500/30',
    danger: 'bg-rose-950/40 text-rose-300 border border-rose-500/30',
    neutral: 'bg-zinc-800/80 text-zinc-300 border border-zinc-700/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-xs select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === 'live' && (
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse-live" />
      )}
      {children}
    </span>
  );
}
