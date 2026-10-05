# 01 — Domain & Data Model Specification

Dokumen ini memetakan domain bisnis **Kodeva** berdasarkan skema database Supabase yang telah disiapkan di `supabase-migrations/`. Setiap entitas di database memiliki padanan model di layer `entities/` pada arsitektur FSD.

---

## 1. Ikhtisar Domain Bisnis Kodeva

Kodeva adalah platform etalase katalog software & SaaS, artikel komparasi teknologi, dan sistem penangkap prospek (*lead generation*) untuk pasar Indonesia (`market_code = 'id'`).

### Entitas Utama:
1. **Product & Plans**: Katalog software/SaaS dengan tier harga bulanan (*basic, pro, business*), satuan lisensi (*user, outlet*), dan kuota promo diskon.
2. **Category**: Kategori taksonomi untuk produk dan artikel.
3. **Article**: Artikel konten edukasi, ulasan, atau perbandingan software dengan relasi ke produk terkait (`article_products`).
4. **Lead**: Pengunjung yang tertarik meminta penawaran atau demo (nama, email, WhatsApp, UTM tracking, IP hash protection).
5. **Social Proof & Support**: Testimoni (`testimonials`), Tanya Jawab (`faqs`), dan Hero Banner (`landing_hero`).
6. **User & Profile**: Manajemen pengguna internal dengan peran `admin` dan `editor`.

---

## 2. Pemetaan Tipe & Enum Database

Berdasarkan migrasi `20261005000001_schema.sql`:

| PostgreSQL Type / Domain | Nilai yang Diizinkan | Penggunaan |
| :--- | :--- | :--- |
| `public.user_role` | `'admin'`, `'editor'` | Hak akses profil pengguna. |
| `public.category_type` | `'product'`, `'article'` | Pemisah kategori produk vs artikel. |
| `public.plan_tier` | `'basic'`, `'pro'`, `'business'` | Tingkatan paket lisensi. |
| `public.plan_unit` | `'user'`, `'outlet'` | Satuan kuota lisensi per bulan. |
| `public.article_status` | `'draft'`, `'published'` | Status publikasi artikel. |
| `public.market` | `^[a-z]{2}$` (default: `'id'`) | Kode pasar regional. |
| `public.slug` | `^[a-z0-9]+(-[a-z0-9]+)*$` (1–120 char) | URL ramah SEO. |

---

## 3. Detail Tabel & Relasi

### A. Tabel `products` & `product_plans`
* **`products`**:
  * `id`: UUID (PK)
  * `slug`: Text (Unique per `market_code`)
  * `name`, `tagline`, `description`
  * `category_id`: FK -> `categories.id` (dengan trigger proteksi tipe `'product'`)
  * `thumbnail_url`, `screenshots` (JSONB array `[{url, alt}]`)
  * `features` (JSONB array `["fitur1", "fitur2"]`)
  * `featured_rank`: Integer (Null = tidak tampil di hero/top listing landing page)
  * `promo_starts_at`, `promo_ends_at`, `promo_quota_remaining`
  * `is_active`: Boolean
* **`product_plans`**:
  * `id`: UUID (PK)
  * `product_id`: FK -> `products.id` (Cascade delete)
  * `tier`: `plan_tier` (Unique per `product_id`)
  * `unit`: `plan_unit` (default: `'user'`)
  * `price`: Integer (Rupiah, > 0)
  * `promo_price`: Integer (Nullable, harus < `price`)
  * `min_qty`, `max_qty`: Integer
  * `features`: JSONB array

### B. Tabel `categories`
* `id`: UUID (PK)
* `type`: `category_type` (`'product'` | `'article'`)
* `slug`: Slug (Unique per `type`)
* `name`: Text (1–80 char)

### C. Tabel `articles` & `article_products`
* **`articles`**:
  * `id`: UUID (PK)
  * `market_code`: Text (default `'id'`)
  * `slug`: Slug (Unique per `market_code`)
  * `title`, `excerpt`, `cover_url`, `cover_alt`, `content_html`
  * `category_id`: FK -> `categories.id` (trigger tipe `'article'`)
  * `status`: `article_status` (`'draft'` | `'published'`)
  * `published_at`: Timestamptz (auto-fill jika status berubah jadi `'published'`)
  * `seo_title`, `seo_description`, `author_name`
* **`article_products`**:
  * Composite PK: (`article_id`, `product_id`)
  * `rank`: Urutan produk yang di-highlight dalam artikel

### D. Tabel `leads` & Proteksi Anti-Spam
* Atribut: `name`, `email`, `whatsapp`, `source_cta`, UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, dll.), `landing_path`, `referrer`, `ip_hash`.
* **Proteksi (Migrasi `000002_lead_protection.sql`)**:
  * Trigger otomatis menormalisasi nomor WhatsApp (awalan 08 -> 628).
  * Rate-limit: Maksimal 3 kali submit lead per IP hash dalam kurun waktu 1 jam.
  * Mencegah spam bot langsung di tingkat database PostgreSQL.

### E. Tabel Pendukung: `landing_hero`, `testimonials`, `faqs`, `site_settings`
* `landing_hero`: Konfigurasi judul hero, subtitle, image, CTA label & href per `market_code`.
* `testimonials`: Ulasan pelanggan, nama, role, perusahaan, kutipan, avatar, dan ranking.
* `faqs`: Daftar tanya jawab terurut (`rank`) yang dipublikasikan.
* `site_settings`: Konfigurasi global berbasis key-value JSONB (flag `is_public` menentukan apakah terbaca oleh pengunjung publik anonim).

---

## 4. Pemetaan Entitas FSD (`entities/`)

Setiap entitas di layer `entities/` bertugas mengelola TypeScript type, fetcher data, dan komponen kartu atomik:

| Folder FSD | Entitas Domain | Komponen Utama | Fetcher Utama |
| :--- | :--- | :--- | :--- |
| `entities/product` | `Product`, `ProductPlan` | `<ProductCard />`, `<ProductPlanCard />`, `<PromoBadge />` | `getFeaturedProducts()`, `getProductBySlug(slug)` |
| `entities/article` | `Article` | `<ArticleCard />`, `<ArticleHeader />`, `<ArticleContent />` | `getPublishedArticles()`, `getArticleBySlug(slug)` |
| `entities/lead` | `Lead` | `<LeadStatusCard />` | `createLeadAction(data)` (Server Action) |
| `entities/category` | `Category` | `<CategoryBadge />`, `<CategoryTabs />` | `getCategories(type)` |
| `entities/faq` | `Faq` | `<FaqAccordionItem />` | `getFaqs()` |
| `entities/testimonial` | `Testimonial` | `<TestimonialCard />` | `getTestimonials()` |
| `entities/hero` | `LandingHero` | `<HeroHeadline />` | `getLandingHero()` |
| `entities/user` | `Profile` | `<UserAvatar />`, `<RoleBadge />` | `getCurrentProfile()` |

---

## 5. Standar TypeScript Types di `shared/api/supabase/types.ts`

Semua entitas akan merujuk pada tipe database terpusat yang dihasilkan dari skema Supabase:
- `Product`: Representasi baris produk + opsional join `category` & `product_plans`.
- `LeadInput`: Payload form validasi untuk pembuatan lead baru (Zod schema di `features/submit-lead`).
