import { createServerClient } from '@/shared/api/supabase';
import type { Article } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getArticleBySlug(
  slug: string,
  marketCode: string = DEFAULT_MARKET_CODE
): Promise<Article | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(id, slug, name)
    `)
    .eq('market_code', marketCode)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('Error fetching article by slug:', error.message);
    return null;
  }

  return data as Article;
}
