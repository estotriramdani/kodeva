'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, CartSummary, QuotaValidationResult, QuotaViolation } from './types';

export interface AddItemInput {
  productId: string;
  productSlug: string;
  productName: string;
  productThumbnail?: string | null;
  planId: string;
  planTier: CartItem['planTier'];
  planName: string;
  unitName: string;
  price: number;
  promoPrice?: number | null;
  quantity: number;
  promoQuotaRemaining: number;
}

export interface CartStoreState {
  items: CartItem[];
  isDrawerOpen: boolean;
  hasHydrated: boolean;

  // Actions
  addItem: (item: AddItemInput) => { success: boolean; error?: string };
  updateQuantity: (itemId: string, quantity: number) => { success: boolean; error?: string };
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setHasHydrated: (hydrated: boolean) => void;

  // Helper Getters
  getSummary: () => CartSummary;
  validateQuotas: () => QuotaValidationResult;
  getProductTotalQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      hasHydrated: false,

      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
      setDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      getProductTotalQuantity: (productId: string) => {
        const { items } = get();
        return items
          .filter((item) => item.productId === productId)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      addItem: (input: AddItemInput) => {
        const { items } = get();
        const itemId = `${input.productId}_${input.planTier}`;
        const existingItem = items.find((i) => i.id === itemId);

        // Akumulasi kuantitas untuk produk yang sama di luar item ini
        const otherQuantityForProduct = items
          .filter((i) => i.productId === input.productId && i.id !== itemId)
          .reduce((sum, i) => sum + i.quantity, 0);

        const currentItemQuantity = existingItem ? existingItem.quantity : 0;
        const requestedTotalForProduct = otherQuantityForProduct + currentItemQuantity + input.quantity;

        // VALIDASI ATURAN KRITIS 4: Total lisensi seluruh tier produk <= sisa kuota promo
        if (input.promoQuotaRemaining > 0 && requestedTotalForProduct > input.promoQuotaRemaining) {
          const excess = requestedTotalForProduct - input.promoQuotaRemaining;
          return {
            success: false,
            error: `Total pesanan lisensi untuk ${input.productName} (${requestedTotalForProduct} lisensi) melebihi sisa kuota promo (${input.promoQuotaRemaining} lisensi). Kurangi ${excess} lisensi untuk melanjutkan.`,
          };
        }

        const effectivePrice =
          input.promoPrice && input.promoPrice > 0 ? input.promoPrice : input.price;

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    quantity: i.quantity + input.quantity,
                    effectivePrice,
                    price: input.price,
                    promoPrice: input.promoPrice,
                    promoQuotaRemaining: input.promoQuotaRemaining,
                  }
                : i
            ),
            isDrawerOpen: true,
          });
        } else {
          const newItem: CartItem = {
            id: itemId,
            productId: input.productId,
            productSlug: input.productSlug,
            productName: input.productName,
            productThumbnail: input.productThumbnail,
            planId: input.planId,
            planTier: input.planTier,
            planName: input.planName,
            unitName: input.unitName,
            price: input.price,
            promoPrice: input.promoPrice,
            effectivePrice,
            quantity: input.quantity,
            promoQuotaRemaining: input.promoQuotaRemaining,
          };
          set({
            items: [...items, newItem],
            isDrawerOpen: true,
          });
        }

        return { success: true };
      },

      updateQuantity: (itemId: string, newQuantity: number) => {
        const { items } = get();
        const targetItem = items.find((i) => i.id === itemId);
        if (!targetItem) return { success: false, error: 'Item tidak ditemukan di keranjang.' };

        if (newQuantity <= 0) {
          set({ items: items.filter((i) => i.id !== itemId) });
          return { success: true };
        }

        // Cek kuota promo produk lintas tier
        const otherQuantityForProduct = items
          .filter((i) => i.productId === targetItem.productId && i.id !== itemId)
          .reduce((sum, i) => sum + i.quantity, 0);

        const requestedTotalForProduct = otherQuantityForProduct + newQuantity;

        if (
          targetItem.promoQuotaRemaining > 0 &&
          requestedTotalForProduct > targetItem.promoQuotaRemaining
        ) {
          const excess = requestedTotalForProduct - targetItem.promoQuotaRemaining;
          return {
            success: false,
            error: `Total lisensi produk ${targetItem.productName} melebihi sisa kuota promo ${targetItem.promoQuotaRemaining} (kelebihan ${excess} lisensi).`,
          };
        }

        set({
          items: items.map((i) =>
            i.id === itemId ? { ...i, quantity: newQuantity } : i
          ),
        });

        return { success: true };
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getSummary: (): CartSummary => {
        const { items } = get();
        let totalItems = 0;
        let originalSubtotal = 0;
        let grandTotal = 0;
        const uniqueProductIds = new Set<string>();

        for (const item of items) {
          totalItems += item.quantity;
          uniqueProductIds.add(item.productId);
          originalSubtotal += item.price * item.quantity;
          grandTotal += item.effectivePrice * item.quantity;
        }

        const discountTotal = Math.max(0, originalSubtotal - grandTotal);

        return {
          totalItems,
          totalUniqueProducts: uniqueProductIds.size,
          originalSubtotal,
          discountTotal,
          grandTotal,
        };
      },

      validateQuotas: (): QuotaValidationResult => {
        const { items } = get();
        const productMap = new Map<
          string,
          { productName: string; quota: number; totalQty: number }
        >();

        for (const item of items) {
          const existing = productMap.get(item.productId);
          if (existing) {
            existing.totalQty += item.quantity;
          } else {
            productMap.set(item.productId, {
              productName: item.productName,
              quota: item.promoQuotaRemaining,
              totalQty: item.quantity,
            });
          }
        }

        const violations: QuotaViolation[] = [];

        for (const [productId, info] of productMap.entries()) {
          if (info.quota > 0 && info.totalQty > info.quota) {
            violations.push({
              productId,
              productName: info.productName,
              quotaRemaining: info.quota,
              requestedTotal: info.totalQty,
              excess: info.totalQty - info.quota,
            });
          }
        }

        return {
          isValid: violations.length === 0,
          violations,
        };
      },
    }),
    {
      name: 'kodeva_cart_v1',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
);
