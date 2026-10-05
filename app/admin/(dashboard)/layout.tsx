import React from 'react';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/widgets/admin-sidebar';
import { createServerClient } from '@/shared/api/supabase/server';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Ambil profil user untuk mengetahui role (admin / editor)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-cream-paper flex flex-col lg:flex-row antialiased">
      <AdminSidebar
        adminEmail={profile?.display_name || user.email}
        adminRole={profile?.role || 'admin'}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
