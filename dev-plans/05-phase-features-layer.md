# 05 — Tahap 3: Implementasi Features Layer

Dokumen ini menjelaskan rancangan implementasi layer **`features/`**, yang membungkus aksi pengguna, interaktivitas bisnis, Server Actions, dan form submission.

---

## 1. Tanggung Jawab Layer Features

Di FSD, sebuah **feature** merepresentasikan interaksi pengguna yang memberikan nilai bisnis langsung. Feature boleh mengimpor dari layer `entities` dan `shared`, tetapi **dilarang keras** mengimpor dari layer `widgets` atau sesama `features`.

---

## 2. Rincian Slices di Layer `features/`

### A. Slice `features/submit-lead` (Aksi Utama Konversi)
Menangani pengisian form prospek oleh calon pembeli produk/software.
```
features/submit-lead/
├── index.ts
├── api/
│   └── submit-lead.action.ts   # Next.js Server Action ke tabel public.leads
├── model/
│   ├── use-submit-lead.ts      # Hook state form, loading, error, success
│   └── get-lead-metadata.ts    # Helper ekstraksi UTM & referrer dari URL / cookies
└── ui/
    ├── LeadForm.tsx            # Form lengkap (Nama, WhatsApp/Email, tombol CTA coral)
    └── SubmitButton.tsx        # Tombol submit dengan indikator proses
```

#### Alur Penanganan Keamanan & Rate Limit:
1. Form mengumpulkan data: nama, email/WhatsApp, sumber CTA (`source_cta`), dan parameter kampanye UTM.
2. Server Action membaca IP pengguna dan membuat `ip_hash`.
3. Server Action melakukan `INSERT` ke tabel `public.leads`.
4. Jika PostgreSQL mendeteksi rate limit terlampaui (> 3 submit per jam dari IP yang sama via migrasi `000002_lead_protection.sql`), database akan memunculkan exception. Server Action menangkap pesan ini dan mengembalikan feedback yang ramah ke pengguna tanpa membocorkan detail internal.

### B. Slice `features/filter-products`
Menangani interaksi pemilahan katalog produk berdasarkan kategori dan pencarian kata kunci.
```
features/filter-products/
├── index.ts
├── model/
│   └── use-product-filter.ts   # Sinkronisasi state filter dengan Next.js URL SearchParams
└── ui/
    ├── CategoryFilterPills.tsx # Kumpulan pil filter kategori
    └── SearchInput.tsx         # Input pencarian nama produk
```

### C. Slice `features/auth`
Menangani otentikasi admin dan editor untuk dashboard internal.
```
features/auth/
├── index.ts
├── api/
│   ├── login.action.ts         # Sign in dengan Supabase Auth
│   └── logout.action.ts        # Sign out dan membersihkan session cookies
├── model/
│   └── use-auth-session.ts     # Hook pengecekan status login & role
└── ui/
    ├── LoginForm.tsx           # Form input email & password
    └── SignOutButton.tsx       # Tombol logout di navigasi admin
```

### D. Slice `features/claim-promo`
Menangani alur ketika calon pembeli memilih tombol tier paket promo tertentu.
```
features/claim-promo/
├── index.ts
├── model/
│   └── use-claim-promo.ts      # Menyimpan referensi product_id dan tier yang dipilih
└── ui/
    └── ClaimPromoTrigger.tsx   # Tombol pemicu yang membuka Lead Capture Modal dengan payload paket
```

---

## 3. Checklist Verifikasi Tahap Features

- [ ] Form submit lead tervalidasi di client dan server sebelum dikirim ke database.
- [ ] Proteksi IP hash dan trigger anti-flood berfungsi secara elegan saat dicoba bertubi-tubi.
- [ ] Filter produk terintegrasi dengan URL query parameters (`?kategori=erp`) sehingga dapat di-share/bookmark.
- [ ] Autentikasi memanfaatkan cookie handling `@supabase/ssr` tanpa kebocoran session.
