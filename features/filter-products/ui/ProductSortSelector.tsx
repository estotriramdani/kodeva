'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export interface ProductSortSelectorProps {
  activeSort?: string;
}

export function ProductSortSelector({ activeSort = 'default' }: ProductSortSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val === 'default') {
      params.delete('sort');
    } else {
      params.set('sort', val);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative flex items-center shrink-0">
      <div className="relative flex items-center bg-pure-white rounded-full border border-hairline-mist px-3 py-1.5 hover:border-ink-black/30 transition-colors shadow-xs">
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-gray mr-2 shrink-0" />
        <span className="text-[12px] text-stone-gray mr-1 hidden sm:inline">Urutkan:</span>
        <select
          value={activeSort}
          onChange={handleSortChange}
          aria-label="Urutkan Produk"
          className="text-[13px] font-medium text-ink-black bg-transparent border-none outline-hidden cursor-pointer pr-1"
        >
          <option value="default">Unggulan</option>
          <option value="price-asc">Harga: Termurah</option>
          <option value="price-desc">Harga: Tertinggi</option>
        </select>
      </div>
    </div>
  );
}
