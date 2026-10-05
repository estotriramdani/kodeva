import type { Metadata } from 'next';
import { AdminArticlesPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';
import type { Product } from '@/entities/product';

export const metadata: Metadata = {
  title: 'Kelola Artikel Blog | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

interface ArticleWithProductsRow extends Article {
  article_products?: { product_id: string }[];
}

export default async function Page() {
  const supabase = await createServerClient();

  const [articlesRes, categoriesRes, productsRes] = await Promise.all([
    supabase
      .from('articles')
      .select(`
        *,
        category:categories(id, slug, name),
        article_products(product_id)
      `)
      .order('created_at', { ascending: false }),
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

  const rawArticles = (articlesRes.data || []) as unknown as ArticleWithProductsRow[];
  const articles: Article[] = rawArticles.map((raw) => ({
    ...raw,
    linked_product_ids: (raw.article_products || []).map((ap) => ap.product_id),
  }));

  return (
    <AdminArticlesPage
      articles={articles}
      categories={(categoriesRes.data || []) as Category[]}
      products={(productsRes.data || []) as Product[]}
    />
  );
}
