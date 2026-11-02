import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'token';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08080c] active:scale-[0.98]';

    const variants = {
      primary: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/30 border border-purple-500/30 focus:ring-purple-500',
      secondary: 'bg-[#181824] hover:bg-[#222232] text-zinc-200 border border-zinc-700/60 hover:border-zinc-500 focus:ring-zinc-500',
      accent: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-md shadow-fuchsia-950/40 focus:ring-fuchsia-500',
      outline: 'bg-transparent border border-zinc-700 hover:border-purple-400 text-zinc-300 hover:text-white hover:bg-purple-950/20 focus:ring-purple-500',
      ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white focus:ring-zinc-600',
      danger: 'bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-500/30 shadow-md shadow-rose-950/30 focus:ring-rose-500',
      token: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-900/30 border border-amber-400/40 focus:ring-amber-400',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
      icon: 'p-2.5 w-10 h-10',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
