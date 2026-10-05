import React from 'react';
import { Badge } from '@/shared/ui';

interface PromoQuotaBadgeProps {
  quota: number;
  className?: string;
}

export function PromoQuotaBadge({ quota, className }: PromoQuotaBadgeProps) {
  if (quota <= 0) return null;

  return (
    <Badge variant="coral" className={className}>
      Sisa Promo: {quota} Kuota
    </Badge>
  );
}
