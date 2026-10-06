'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ShoppingBag, Zap } from 'lucide-react';
import type { Product, ProductPlan, PlanTier } from '@/entities/product';
import { useCart } from '@/entities/cart';
import { formatIDR } from '@/shared/lib';
import { Button, Badge } from '@/shared/ui';
import { trackAddToCart, trackBeginCheckout } from '@/shared/lib/analytics';

const tierLabels: Record<PlanTier, string> = {
  basic: 'Paket Basic',
  pro: 'Paket Pro',
  business: 'Paket Business',
};

export interface ProductOrderConfiguratorProps {
  product: Product;
}

export function ProductOrderConfigurator({ product }: ProductOrderConfiguratorProps) {
  const router = useRouter();
  const { addItem, getProductTotalQuantity, setDrawerOpen } = useCart();

  const plans = product.plans || [];
  // Default ke 'pro' jika ada, atau paket pertama
  const defaultPlan = plans.find((p) => p.tier === 'pro') || plans[0];
  const [selectedTier, setSelectedTier] = useState<PlanTier>(
    (defaultPlan?.tier as PlanTier) || 'pro'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedPlan: ProductPlan | undefined =
    plans.find((p) => p.tier === selectedTier) || defaultPlan;

  if (!selectedPlan) return null;

  const baseMonthlyPrice = selectedPlan.promo_price || selectedPlan.price;
  const effectiveMonthlyPrice = billingCycle === 'yearly' ? Math.round(baseMonthlyPrice * 0.8) : baseMonthlyPrice;
  const currentPrice = billingCycle === 'yearly' ? effectiveMonthlyPrice * 12 : effectiveMonthlyPrice;
  const regularPeriodPrice = billingCycle === 'yearly' ? selectedPlan.price * 12 : selectedPlan.price;
  const originalTotalPrice = regularPeriodPrice * quantity;
  const totalPrice = currentPrice * quantity;
  const totalSavings = originalTotalPrice > totalPrice ? originalTotalPrice - totalPrice : 0;
  const cycleLabel = billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan';
  const planDisplayName = `${tierLabels[selectedPlan.tier] || selectedPlan.tier} (${cycleLabel})`;

  // Cek akumulasi kuantitas produk lintas tier yang sudah ada di keranjang
  const existingCartQty = getProductTotalQuantity(product.id);
  const requestedCombinedTotal = existingCartQty + quantity;
  const quotaLimit = product.promo_quota_remaining;
  const isQuotaExceeded = quotaLimit > 0 && requestedCombinedTotal > quotaLimit;

  const handleAddToCart = (directCheckout = false) => {
    setErrorMessage(null);

    const res = addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productThumbnail: product.thumbnail_url,
      planId: `${selectedPlan.id}_${billingCycle}`,
      planTier: selectedPlan.tier,
      planName: planDisplayName,
      unitName: `${selectedPlan.unit}/${cycleLabel.toLowerCase()}`,
      price: regularPeriodPrice,
      promoPrice: currentPrice,
      quantity,
      promoQuotaRemaining: quotaLimit,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Gagal menambahkan lisensi ke keranjang.');
      return;
    }

    trackAddToCart({
      itemId: `${product.slug}_${selectedPlan.tier}`,
      itemName: product.name,
      planTier: selectedPlan.tier,
      category: product.category?.name,
      price: currentPrice,
      quantity,
    });

    if (directCheckout) {
      trackBeginCheckout({
        value: totalPrice,
        items: [
          {
            itemId: `${product.slug}_${selectedPlan.tier}`,
            itemName: `${product.name} (${planDisplayName})`,
            price: currentPrice,
            quantity,
          },
        ],
      });
      setDrawerOpen(false);
      router.push('/checkout');
    }
  };

  return (
    <div className="bg-pure-white rounded-[40px] p-6 sm:p-8 border border-hairline-mist shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-hairline-mist">
        <div>
          <span className="text-[12px] font-semibold text-fresh-grass uppercase tracking-wider block">
            Konfigurasi Lisensi Langganan
          </span>
          <h3 className="text-[22px] font-medium text-ink-black mt-0.5">
            Pilih Paket & Jumlah Lisensi
          </h3>
        </div>

        {quotaLimit > 0 && (
          <Badge variant={isQuotaExceeded ? 'coral' : 'neutral'}>
            Sisa Kuota Promo: {quotaLimit} Lisensi
          </Badge>
        )}
      </div>

      {/* Durasi Langganan: Bulanan vs Tahunan (Bonus Requirement) */}
      <div className="mb-6">
        <label className="text-[13px] font-semibold text-stone-gray block mb-2.5">
          1. PILIH DURASI TAGIHAN:
        </label>
        <div className="flex items-center p-1.5 bg-cream-paper rounded-full border border-hairline-mist max-w-sm">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-2 px-4 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-ink-black text-pure-white shadow-xs'
                : 'text-stone-gray hover:text-ink-black'
            }`}
          >
            Tagihan Bulanan
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`flex-1 py-2 px-4 rounded-full text-[13px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-ink-black text-pure-white shadow-xs'
                : 'text-stone-gray hover:text-ink-black'
            }`}
          >
            <span>Tahunan</span>
            <span className="text-[10px] bg-sunshine-yellow text-ink-black px-1.5 py-0.5 rounded-full font-bold">
              Hemat 20%
            </span>
          </button>
        </div>
      </div>

      {/* 2. Selector Pilihan Paket (Basic, Pro, Business) */}
      <div className="mb-6">
        <label className="text-[13px] font-semibold text-stone-gray block mb-3">
          2. PILIH TINGKATAN PAKET:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {plans.map((plan) => {
            const isSelected = plan.tier === selectedTier;
            const planBaseMonthly = plan.promo_price || plan.price;
            const planEffectiveMonthly = billingCycle === 'yearly' ? Math.round(planBaseMonthly * 0.8) : planBaseMonthly;
            const displayName = tierLabels[plan.tier] || plan.tier;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => {
                  setSelectedTier(plan.tier as PlanTier);
                  setErrorMessage(null);
                }}
                className={`p-4 rounded-[24px] text-left transition-all border text-ink-black cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cream-paper border-ink-black ring-2 ring-ink-black/10'
                    : 'bg-pure-white border-hairline-mist hover:border-ink-black/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[14px] font-bold uppercase tracking-tight">
                      {displayName}
                    </span>
                    {plan.tier === 'pro' && (
                      <span className="text-[10px] bg-sunshine-yellow text-ink-black px-2 py-0.5 rounded-full font-bold">
                        Populer
                      </span>
                    )}
                  </div>
                  <div className="text-[18px] font-bold text-ink-black mt-1">
                    {formatIDR(planEffectiveMonthly)}
                  </div>
                  <span className="text-[11px] text-stone-gray block">
                    /{plan.unit}/bulan
                  </span>
                  {billingCycle === 'yearly' && (
                    <span className="text-[10px] text-stone-gray/80 block mt-0.5">
                      ditagih {formatIDR(planEffectiveMonthly * 12)}/tahun
                    </span>
                  )}
                </div>

                {billingCycle === 'yearly' ? (
                  <div className="mt-2 text-[11px] text-fresh-grass font-semibold">
                    Hemat 20% (Setara 2 Bln Gratis)
                  </div>
                ) : plan.promo_price && plan.promo_price < plan.price ? (
                  <div className="mt-2 text-[11px] text-fresh-grass font-semibold">
                    Hemat {formatIDR(plan.price - plan.promo_price)}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Jumlah Unit / Outlet / User Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[13px] font-semibold text-stone-gray block">
            3. JUMLAH LISENSI / {selectedPlan.unit.toUpperCase()}:
          </label>
          {existingCartQty > 0 && (
            <span className="text-[12px] text-stone-gray">
              Sudah ada di keranjang: <strong>{existingCartQty} unit</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 bg-cream-paper/60 p-3 rounded-[24px] border border-hairline-mist max-w-xs">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-full bg-pure-white hover:bg-sandstone flex items-center justify-center font-bold text-lg text-ink-black border border-hairline-mist transition-colors cursor-pointer"
            aria-label="Kurangi kuantitas"
          >
            -
          </button>
          <div className="flex-1 text-center">
            <span className="text-[20px] font-bold text-ink-black">{quantity}</span>
            <span className="text-[12px] text-stone-gray block">
              {selectedPlan.unit}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (quotaLimit > 0 && requestedCombinedTotal + 1 > quotaLimit) {
                setErrorMessage(
                  `Maksimal kuota promo produk ${product.name} tersisa ${quotaLimit} lisensi!`
                );
                return;
              }
              setQuantity(quantity + 1);
              setErrorMessage(null);
            }}
            className="w-10 h-10 rounded-full bg-pure-white hover:bg-sandstone flex items-center justify-center font-bold text-lg text-ink-black border border-hairline-mist transition-colors cursor-pointer"
            aria-label="Tambah kuantitas"
          >
            +
          </button>
        </div>
      </div>

      {/* Quota Overflow Error Alert */}
      {(isQuotaExceeded || errorMessage) && (
        <div className="mb-6 p-4 rounded-[20px] bg-coral-pop/10 border border-coral-pop/30 text-coral-pop text-[13px] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Peringatan Kuota Promo:</strong>{' '}
            {errorMessage ||
              `Kombinasi lisensi di keranjang (${existingCartQty}) + pesanan baru (${quantity}) = ${requestedCombinedTotal} lisensi, melebihi sisa kuota promo (${quotaLimit}).`}
          </div>
        </div>
      )}

      {/* 4. Ringkasan Kalkulasi Harga Seketika */}
      <div className="bg-sandstone/30 rounded-[24px] p-5 mb-6 border border-hairline-mist/60 space-y-2">
        <div className="flex justify-between text-[14px] text-stone-gray">
          <span>Paket Terpilih:</span>
          <span className="font-semibold text-ink-black">
            {planDisplayName} ({quantity} {selectedPlan.unit})
          </span>
        </div>
        <div className="flex justify-between text-[14px] text-stone-gray">
          <span>Harga Satuan:</span>
          <span>{formatIDR(currentPrice)}</span>
        </div>
        {totalSavings > 0 && (
          <div className="flex justify-between text-[14px] text-fresh-grass font-medium">
            <span>Total Hemat Promo:</span>
            <span>- {formatIDR(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between text-[20px] font-bold text-ink-black pt-3 border-t border-hairline-mist">
          <span>Total Investasi:</span>
          <span className="text-fresh-grass">{formatIDR(totalPrice)}</span>
        </div>
      </div>

      {/* 5. Tombol Aksi Keranjang & Checkout Langsung */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="ghost-pill"
          size="lg"
          dotColor="grass"
          disabled={isQuotaExceeded}
          onClick={() => handleAddToCart(false)}
          className="flex-1 justify-center py-3.5 inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Tambah ke Keranjang</span>
        </Button>
        <Button
          variant="coral-pill"
          size="lg"
          disabled={isQuotaExceeded}
          onClick={() => handleAddToCart(true)}
          className="flex-1 justify-center py-3.5 inline-flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          <span>Beli Sekarang</span>
        </Button>
      </div>
    </div>
  );
}
