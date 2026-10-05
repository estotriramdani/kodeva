import React from 'react';
import { cn } from '@/shared/lib';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost-pill' | 'coral-pill' | 'grass-pill' | 'circle-icon';
  size?: 'sm' | 'md' | 'lg';
  dotColor?: 'sky' | 'grass' | 'coral' | 'yellow';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'ghost-pill',
      size = 'md',
      dotColor,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Ukuran standar
    const sizeClasses = {
      sm: 'px-4 py-2 text-[14px]',
      md: 'px-5 py-[11px] text-[15px]',
      lg: 'px-7 py-3.5 text-[17px]',
    };

    // Varian sesuai STYLES.md
    const variantClasses = {
      'ghost-pill':
        'bg-pure-white text-ink-black border border-ink-black/10 hover:border-ink-black/30 rounded-pill font-medium shadow-none transition-all duration-150',
      'coral-pill':
        'bg-coral-pop text-pure-white hover:bg-coral-pop/90 rounded-pill font-medium shadow-none transition-all duration-150',
      'grass-pill':
        'bg-fresh-grass text-ink-black hover:bg-fresh-grass/90 rounded-pill font-medium shadow-none transition-all duration-150',
      'circle-icon':
        'w-10 h-10 rounded-full bg-fresh-grass text-ink-black flex items-center justify-center p-0 transition-transform active:scale-95 hover:bg-fresh-grass/90',
    };

    // Dot indikator aksi di sisi kanan
    const dotClasses = {
      sky: 'bg-sky-pop',
      grass: 'bg-fresh-grass',
      coral: 'bg-coral-pop',
      yellow: 'bg-sunshine-pop',
    };

    if (variant === 'circle-icon') {
      return (
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            'inline-flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
            variantClasses['circle-icon'],
            className
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2.5 cursor-pointer leading-none disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {dotColor && (
          <span
            className={cn('w-2.5 h-2.5 rounded-full inline-block shrink-0', dotClasses[dotColor])}
            aria-hidden="true"
          />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
