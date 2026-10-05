import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailPage } from '@/views/product-detail';
import { getProductBySlug } from '@/entities/product/server';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
    };
  }

  return {
    title: `${product.name} — ${product.tagline || 'Software Bisnis Resmi'}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} — Kodeva`,
      description: product.tagline || undefined,
      images: product.thumbnail_url ? [product.thumbnail_url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
