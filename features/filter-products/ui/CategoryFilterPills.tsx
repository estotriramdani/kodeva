'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/shared/lib';

export interface CategoryOption {
  slug: string;
  name: string;
}

export interface CategoryFilterPillsProps {
  categories: CategoryOption[];
  activeCategory?: string;
}

export function CategoryFilterPills({
  categories,
  activeCategory = 'semua',
}: CategoryFilterPillsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'semua') {
      params.delete('kategori');
    } else {
      params.set('kategori', slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const allCategories = [{ slug: 'semua', name: 'Semua Produk' }, ...categories];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => handleSelect(cat.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap cursor-pointer transition-all border',
              isActive
                ? 'bg-ink-black text-pure-white border-ink-black'
                : 'bg-pure-white text-ink-black border-hairline-mist hover:border-ink-black/30'
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
