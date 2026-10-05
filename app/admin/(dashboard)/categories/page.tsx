import type { Metadata } from 'next';
import { AdminCategoriesPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Category } from '@/entities/category';

export const metadata: Metadata = {
  title: 'Kelola Kategori | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching categories:', error.message);
  }

  return (
    <AdminCategoriesPage categories={(categories || []) as Category[]} />
  );
}
