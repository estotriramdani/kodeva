import React from 'react';
import { Badge } from '@/shared/ui';
import type { Category } from '../model/types';

export interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'slug'>;
  variant?: 'neutral' | 'grass' | 'sky';
  className?: string;
}

export function CategoryBadge({
  category,
  variant = 'neutral',
  className,
}: CategoryBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {category.name}
    </Badge>
  );
}
