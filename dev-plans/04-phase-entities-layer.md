# 04 — Tahap 2: Implementasi Entities Layer

Dokumen ini menjelaskan rancangan implementasi layer **`entities/`**, yang membungkus representasi domain bisnis, kontrak data, query Supabase, dan komponen visual kartu atomik.

---

## 1. Aturan Khusus Layer Entities

1. **Dilarang Cross-Import Antar-Entitas**:
   - Contoh: `entities/article` **tidak boleh** mengimpor komponen dari `entities/product`.
   - Jika sebuah artikel menampilkan rekomendasi produk, penggabungan ini dilakukan di layer `widgets` (misal: `widgets/article-product-recommendations`) atau di layer `pages`.
2. **Entitas Hanya Mengimpor `shared/`**:
   - Entitas hanya bergantung pada `shared/api/supabase`, `shared/ui`, `shared/lib`, dan `shared/config`.
3. **Public API Wajib**:
   - Setiap folder entitas wajib memiliki file `index.ts` yang mengekspos tipe data, fungsi query, dan komponen UI.

---

## 2. Rincian Slices di Layer `entities/`

### A. Slice `entities/product`
Menangani data katalog produk software dan paket lisensi.
```
entities/product/
├── index.ts
├── model/
│   └── types.ts            # Product, ProductPlan, PlanTier, PlanUnit
├── api/
│   ├── get-featured.ts     # Ambil produk dengan featured_rank tidak null
│   ├── get-by-slug.ts      # Ambil detail produk + relasi product_plans
│   └── list-products.ts    # Filter berdasarkan kategori dan market
└── ui/
    ├── ProductCard.tsx     # Kartu produk utama (thumbnail, title, tagline, starting price)
    ├── ProductPlanCard.tsx # Kartu tier paket (Basic, Pro, Business)
    ├── PromoQuotaBadge.tsx # Indikator sisa kuota promo
    └── FeatureList.tsx     # Render daftar bullet point fitur produk
```

### B. Slice `entities/article`
Menangani artikel ulasan software, panduan, dan komparasi.
```
entities/article/
├── index.ts
├── model/
│   └── types.ts            # Article, ArticleStatus
├── api/
│   ├── get-published.ts    # Ambil artikel berstatus 'published' (urutan published_at DESC)
│   └── get-by-slug.ts      # Ambil artikel lengkap berdasarkan slug
└── ui/
    ├── ArticleCard.tsx     # Kartu artikel (cover, judul, excerpt, tanggal)
    ├── ArticleHeader.tsx   # Header judul & meta artikel
    └── ArticleContent.tsx  # Kontainer render HTML artikel dengan styling typography
```

### C. Slice `entities/lead`
Menangani struktur data penangkap prospek pelanggan.
```
entities/lead/
├── index.ts
├── model/
│   ├── types.ts            # Lead, LeadInput
│   └── schema.ts           # Skema validasi input (nama 2-80 char, validasi format WA / email)
└── ui/
    └── LeadSuccessCard.tsx # Pesan konfirmasi penerimaan penawaran
```

### D. Slice `entities/category`
Menangani taksonomi kategori produk dan artikel.
```
entities/category/
├── index.ts
├── model/
│   └── types.ts            # Category, CategoryType ('product' | 'article')
├── api/
│   └── get-categories.ts   # Ambil kategori berdasarkan type
└── ui/
    ├── CategoryBadge.tsx   # Chip kategori (10px radius)
    └── CategoryTabs.tsx    # Tab pemilih kategori
```

### E. Slice `entities/testimonial`
Menangani ulasan sosial pengguna untuk meningkatkan konversi.
```
entities/testimonial/
├── index.ts
├── model/
│   └── types.ts            # Testimonial
├── api/
│   └── get-testimonials.ts # Ambil testimoni yang is_published = true terurut rank
└── ui/
    └── TestimonialCard.tsx # Kartu kutipan testimoni, nama, avatar, dan role
```

### F. Slice `entities/faq`
Menangani tanya jawab seputar layanan dan lisensi software.
```
entities/faq/
├── index.ts
├── model/
│   └── types.ts            # Faq
├── api/
│   └── get-faqs.ts         # Ambil faqs yang is_published = true terurut rank
└── ui/
    └── FaqItem.tsx         # Item accordion pertanyaan dan jawaban
```

### G. Slice `entities/hero`
Menangani konfigurasi visual headline di halaman utama.
```
entities/hero/
├── index.ts
├── model/
│   └── types.ts            # LandingHero
├── api/
│   └── get-hero.ts         # Ambil teks hero berdasarkan market_code ('id')
└── ui/
    └── HeroDisplay.tsx     # Display headline ukuran besar 140px Inter sesuai STYLES.md
```

---

## 3. Checklist Verifikasi Tahap Entities

- [ ] Fungsi query Supabase menggunakan query terindeks (misal: `products_listing_idx`, `articles_listing_idx`).
- [ ] Komponen UI entitas bersifat *presentational* murni tanpa mutasi state global yang tidak perlu.
- [ ] TypeScript interface 100% konsisten dengan skema di `supabase-migrations/`.
- [ ] Tidak ada dependensi horizontal antar-slice di dalam `entities/`.
