# 08 — Tahap 6: Testing, Keamanan, & Deployment

Dokumen ini menjelaskan prosedur pengujian, audit keamanan database Supabase, dan persiapan deployment produksi untuk proyek **Kodeva**.

---

## 1. Verifikasi Keamanan Supabase & RLS (Row Level Security)

Database Kodeva dirancang dengan prinsip *Defense in Depth*. Setiap tabel yang diekspos ke Data API publik wajib dilindungi RLS ketat.

### A. Uji Coba Smoke Test RLS (`supabase-migrations/rls_smoke.sql`)
File uji `rls_smoke.sql` telah disediakan di repositori. Uji ini mencakup verifikasi skenario:
1. **Akses Anonim (Publik)**:
   - ✅ Dapat membaca produk berstatus `is_active = true`.
   - ✅ Dapat membaca artikel berstatus `status = 'published'`.
   - ✅ Dapat membaca `faqs` dan `testimonials` yang `is_published = true`.
   - ✅ Dapat membaca `site_settings` yang `is_public = true`.
   - ✅ Dapat melakukan `INSERT` ke tabel `leads`.
   - ❌ **Dilarang** membaca data `leads` milik siapa pun.
   - ❌ **Dilarang** membaca artikel bertipe `'draft'`.
   - ❌ **Dilarang** melakukan mutasi (`UPDATE`/`DELETE`) ke produk, artikel, atau kategori.
2. **Proteksi Anti-Spam Leads (`lead_protection.sql`)**:
   - Uji normalisasi nomor WhatsApp (misal input `08123456789` otomatis diubah menjadi `628123456789`).
   - Uji penolakan submit ke-4 dari IP hash yang sama dalam jendela waktu 1 jam.

---

## 2. Pengujian Frontend & Validasi FSD

### A. Audit Batasan Layer (*Boundary Check*)
Memastikan tidak ada pelanggaran aturan FSD:
- Tidak ada import yang mengarah ke atas (*bottom-to-top*).
- Tidak ada import antar-slice pada layer yang sama (*cross-slice dependency*).
- Semua impor melewati Public API (`index.ts`).

### B. Validasi Type Checking & Linter
Jalankan perintah berikut sebelum penggabungan kode:
```bash
# Validasi TypeScript
pnpm tsc --noEmit

# Validasi Linter ESLint
pnpm lint
```

### C. Pengujian Tampilan Responsif & Desain
- Pastikan canvas krem `#f5f1e4` membentang konsisten di seluruh viewport.
- Pastikan tidak ada border-radius tajam (< 10px) pada komponen utama.
- Pastikan floating navigation pill tetap presisi dan tidak overflow di layar smartphone (< 400px).

---

## 3. Checklist Kesiapan Deployment Produksi

### A. Konfigurasi Lingkungan Produksi (Vercel / Hosting)
Pastikan Environment Variables berikut terpasang di platform deployment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

### B. Konfigurasi Cache & Revalidasi Next.js
- Gunakan `revalidatePath` atau cache tag Supabase pada saat admin mengubah data produk atau mempublikasikan artikel baru.
- Halaman katalog publik memanfaatkan Server-Side Rendering (SSR) dengan caching terukur agar performa Time-to-First-Byte (TTFB) dan LCP (Largest Contentful Paint) tetap optimal.

### C. Checklist Final Go-Live:
- [ ] Migrasi database `000001` s.d `000004` sukses diaplikasikan di instans Supabase produksi.
- [ ] User admin pertama dibuat via script `supabase-migrations/seed_admin_example.sql`.
- [ ] RLS diaktifkan di seluruh tabel skema `public`.
- [ ] Favicon, OpenGraph image, dan sitemap XML telah terhubung.
- [ ] Build Next.js sukses tanpa peringatan deprecation kritis (`pnpm build`).
