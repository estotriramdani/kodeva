import { createServerClient } from '@/shared/api/supabase/server';
import type { Article } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getPublishedArticles(
  marketCode: string = DEFAULT_MARKET_CODE
): Promise<Article[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, slug, name)
    `)
    .eq('market_code', marketCode)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching published articles:', error.message);
    return [];
  }

  return (data || []) as Article[];
}
