-- =====================================================================
-- supabase/seed_admin_example.sql
-- Membuat admin/editor pertama. Role TIDAK diberikan otomatis saat signup.
--
-- Langkah:
--  1. Supabase Dashboard > Authentication > Users > Add user
--     (email + password demo, mis. admin@kodeva.test). Jangan commit password asli.
--  2. Jalankan skrip ini di SQL Editor (sebagai postgres).
-- =====================================================================

insert into public.profiles (id, role, display_name)
select id, 'admin', 'Admin Demo'
from auth.users
where email = 'admin@kodeva.test'
on conflict (id) do update set role = excluded.role;

-- Editor (hak tulis konten + baca leads, tanpa kelola profil):
-- insert into public.profiles (id, role, display_name)
-- select id, 'editor', 'Editor Marketing'
-- from auth.users where email = 'editor@kodeva.test'
-- on conflict (id) do update set role = excluded.role;
