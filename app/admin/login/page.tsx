import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminLoginPage } from '@/views/admin';
import { createServerClient } from '@/shared/api/supabase/server';

export const metadata: Metadata = {
  title: 'Login Admin & Editor',
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

  if (user) {
    redirect('/admin/dashboard');
  }

  return <AdminLoginPage />;
}
