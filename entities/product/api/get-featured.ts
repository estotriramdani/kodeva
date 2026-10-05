import { createServerClient } from '@/shared/api/supabase/server';
import type { Product, ProductPlan, ProductScreenshot } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getFeaturedProducts(marketCode: string = DEFAULT_MARKET_CODE): Promise<Product[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, slug, name),
      plans:product_plans(*)
    `)
    .eq('market_code', marketCode)
    .eq('is_active', true)
    .not('featured_rank', 'is', null)
    .order('featured_rank', { ascending: true });

  if (error) {
    console.error('Error fetching featured products:', error.message);
    return [];
  }

  return (data || []).map((p) => ({
    ...p,
    screenshots: (Array.isArray(p.screenshots) ? p.screenshots : []) as unknown as ProductScreenshot[],
    features: (Array.isArray(p.features) ? p.features : []) as unknown as string[],
    plans: (p.plans || []).map((plan) => ({
      ...plan,
      features: (Array.isArray(plan.features) ? plan.features : []) as unknown as string[],
    })) as ProductPlan[],
  })) as Product[];
}
