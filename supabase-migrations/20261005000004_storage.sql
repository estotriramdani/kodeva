-- =====================================================================
-- 20261005000004_storage.sql
-- Bucket `media` (gambar CMS): baca publik via URL, tulis hanya editor.
-- Batas 2 MB dan hanya tipe gambar ditegakkan di level bucket.
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,                                   -- URL publik tanpa policy SELECT
  2097152,                                -- 2 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Editor boleh melihat daftar, upload, ganti, dan hapus.
create policy media_editor_all on storage.objects
  for all to authenticated
  using      (bucket_id = 'media' and (select public.is_editor()))
  with check (bucket_id = 'media' and (select public.is_editor()));
