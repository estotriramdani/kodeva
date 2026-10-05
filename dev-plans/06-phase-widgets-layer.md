# 06 — Tahap 4: Implementasi Widgets Layer

Dokumen ini menjelaskan rancangan implementasi layer **`widgets/`**, yang bertugas menyusun blok UI besar, otonom, dan dapat digunakan ulang di berbagai halaman.

---

## 1. Tanggung Jawab Layer Widgets

Sebuah **widget** bertindak sebagai komposer yang menggabungkan:
- Beberapa komponen representasional dari layer `entities/`.
- Logika interaksi dari layer `features/`.
- Fondasi visual dari layer `shared/`.

Widget **dilarang keras** mengimpor dari layer `pages/` atau `app/`.

---

## 2. Rincian Slices di Layer `widgets/`

### A. `widgets/header` (Floating Pill Navigation)
Mengacu langsung pada komponen kunci di [`STYLES.md`](../STYLES.md):
- Bentuk bilah kapsul mengambang (*white pill*, radius 50px) dengan latar belakang `#ffffff` di atas kanvas krem.
- **Elemen Navigasi**:
  - Logo Kodeva di kotak sudut tumpul (10–20px radius).
  - Tautan menu utama (Produk, Artikel, Tentang Kami) dengan tipografi Inter 15px weight 500 warna `#2c2e2a`.
  - Tombol menu toggle bundar 40px berwarna hijau Fresh Grass (`#8ed462`).
  - Tombol aksi utama: Tombol ghost-pill dengan aksen titik bundar biru/hijau di sisi kanan.

### B. `widgets/hero-section`
- Headline ukuran ekstrem (140–144px Inter 500, letter-spacing -0.06em, line-height 0.95).
- Teks subheadline (17–20px).
- Panel seni karakter bergaya *paper-cut* yang menyatu alami dengan kanvas krem tanpa bingkai kaku.
- Tombol CTA penawaran langsung.

### C. `widgets/featured-products`
- Menyajikan produk-produk unggulan teratas (`featured_rank` terisi).
- Mengorkestrasikan `<ProductCard />` dari `entities/product` dan tombol interaksi dari `features/claim-promo`.

### D. `widgets/product-catalog`
- Menyajikan seluruh katalog produk aktif.
- Mengintegrasikan bilah filter kategori dari `features/filter-products` dengan grid produk.

### E. `widgets/pricing-table`
- Menampilkan perbandingan paket tier (`basic`, `pro`, `business`) untuk halaman detail produk.
- Menampilkan harga promo, sisa kuota, dan fitur tiap tier.

### F. `widgets/lead-capture-modal`
- Modal interaktif yang terbuka saat pengunjung menekan tombol penawaran atau klaim diskon.
- Membungkus `<LeadForm />` dari `features/submit-lead` dengan dialog overlay bergaya *sticker-soft*.

### G. `widgets/article-grid` & `widgets/article-detail-view`
- `article-grid`: Daftar kartu artikel di blog atau landing page.
- `article-detail-view`: Tampilan artikel penuh, informasi penulis, dan daftar produk software terkait yang direkomendasikan di artikel tersebut.

### H. `widgets/faq-section`
- Daftar accordion tanya jawab yang rapi menggunakan komponen dari `entities/faq`.

### I. `widgets/testimonial-wall`
- Galeri ulasan dan bukti sosial dari `entities/testimonial` untuk memperkuat kepercayaan pengunjung.

### J. `widgets/footer`
- Sesuai `STYLES.md`: Bagian pita penutup bawah berwarna kuning solid Sunshine Pop (`#f5e211`).
- Berisi tautan navigasi sekunder, informasi hak cipta, dan pernyataan brand.

---

## 3. Checklist Verifikasi Tahap Widgets

- [ ] Header tampil sebagai floating pill tanpa bayangan digital (mengandalkan kontras putih terhadap krem).
- [ ] Headline hero menggunakan tipografi display raksasa dengan tracking ketat tanpa melompat ke baris yang berantakan di layar mobile.
- [ ] Lead capture modal dapat dipicu dari berbagai CTA di hero, kartu produk, maupun floating header.
- [ ] Komponen widget responsif di semua ukuran layar (Mobile, Tablet, Desktop 1200px max-width).
