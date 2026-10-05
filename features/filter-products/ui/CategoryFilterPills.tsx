'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const distance = 260;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -distance : distance,
        behavior: 'smooth',
      });
    }
  };

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
    <div className="relative flex items-center w-full">
      {/* Tombol Geser Kiri */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Geser kategori ke kiri"
          className="shrink-0 z-10 mr-1.5 w-9 h-9 rounded-full bg-pure-white border border-hairline-mist hover:border-ink-black/40 text-ink-black shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Container List Kategori */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth flex-1"
      >
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleSelect(cat.slug)}
              className={cn(
                'px-4 py-2 rounded-full text-[14px] font-medium whitespace-nowrap cursor-pointer transition-all border shrink-0',
                isActive
                  ? 'bg-ink-black text-pure-white border-ink-black shadow-xs'
                  : 'bg-pure-white text-ink-black border-hairline-mist hover:border-ink-black/30'
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Tombol Geser Kanan */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Geser kategori ke kanan"
          className="shrink-0 z-10 ml-1.5 w-9 h-9 rounded-full bg-pure-white border border-hairline-mist hover:border-ink-black/40 text-ink-black shadow-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
