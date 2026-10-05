import type { Metadata } from 'next';
import { AdminProductsPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Product, ProductPlan, ProductScreenshot } from '@/entities/product';
import type { Category } from '@/entities/category';

export const metadata: Metadata = {
  title: 'Kelola Produk & Paket | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();

  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('products')
      .select(`
        *,
        category:categories(id, slug, name),
        plans:product_plans(*)
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .eq('type', 'product')
      .order('name', { ascending: true }),
  ]);

  const rawProducts = productsRes.data || [];
  const products = rawProducts.map((p) => ({
    ...p,
    screenshots: (Array.isArray(p.screenshots) ? p.screenshots : []) as unknown as ProductScreenshot[],
    features: (Array.isArray(p.features) ? p.features : []) as unknown as string[],
    plans: (p.plans || []).map((plan) => ({
      ...plan,
      features: (Array.isArray(plan.features) ? plan.features : []) as unknown as string[],
    })) as ProductPlan[],
  })) as Product[];

  return (
    <AdminProductsPage
      products={products}
      categories={(categoriesRes.data || []) as Category[]}
    />
  );
}
