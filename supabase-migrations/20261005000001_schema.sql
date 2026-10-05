-- =====================================================================
-- 20261005000001_schema.sql
-- Kodeva — skema inti: enum, domain, tabel, trigger, index.
-- RLS dan grant ada di migrasi 000003. Jalankan berurutan.
-- =====================================================================

-- ---------- Enum ----------
create type public.user_role      as enum ('admin', 'editor');
create type public.category_type  as enum ('product', 'article');
create type public.plan_tier      as enum ('basic', 'pro', 'business');
create type public.plan_unit      as enum ('user', 'outlet');
create type public.article_status as enum ('draft', 'published');

-- ---------- Domain ----------
create domain public.slug as text
  check (value ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(value) between 1 and 120);

-- Kode market 2 huruf (id, my, sg). v1 hanya 'id'.
create domain public.market as text
  check (value ~ '^[a-z]{2}$');

-- ---------- Fungsi util ----------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Memastikan category_id bertipe sesuai (argumen trigger: 'product' | 'article')
create function public.assert_category_type()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  expected public.category_type := tg_argv[0]::public.category_type;
begin
  if new.category_id is not null
     and not exists (
       select 1 from public.categories c
       where c.id = new.category_id and c.type = expected
     )
  then
    raise exception 'category % bukan bertipe %', new.category_id, expected
      using errcode = '23514';
  end if;
  return new;
end;
$$;

-- ---------- profiles ----------
-- Role TIDAK dibuat otomatis saat signup (mencegah privilege escalation).
-- Admin pertama dibuat manual, lihat supabase/seed_admin_example.sql.
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null default 'editor',
  display_name text check (display_name is null or char_length(display_name) <= 80),
  created_at   timestamptz not null default now()
);

-- ---------- categories ----------
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  type       public.category_type not null,
  slug       public.slug not null,
  name       text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  unique (type, slug)
);

-- ---------- products ----------
create table public.products (
  id                    uuid primary key default gen_random_uuid(),
  market_code           public.market not null default 'id',
  slug                  public.slug not null,
  name                  text not null check (char_length(name) between 1 and 120),
  tagline               text check (tagline is null or char_length(tagline) <= 200),
  description           text not null default '' check (char_length(description) <= 10000),
  category_id           uuid references public.categories (id) on delete restrict,
  thumbnail_url         text,
  screenshots           jsonb not null default '[]'::jsonb
                          check (jsonb_typeof(screenshots) = 'array'),   -- [{url, alt}]
  features              jsonb not null default '[]'::jsonb
                          check (jsonb_typeof(features) = 'array'),      -- ["fitur", ...]
  featured_rank         integer,                                         -- null = tidak tampil di landing
  promo_starts_at       timestamptz,                                     -- bonus: penjadwalan promo
  promo_ends_at         timestamptz,
  promo_quota_remaining integer not null default 0 check (promo_quota_remaining >= 0),
  is_active             boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (market_code, slug),
  check (promo_starts_at is null or promo_ends_at is null or promo_ends_at > promo_starts_at)
);

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger products_category_type
  before insert or update of category_id on public.products
  for each row execute function public.assert_category_type('product');

-- ---------- product_plans ----------
-- Harga IDR integer per lisensi per bulan. promo_price terisi => plan mengonsumsi kuota promo.
create table public.product_plans (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products (id) on delete cascade,
  tier        public.plan_tier not null,
  unit        public.plan_unit not null default 'user',
  price       integer not null check (price > 0),
  promo_price integer,
  min_qty     integer not null default 1   check (min_qty >= 1),
  max_qty     integer not null default 100 check (max_qty >= 1),
  features    jsonb not null default '[]'::jsonb
                check (jsonb_typeof(features) = 'array'),
  unique (product_id, tier),
  check (max_qty >= min_qty),
  check (promo_price is null or (promo_price > 0 and promo_price < price))
);

-- ---------- landing_hero (1 baris per market) ----------
create table public.landing_hero (
  market_code   public.market primary key default 'id',
  title         text not null check (char_length(title) between 1 and 160),
  subtitle      text check (subtitle is null or char_length(subtitle) <= 400),
  image_url     text,
  image_alt     text check (image_alt is null or char_length(image_alt) <= 200),
  cta_label     text not null default 'Lihat Promo' check (char_length(cta_label) between 1 and 40),
  cta_href      text not null default '/produk' check (cta_href ~ '^(/|https?://)'),
  campaign_name text not null default 'Promo Akhir Tahun',
  updated_at    timestamptz not null default now()
);

create trigger landing_hero_updated_at
  before update on public.landing_hero
  for each row execute function public.set_updated_at();

-- ---------- testimonials ----------
create table public.testimonials (
  id           uuid primary key default gen_random_uuid(),
  market_code  public.market not null default 'id',
  name         text not null check (char_length(name) between 1 and 80),
  role         text check (role is null or char_length(role) <= 80),
  company      text check (company is null or char_length(company) <= 80),
  quote        text not null check (char_length(quote) between 1 and 600),
  avatar_url   text,
  rank         integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- ---------- faqs ----------
create table public.faqs (
  id           uuid primary key default gen_random_uuid(),
  market_code  public.market not null default 'id',
  question     text not null check (char_length(question) between 1 and 200),
  answer       text not null check (char_length(answer) between 1 and 2000),
  rank         integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------- articles ----------
create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  market_code     public.market not null default 'id',
  slug            public.slug not null,
  title           text not null check (char_length(title) between 1 and 200),
  excerpt         text check (excerpt is null or char_length(excerpt) <= 400),
  cover_url       text,
  cover_alt       text check (cover_alt is null or char_length(cover_alt) <= 200),
  content_html    text not null default '' check (char_length(content_html) <= 200000),
  category_id     uuid references public.categories (id) on delete set null,
  status          public.article_status not null default 'draft',
  published_at    timestamptz,
  seo_title       text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description text check (seo_description is null or char_length(seo_description) <= 200),
  author_name     text check (author_name is null or char_length(author_name) <= 80),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (market_code, slug)
);

-- Saat dipublish tanpa tanggal, isi published_at = now().
create function public.articles_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger articles_publish_date
  before insert or update on public.articles
  for each row execute function public.articles_before_write();

create trigger articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create trigger articles_category_type
  before insert or update of category_id on public.articles
  for each row execute function public.assert_category_type('article');

-- ---------- article_products ----------
create table public.article_products (
  article_id uuid not null references public.articles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  rank       integer not null default 0,
  primary key (article_id, product_id)
);

-- ---------- leads ----------
create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text,
  whatsapp      text,
  source_cta    text check (source_cta is null or char_length(source_cta) <= 60),
  utm_source    text check (utm_source   is null or char_length(utm_source)   <= 100),
  utm_medium    text check (utm_medium   is null or char_length(utm_medium)   <= 100),
  utm_campaign  text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  utm_term      text check (utm_term     is null or char_length(utm_term)     <= 100),
  utm_content   text check (utm_content  is null or char_length(utm_content)  <= 100),
  landing_path  text check (landing_path is null or char_length(landing_path) <= 300),
  referrer      text check (referrer     is null or char_length(referrer)     <= 300),
  ip_hash       text not null check (char_length(ip_hash) between 8 and 128),
  created_at    timestamptz not null default now(),
  -- constraint dievaluasi SETELAH trigger BEFORE INSERT (yang menormalisasi nilai)
  constraint leads_name_len    check (char_length(name) between 2 and 80),
  constraint leads_email_fmt   check (email is null
                                 or (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  constraint leads_wa_fmt      check (whatsapp is null or whatsapp ~ '^\+?[0-9]{8,15}$'),
  constraint leads_has_contact check (email is not null or whatsapp is not null)
);

-- ---------- site_settings ----------
create table public.site_settings (
  key        text primary key check (key ~ '^[a-z0-9_.-]{1,60}$'),
  value      jsonb not null,
  is_public  boolean not null default false,   -- hanya baris is_public yang terbaca anon
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------- Index ----------
create index products_listing_idx       on public.products (market_code, is_active, featured_rank);
create index products_category_idx      on public.products (category_id);
create index product_plans_product_idx  on public.product_plans (product_id);
create index testimonials_listing_idx   on public.testimonials (market_code, rank) where is_published;
create index faqs_listing_idx           on public.faqs (market_code, rank) where is_published;
create index articles_listing_idx       on public.articles (market_code, status, published_at desc);
create index articles_category_idx      on public.articles (category_id);
create index article_products_prod_idx  on public.article_products (product_id);
create index leads_created_idx          on public.leads (created_at desc);
create index leads_ip_created_idx       on public.leads (ip_hash, created_at desc);
create index leads_email_idx            on public.leads (email) where email is not null;
create index leads_whatsapp_idx         on public.leads (whatsapp) where whatsapp is not null;
