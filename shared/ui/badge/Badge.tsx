import React from 'react';
import { cn } from '@/shared/lib';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'grass' | 'coral' | 'sky' | 'yellow';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'neutral',
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      neutral: 'bg-sandstone text-ink-black',
      grass: 'bg-fresh-grass/20 text-ink-black border border-fresh-grass/40',
      coral: 'bg-coral-pop/15 text-coral-pop font-semibold',
      sky: 'bg-sky-pop/15 text-sky-pop font-semibold',
      yellow: 'bg-sunshine-pop/30 text-ink-black',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[13px] font-medium leading-tight',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
