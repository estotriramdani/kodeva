import { createServerClient } from '@/shared/api/supabase/server';
import type { Category, CategoryType } from '../model/types';

export async function getCategories(type: CategoryType): Promise<Category[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('type', type)
    .order('name', { ascending: true });

  if (error) {
    console.error(`Error fetching ${type} categories:`, error.message);
    return [];
  }

  return (data || []) as Category[];
}
