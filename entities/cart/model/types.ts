import type { PlanTier } from '@/entities/product';

export interface CartItem {
  id: string; // e.g. `${productId}_${planTier}`
  productId: string;
  productSlug: string;
  productName: string;
  productThumbnail?: string | null;
  planId: string;
  planTier: PlanTier;
  planName: string;
  unitName: string;
  price: number;
  promoPrice?: number | null;
  effectivePrice: number;
  quantity: number;
  promoQuotaRemaining: number;
}

export interface QuotaViolation {
  productId: string;
  productName: string;
  quotaRemaining: number;
  requestedTotal: number;
  excess: number;
}

export interface QuotaValidationResult {
  isValid: boolean;
  violations: QuotaViolation[];
}

export interface CartSummary {
  totalItems: number; // total unit/lisensi
  totalUniqueProducts: number;
  originalSubtotal: number;
  discountTotal: number;
  grandTotal: number;
}
