import type { Metadata } from 'next';
import { ProductCatalogPage } from '@/views/product-catalog';
import { listProducts } from '@/entities/product/server';
import { getCategories } from '@/entities/category/server';

export const metadata: Metadata = {
  title: 'Katalog Software & SaaS Bisnis Terlengkap',
  description:
    'Bandingkan dan pilih software bisnis terbaik untuk akuntansi, kasir POS, ERP, dan HRIS dengan harga promo lisensi resmi.',
};

type Props = {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { kategori, q, sort } = await searchParams;

  const [categories, products] = await Promise.all([
    getCategories('product'),
    listProducts({
      categorySlug: kategori,
      searchQuery: q,
      sortBy: sort,
    }),
  ]);

  return (
    <ProductCatalogPage
      products={products}
      categories={categories}
      activeCategory={kategori || 'semua'}
      searchQuery={q || ''}
      activeSort={sort || 'default'}
    />
  );
}
