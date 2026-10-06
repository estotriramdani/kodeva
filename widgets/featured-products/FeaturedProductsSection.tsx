'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Button } from '@/shared/ui';
import { ProductCard, type Product } from '@/entities/product';
import { ClaimPromoButton } from '@/features/claim-promo';
import { trackLandingCta } from '@/shared/lib/analytics';

export interface FeaturedProductsSectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export function FeaturedProductsSection({
  products,
  title = 'Produk SaaS Unggulan Pilihan',
  subtitle = 'Solusi software teruji untuk efisiensi operasional dan pertumbuhan bisnis Anda.',
}: FeaturedProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-[32px] sm:text-[44px] font-medium text-ink-black leading-tight tracking-tight">
              {title}
            </h2>
            <p className="text-[16px] sm:text-[18px] text-stone-gray mt-2 max-w-xl">
              {subtitle}
            </p>
          </div>
          <Link
            href="/produk"
            onClick={() =>
              trackLandingCta('Lihat Semua Produk', 'featured_products_section', '/produk')
            }
          >
            <Button variant="ghost-pill" size="md" dotColor="grass">
              Lihat Semua Produk
            </Button>
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              actionSlot={
                product.promo_quota_remaining > 0 ? (
                  <ClaimPromoButton
                    productName={product.name}
                    productId={product.id}
                    quotaRemaining={product.promo_quota_remaining}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
