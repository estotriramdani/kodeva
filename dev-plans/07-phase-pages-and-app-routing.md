# 07 — Tahap 5: Pages Layer & App Routing

Dokumen ini menjelaskan rancangan implementasi komposisi halaman pada layer **`pages/`** dan pemetaan rute Next.js 16 App Router pada layer **`app/`**.

---

## 1. Pemisahan Tanggung Jawab: `app/` vs `pages/`

Untuk menjaga arsitektur tetap bersih dan mematuhi kaidah FSD:
- **`app/` (Router & Shell)**:
  - Berfungsi murni sebagai perute (*router entrypoint*), penyedia layout dasar (`layout.tsx`), penentu metadata SEO (`generateMetadata`), dan middleware Next.js.
  - Berkas `page.tsx` di `app/` dibuat seringkas mungkin (*thin wrapper*), hanya bertugas membaca parameter URL lalu memanggil komponen dari layer `pages/`.
- **`pages/` (Page Compositions)**:
  - Komponen halaman utuh yang menggabungkan berbagai widget, layout section, dan konteks halaman.

---

## 2. Struktur Rute & Halaman

```
app/
├── layout.tsx                     # Root HTML & Inter font definition
├── globals.css                    # Tailwind v4 theme & MindMarket styling
├── (marketing)/                   # Route group dengan layout publik
│   ├── layout.tsx                 # Header pill & Footer yellow band
│   ├── page.tsx                   # Rute '/' -> memanggil HomePage
│   ├── produk/
│   │   ├── page.tsx               # Rute '/produk' -> memanggil ProductCatalogPage
│   │   └── [slug]/
│   │       └── page.tsx           # Rute '/produk/[slug]' -> memanggil ProductDetailPage
│   └── artikel/
│       ├── page.tsx               # Rute '/artikel' -> memanggil ArticleListPage
│       └── [slug]/
│           └── page.tsx           # Rute '/artikel/[slug]' -> memanggil ArticleDetailPage
├── admin/                         # Route group untuk dashboard internal
│   ├── login/
│   │   └── page.tsx               # Rute '/admin/login' -> memanggil AdminLoginPage
│   └── dashboard/
│       └── page.tsx               # Rute '/admin/dashboard' -> memanggil AdminDashboardPage
└── middleware.ts                  # Proteksi rute admin & refresh session Supabase
```

Padanan di layer `pages/`:
```
pages/
├── home/
│   ├── index.ts
│   └── ui/HomePage.tsx
├── product-catalog/
│   ├── index.ts
│   └── ui/ProductCatalogPage.tsx
├── product-detail/
│   ├── index.ts
│   └── ui/ProductDetailPage.tsx
├── article-list/
│   ├── index.ts
│   └── ui/ArticleListPage.tsx
├── article-detail/
│   ├── index.ts
│   └── ui/ArticleDetailPage.tsx
└── admin/
    ├── login/ui/AdminLoginPage.tsx
    └── dashboard/ui/AdminDashboardPage.tsx
```

---

## 3. Penanganan Khusus Next.js 16 & React 19

### A. Asynchronous `params` dan `searchParams`
Di Next.js 16, `params` dan `searchParams` bersifat `Promise` yang harus di-`await`:
```tsx
// app/(marketing)/produk/[slug]/page.tsx
import { ProductDetailPage } from '@/pages/product-detail';
import { getProductBySlug } from '@/entities/product';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: 'Produk Tidak Ditemukan | Kodeva' };
  }

  return {
    title: `${product.name} — ${product.tagline ?? 'Software Indonesia'} | Kodeva`,
    description: product.description.slice(0, 160),
    openGraph: {
      images: product.thumbnail_url ? [product.thumbnail_url] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
```

### B. Middleware Autentikasi (`middleware.ts`)
Menggunakan helper dari `@/shared/api/supabase/middleware` untuk:
1. Memperbarui token autentikasi pengguna secara otomatis di setiap request.
2. Memastikan rute `/admin/dashboard` hanya dapat diakses oleh user yang telah terotentikasi dan memiliki profil role `admin` atau `editor`.

---

## 4. Checklist Verifikasi Tahap Pages & App

- [ ] Setiap file `app/**/page.tsx` berukuran ringkas (< 40 baris kode).
- [ ] Metadata dinamis (OpenGraph, Twitter card, Title) terbentuk sempurna di halaman produk dan artikel.
- [ ] Middleware me-redirect pengunjung yang belum login saat mencoba mengakses `/admin/dashboard`.
- [ ] Navigasi antar-halaman berjalan lancar dengan transisi mulus dan SSR optimal.
