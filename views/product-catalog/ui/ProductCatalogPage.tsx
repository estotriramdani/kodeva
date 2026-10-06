import React from 'react';
import { Container } from '@/shared/ui';
import { ProductCard, type Product } from '@/entities/product';
import type { Category } from '@/entities/category';
import { CategoryFilterPills, ProductSearchBar, ProductSortSelector } from '@/features/filter-products';
import { ClaimPromoButton } from '@/features/claim-promo';
import { Search } from 'lucide-react';

export interface ProductCatalogPageProps {
  products: Product[];
  categories: Category[];
  activeCategory?: string;
  searchQuery?: string;
  activeSort?: string;
}

export function ProductCatalogPage({
  products,
  categories,
  activeCategory = 'semua',
  searchQuery = '',
  activeSort = 'default',
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

        {/* Filter Bar, Search & Sort */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-hairline-mist">
          <div className="flex-1 min-w-0">
            <CategoryFilterPills
              categories={categories}
              activeCategory={activeCategory}
            />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <ProductSortSelector activeSort={activeSort} />
            <ProductSearchBar defaultValue={searchQuery} />
          </div>
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
                      productId={product.id}
                      quotaRemaining={product.promo_quota_remaining}
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-pure-white rounded-[50px] p-8 border border-hairline-mist max-w-xl mx-auto">
            <Search className="w-10 h-10 text-stone-gray/60 mx-auto mb-3" />
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
