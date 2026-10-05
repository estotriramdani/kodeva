'use client';

import { useEffect, useRef } from 'react';
import { trackViewItem } from '@/shared/lib/analytics';
import type { Product } from '@/entities/product';

export function ProductViewTracker({ product }: { product: Product }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    const lowestPrice =
      product.plans && product.plans.length > 0
        ? Math.min(...product.plans.map((p) => p.promo_price || p.price))
        : 0;

    trackViewItem({
      itemId: product.slug,
      itemName: product.name,
      category: product.category?.name,
      price: lowestPrice,
    });
  }, [product.slug, product.name, product.category, product.plans]);

  return null;
}
