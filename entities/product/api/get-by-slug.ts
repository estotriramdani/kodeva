import { createPublicClient } from '@/shared/api/supabase/server';
import type { Product, ProductPlan, ProductScreenshot } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getProductBySlug(
  slug: string,
  marketCode: string = DEFAULT_MARKET_CODE
): Promise<Product | null> {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, slug, name),
      plans:product_plans(*)
    `)
    .eq('market_code', marketCode)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('Error fetching product by slug:', error.message);
    return null;
  }

  return {
    ...data,
    screenshots: (Array.isArray(data.screenshots) ? data.screenshots : []) as unknown as ProductScreenshot[],
    features: (Array.isArray(data.features) ? data.features : []) as unknown as string[],
    plans: (data.plans || []).map((plan) => ({
      ...plan,
      features: (Array.isArray(plan.features) ? plan.features : []) as unknown as string[],
    })) as ProductPlan[],
  } as Product;
}
