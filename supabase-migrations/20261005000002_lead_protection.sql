-- =====================================================================
-- 20261005000002_lead_protection.sql
-- Normalisasi + proteksi spam lead di level database.
--
-- Error yang dilempar (SQLSTATE P0001), dipetakan oleh Server Action:
--   lead_rate_limited : >= 5 lead per jam dari ip_hash yang sama
--   lead_duplicate    : email/WhatsApp yang sama dalam 24 jam
--
-- SECURITY DEFINER wajib: anon tidak punya SELECT pada leads, sehingga
-- tanpa itu hitungan di dalam trigger selalu 0 (rate limit tidak bekerja).
-- =====================================================================

create function public.leads_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Normalisasi (constraint CHECK dijalankan setelah trigger ini)
  new.name       := btrim(new.name);
  new.email      := nullif(lower(btrim(coalesce(new.email, ''))), '');
  new.whatsapp   := nullif(regexp_replace(coalesce(new.whatsapp, ''), '[\s\-\(\)\.]', '', 'g'), '');
  new.created_at := now();

  -- Serialisasi per ip_hash agar hitungan tidak balapan
  perform pg_advisory_xact_lock(hashtextextended(new.ip_hash, 0));

  if (
    select count(*) from public.leads l
    where l.ip_hash = new.ip_hash
      and l.created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'lead_rate_limited' using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.leads l
    where l.created_at > now() - interval '24 hours'
      and (
        (new.email    is not null and l.email    = new.email)
        or
        (new.whatsapp is not null and l.whatsapp = new.whatsapp)
      )
  ) then
    raise exception 'lead_duplicate' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.leads_before_insert() from public, anon, authenticated;

create trigger leads_before_insert
  before insert on public.leads
  for each row execute function public.leads_before_insert();
