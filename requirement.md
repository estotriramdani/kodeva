# Technical Skill Test — Fullstack Developer

**PT Digital Solusi Grup**

Terima kasih atas ketertarikan Anda untuk bergabung di PT Digital Solusi Grup. Dokumen ini disusun sebagai panduan pelaksanaan Technical Skill Test yang bertujuan untuk mengevaluasi kemampuan teknis, pengambilan keputusan, serta cara Anda menerjemahkan kebutuhan tim marketing menjadi produk yang siap dipakai.

---

## Instruksi Umum

| Item                                     | Keterangan                                               |
| ---------------------------------------- | -------------------------------------------------------- |
| **Posisi**                               | Fullstack Developer                                      |
| **Tipe**                                 | Take-home Technical Test                                 |
| **Deadline**                             | 2 hari kalender sejak brief diterima                     |
| **Estimasi pengerjaan**                  | 6–8 jam                                                  |
| **Stack Wajib**                          | TypeScript untuk kode yang Anda tulis                    |
| **Framework / CMS / Database / Hosting** | Bebas                                                    |
| **Deliverable**                          | Git repository + link deploy + `README.md` + `AI_LOG.md` |

### Aturan

1. Kumpulkan dalam **2 hari kalender** sejak brief diterima.

   * Tes dirancang untuk sekitar **6–8 jam kerja**.
   * Tidak perlu mengerjakan lebih dari waktu tersebut.
   * Catat waktu pengerjaan sebenarnya di `README.md`.

2. Boleh dan dianjurkan menggunakan **AI tools**.

   * Cantumkan log penggunaannya di `AI_LOG.md`.

3. Kumpulkan dalam bentuk **Git Repository**:

   * GitHub atau GitLab.
   * Public atau private dengan invite ke:

     * `hendrawan.putra@dsg.id`
   * Pastikan commit history terlihat.
   * Jangan melakukan squash terhadap commit history.

4. Sertakan **link deploy** menggunakan layanan hosting gratis, misalnya:

   * Vercel
   * Netlify
   * Railway
   * Render
   * dan lainnya.

   Sertakan juga akun CMS/admin demo agar tim dapat mencoba mengedit konten.

5. Sertakan `README.md` yang berisi:

   * Waktu pengerjaan sebenarnya.
   * Cara menjalankan project secara lokal.
   * Arsitektur singkat dan alasan memilih stack.
   * Asumsi yang dibuat atas hal-hal yang ambigu.
   * Apa yang sudah selesai.
   * Apa yang belum selesai.
   * Apa yang akan dikerjakan jika diberikan waktu 1 minggu lagi.
   * Rencana menghubungkan marketplace ke backend:

     * Endpoint yang dibutuhkan.
     * Alur payment gateway yang aman.
     * Webhook.
     * Verifikasi.
     * Status order.
     * Cara menjaga kuota lisensi promo tetap akurat.
     * Pengiriman lisensi setelah pembayaran berhasil.
   * Screenshot hasil **Lighthouse Mobile** untuk landing page.

6. Sertakan `AI_LOG.md` yang berisi:

   * Tools yang digunakan dan untuk bagian apa.
   * 2–3 contoh prompt yang paling membantu.
   * Minimal 2 contoh ketika AI:

     * Memberikan jawaban yang salah.
     * Menghasilkan implementasi yang kurang tepat.
     * Menghasilkan implementasi yang tidak aman.
     * Tidak memenuhi requirement.
   * Jelaskan:

     * Bagaimana masalah ditemukan.
     * Bagaimana diperbaiki.
     * Bagaimana hasil akhirnya diverifikasi.
   * Minimal 1 bagian implementasi yang banyak dibantu AI, beserta edge case yang diuji.
   * Bagian yang sengaja ditulis sendiri tanpa AI beserta alasannya.

7. Boleh menggunakan:

   * Template.
   * Boilerplate.
   * Starter kit.
   * Library UI.
   * State management.
   * Mock API.

   Contoh:

   * Zustand
   * Redux
   * TanStack Query
   * MSW
   * json-server

   Semua penggunaan harus disebutkan dan dijelaskan alasannya di `README.md`.

8. Gunakan **data dummy**.

   * Jangan menggunakan data pribadi.
   * Jangan menggunakan API key sungguhan di repository.

9. Penilaian tidak didasarkan pada banyaknya fitur atau lamanya pengerjaan.

   * Lebih baik sebagian fitur selesai dengan rapi dan dijelaskan daripada semua fitur ada tetapi rapuh.
   * Hasil tes hanya digunakan untuk penilaian dan tetap menjadi milik Anda.

---

# Skenario

Brand fiktif **"Kodeva"** menjual software bisnis untuk UMKM secara online, yaitu:

* Aplikasi kasir.
* Aplikasi HR & payroll.
* Add-on pendukung.

Produk menggunakan sistem **lisensi berlangganan**.

Tim marketing akan meluncurkan campaign **"Promo Akhir Tahun"** dan membutuhkan dua hal:

1. **Website landing campaign + blog**

   * Konten dapat diubah sendiri oleh tim marketing tanpa bantuan developer.

2. **Mini marketplace**

   * Halaman katalog produk.
   * Detail produk.
   * Keranjang.
   * Checkout sederhana.
   * Cukup di sisi frontend.

---

## Pesan dari Head of Marketing

> "Kami sering ganti banner dan promo tiap minggu, jadi jangan sampai harus minta tolong developer tiap kali ganti teks atau gambar. Website juga harus cepat dibuka di HP, karena 80% traffic kami dari Instagram dan TikTok. Kami perlu tahu berapa orang yang klik tombol beli dari landing page. Satu lagi, kami ingin artikel blog dan produk kami gampang ketemu waktu orang cari aplikasi kasir atau aplikasi HR di Google, dan link-nya kelihatan menarik waktu dibagikan di WhatsApp. Oh iya, awal tahun depan kami mulai ekspansi ke Malaysia dan Singapura, dan tim di sana juga akan memakai website ini untuk campaign mereka."

Jika ada hal yang ambigu:

* Tanyakan via email ke `hendrawan.putra@dsg.id`, atau
* Tulis asumsi di `README.md`. 

---

# Bagian A — Website Landing + Blog (CMS)

Website cukup terdiri dari:

1. Satu halaman landing.
2. Halaman blog.

CMS boleh:

* Dibangun sendiri, atau
* Menggunakan CMS existing.

Contoh CMS:

* Strapi
* Sanity
* Payload
* Directus
* WordPress
* dan lainnya.

Jelaskan alasan pemilihan CMS di `README.md`.

## Requirements

### Landing Page

Landing page harus memiliki:

* Hero section:

  * Judul.
  * Subjudul.
  * Gambar.
  * CTA menuju katalog.
* Daftar produk unggulan.
* Testimoni.
* FAQ.

### Content Management

Konten setiap section harus dapat diedit melalui CMS oleh user non-teknis.

Konten meliputi:

* Teks.
* Gambar.
* Produk.
* Testimoni.
* FAQ.

> Layout dan urutan section boleh tetap berada di dalam kode.

### Lead Capture

Sediakan form lead capture dengan:

* Nama.
* Email/WhatsApp.

Data harus:

* Tersimpan.
* Dapat dilihat oleh tim marketing.

Form harus memiliki:

* Validasi.
* Proteksi spam dasar.

### Blog

Sediakan:

* Halaman daftar artikel.
* Pagination.
* Halaman detail artikel.
* URL menggunakan slug yang mudah dibaca.

### Content Artikel

Artikel dikelola melalui CMS dengan field:

* Judul.
* Slug.
* Gambar cover.
* Isi/rich text.
* Kategori.
* Status:

  * `draft`
  * `publish`

Artikel dapat menautkan produk dari marketplace.

### CMS Publishing & Caching

Perubahan konten yang sudah dipublish di CMS harus dapat tampil di website **tanpa deploy ulang secara manual**.

Jelaskan:

* Strategi caching.
* Strategi revalidation.
* Konsekuensi terhadap kecepatan perubahan tampil di website. 

---

# Bagian B — Mini Marketplace (Frontend)

Bagian marketplace **cukup frontend**.

Tidak perlu membangun:

* Backend.
* Database.
* Integrasi payment.

Data produk boleh berasal dari:

* JSON.
* Mock API.
* MSW.
* json-server.

Walaupun frontend-only, seluruh alur harus terasa seperti aplikasi sungguhan dan interaktif.

## Requirements

### 1. Katalog

Minimal **6 produk**.

Harus memiliki:

* Filter kategori.

### 2. Detail Produk

Detail produk harus menampilkan:

* Screenshot fitur.
* Harga.
* Harga coret saat promo.
* Sisa kuota lisensi promo.
* Pilihan paket:

  * Basic
  * Pro
  * Business

Pemilihan paket harus langsung mengubah harga.

### 3. Keranjang

User dapat:

* Menambah item.
* Mengubah jumlah lisensi/user/outlet.
* Menghapus item.

Subtotal harus dihitung otomatis.

Isi keranjang harus tetap ada ketika halaman di-refresh.

### 4. Kuota Promo

Jumlah lisensi tidak boleh melebihi sisa kuota promo.

**Penting:**

Jika beberapa pilihan paket dari produk yang sama menggunakan kuota promo yang sama, maka batas kuota berlaku terhadap:

```text
Total lisensi produk
```

bukan terhadap masing-masing item/baris.

Contoh:

```text
Promo quota produk = 100

Basic     = 60 lisensi
Pro       = 30 lisensi
Business  = 20 lisensi
----------------------
Total     = 110 lisensi ❌
```

Maka transaksi tersebut harus ditolak karena total lisensi produk melebihi quota 100.

### 5. Checkout

Checkout harus memiliki:

* Form data pembeli:

  * Nama.
  * Email.
* Validasi.
* Ringkasan pesanan.
* Simulasi pembayaran:

  * Status sukses.
  * Status gagal.

### 6. State Handling

Tangani kondisi:

* Loading.
* Error.
* Empty.

Contoh:

* Keranjang kosong.
* Produk tidak ditemukan.
* Mock API gagal.

### 7. Mobile Experience

Website harus nyaman digunakan di HP.

Perhatikan:

* Tombol mudah ditekan.
* Keranjang mudah diakses dari halaman mana pun. 

---

# Bagian C — Kebutuhan Marketing

## 1. Mobile Performance

Target:

> **Lighthouse Mobile Performance ≥ 80**

Pengukuran dilakukan pada landing page.

---

## 2. Tracking

Kirim event berikut ke `dataLayer` menggunakan format GA4:

* `view_item`
* `add_to_cart`
* `begin_checkout`
* Klik CTA landing page.

Event harus:

* Merepresentasikan aksi user yang sesuai.
* Tidak terkirim berulang hanya karena component re-render.
* Memiliki informasi produk/campaign yang relevan dalam payload.

Tidak perlu menggunakan akun Google Analytics sungguhan.

Cukup buktikan bahwa event berhasil dikirim.

---

## 3. UTM Attribution

Parameter UTM dari link Instagram/TikTok harus tetap teratribusi meskipun user:

```text
Landing Page
      ↓
Halaman lain
      ↓
Lead Form / Checkout
```

UTM harus disertakan pada:

* Data lead.
* Payload order checkout.

Untuk marketplace, cukup menggunakan payload order mock. 

---

# Bonus — Opsional

Kerjakan bonus **hanya jika requirement wajib sudah selesai**.

> Bonus tidak dapat menutupi requirement wajib yang belum dikerjakan.

## Bonus Features

### CMS

* Pengaturan layout dan urutan section landing page dari CMS:

  * Mengubah urutan.
  * Show/hide section.
  * Memilih variasi layout.

### Katalog

* Sorting berdasarkan harga.
* Search.
* Filter yang tercermin di URL sehingga dapat dibagikan.

### Detail Produk

* Pilihan durasi langganan:

  * Bulanan.
  * Tahunan.
* Tabel perbandingan fitur antar paket.

### Content Scheduling

Penjadwalan konten promo dari CMS:

* Tanggal mulai.
* Tanggal berakhir.
* Tayang otomatis.
* Berakhir otomatis.

### Voucher

Kode voucher dengan aturan sederhana:

* Minimal belanja.
* Kuota pemakaian.

### CMS Preview

Preview/draft content dari CMS sebelum dipublikasikan.

### Automated Testing

Test otomatis untuk logika penting:

* Kuota.
* Total harga.
* Voucher. 

---

# Kriteria Penilaian

| Aspek                                                                                                        | Max Poin |
| ------------------------------------------------------------------------------------------------------------ | -------: |
| **Fungsionalitas & kualitas kode** — fitur berjalan sesuai requirement, proper typing, struktur project rapi |   **25** |
| **Validasi, error handling & testing** — validasi form dan kuota, keadaan loading/error/kosong               |   **20** |
| **Kebutuhan marketing** — CMS mudah dipakai non-teknis, performa mobile, tracking                            |   **20** |
| **Keputusan teknis** — pilihan stack dan arsitektur sesuai skala kebutuhan                                   |   **15** |
| **Dokumentasi & AI log** — README, asumsi, contoh koreksi output AI                                          |   **20** |
| **Total**                                                                                                    |  **100** |



---

# Pengumpulan

1. Push semua kode ke repository Git.
2. Pastikan link deploy dapat diakses.
3. Kirimkan:

   * Link repository.
   * Link deploy.
   * Akun CMS demo.

Kirim ke:

**To:**

`recruitment@dsg.id`

**CC:**

* `hendrawan.putra@dsg.id`
* `rochman.maarif@dsg.id`

### Subject Email

```text
[Skill Test] Fullstack Developer — [Nama Lengkap]
```

### Pertanyaan

Pertanyaan seputar tes dapat dikirim melalui email ke:

`hendrawan.putra@dsg.id`

Pertanyaan akan dijawab maksimal **1×24 jam pada hari kerja**.

---

**PT Digital Solusi Grup** 
