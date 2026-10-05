-- =====================================================================
-- 20261005000003_rls.sql
-- Hak akses: deny-by-default (grant eksplisit) + RLS di semua tabel.
--
-- Catatan:
--  * Tabel baru di masa depan WAJIB diberi grant + RLS eksplisit.
--  * Matikan "Allow new users to sign up" di Supabase Auth; akun editor
--    dibuat manual. Pengguna 'authenticated' tanpa baris profiles hanya
--    punya akses baca publik yang sama seperti anon.
--  * supabase-js: insert ke leads JANGAN memakai .select() (anon tidak
--    punya hak SELECT), cukup .insert(...) tanpa returning.
-- =====================================================================

-- ---------- Fungsi helper ----------
-- SECURITY DEFINER agar bisa membaca profiles tanpa memicu rekursi RLS.
create function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role in ('admin', 'editor')
  );
$$;

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function public.is_editor() from public;
revoke all on function public.is_admin()  from public;
grant execute on function public.is_editor() to anon, authenticated;
grant execute on function public.is_admin()  to anon, authenticated;

-- ---------- Grant (deny-by-default) ----------
revoke all on all tables in schema public from anon, authenticated;

-- Baca konten publik (baris tetap dibatasi RLS)
grant select on
  public.categories, public.products, public.product_plans,
  public.landing_hero, public.testimonials, public.faqs,
  public.articles, public.article_products, public.site_settings
to anon, authenticated;

-- Tulis konten: hanya authenticated (RLS membatasi ke editor/admin)
grant insert, update, delete on
  public.categories, public.products, public.product_plans,
  public.landing_hero, public.testimonials, public.faqs,
  public.articles, public.article_products, public.site_settings
to authenticated;

-- Leads: anon/authenticated hanya boleh INSERT pada kolom tertentu
-- (id & created_at tidak bisa diisi klien). Baca/hapus hanya editor.
grant insert (name, email, whatsapp, source_cta,
              utm_source, utm_medium, utm_campaign, utm_term, utm_content,
              landing_path, referrer, ip_hash)
  on public.leads to anon, authenticated;
grant select, delete on public.leads to authenticated;

-- Profiles: dikelola admin (RLS), pengguna boleh membaca profilnya sendiri
grant select, insert, update, delete on public.profiles to authenticated;

-- ---------- Aktifkan RLS ----------
alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.products         enable row level security;
alter table public.product_plans    enable row level security;
alter table public.landing_hero     enable row level security;
alter table public.testimonials     enable row level security;
alter table public.faqs             enable row level security;
alter table public.articles         enable row level security;
alter table public.article_products enable row level security;
alter table public.leads            enable row level security;
alter table public.site_settings    enable row level security;

-- ---------- profiles ----------
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy profiles_admin_all on public.profiles
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------- categories ----------
create policy categories_public_read on public.categories
  for select to anon, authenticated
  using (true);

create policy categories_editor_write on public.categories
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- products ----------
create policy products_public_read on public.products
  for select to anon, authenticated
  using (is_active);

create policy products_editor_all on public.products
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- product_plans ----------
-- Subquery ke products ikut terfilter RLS: plan produk nonaktif tidak terlihat publik.
create policy product_plans_public_read on public.product_plans
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));

create policy product_plans_editor_all on public.product_plans
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- landing_hero ----------
create policy landing_hero_public_read on public.landing_hero
  for select to anon, authenticated
  using (true);

create policy landing_hero_editor_all on public.landing_hero
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- testimonials ----------
create policy testimonials_public_read on public.testimonials
  for select to anon, authenticated
  using (is_published);

create policy testimonials_editor_all on public.testimonials
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- faqs ----------
create policy faqs_public_read on public.faqs
  for select to anon, authenticated
  using (is_published);

create policy faqs_editor_all on public.faqs
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- articles ----------
-- Publik: hanya yang berstatus published DAN sudah waktunya tayang.
create policy articles_public_read on public.articles
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());

create policy articles_editor_all on public.articles
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- article_products ----------
-- Terlihat publik hanya bila artikel DAN produknya terlihat (sama-sama lolos RLS).
create policy article_products_public_read on public.article_products
  for select to anon, authenticated
  using (
    exists (select 1 from public.articles a where a.id = article_id)
    and exists (select 1 from public.products p where p.id = product_id)
  );

create policy article_products_editor_all on public.article_products
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));

-- ---------- leads ----------
-- INSERT terbuka (with check true) KARENA validasi & anti-spam ada di
-- constraint + trigger (migrasi 000001/000002) dan Server Action.
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (true);

create policy leads_editor_select on public.leads
  for select to authenticated
  using ((select public.is_editor()));

create policy leads_editor_delete on public.leads
  for delete to authenticated
  using ((select public.is_editor()));
-- Tidak ada policy UPDATE: lead tidak bisa diubah.

-- ---------- site_settings ----------
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated
  using (is_public);

create policy site_settings_editor_all on public.site_settings
  for all to authenticated
  using ((select public.is_editor()))
  with check ((select public.is_editor()));
