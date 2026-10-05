# Analisis Gap & Evaluasi Requirement Kodeva

Dokumen ini menyajikan hasil audit menyeluruh antara kode yang telah diimplementasikan dalam repositori **Kodeva** terhadap dokumen spesifikasi teknis resmi [requirement.md](file:///c:/Users/Lenovo/Documents/development/kodeva/requirement.md) (*Take-home Technical Skill Test Fullstack Developer — PT Digital Solusi Grup*).

---

## 1. Ringkasan Eksekutif (Executive Summary)

* **Estimasi Pemenuhan Requirement Saat Ini:** ~**55% - 60%**
* **Fondasi yang Sudah Sangat Baik:**
  * Arsitektur **Feature-Sliced Design (FSD v2.1)** terstruktur rapi pada Next.js 16 App Router & React 19.
  * Desain visual konsisten dengan panduan **MindMarket / Paper Canvas** (bebas shadow digital, border hairline, sudut tumpul 50px, palet warna *ink black, coral, sunshine yellow*).
  * Supabase SSR Client & Server actions aman dari kebocoran data dengan RLS.
  * Form Lead Capture memiliki proteksi anti-spam berlapis (Client debounce + Server IP hash rate-limit 5/jam + PostgreSQL trigger 24h deduplication).
  * Admin CMS Dashboard untuk mengelola Produk, Artikel, dan Kategori sudah aktif dengan persistent sidebar UX.
* **Area Kritis yang Belum Selesai (High Priority Gaps):**
  1. **Bagian B — Mini Marketplace Frontend:**
     * Belum ada fitur **Keranjang Belanja (Cart)** dengan persistensi `localStorage`.
     * Belum ada **Validasi Kuota Promo Lintas Paket (Multi-Tier Quota Validation)**: akumulasi total lisensi produk dalam keranjang tidak boleh melebihi kuota promo produk (Basic + Pro + Business ≤ Quota).
     * Belum ada **Halaman Checkout** lengkap dengan form pembeli, ringkasan pesanan, dan simulasi pembayaran (Status Sukses vs Gagal).
     * Detail produk belum memiliki **Pilihan Paket (Basic, Pro, Business) interaktif** yang seketika mengubah harga dan menambahkan paket ke keranjang.
  2. **Bagian C — Kebutuhan Marketing:**
     * Belum ada implementasi **GA4 `dataLayer` tracking** (`view_item`, `add_to_cart`, `begin_checkout`, dan klik CTA landing page) yang bebas duplikasi re-render.
     * Belum ada **UTM Attribution Engine** yang menyimpan parameter URL (`utm_source`, `utm_campaign`, dll.) melintasi halaman dan meneruskannya ke data Lead serta Checkout order.
  3. **Data Katalog:**
     * Database Supabase masih kosong (0 produk, 0 artikel, 0 kategori). Perlu disiapkan data dummy/seed minimal **6 produk software UMKM** lengkap dengan 3 paket lisensi.
  4. **Dokumentasi & Deliverables:**
     * `README.md` belum memuat jawaban spesifik atas arsitektur backend marketplace, payment gateway, webhook, pengiriman lisensi, dan hasil Lighthouse.
     * `AI_LOG.md` belum dibuat sesuai dengan rubrik penilaian evaluasi AI.

---

## 2. Matriks Pemenuhan Requirement per Bagian

### Bagian A — Website Landing + Blog (CMS)

| No | Kebutuhan Spesifikasi | Status | Catatan & Analisis Implementasi |
|:---|:---|:---:|:---|
| **A.1** | **Hero Section** (Judul, Subjudul, Gambar, CTA menuju katalog) | ✅ Selesai | Komponen `widgets/hero-section` sudah dibuat sesuai estetika MindMarket. Mendukung fallback konten jika database kosong. |
| **A.2** | **Daftar Produk Unggulan** | ⚠️ Sebagian | Komponen `widgets/featured-products` sudah ada, namun saat ini database remote belum di-seed (0 produk). |
| **A.3** | **Testimoni & FAQ** | ✅ Selesai | Komponen `widgets/testimonial-wall` dan `widgets/faq-section` sudah terpasang rapi di landing page. |
| **A.4** | **Content Management (CMS)** | ⚠️ Sebagian | Admin dashboard di `/admin` sudah mendukung manajemen Produk, Artikel, dan Kategori. Namun menu edit Testimoni, FAQ, dan Hero section belum dibuatkan form CMS khususnya (bisa menggunakan fallback/seed SQL). |
| **A.5** | **Lead Capture** (Nama, Email/WhatsApp, tersimpan & dilihat tim marketing) | ✅ Selesai | `features/submit-lead` menyimpan ke tabel `leads`. Tim marketing dapat melihat daftar prospek di tabel `/admin/dashboard`. |
| **A.6** | **Validasi & Proteksi Spam Dasar pada Lead** | ✅ Selesai | Validasi Zod + IP Hash sha256 (rate limit 5 request/jam) + Database Trigger PostgreSQL `prevent_duplicate_lead_24h`. |
| **A.7** | **Halaman Daftar Artikel Blog** | ✅ Selesai | Halaman `/artikel` menampilkan feed kartu artikel dari database/mock. |
| **A.8** | **Pagination Blog** | ❌ **Belum** | Halaman `/artikel` saat ini menampilkan seluruh list tanpa kontrol pagination halaman (`?page=1`). Wajib ditambahkan. |
| **A.9** | **Detail Artikel dengan Slug SEO-Friendly** | ✅ Selesai | Halaman `/artikel/[slug]` sudah terpasang dengan metadata dynamic Next.js. |
| **A.10**| **Artikel Menautkan Produk Marketplace** | ❌ **Belum** | Tabel pivot `article_products` sudah siap di schema Supabase, namun UI rekomendasi produk di bawah artikel (`/artikel/[slug]`) belum dirender. |
| **A.11**| **CMS Publishing & Caching** (tanpa deploy manual) | ✅ Selesai | Memanfaatkan Server Components & Server Actions dengan `revalidatePath`. Tinggal didokumentasikan di `README.md`. |

---

### Bagian B — Mini Marketplace (Frontend)

| No | Kebutuhan Spesifikasi | Status | Catatan & Analisis Implementasi |
|:---|:---|:---:|:---|
| **B.1** | **Katalog Minimal 6 Produk** | ❌ **Belum** | Halaman `/produk` sudah ada dengan filter kategori, namun data produk masih 0 di database. Perlu diinjeksi minimal 6 software bisnis UMKM realistis (Kasir POS, HR Payroll, Akuntansi, dsb). |
| **B.2** | **Filter Kategori Produk** | ✅ Selesai | Komponen `features/filter-products` sudah ada dan terhubung dengan URL/state. |
| **B.3** | **Detail Produk: Screenshot, Harga & Harga Coret** | ✅ Selesai | Template `views/product-detail` sudah menampilkan screenshot fitur, harga normal, harga diskon promo, dan badge kuota promo. |
| **B.4** | **Detail Produk: Pilihan Paket (Basic, Pro, Business) Langsung Mengubah Harga** | ❌ **Belum** | Saat ini halaman detail hanya menampilkan tabel perbandingan harga statis. Belum ada selector paket interaktif yang mengubah harga terpilih dan tombol "Tambah ke Keranjang". |
| **B.5** | **Keranjang Belanja (Cart)** (Tambah, Ubah Qty Lisensi/Outlet, Hapus) | ❌ **Belum** | Belum ada state management cart (Zustand/Context). User belum bisa menambah item, mengubah kuantitas lisensi, atau menghapus item. |
| **B.6** | **Subtotal Otomatis & Persistensi Refresh** | ❌ **Belum** | Keranjang harus otomatis menghitung subtotal dan menyimpan data di `localStorage` agar tidak hilang saat browser di-refresh. |
| **B.7** | **Validasi Kuota Promo Lintas Paket (Multi-Tier Product Quota)** | ❌ **Belum** | **Aturan Kritis:** Jika suatu produk memiliki kuota promo (misal 100) dan user memasukkan Basic (60) + Pro (30) + Business (20) = 110 lisensi, transaksi harus **ditolak** karena total lisensi melebihi kuota 100. Logika akumulasi ini belum dibuat. |
| **B.8** | **Halaman Checkout Sederhana** (Nama, Email, Validasi) | ❌ **Belum** | Belum ada rute `/checkout` yang memuat form data pembeli dan ringkasan pesanan. |
| **B.9** | **Simulasi Pembayaran (Sukses & Gagal)** | ❌ **Belum** | Belum ada tombol atau switch simulasi pembayaran untuk mendemonstrasikan status *Success* dan *Failed*. |
| **B.10**| **State Handling (Loading, Error, Empty)** | ⚠️ Sebagian | Empty state keranjang belanja dan pesan validasi checkout belum ada. |
| **B.11**| **Mobile Cart Experience** (Mudah diakses dari mana saja) | ❌ **Belum** | Perlu tombol keranjang melayang (Floating Cart Button / Drawer) dengan badge jumlah item yang dapat diakses di seluruh halaman. |

---

### Bagian C — Kebutuhan Marketing

| No | Kebutuhan Spesifikasi | Status | Catatan & Analisis Implementasi |
|:---|:---|:---:|:---|
| **C.1** | **Mobile Performance: Lighthouse Mobile ≥ 80** | ⏳ Menunggu Audit | Next.js 16 SSR + Tailwind v4 + Font optimization sudah dioptimalkan. Perlu diuji via Chrome DevTools / Lighthouse CLI dan di-screenshot. |
| **C.2** | **Tracking GA4 dataLayer** (`view_item`, `add_to_cart`, `begin_checkout`, CTA Klik) | ❌ **Belum** | Belum ada utility `dataLayer.push` GA4. Event harus bebas duplikasi re-render dan membawa payload relevan (ID produk, nama, harga, tier paket). |
| **C.3** | **Console/Debug Tracker Indicator** | ❌ **Belum** | Diperlukan logger/helper agar reviewer dapat dengan mudah melihat event dataLayer yang terkirim di browser console. |
| **C.4** | **UTM Attribution Persistence** | ❌ **Belum** | Parameter UTM (`utm_source`, `utm_medium`, `utm_campaign`) dari Instagram/TikTok harus ditangkap di landing page, disimpan di storage (sessionStorage/cookie), dan dikirimkan saat user mengisi Form Lead maupun Checkout. |

---

### Bagian D — Dokumentasi & Persyaratan Pengumpulan

| No | Kebutuhan Spesifikasi | Status | Catatan & Analisis Implementasi |
|:---|:---|:---:|:---|
| **D.1** | **`README.md` Komprehensif** | ❌ **Belum** | Wajib berisi: waktu pengerjaan, cara run lokal, arsitektur FSD & alasan stack, asumsi teknis, status pengerjaan, rencana 1 minggu ke depan, dan rencana backend marketplace (endpoint, payment gateway, webhook, verifikasi, order status, lock kuota promo, pengiriman lisensi), serta screenshot Lighthouse. |
| **D.2** | **`AI_LOG.md` Lengkap** | ❌ **Belum** | Wajib berisi: tools AI yang dipakai, 2-3 prompt paling efektif, minimal 2 contoh koreksi atas kekeliruan AI, implementasi kompleks yang dibantu AI + pengujian edge case, dan bagian yang ditulis manual. |
| **D.3** | **Data Dummy / Seeding Siap Pakai** | ❌ **Belum** | Wajib ada seed data SQL dan fallback mock di kode agar website langsung berfungsi penuh saat dibuka penguji tanpa database kosong. |
| **D.4** | **Git Commit History** | ✅ Selesai | Mengikuti standar *Conventional Commits*, commit teratur dan tidak di-squash. |

---

## 3. Rencana Aksi Penyelesaian (Action Roadmap)

Berikut adalah urutan langkah kerja terstruktur untuk menuntaskan semua gap di atas:

### Langkah 1: Injeksi Data Dummy & Mock Fallback (Katalog 6 Produk UMKM)
* Menyusun skrip SQL seed data dan fallback data lokal untuk minimal 6 produk bisnis UMKM:
  1. **Kodeva POS Kasir Pro** (Aplikasi kasir retail & F&B dengan manajemen multi-outlet).
  2. **Kodeva Payroll & HR Cloud** (Aplikasi absensi GPS, BPJS, PPh 21, dan slip gaji otomatis).
  3. **Kodeva Inventory & Stock Master** (Manajemen gudang, barcode, batch expiry, dan stock opname).
  4. **Kodeva WhatsApp CRM & Marketing Blast** (Customer engagement, auto-reply, dan broadcast promosi UMKM).
  5. **Kodeva Smart Invoice & Billing** (Faktur elektronik, piutang pelanggan, dan pembayaran QRIS).
  6. **Kodeva Resto Kitchen Display & Table Order** (Sistem pemesanan meja dan koki dapur restoran).
* Menyertakan 3 pilihan paket untuk tiap produk: **Basic**, **Pro**, dan **Business** dengan harga normal, harga promo diskon, dan kuota promo terbatas.
* Menyiapkan minimal 3 artikel blog dan data FAQ/testimoni.

### Langkah 2: State Management Keranjang Belanja & Validasi Kuota Promo Lintas Paket
* Membuat modul `features/cart` atau `entities/cart`:
  * State: `items: CartItem[]` (menyimpan `productId`, `productName`, `planTier`, `unitPrice`, `quantity`, `promoQuotaMax`, `unitName`).
  * Persistensi: Sinkronisasi otomatis dua arah dengan `localStorage` (`kodeva_cart_v1`).
  * Actions: `addItem`, `updateQuantity`, `removeItem`, `clearCart`.
  * **Fungsi Validasi Kritis (`validateProductPromoQuotas`)**:
    * Mengelompokkan item keranjang berdasarkan `productId`.
    * Menghitung: $\sum \text{quantity}(tier) \le \text{promoQuotaRemaining}$.
    * Jika Basic (60) + Pro (30) + Business (20) = 110 > Kuota (100), sistem otomatis menolak penambahan atau menampilkan *badge error/warning* yang memblokir proses checkout.
* Membuat widget `widgets/cart-drawer` dan menambahkan **Floating Cart Button** yang sticky di header dan pojok kanan bawah mobile.

### Langkah 3: Interaktivitas Detail Produk & Halaman Checkout
* Memperbarui `views/product-detail`:
  * Menambahkan selector interaktif paket (Basic / Pro / Business) yang mengubah tampilan harga, kalkulasi unit, dan tombol **"Tambah ke Keranjang"**.
* Membuat halaman `app/(marketing)/checkout/page.tsx` & `views/checkout`:
  * Form data pembeli (Nama Lengkap, Email Perusahaan, Nomor WhatsApp).
  * Validasi input format email dan nomor telepon Indonesia.
  * Ringkasan Pesanan (daftar item, kuantitas lisensi, subtotal, potongan promo, total bayar).
  * Panel **Simulasi Pembayaran**:
    * Pilihan metode simulasi: QRIS / Virtual Account.
    * Tombol **"Simulasikan Pembayaran Berhasil"** (menampilkan status sukses, kode invoice referensi, dan instruksi aktivasi lisensi).
    * Tombol **"Simulasikan Pembayaran Gagal"** (menampilkan status gagal, alasan simulasi saldo/timeout, dan opsi coba lagi).

### Langkah 4: Mesin GA4 Tracking & UTM Attribution
* Membuat `shared/lib/analytics.ts`:
  * Fungsi aman pengirim `window.dataLayer.push({ event, ...payload })`.
  * Tracking helper untuk:
    * `view_item`: terpicu sekali saat halaman produk dibuka (menggunakan `useEffect` dengan dependency aman).
    * `add_to_cart`: terpicu saat user memilih paket dan menekan tambah ke keranjang.
    * `begin_checkout`: terpicu saat user menavigasi ke halaman checkout.
    * `cta_click`: terpicu saat tombol CTA di Landing Page ditekan.
  * Logger console informatif (`[GA4 dataLayer] Event triggered: ...`) agar penguji dapat langsung memverifikasi via DevTools.
* Membuat `shared/lib/utm.ts`:
  * Menangkap parameter URL query `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
  * Menyimpan ke `sessionStorage` (`kodeva_utm_params`).
  * Otomatis menginjeksi UTM ke dalam payload Lead Capture dan payload Order Checkout.

### Langkah 5: Penyempurnaan Blog
* Menambahkan pagination sederhana (`?page=1`, `?page=2`) pada `views/article-list`.
* Menambahkan komponen produk tertaut (*Linked Products*) pada `views/article-detail` yang menampilkan kartu produk marketplace yang dibahas dalam artikel.

### Langkah 6: Pembuatan Dokumen Deliverables Wajib
* Menyusun `README.md` secara lengkap menjawab seluruh poin instruksi (waktu pengerjaan, arsitektur, rencana backend & payment gateway, webhook, license delivery, validasi kuota).
* Menyusun `AI_LOG.md` secara transparan dan mendalam (prompting, studi kasus kesalahan AI & cara mengatasinya, verifikasi edge cases).
* Mengambil data audit performa Lighthouse Mobile pada landing page.

---

> Dokumen ini siap dijadikan acuan kerja untuk melanjutkan implementasi tahap berikutnya hingga seluruh kriteria evaluasi terpenuhi 100%.
