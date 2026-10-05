# Catatan Penggunaan AI (AI_LOG.md)

Dokumen ini disusun sebagai bentuk transparansi dan evaluasi kritis terhadap penggunaan alat bantu Artificial Intelligence (AI) dalam pengerjaan Technical Skill Test Fullstack Developer di **PT Digital Solusi Grup**.

---

## 1. Alat Bantu AI yang Digunakan & Cakupan Tugas

| Alat Bantu AI | Cakupan Penggunaan dalam Project |
|:---|:---|
| **Antigravity CLI (Agentic AI Engine)** | Eksplorasi arsitektur FSD, pembuatan boilerplate tipe TypeScript, penyusunan komponen UI MindMarket, penulisan query fetcher Supabase, dan pembacaan log kompilasi. |
| **LLM Reasoning (Claude 3.7 Sonnet / Gemini Pro)** | Evaluasi arsitektur perbandingan state management (Zustand vs Redux vs Context), perumusan skema mitigasi race condition kuota database, dan perumusan struktur data GA4 e-commerce. |

---

## 2. Contoh Prompt yang Paling Membantu & Efektif

### Prompt 1: Perumusan Logika Validasi Kuota Promo Lintas Paket
> *"Implementasikan Zustand store untuk keranjang belanja di Next.js 16 yang memiliki aturan validasi khusus: kuota promo melekat pada produk induk, bukan pada tier paket individual. Jika user memiliki Basic (60 unit) dan Pro (30 unit), lalu mencoba menambahkan Business (20 unit) untuk produk yang kuotanya 100, hitung akumulasi seluruh tier produk tersebut (110 unit) dan tolak transaksi dengan pesan error detail berapa unit yang berlebih. Pastikan store tersinkronisasi ke localStorage."*
* **Mengapa Efektif:** Prompt memberikan batasan bisnis yang eksplisit, contoh angka matematis yang konkret, dan perilaku penolakan yang diharapkan, sehingga menghasilkan kode state management yang terstruktur rapi.

### Prompt 2: Skema Proteksi Anti-Spam Lead Tanpa Menyimpan IP Mentah
> *"Buat fungsi Server Action di Next.js untuk menerima form lead (nama, email/whatsapp). Demi privasi data, jangan simpan IP address mentah ke database. Buatkan hash sha256 dari IP address digabung dengan secret salt dari environment variable. Batasi maksimal 5 submission per hash per jam."*
* **Mengapa Efektif:** Mengarahkan AI untuk menerapkan best-practice keamanan data dan privasi pengguna tanpa kompromi.

### Prompt 3: Tracking GA4 dataLayer yang Bebas Duplikasi Re-Render
> *"Buat modul utility TypeScript untuk mengirimkan event GA4 dataLayer ('view_item', 'add_to_cart', 'begin_checkout'). Pastikan pemanggilan di React 19 Client Component tidak memicu pengiriman event ganda akibat re-render atau React StrictMode."*
* **Mengapa Efektif:** Secara spesifik mengingatkan AI akan karakteristik `useEffect` di React StrictMode yang sering memicu event duplikat jika tidak dijaga menggunakan guard ref.

---

## 3. Evaluasi Kritis: Studi Kasus Kesalahan AI & Cara Mengatasinya

### Kasus 1: Kesalahan Skema DDL SQL & Sintaks UUID Non-Hex
* **Deskripsi Kesalahan:**
  Saat membuat file migrasi data seed katalog awal (`seed_catalog.sql`), AI menghasilkan skrip SQL yang mencoba menyisipkan kolom `description`, `sort_order`, dan `market_code` ke tabel `categories`. Padahal skema tabel `categories` yang telah disepakati hanya memiliki kolom `(id, type, slug, name)`. Selain itu, AI membuat dummy ID berupa string `p1000000-0000-0000-0000-000000000001` dan `t1000000-0000-0000-0000-000000000001`, yang mengandung huruf non-heksadesimal (`p` dan `t`).
* **Bagaimana Masalah Ditemukan:**
  Ketika mengeksekusi seed SQL ke Supabase remote via CLI (`supabase db query --linked`), terminal mengembalikan pesan error dari PostgreSQL:
  ```
  ERROR: 42703: column "description" of relation "categories" does not exist
  ERROR: 22P02: invalid input syntax for type uuid: "p1000000-0000-0000-0000-000000000001"
  ```
* **Bagaimana Diperbaiki:**
  1. Melakukan inspeksi langsung pada file skema dasar `supabase-migrations/20261005000001_schema.sql` dan `database.types.ts`.
  2. Menyesuaikan klausa `INSERT` tabel `categories` hanya pada kolom `(id, type, slug, name)`.
  3. Mengganti format UUID ke karakter heksadesimal yang valid (`0-9`, `a-f`), misalnya `d1000000-...` untuk produk dan `e1000000-...` untuk testimoni.
* **Verifikasi Hasil Akhir:**
  Query ulang via Node.js script membuktikan seluruh 6 produk, 18 paket lisensi, 4 artikel blog, 5 FAQ, dan 3 review testimoni berhasil masuk ke database PostgreSQL tanpa error.

---

### Kasus 2: Ketidaksesuaian Properti Model `ProductPlan` pada Komponen Interaktif
* **Deskripsi Kesalahan:**
  Saat membuat komponen client `ProductOrderConfigurator.tsx`, AI mengasumsikan bahwa objek paket `ProductPlan` memiliki properti `plan.name` dan `plan.unit_name`. Kenyataannya, skema relasional tabel `product_plans` di database hanya mendefinisikan kolom `tier` (enum: `basic`, `pro`, `business`) dan `unit` (enum: `user`, `outlet`).
* **Bagaimana Masalah Ditemukan:**
  Ditemukan secara langsung oleh TypeScript compiler saat menjalankan `next build`:
  ```
  error TS2339: Property 'name' does not exist on type 'ProductPlan'.
  error TS2339: Property 'unit_name' does not exist on type 'ProductPlan'.
  ```
* **Bagaimana Diperbaiki:**
  Membuat kamus pemetaan tampilan yang aman secara tipe (*type-safe display mapping*):
  ```ts
  const tierLabels: Record<PlanTier, string> = {
    basic: 'Paket Basic',
    pro: 'Paket Pro',
    business: 'Paket Business',
  };
  ```
  Serta menggunakan `plan.unit` asli dari database alih-alih `plan.unit_name`.
* **Verifikasi Hasil Akhir:**
  Perintah `pnpm build` dijalankan ulang dan berhasil lolos 100% dengan status sukses pada seluruh 13 rute.

---

### Kasus 3: Infinite Re-Render Loop pada `useSyncExternalStore` & `LeadForm`
* **Deskripsi Kesalahan:**
  Saat membuka modal *"Amankan Kuota Promo"*, browser mengalami error fatal:
  `Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.`
* **Bagaimana Masalah Ditemukan:**
  Error tertangkap langsung di runtime console browser saat tombol CTA di klik:
  `features/claim-promo/ui/ClaimPromoButton.tsx (46:9) @ ClaimPromoButton -> <LeadForm>`
* **Akar Masalah (Root Cause):**
  Fungsi `getStoredUtmParams()` mengembalikan objek baru `{}` pada setiap pemanggilan saat data kosong. Ketika diikat ke hook `useSyncExternalStore(subscribeUtm, getStoredUtmParams)`, React mendeteksi bahwa referensi objek snapshot selalu berubah (`Object.is(prev, next) === false`), sehingga memicu render ulang tanpa henti (*infinite re-render loop*). Ditambah lagi callback `onSuccess={() => setIsOpen(false)}` di inline prop selalu dibuat ulang di setiap render.
* **Bagaimana Diperbaiki:**
  1. Menstabilkan snapshot referensial di `shared/lib/utm.ts` menggunakan static singleton `EMPTY_UTM` dan caching stringified snapshot `cachedSnapshot`.
  2. Menyimpan callback `onSuccess` dalam `useRef` di `LeadForm.tsx` agar tidak memicu `useEffect` berulang.
  3. Menerapkan lazy conditional rendering `{isOpen && <Modal ...>}` pada tombol-tombol pemicu modal agar form tidak di-mount saat modal sedang tertutup.
* **Verifikasi Hasil Akhir:**
  Modal terbuka secara instan dan form lead dapat diisi dengan mulus tanpa ada re-render berlebih.

---

### Kasus 4: Upload Media ke Supabase Storage Bucket & RLS Policy
* **Deskripsi Kebutuhan & Integrasi:**
  Fitur upload gambar untuk thumbnail produk dan cover artikel blog menggunakan Supabase Storage bucket `media` (publik, batas 2 MB, tipe: JPEG, PNG, WebP, AVIF).
* **Tantangan & Pengujian:**
  1. Bucket Supabase Storage dilindungi policy RLS `media_editor_all` yang mensyaratkan user memiliki profil `role in ('admin', 'editor')` di tabel `public.profiles`.
  2. Pengecekan awal menemukan bahwa user admin di `auth.users` belum memiliki baris profil terhubung di `public.profiles`, sehingga upload awal ditolak dengan kode `403 AccessDenied`.
* **Bagaimana Diperbaiki:**
  1. Menghubungkan user admin ke `public.profiles` dengan role `admin` melalui query SQL berhak `postgres`.
  2. Membangun modul `features/upload-media` dengan Server Action `uploadMediaAction` yang memanfaatkan `createServerClient` (membawa session cookies terotentikasi) dan komponen interaktif `ImageUploader` yang mendukung drag-and-drop, validasi 2 MB, preview instan, spinner loading, dan opsi fallback URL eksternal.
  3. Mengintegrasikan `ImageUploader` pada modal tambah/edit produk di `AdminProductsPage` dan modal tambah/edit artikel di `AdminArticlesPage`.
* **Verifikasi Hasil Akhir:**
  Linting lolos 0 error dan `pnpm build` sukses mengkompilasi seluruh 13 rute.

---

## 4. Bagian Implementasi yang Banyak Dibantu AI & Pengujian Edge Cases

* **Fitur:** *Multi-Tier Product Promo Quota Accumulation Engine* di `entities/cart/model/cart-store.ts`.
* **Peran AI:** Membantu menyusun struktur reducers Zustand, perhitungan agregasi grup produk, dan middleware persistensi `localStorage`.
* **Edge Cases Kritis yang Diuji:**
  1. **Overflow Lintas Paket:**
     * *Kasus:* Produk POS Kasir memiliki kuota promo tersisa 100. Pengguna memasukkan paket Basic (60 lisensi) dan Pro (30 lisensi). Saat pengguna mencoba menambahkan paket Business (20 lisensi) dari produk yang sama, sistem menghitung total akumulasi: $60 + 30 + 20 = 110$.
     * *Hasil:* Penambahan ditolak dengan notifikasi: *"Total pesanan lisensi untuk Kodeva POS Kasir Pro (110 lisensi) melebihi sisa kuota promo (100 lisensi). Kurangi 10 lisensi untuk melanjutkan."*
  2. **Update Kuantitas di Keranjang:**
     * *Kasus:* Mengubah kuantitas item yang sudah ada di keranjang drawer melalui stepper `[+]`.
     * *Hasil:* Sistem secara dinamis memverifikasi apakah kenaikan tersebut menyebabkan total lisensi produk melanggar kuota. Tombol checkout di keranjang otomatis berubah menjadi *"Sesuaikan Kuota untuk Checkout"* dan dinonaktifkan jika kuota terlampaui.
  3. **Self-Healing saat Item Dihapus:**
     * *Kasus:* Ketika user menghapus paket yang berlebih dari keranjang, kalkulasi kuota seketika dihitung ulang dan peringatan merah otomatis hilang.

---

## 5. Bagian yang Sengaja Ditulis Sendiri Tanpa AI & Alasannya

* **Bagian yang Ditulis Sendiri:**
  1. **Database Deduplication Trigger PostgreSQL (`prevent_duplicate_lead_24h`):**
     * Fungsi PL/pgSQL pada migrasi database yang secara otomatis menolak penyimpanan data prospek jika nomor WhatsApp atau Email yang sama telah mendaftar dalam kurun waktu 24 jam terakhir.
  2. **Struktur Pembagian Layer FSD v2.1:**
     * Penataan direktori hierarkis (`shared/`, `entities/`, `features/`, `widgets/`, `views/`, `app/`) dan isolasi Server vs Client components.
* **Alasan Keputusan:**
  * Model AI sering kali menghasilkan kode yang mencampuradukkan business logic langsung di dalam komponen UI atau API route tunggal tanpa pemisahan tanggung jawab yang jelas.
  * Validasi duplikasi data dan spamming paling aman serta efisien dieksekusi sedekat mungkin dengan lapisan penyimpanan (*database-level trigger*), bukan sekadar mengandalkan validasi JavaScript di browser yang rentan dilewati oleh bot penyerang.

---
**PT Digital Solusi Grup — Kodeva 2026**
