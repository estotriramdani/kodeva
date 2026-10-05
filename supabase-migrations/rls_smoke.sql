-- =====================================================================
-- supabase/tests/rls_smoke.sql
-- Uji asap RLS + proteksi lead. Seluruh fixture di-ROLLBACK di akhir.
--
-- Jalankan sebagai superuser/postgres (mis. psql atau SQL Editor):
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_smoke.sql
-- Berhasil bila muncul "ALL RLS CHECKS PASSED". Gagal => exception "FAIL ...".
-- Fixture memakai INSERT minimal ke auth.users (id, email); bila versi
-- Supabase Anda mewajibkan kolom lain, tambahkan di bagian fixture.
-- =====================================================================
begin;

create schema rls_test;
grant usage on schema rls_test to anon, authenticated;

create function rls_test.expect(label text, ok boolean)
returns void language plpgsql as $$
begin
  if ok then
    raise notice 'PASS  %', label;
  else
    raise exception 'FAIL  %', label;
  end if;
end;
$$;

-- true bila statement melempar error (dengan SQLSTATE tertentu bila diberikan)
create function rls_test.throws(stmt text, state text default null)
returns boolean language plpgsql as $$
begin
  execute stmt;
  return false;
exception when others then
  return state is null or sqlstate = state;
end;
$$;

-- ---------- Fixture (sebagai owner, RLS dilewati) ----------
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000e001', 'editor@test.local'),
  ('00000000-0000-0000-0000-00000000a001', 'plain-user@test.local');

insert into public.profiles (id, role, display_name)
values ('00000000-0000-0000-0000-00000000e001', 'editor', 'Editor Uji');

insert into public.categories (id, type, slug, name) values
  ('00000000-0000-0000-0000-00000000c001', 'product', 'test-kasir', 'Kasir'),
  ('00000000-0000-0000-0000-00000000c002', 'article', 'test-tips',  'Tips');

insert into public.products (id, slug, name, category_id, is_active, promo_quota_remaining) values
  ('00000000-0000-0000-0000-00000000b001', 'test-aktif',    'Produk Aktif',    '00000000-0000-0000-0000-00000000c001', true,  50),
  ('00000000-0000-0000-0000-00000000b002', 'test-nonaktif', 'Produk Nonaktif', '00000000-0000-0000-0000-00000000c001', false, 0);

insert into public.product_plans (product_id, tier, price, promo_price) values
  ('00000000-0000-0000-0000-00000000b001', 'basic', 100000, 80000),
  ('00000000-0000-0000-0000-00000000b002', 'basic', 100000, null);

insert into public.articles (id, slug, title, status, published_at, category_id, content_html) values
  ('00000000-0000-0000-0000-00000000d001', 'test-terbit',    'Terbit',    'published', now() - interval '1 day', '00000000-0000-0000-0000-00000000c002', '<p>x</p>'),
  ('00000000-0000-0000-0000-00000000d002', 'test-draft',     'Draft',     'draft',     null,                     '00000000-0000-0000-0000-00000000c002', '<p>x</p>'),
  ('00000000-0000-0000-0000-00000000d003', 'test-terjadwal', 'Terjadwal', 'published', now() + interval '1 day', '00000000-0000-0000-0000-00000000c002', '<p>x</p>');

insert into public.article_products (article_id, product_id) values
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-00000000b001'),
  ('00000000-0000-0000-0000-00000000d001', '00000000-0000-0000-0000-00000000b002');

insert into public.testimonials (name, quote, is_published) values
  ('test-tampil',  'Bagus', true),
  ('test-sembunyi','Rahasia', false);

insert into public.site_settings (key, value, is_public) values
  ('test.public',  '"x"'::jsonb, true),
  ('test.private', '"y"'::jsonb, false);

-- =====================================================================
-- 1) ANON (pengunjung)
-- =====================================================================
set local role anon;

do $$
declare n int;
begin
  select count(*) into n from public.products where slug like 'test-%';
  perform rls_test.expect('anon: hanya produk aktif terlihat', n = 1);

  select count(*) into n from public.product_plans pp
    join public.products p on p.id = pp.product_id where p.slug like 'test-%';
  perform rls_test.expect('anon: plan produk nonaktif tidak terlihat', n = 1);

  select count(*) into n from public.articles where slug like 'test-%';
  perform rls_test.expect('anon: hanya artikel terbit & sudah tayang (draft/terjadwal tersembunyi)', n = 1);

  select count(*) into n from public.article_products;
  perform rls_test.expect('anon: article_products hanya yang artikel+produknya terlihat', n = 1);

  select count(*) into n from public.testimonials where name like 'test-%';
  perform rls_test.expect('anon: testimoni tidak terbit tersembunyi', n = 1);

  select count(*) into n from public.site_settings where key like 'test.%';
  perform rls_test.expect('anon: hanya site_settings is_public', n = 1);

  perform rls_test.expect('anon: tidak bisa INSERT produk',
    rls_test.throws($q$insert into public.products (slug, name) values ('x-anon', 'X')$q$, '42501'));
  perform rls_test.expect('anon: tidak bisa UPDATE produk',
    rls_test.throws($q$update public.products set name = 'hack'$q$, '42501'));
  perform rls_test.expect('anon: tidak bisa SELECT leads',
    rls_test.throws($q$select * from public.leads$q$, '42501'));
  perform rls_test.expect('anon: tidak bisa DELETE leads',
    rls_test.throws($q$delete from public.leads$q$, '42501'));
  perform rls_test.expect('anon: tidak bisa SELECT profiles',
    rls_test.throws($q$select * from public.profiles$q$, '42501'));
end $$;

-- Lead: insert valid, normalisasi, dedupe, validasi, rate limit
do $$
declare i int;
begin
  insert into public.leads (name, email, ip_hash, source_cta)
  values ('  Budi  ', 'Budi@Example.com ', 'hash-aaaa-1', 'hero_primary');
  perform rls_test.expect('lead: insert valid oleh anon berhasil', true);

  perform rls_test.expect('lead: email sama (beda huruf besar) dalam 24 jam ditolak',
    rls_test.throws($q$insert into public.leads (name, email, ip_hash) values ('Budi 2', 'budi@example.com', 'hash-aaaa-2')$q$, 'P0001'));

  perform rls_test.expect('lead: tanpa email & WhatsApp ditolak (23514)',
    rls_test.throws($q$insert into public.leads (name, ip_hash) values ('Tanpa Kontak', 'hash-aaaa-3')$q$, '23514'));

  perform rls_test.expect('lead: format WhatsApp salah ditolak (23514)',
    rls_test.throws($q$insert into public.leads (name, whatsapp, ip_hash) values ('WA Salah', 'abc123', 'hash-aaaa-4')$q$, '23514'));

  perform rls_test.expect('lead: format email salah ditolak (23514)',
    rls_test.throws($q$insert into public.leads (name, email, ip_hash) values ('Email Salah', 'bukan-email', 'hash-aaaa-5')$q$, '23514'));

  perform rls_test.expect('lead: nama terlalu pendek ditolak (23514)',
    rls_test.throws($q$insert into public.leads (name, email, ip_hash) values ('A', 'a@example.com', 'hash-aaaa-6')$q$, '23514'));

  perform rls_test.expect('lead: klien tidak boleh mengisi created_at/id (privilege kolom)',
    rls_test.throws($q$insert into public.leads (name, email, ip_hash, created_at) values ('Curang', 'curang@example.com', 'hash-aaaa-7', now() - interval '10 days')$q$, '42501'));

  -- WhatsApp dinormalisasi: "0812-3456-7890" -> "081234567890"; format sama dianggap duplikat
  insert into public.leads (name, whatsapp, ip_hash) values ('Wati', '0812-3456-7890', 'hash-aaaa-8');
  perform rls_test.expect('lead: WhatsApp dengan tanda hubung diterima',  true);
  perform rls_test.expect('lead: WhatsApp sama (format beda) dianggap duplikat',
    rls_test.throws($q$insert into public.leads (name, whatsapp, ip_hash) values ('Wati 2', '0812 3456 7890', 'hash-aaaa-9')$q$, 'P0001'));

  -- Rate limit: 5 lead per jam per ip_hash
  for i in 1..5 loop
    insert into public.leads (name, email, ip_hash)
    values ('Spam ' || i, 'spam' || i || '@example.com', 'hash-spammer-1');
  end loop;
  perform rls_test.expect('lead: lead ke-6 dari ip_hash yang sama dalam 1 jam ditolak',
    rls_test.throws($q$insert into public.leads (name, email, ip_hash) values ('Spam 6', 'spam6@example.com', 'hash-spammer-1')$q$, 'P0001'));
  insert into public.leads (name, email, ip_hash) values ('Orang Lain', 'lain@example.com', 'hash-other-1');
  perform rls_test.expect('lead: ip_hash berbeda tidak terkena rate limit', true);
end $$;

reset role;

-- =====================================================================
-- 2) AUTHENTICATED tanpa profil editor
-- =====================================================================
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000a001","role":"authenticated"}', true);
set local role authenticated;

do $$
declare n int;
begin
  select count(*) into n from public.products where slug like 'test-%';
  perform rls_test.expect('user biasa: produk nonaktif tetap tersembunyi', n = 1);

  select count(*) into n from public.articles where slug like 'test-%';
  perform rls_test.expect('user biasa: draft tetap tersembunyi', n = 1);

  select count(*) into n from public.leads;
  perform rls_test.expect('user biasa: leads tidak terlihat (0 baris)', n = 0);

  perform rls_test.expect('user biasa: tidak bisa INSERT produk (RLS)',
    rls_test.throws($q$insert into public.products (slug, name) values ('x-user', 'X')$q$, '42501'));
  perform rls_test.expect('user biasa: tidak bisa INSERT artikel (RLS)',
    rls_test.throws($q$insert into public.articles (slug, title) values ('x-user', 'X')$q$, '42501'));
  perform rls_test.expect('user biasa: tidak bisa memberi diri role admin',
    rls_test.throws($q$insert into public.profiles (id, role) values ('00000000-0000-0000-0000-00000000a001', 'admin')$q$, '42501'));
end $$;

reset role;

-- =====================================================================
-- 3) EDITOR
-- =====================================================================
select set_config('request.jwt.claims',
  '{"sub":"00000000-0000-0000-0000-00000000e001","role":"authenticated"}', true);
set local role authenticated;

do $$
declare n int; rc int;
begin
  select count(*) into n from public.products where slug like 'test-%';
  perform rls_test.expect('editor: melihat semua produk termasuk nonaktif', n = 2);

  select count(*) into n from public.articles where slug like 'test-%';
  perform rls_test.expect('editor: melihat draft & terjadwal', n = 3);

  select count(*) into n from public.leads;
  perform rls_test.expect('editor: bisa membaca leads', n >= 8);

  perform rls_test.expect('editor: bisa INSERT artikel',
    not rls_test.throws($q$insert into public.articles (slug, title, content_html) values ('test-baru', 'Baru', '<p>ok</p>')$q$));

  update public.articles set status = 'published' where slug = 'test-baru';
  select count(*) into n from public.articles
    where slug = 'test-baru' and published_at is not null;
  perform rls_test.expect('editor: artikel publish tanpa tanggal otomatis diberi published_at', n = 1);

  perform rls_test.expect('editor: kategori bertipe salah ditolak (23514)',
    rls_test.throws($q$insert into public.products (slug, name, category_id) values ('test-salah-kategori', 'X', '00000000-0000-0000-0000-00000000c002')$q$, '23514'));

  perform rls_test.expect('editor: harga promo >= harga normal ditolak (23514)',
    rls_test.throws($q$insert into public.product_plans (product_id, tier, price, promo_price) values ('00000000-0000-0000-0000-00000000b002', 'pro', 100000, 100000)$q$, '23514'));

  perform rls_test.expect('editor: kuota promo negatif ditolak (23514)',
    rls_test.throws($q$update public.products set promo_quota_remaining = -1 where slug = 'test-aktif'$q$, '23514'));

  perform rls_test.expect('editor: tidak bisa UPDATE lead',
    rls_test.throws($q$update public.leads set name = 'ubah'$q$, '42501'));

  update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000e001';
  get diagnostics rc = row_count;
  perform rls_test.expect('editor: tidak bisa menaikkan role sendiri (0 baris berubah)', rc = 0);

  perform rls_test.expect('editor: tidak bisa membuat profil baru',
    rls_test.throws($q$insert into public.profiles (id, role) values ('00000000-0000-0000-0000-00000000a001', 'editor')$q$, '42501'));
end $$;

reset role;

do $$ begin raise notice 'ALL RLS CHECKS PASSED'; end $$;

rollback;
