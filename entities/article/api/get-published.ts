import { createServerClient } from '@/shared/api/supabase/server';
import type { Article } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export interface GetPublishedArticlesOptions {
  marketCode?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedArticlesResult {
  articles: Article[];
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export async function getPublishedArticles(
  options: GetPublishedArticlesOptions = {}
): Promise<PaginatedArticlesResult> {
  const { marketCode = DEFAULT_MARKET_CODE, page = 1, pageSize = 6 } = options;
  const supabase = await createServerClient();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      category:categories(id, slug, name)
    `,
      { count: 'exact' }
    )
    .eq('market_code', marketCode)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching published articles:', error.message);
    return {
      articles: [],
      total: 0,
      currentPage: page,
      pageSize,
      totalPages: 1,
    };
  }

  const total = count || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    articles: (data || []) as Article[],
    total,
    currentPage: page,
    pageSize,
    totalPages,
  };
}
