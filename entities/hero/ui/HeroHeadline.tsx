import React from 'react';
import { cn } from '@/shared/lib';

export interface HeroHeadlineProps {
  title: string;
  subtitle?: string | null;
  campaignBadge?: string | null;
  className?: string;
  actionSlot?: React.ReactNode;
}

export function HeroHeadline({
  title,
  subtitle,
  campaignBadge,
  className,
  actionSlot,
}: HeroHeadlineProps) {
  return (
    <div className={cn('text-center max-w-5xl mx-auto pt-8 pb-12', className)}>
      {campaignBadge && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[10px] bg-sandstone/80 text-ink-black text-[13px] font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-fresh-grass animate-pulse" />
          <span>{campaignBadge}</span>
        </div>
      )}

      {/* Headline Raksasa Inter Display */}
      <h1 className="text-[48px] sm:text-[72px] lg:text-[110px] xl:text-[132px] font-medium text-ink-black leading-[0.95] tracking-[-0.04em] sm:tracking-[-0.05em] lg:tracking-[-0.06em] text-balance">
        {title}
      </h1>

      {subtitle && (
        <p className="mt-6 text-[18px] sm:text-[20px] text-stone-gray font-normal max-w-2xl mx-auto leading-relaxed text-balance">
          {subtitle}
        </p>
      )}

      {actionSlot && <div className="mt-8 flex justify-center">{actionSlot}</div>}
    </div>
  );
}
