import type { Metadata } from 'next';
import { AdminArticlesPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Article } from '@/entities/article';
import type { Category } from '@/entities/category';

export const metadata: Metadata = {
  title: 'Kelola Artikel Blog | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();

  const [articlesRes, categoriesRes] = await Promise.all([
    supabase
      .from('articles')
      .select(`
        *,
        category:categories(id, slug, name)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .eq('type', 'article')
      .order('name', { ascending: true }),
  ]);

  return (
    <AdminArticlesPage
      articles={(articlesRes.data || []) as Article[]}
      categories={(categoriesRes.data || []) as Category[]}
    />
  );
}
