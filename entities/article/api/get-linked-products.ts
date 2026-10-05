import { createServerClient } from '@/shared/api/supabase/server';
import type { Product, ProductPlan, ProductScreenshot } from '@/entities/product';

export async function getArticleLinkedProducts(articleId: string): Promise<Product[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('article_products')
    .select(`
      rank,
      product:products(
        *,
        category:categories(id, slug, name),
        plans:product_plans(*)
      )
    `)
    .eq('article_id', articleId)
    .order('rank', { ascending: true });

  if (error || !data) {
    if (error) console.error('Error fetching linked products for article:', error.message);
    return [];
  }

  return data
    .map((item) => {
      const p = item.product as unknown as Record<string, unknown> | null;
      if (!p) return null;
      return {
        ...p,
        screenshots: (Array.isArray(p.screenshots) ? p.screenshots : []) as unknown as ProductScreenshot[],
        features: (Array.isArray(p.features) ? p.features : []) as unknown as string[],
        plans: (Array.isArray(p.plans) ? p.plans : []).map((plan: unknown) => {
          const pl = plan as Record<string, unknown>;
          return {
            ...pl,
            features: (Array.isArray(pl.features) ? pl.features : []) as unknown as string[],
          };
        }) as ProductPlan[],
      };
    })
    .filter(Boolean) as Product[];
}
