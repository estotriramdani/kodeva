# 00 — FSD Architecture Guidelines

Dokumen ini mendefinisikan spesifikasi dan aturan implementasi arsitektur **Feature-Sliced Design (FSD v2.1)** untuk proyek **Kodeva** dengan **Next.js 16 (App Router)**.

---

## 1. Hirarki Layer FSD

FSD membagi kode aplikasi menjadi 6 layer standar. Setiap layer memiliki tanggung jawab yang terisolasi dan hierarki yang ketat:

```
[Top Layer: Paling tinggi ketergantungan konteks bisnis]
1. app/       -> Konfigurasi global aplikasi, routing Next.js, layout root, global CSS.
2. pages/     -> Komposisi halaman utuh (Page Views), menghubungkan widgets & features.
3. widgets/   -> Blok UI besar dan mandiri (Hero, Header, Footer, Catalog, Modal).
4. features/  -> Aksi dan interaksi bisnis pengguna (SubmitLead, FilterProducts, AuthLogin).
5. entities/  -> Domain bisnis, tipe data, fetcher database, UI card atomik.
6. shared/    -> Reusable utilities, API client (Supabase), UI Kit dasar, token desain.
[Bottom Layer: Bebas dari logika bisnis, pure reusable]
```

### Aturan Utama FSD (*Golden Rules*):
1. **Unidirectional Dependency (Searah ke Bawah)**: Modul pada layer $L$ hanya boleh mengimpor modul dari layer di bawahnya ($L-1, L-2, ...$). Modul **dilarang keras** mengimpor modul dari layer di atasnya.
2. **No Cross-Slice Imports pada Layer yang Sama**:
   - Di layer `features`, `entities`, `widgets`, atau `pages`, slice $A$ **tidak boleh** mengimpor langsung dari slice $B$ pada layer yang sama.
   - *Solusi jika butuh komposisi*: Gabungkan di layer atasnya (misal: widget atau page yang mengorkestrasikan beberapa entities/features), atau jika benar-benar generic, turunkan ke layer `shared`.
3. **Public API Enforced**:
   - Setiap slice harus mengekspos kemampuannya secara eksplisit melalui file `index.ts`.
   - Modul luar dilarang mengimpor internal file dari slice lain.
   - ✅ Benar: `import { ProductCard } from '@/entities/product'`
   - ❌ Salah: `import { ProductCard } from '@/entities/product/ui/ProductCard'`

---

## 2. Adaptasi FSD dengan Next.js 16 App Router

Next.js App Router mengharuskan folder `app/` menangani routing file-system (`page.tsx`, `layout.tsx`, `route.ts`). Agar FSD tetap bersih:

### Aturan Folder `app/`:
Folder `app/` diperlakukan sebagai **Routing & Orchestration Shell** yang tipis (*Thin Routing Layer*):
- File `app/**/page.tsx` **tidak boleh** memuat logika bisnis atau JSX UI yang panjang.
- Tanggung jawab `page.tsx` hanya:
  1. Menangkap route params / search params.
  2. Menentukan metadata SEO (`generateMetadata` / `metadata`).
  3. Memanggil komponen halaman dari layer `pages/` (misal: `<HomePage />`, `<ProductDetailPage slug={slug} />`).

### Contoh Implementasi:

```tsx
// app/produk/[slug]/page.tsx (App Layer - Thin Entrypoint)
import { ProductDetailPage } from '@/pages/product-detail';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Metadata fetcher dari entity
  return { title: `Produk ${slug} | Kodeva` };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailPage slug={slug} />;
}
```

---

## 3. Struktur Anatomi Slice & Segments

Setiap slice di dalam layer `entities`, `features`, dan `widgets` diorganisir menggunakan segment standar berikut:

```
[layer]/[slice]/
├── index.ts           # Public API (wajib ada)
├── ui/                # Komponen representasional (React)
│   ├── Component.tsx
│   └── Component.module.css (opsional)
├── model/             # State, store, hooks, validasi skema (Zod), types
│   ├── types.ts
│   ├── schemas.ts
│   └── use-logic.ts
├── api/               # Query / mutation database Supabase, Server Actions
│   └── get-data.ts
└── lib/               # Helper khusus untuk slice ini
```

### Contoh Konkret Slice Entitas `product`:
```
entities/product/
├── index.ts                   # Export: ProductCard, ProductPlanCard, useProduct, Product type
├── ui/
│   ├── ProductCard.tsx        # UI card sesuai STYLES.md
│   ├── ProductPlanCard.tsx    # Kartu tier paket (Basic/Pro/Business)
│   └── PromoBadge.tsx         # Badge kuota promo
├── model/
│   ├── types.ts               # Interface Product, ProductPlan, PlanTier
│   └── schemas.ts             # Schema validasi Zod
└── api/
    ├── get-product.ts         # Query Supabase by slug
    └── get-featured-products.ts
```

---

## 4. Konfigurasi Path Aliases (`tsconfig.json`)

Untuk mendukung keterbacaan import FSD yang bersih dan rapi:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/app/*": ["./app/*"],
      "@/pages/*": ["./pages/*"],
      "@/widgets/*": ["./widgets/*"],
      "@/features/*": ["./features/*"],
      "@/entities/*": ["./entities/*"],
      "@/shared/*": ["./shared/*"]
    }
  }
}
```

---

## 5. Ringkasan Do's & Don'ts FSD

### ✅ DO:
- Selalu buat `index.ts` sebagai pintu gerbang (*Public API*) untuk setiap slice.
- Pindahkan logika utilitas yang tidak memiliki keterikatan domain bisnis ke `shared/lib/` atau `shared/ui/`.
- Gunakan React Server Components (RSC) secara default pada layer `pages/`, `widgets/`, dan `entities/` kecuali jika membutuhkan interaktivitas klien (`"use client"` diisolasi di `features/` atau komponen spesifik).

### ❌ DON'T:
- Dilarang mengimpor komponen dari layer `widgets` ke dalam layer `features` atau `entities`.
- Dilarang membuat kode "god-object" di `shared` yang memuat logika spesifik produk atau leads.
- Dilarang menulis implementasi view lengkap di dalam `app/**/page.tsx`.
