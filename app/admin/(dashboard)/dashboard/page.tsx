import type { Metadata } from 'next';
import { AdminDashboardPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Lead } from '@/entities/lead';

export const metadata: Metadata = {
  title: 'Ringkasan & Leads | Admin Kodeva',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();

  const [leadsRes, productsRes, articlesRes] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    supabase.from('products').select('id, promo_quota_remaining, is_active'),
    supabase.from('articles').select('id', { count: 'exact', head: true }),
  ]);

  const leads = (leadsRes.data || []) as Lead[];
  const products = productsRes.data || [];
  const activeProducts = products.filter((p) => p.is_active);
  const promoQuotaTotal = activeProducts.reduce(
    (acc, curr) => acc + (curr.promo_quota_remaining || 0),
    0
  );

  return (
    <AdminDashboardPage
      leads={leads}
      productsCount={activeProducts.length}
      articlesCount={articlesRes.count || 0}
      promoQuotaTotal={promoQuotaTotal}
    />
  );
}
