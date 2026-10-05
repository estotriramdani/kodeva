import React from 'react';
import { Container } from '@/shared/ui';
import { ProductCard, type Product } from '@/entities/product';
import type { Category } from '@/entities/category';
import { CategoryFilterPills, ProductSearchBar } from '@/features/filter-products';
import { ClaimPromoButton } from '@/features/claim-promo';

export interface ProductCatalogPageProps {
  products: Product[];
  categories: Category[];
  activeCategory?: string;
  searchQuery?: string;
}

export function ProductCatalogPage({
  products,
  categories,
  activeCategory = 'semua',
  searchQuery = '',
}: ProductCatalogPageProps) {
  return (
    <div className="py-10 sm:py-16">
      <Container>
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-[36px] sm:text-[53px] font-medium text-ink-black leading-tight tracking-tight">
            Katalog Software & Solusi Bisnis
          </h1>
          <p className="text-[17px] sm:text-[19px] text-stone-gray mt-3 leading-relaxed">
            Pilih software yang tepat untuk kebutuhan akuntansi, kasir, inventori, ERP, hingga HRIS perusahaan Anda.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-hairline-mist">
          <CategoryFilterPills
            categories={categories}
            activeCategory={activeCategory}
          />
          <ProductSearchBar defaultValue={searchQuery} />
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                actionSlot={
                  product.promo_quota_remaining > 0 ? (
                    <ClaimPromoButton
                      productName={product.name}
                      quotaRemaining={product.promo_quota_remaining}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-pure-white rounded-[50px] p-8 border border-hairline-mist max-w-xl mx-auto">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-[22px] font-medium text-ink-black mb-2">
              Tidak Ada Produk yang Sesuai
            </h3>
            <p className="text-[15px] text-stone-gray leading-relaxed">
              Coba gunakan kata kunci lain atau pilih kategori produk yang berbeda.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
