'use client';

import React from 'react';
import { useCart } from '@/entities/cart';
import { formatIDR } from '@/shared/lib';

export function FloatingCartButton() {
  const { isHydrated, summary, setDrawerOpen } = useCart();

  if (!isHydrated || summary.totalItems === 0) {
    return null;
  }

  return (
    <aside aria-label="Akses Cepat Keranjang" className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setDrawerOpen(true)}
        className="group flex items-center gap-3 bg-ink-black text-pure-white px-5 py-3.5 rounded-[50px] border border-hairline-mist shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label={`Buka Keranjang: ${summary.totalItems} unit lisensi`}
      >
        <div className="relative flex items-center justify-center">
          <span className="text-xl">🛒</span>
          <span className="absolute -top-2 -right-2 bg-coral-pop text-pure-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-ink-black">
            {summary.totalItems}
          </span>
        </div>

        <div className="text-left hidden sm:block">
          <span className="text-[11px] text-pure-white/70 block leading-none">
            Keranjang Lisensi
          </span>
          <span className="text-[14px] font-semibold text-sunshine-yellow leading-tight">
            {formatIDR(summary.grandTotal)}
          </span>
        </div>
      </button>
    </aside>
  );
}
