import React from 'react';
import { cn } from '@/shared/lib';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  surface?: 'white' | 'sandstone' | 'cream';
  hasBorder?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      surface = 'white',
      hasBorder = false,
      children,
      ...props
    },
    ref
  ) => {
    const surfaceClasses = {
      white: 'bg-pure-white text-ink-black',
      sandstone: 'bg-sandstone text-ink-black',
      cream: 'bg-cream-paper text-ink-black',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[50px] p-[21px] transition-colors',
          surfaceClasses[surface],
          hasBorder && 'border border-hairline-mist',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
