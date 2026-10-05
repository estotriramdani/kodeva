import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminDashboardPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';
import type { Lead } from '@/entities/lead';

export const metadata: Metadata = {
  title: 'Dashboard Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Ambil data leads (hanya diizinkan oleh RLS jika user memiliki role admin/editor)
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads in admin dashboard:', error.message);
  }

  return (
    <AdminDashboardPage
      leads={(leads || []) as Lead[]}
      adminEmail={user.email}
    />
  );
}
