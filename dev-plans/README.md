# Kodeva — Master Development Plan & FSD Documentation Index

Dokumen ini merupakan panduan utama arsitektur dan peta jalan (*roadmap*) pengembangan proyek **Kodeva**, yang dibangun menggunakan arsitektur **Feature-Sliced Design (FSD v2.1)** di atas **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, dan **Supabase**.

---

## 🗺️ Daftar Dokumen Perencanaan & FSD

Rangkaian rencana pengembangan disusun secara runut dan terstruktur ke dalam dokumen-dokumen spesifikasi arsitektur dan tahapan pengerjaan berikut:

| No | Dokumen | Kategori | Deskripsi |
| :--- | :--- | :--- | :--- |
| **00** | [00-fsd-architecture-guidelines.md](./00-fsd-architecture-guidelines.md) | **Spesifikasi FSD** | Panduan arsitektur FSD, aturan isolasi layer (*dependency rule*), struktur segment (`ui`, `model`, `api`, `lib`), dan aturan Public API. |
| **01** | [01-domain-data-model.md](./01-domain-data-model.md) | **Model Domain** | Pemetaan entitas bisnis (Product, Lead, Article, Category, Plan, Profile) terhadap skema database Supabase & TypeScript types. |
| **02** | [02-design-system-integration.md](./02-design-system-integration.md) | **Design System** | Integrasi sistem desain **MindMarket** (`STYLES.md`) ke Tailwind v4 `@theme`, tipografi Inter, dan token warna cream paper. |
| **03** | [03-phase-shared-layer.md](./03-phase-shared-layer.md) | **Tahap 1: Shared** | Implementasi layer `shared/` (Supabase SSR client, base UI kit, utility formatting rupiah, constants). |
| **04** | [04-phase-entities-layer.md](./04-phase-entities-layer.md) | **Tahap 2: Entities** | Implementasi model domain, data fetcher, dan UI atomik untuk entitas `product`, `lead`, `article`, `category`, `faq`, `testimonial`. |
| **05** | [05-phase-features-layer.md](./05-phase-features-layer.md) | **Tahap 3: Features** | Implementasi interaksi bisnis: `submit-lead`, `filter-products`, `auth-login`, `claim-promo`. |
| **06** | [06-phase-widgets-layer.md](./06-phase-widgets-layer.md) | **Tahap 4: Widgets** | Komposisi UI blok mandiri: Floating Pill Header, Hero Section, Catalog Grid, Lead Capture Modal, Footer Band. |
| **07** | [07-phase-pages-and-app-routing.md](./07-phase-pages-and-app-routing.md) | **Tahap 5: Pages & App** | Komposisi halaman penuh (`pages/`) dan wiring rute Next.js App Router (`app/`), SEO metadata, dan route handlers. |
| **08** | [08-testing-security-deployment.md](./08-testing-security-deployment.md) | **Tahap 6: QA & Security** | Validasi keamanan RLS Supabase, smoke test, optimasi performa Core Web Vitals, dan checklist deployment. |

---

## 🏗️ Gambaran Alur Ketergantungan FSD

Dalam FSD, ketergantungan modul bersifat **satu arah ke bawah** (*unidirectional downward dependency*). Modul pada layer atas boleh mengimpor modul di layer bawahnya, namun **tidak boleh** mengimpor ke samping (*cross-slice*) pada layer yang sama, dan **dilarang keras** mengimpor modul di layer atasnya.

```
┌────────────────────────────────────────────────────────┐
│                      app/                              │  (Next.js App Router, Global Providers)
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                     pages/                             │  (Halaman komposit)
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                    widgets/                            │  (Blok UI mandiri)
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                    features/                           │  (Aksi & interaksi pengguna)
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                    entities/                           │  (Model data & representasi domain)
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                     shared/                            │  (UI Kit dasar, Supabase Client, Libs)
└────────────────────────────────────────────────────────┘
```

---

## ⚡ Prinsip Eksekusi

1. **Strict Public API (`index.ts`)**: Semua ekspor dari setiap slice harus melewati file `index.ts` pada root slice tersebut. Tidak diperbolehkan mengimpor langsung internal path dari slice lain (misal: `@/entities/product/ui/Card` ❌ -> gunakan `@/entities/product` ✅).
2. **Desain Tanpa Kompromi**: Tampilan mengikuti acuan ketat [`STYLES.md`](../STYLES.md) (aesthetic paper-cut, warm cream background, roundness 50px, tanpa shadow digital).
3. **Database & Keamanan Ketat**: Menjaga RLS Postgres Supabase, rate limiting anti-flood pada submit lead, dan pemisahan role admin/editor.
