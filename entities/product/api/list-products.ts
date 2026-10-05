import { createServerClient } from '@/shared/api/supabase';
import type { Product, ProductPlan, ProductScreenshot } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export interface ListProductsOptions {
  marketCode?: string;
  categorySlug?: string;
  searchQuery?: string;
}

export async function listProducts(options: ListProductsOptions = {}): Promise<Product[]> {
  const { marketCode = DEFAULT_MARKET_CODE, categorySlug, searchQuery } = options;
  const supabase = await createServerClient();

  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, slug, name),
      plans:product_plans(*)
    `)
    .eq('market_code', marketCode)
    .eq('is_active', true);

  if (searchQuery && searchQuery.trim()) {
    query = query.ilike('name', `%${searchQuery.trim()}%`);
  }

  // Sorting: featured products first, then latest
  query = query.order('featured_rank', { ascending: true, nullsFirst: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error listing products:', error.message);
    return [];
  }

  let results = (data || []).map((p) => ({
    ...p,
    screenshots: (Array.isArray(p.screenshots) ? p.screenshots : []) as unknown as ProductScreenshot[],
    features: (Array.isArray(p.features) ? p.features : []) as unknown as string[],
    plans: (p.plans || []).map((plan) => ({
      ...plan,
      features: (Array.isArray(plan.features) ? plan.features : []) as unknown as string[],
    })) as ProductPlan[],
  })) as Product[];

  if (categorySlug && categorySlug !== 'semua') {
    results = results.filter((p) => p.category?.slug === categorySlug);
  }

  return results;
}
