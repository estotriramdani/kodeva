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

  const isAuthorized = profile && ['admin', 'editor'].includes(profile.role);

  return (
    <div className="min-h-screen bg-cream-paper flex flex-col lg:flex-row antialiased">
      <AdminSidebar
        adminEmail={profile?.display_name || user.email}
        adminRole={profile?.role || 'unauthorized'}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full overflow-x-hidden">
        {!isAuthorized && (
          <div className="mb-6 p-4 rounded-[20px] bg-coral-pop/10 border border-coral-pop/30 text-coral-pop text-sm font-medium">
            <strong>Peringatan Hak Akses:</strong> Akun Anda terautentikasi ({user.email}), namun belum terhubung ke tabel <code className="bg-coral-pop/20 px-1 py-0.5 rounded">public.profiles</code> dengan role <code className="bg-coral-pop/20 px-1 py-0.5 rounded">admin</code> atau <code className="bg-coral-pop/20 px-1 py-0.5 rounded">editor</code>. Operasi pembaruan konten dan upload media akan ditolak oleh Row-Level Security (RLS) database. Jalankan skrip di <code className="bg-coral-pop/20 px-1 py-0.5 rounded">supabase-migrations/seed_admin_example.sql</code> untuk mengaktifkan profil.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
