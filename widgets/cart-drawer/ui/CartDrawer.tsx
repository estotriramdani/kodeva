'use client';

import React from 'react';
import Link from 'next/link';
import { X, AlertTriangle, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/entities/cart';
import { formatIDR } from '@/shared/lib';
import { Button, Badge } from '@/shared/ui';
import { trackBeginCheckout } from '@/shared/lib/analytics';

export function CartDrawer() {
  const {
    isDrawerOpen,
    setDrawerOpen,
    items,
    summary,
    validation,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    trackBeginCheckout({
      value: summary.grandTotal,
      items: items.map((i) => ({
        itemId: i.id,
        itemName: `${i.productName} (${i.planName})`,
        price: i.effectivePrice,
        quantity: i.quantity,
      })),
    });
    setDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-ink-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-pure-white h-full shadow-2xl flex flex-col justify-between border-l border-hairline-mist">
        {/* Drawer Header */}
        <div className="p-6 border-b border-hairline-mist flex items-center justify-between bg-cream-paper/40">
          <div>
            <h2 className="text-[20px] font-semibold text-ink-black flex items-center gap-2">
              <span>Keranjang Lisensi</span>
              {isHydrated && items.length > 0 && (
                <Badge variant="coral">{summary.totalItems} unit</Badge>
              )}
            </h2>
            <p className="text-[13px] text-stone-gray mt-0.5">
              Kelola jumlah lisensi dan klaim kuota promo
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup Keranjang"
            className="w-9 h-9 rounded-full bg-sandstone/60 hover:bg-sandstone flex items-center justify-center text-ink-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quota Overflow Warning Box (Critical Requirement 4) */}
        {isHydrated && !validation.isValid && (
          <div className="m-4 p-4 rounded-[20px] bg-coral-pop/10 border border-coral-pop/30 text-ink-black">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-coral-pop shrink-0 mt-0.5" />
              <div className="text-[13px]">
                <strong className="text-coral-pop block mb-1">
                  Kelebihan Kuota Promo Terdeteksi!
                </strong>
                {validation.violations.map((v) => (
                  <p key={v.productId} className="mb-1 leading-snug">
                    Total lisensi <strong>{v.productName}</strong> lintas seluruh paket ({v.requestedTotal} unit) melebihi batas kuota promo ({v.quotaRemaining} unit). Kurangi <strong>{v.excess} unit</strong> agar transaksi dapat diproses.
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Drawer Body / Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isHydrated || items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-sandstone/60 flex items-center justify-center mb-4 text-stone-gray">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-medium text-ink-black">
                Keranjang Belanja Kosong
              </h3>
              <p className="text-[14px] text-stone-gray mt-1 max-w-xs">
                Anda belum menambahkan lisensi software ke keranjang. Jelajahi katalog promo kami.
              </p>
              <Link href="/produk" onClick={() => setDrawerOpen(false)} className="mt-5">
                <Button variant="coral-pill" size="sm">
                  Jelajahi Solusi UMKM
                </Button>
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-[24px] bg-cream-paper/50 border border-hairline-mist flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-[15px] font-medium text-ink-black leading-snug">
                      {item.productName}
                    </h4>
                    <span className="text-[12px] font-semibold text-fresh-grass uppercase tracking-wider block mt-0.5">
                      Paket {item.planName}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label={`Hapus ${item.productName}`}
                    className="text-stone-gray hover:text-coral-pop p-1.5 rounded-full hover:bg-coral-pop/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Price and Quantity Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-hairline-mist/50">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[16px] font-semibold text-ink-black">
                        {formatIDR(item.effectivePrice)}
                      </span>
                      {item.promoPrice && item.promoPrice < item.price && (
                        <span className="text-[12px] text-stone-gray line-through">
                          {formatIDR(item.price)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-gray block">
                      per {item.unitName}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-pure-white rounded-full border border-hairline-mist px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full hover:bg-sandstone flex items-center justify-center font-bold text-ink-black text-sm transition-colors"
                      aria-label="Kurangi lisensi"
                    >
                      -
                    </button>
                    <span className="text-[14px] font-semibold text-ink-black w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        const res = updateQuantity(item.id, item.quantity + 1);
                        if (!res.success && res.error) {
                          alert(res.error);
                        }
                      }}
                      className="w-6 h-6 rounded-full hover:bg-sandstone flex items-center justify-center font-bold text-ink-black text-sm transition-colors"
                      aria-label="Tambah lisensi"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right text-[12px] text-stone-gray">
                  Subtotal: <strong className="text-ink-black">{formatIDR(item.effectivePrice * item.quantity)}</strong>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Summary */}
        {isHydrated && items.length > 0 && (
          <div className="p-6 border-t border-hairline-mist bg-cream-paper/70 space-y-3">
            <div className="space-y-1.5 text-[14px]">
              <div className="flex justify-between text-stone-gray">
                <span>Subtotal Normal:</span>
                <span>{formatIDR(summary.originalSubtotal)}</span>
              </div>
              {summary.discountTotal > 0 && (
                <div className="flex justify-between text-fresh-grass font-medium">
                  <span>Diskon Promo Akhir Tahun:</span>
                  <span>- {formatIDR(summary.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-[18px] font-bold text-ink-black pt-2 border-t border-hairline-mist">
                <span>Total Pembayaran:</span>
                <span>{formatIDR(summary.grandTotal)}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Link href="/checkout" onClick={handleCheckoutClick}>
                <Button
                  variant="coral-pill"
                  size="lg"
                  className="w-full justify-center text-center font-semibold"
                  disabled={!validation.isValid}
                >
                  {validation.isValid
                    ? 'Lanjut ke Checkout'
                    : 'Sesuaikan Kuota untuk Checkout'}
                </Button>
              </Link>
              <button
                onClick={clearCart}
                className="text-[12px] text-stone-gray hover:text-coral-pop text-center underline transition-colors pt-1"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
