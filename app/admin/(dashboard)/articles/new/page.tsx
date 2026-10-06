import type { Metadata } from 'next';
import { AdminArticleFormPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Category } from '@/entities/category';
import type { Product } from '@/entities/product';

export const metadata: Metadata = {
  title: 'Tulis Artikel Baru | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();

  const [categoriesRes, productsRes] = await Promise.all([
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

  return (
    <AdminArticleFormPage
      mode="create"
      categories={(categoriesRes.data || []) as Category[]}
      products={(productsRes.data || []) as Product[]}
    />
  );
}
