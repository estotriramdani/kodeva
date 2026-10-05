'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from './cart-store';

export function useCart() {
  const [mounted, setMounted] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    setMounted(true);
    store.setHasHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated: mounted,
    items: mounted ? store.items : [],
    summary: mounted
      ? store.getSummary()
      : {
          totalItems: 0,
          totalUniqueProducts: 0,
          originalSubtotal: 0,
          discountTotal: 0,
          grandTotal: 0,
        },
    validation: mounted ? store.validateQuotas() : { isValid: true, violations: [] },
  };
}
