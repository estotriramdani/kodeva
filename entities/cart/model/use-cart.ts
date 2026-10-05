'use client';

import { useSyncExternalStore } from 'react';
import { useCartStore } from './cart-store';

const emptySubscribe = () => () => {};

export function useCart() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const store = useCartStore();

  return {
    ...store,
    isHydrated,
    items: isHydrated ? store.items : [],
    summary: isHydrated
      ? store.getSummary()
      : {
          totalItems: 0,
          totalUniqueProducts: 0,
          originalSubtotal: 0,
          discountTotal: 0,
          grandTotal: 0,
        },
    validation: isHydrated ? store.validateQuotas() : { isValid: true, violations: [] },
  };
}
