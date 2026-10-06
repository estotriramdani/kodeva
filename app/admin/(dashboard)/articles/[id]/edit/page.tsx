import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminArticleFormPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';
import type { Product } from '@/entities/product';

export const metadata: Metadata = {
  title: 'Edit Artikel Blog | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

interface ArticleWithProductsRow extends Article {
  article_products?: { product_id: string }[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerClient();

  const [articleRes, categoriesRes, productsRes] = await Promise.all([
    supabase
      .from('articles')
      .select(`
        *,
        category:categories(id, slug, name),
        article_products(product_id)
      `)
      .eq('id', id)
      .maybeSingle(),
    supabase
      .from('categories')
      .select('*')
      .eq('type', 'article')
      .order('name', { ascending: true }),
    supabase
      .from('products')
      .select('id, name, slug, thumbnail_url')
      .eq('is_active', true)
      .order('name', { ascending: true }),
  ]);

  if (!articleRes.data) {
    notFound();
  }

  const rawArticle = articleRes.data as unknown as ArticleWithProductsRow;
  const article: Article = {
    ...rawArticle,
    linked_product_ids: (rawArticle.article_products || []).map((ap) => ap.product_id),
  };

  return (
    <AdminArticleFormPage
      mode="edit"
      article={article}
      categories={(categoriesRes.data || []) as Category[]}
      products={(productsRes.data || []) as Product[]}
    />
  );
}
