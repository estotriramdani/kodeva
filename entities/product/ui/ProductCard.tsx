import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge, Button } from '@/shared/ui';
import { formatIDR } from '@/shared/lib';
import type { Product } from '../model/types';
import { PromoQuotaBadge } from './PromoQuotaBadge';

export interface ProductCardProps {
  product: Product;
  actionSlot?: React.ReactNode;
}

export function ProductCard({ product, actionSlot }: ProductCardProps) {
  // Hitung harga termurah dari paket yang ada
  const lowestPrice = product.plans && product.plans.length > 0
    ? Math.min(...product.plans.map((p) => p.promo_price || p.price))
    : null;

  return (
    <Card
      surface="white"
      className="flex flex-col justify-between h-full group hover:border-ink-black/20 transition-all border border-transparent"
    >
      <div>
        {/* Header Kartu: Kategori & Promo */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {product.category ? (
            <Badge variant="neutral">{product.category.name}</Badge>
          ) : (
            <span />
          )}
          <PromoQuotaBadge quota={product.promo_quota_remaining} />
        </div>

        {/* Thumbnail / Ilustrasi */}
        <div className="relative w-full h-44 rounded-[30px] bg-cream-paper overflow-hidden mb-5 flex items-center justify-center">
          {product.thumbnail_url ? (
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-stone-gray/40 text-4xl font-bold uppercase tracking-wider select-none">
              {product.name.slice(0, 2)}
            </div>
          )}
        </div>

        {/* Informasi Produk */}
        <h3 className="text-[24px] font-medium text-ink-black leading-snug group-hover:text-ink-black/80 transition-colors">
          <Link href={`/produk/${product.slug}`}>{product.name}</Link>
        </h3>

        {product.tagline && (
          <p className="text-[15px] text-stone-gray mt-2 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        )}

        {/* Ringkasan Fitur Unggulan */}
        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="text-[12px] bg-sandstone/60 text-ink-black px-2.5 py-1 rounded-[8px]"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Kartu: Harga & Tombol Aksi */}
      <div className="pt-6 mt-6 border-t border-hairline-mist/50 flex items-center justify-between gap-3">
        <div>
          <span className="text-[12px] text-stone-gray block">Mulai dari</span>
          <span className="text-[18px] font-semibold text-ink-black">
            {lowestPrice ? `${formatIDR(lowestPrice)}` : 'Hubungi Kami'}
          </span>
          {lowestPrice && (
            <span className="text-[12px] text-stone-gray font-normal"> /bln</span>
          )}
        </div>

        <div>
          {actionSlot ? (
            actionSlot
          ) : (
            <Link href={`/produk/${product.slug}`}>
              <Button size="sm" variant="ghost-pill" dotColor="grass">
                Detail
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
