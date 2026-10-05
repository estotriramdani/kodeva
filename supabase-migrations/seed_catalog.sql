-- =====================================================================
-- seed_catalog.sql
-- Seed data katalog resmi Kodeva (6 Software Bisnis UMKM + Paket + Artikel + Testimoni + FAQ)
-- Mengikuti skema tabel Supabase 20261005000001_schema.sql
-- UUID hanya menggunakan karakter hex valid [0-9a-f]
-- =====================================================================

-- 1. Kategori Produk & Artikel
INSERT INTO public.categories (id, type, slug, name)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'product', 'kasir', 'Aplikasi Kasir & POS'),
  ('c1000000-0000-0000-0000-000000000002', 'product', 'hr-payroll', 'HR & Payroll Cloud'),
  ('c1000000-0000-0000-0000-000000000003', 'product', 'addon', 'Add-on & CRM'),
  ('c1000000-0000-0000-0000-000000000004', 'product', 'akuntansi', 'Akuntansi & Faktur'),
  ('c2000000-0000-0000-0000-000000000001', 'article', 'bisnis-umkm', 'Strategi Bisnis UMKM'),
  ('c2000000-0000-0000-0000-000000000002', 'article', 'regulasi-pajak', 'Regulasi & Pajak')
ON CONFLICT (type, slug) DO UPDATE SET
  name = EXCLUDED.name;

-- 2. Enam Produk Software Bisnis UMKM Kodeva
INSERT INTO public.products (
  id, market_code, slug, name, tagline, description, category_id,
  thumbnail_url, screenshots, features,
  featured_rank, promo_quota_remaining, is_active
)
VALUES
  (
    'd1000000-0000-0000-0000-000000000001',
    'id',
    'kodeva-pos-kasir-pro',
    'Kodeva POS Kasir Pro',
    'Aplikasi kasir pintar untuk retail, coffee shop & resto dengan sinkronisasi multi-outlet tanpa jeda.',
    'Kodeva POS Kasir Pro adalah solusi point-of-sale modern berbasis cloud yang dirancang khusus untuk pemilik UMKM di Indonesia. Mendukung pembayaran QRIS dinamis, cetak struk thermal, laporan laba rugi harian otomatis, dan pengelolaan inventori bahan baku secara akurat. Tetap dapat beroperasi saat jaringan internet terputus (offline mode) dan otomatis tersinkronisasi saat online kembali.',
    'c1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80", "alt": "Tampilan Kasir Tablet POS"},
      {"url": "https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80", "alt": "Laporan Penjualan Realtime"}
    ]'::jsonb,
    '["Multi-outlet & Multi-gudang", "QRIS Dinamis & EDC Terintegrasi", "Mode Offline 100% Aman", "Manajemen Meja & Dapur Resto", "Laporan Penjualan & Margin Realtime"]'::jsonb,
    1, 100, true
  ),
  (
    'd1000000-0000-0000-0000-000000000002',
    'id',
    'kodeva-payroll-hr-cloud',
    'Kodeva Payroll & HR Cloud',
    'Software absensi GPS, kelola cuti, kalkulasi PPh 21 skema TER 2024, dan slip gaji WhatsApp otomatis.',
    'Hemat hingga 80% waktu administrasi penggajian bulanan Anda. Kodeva Payroll menghitung gaji pokok, tunjangan, lembur, iuran BPJS Kesehatan & Ketenagakerjaan, serta potongan PPh 21 TER secara otomatis dan taat aturan perpajakan Indonesia terbaru. Karyawan dapat absen dengan selfie geofencing langsung dari smartphone mereka.',
    'c1000000-0000-0000-0000-000000000002',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80", "alt": "Dashboard Ringkasan Gaji & Karyawan"},
      {"url": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80", "alt": "Absensi GPS Mobile & Cuti Online"}
    ]'::jsonb,
    '["Absensi Selfie & Radius Geofencing", "Hitung PPh 21 Skema TER Otomatis", "Kalkulasi BPJS Tenaga Kerja & Kesehatan", "Slip Gaji Terkirim Langsung via WA & PDF", "Approval Cuti & Lembur via Mobile"]'::jsonb,
    2, 75, true
  ),
  (
    'd1000000-0000-0000-0000-000000000003',
    'id',
    'kodeva-inventory-stock-master',
    'Kodeva Inventory & Stock Master',
    'Sistem manajemen stok gudang, transfer antar cabang, barcode scanner, dan deteksi kadaluarsa barang.',
    'Cegah kebocoran barang dan kerugian akibat stok mati (dead stock). Kodeva Inventory memberikan visibilitas mutasi persediaan secara real-time di seluruh cabang. Dilengkapi dengan notifikasi minimum stock alert otomatis untuk pemesanan ulang (reorder point) kepada supplier.',
    'c1000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", "alt": "Manajemen Gudang & Barcode Scanner"},
      {"url": "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80", "alt": "Grafik Perputaran Stok Harian"}
    ]'::jsonb,
    '["Barcode Scanning via Kamera HP", "Transfer Stok & Surat Jalan Digital", "Notifikasi Minimum Stok & Reorder", "Pelacakan Batch & Tanggal Expired", "Laporan Valuasi FIFO / Average"]'::jsonb,
    3, 50, true
  ),
  (
    'd1000000-0000-0000-0000-000000000004',
    'id',
    'kodeva-whatsapp-crm-blast',
    'Kodeva WhatsApp CRM & Marketing Blast',
    'Platform customer relationship management & broadcast promosi resmi WhatsApp Business Cloud API.',
    'Bangun loyalitas pelanggan dengan komunikasi personal berskala besar. Kirimkan pesan promosi, pengingat keranjang belanja, dan penawaran ulang tahun secara otomatis tanpa khawatir akun terblokir berkat integrasi WhatsApp Cloud API resmi.',
    'c1000000-0000-0000-0000-000000000003',
    'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80", "alt": "Multi-agent CS Chat Inbox"},
      {"url": "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80", "alt": "Broadcast Analytics & Conversion"}
    ]'::jsonb,
    '["WhatsApp Cloud API Resmi Anti-Banned", "Multi-Agent Shared Inbox untuk CS", "Broadcast Promo Tersegmentasi", "Chatbot Interaktif Penjawab Otomatis", "Integrasi Webhook Order Marketplace"]'::jsonb,
    4, 40, true
  ),
  (
    'd1000000-0000-0000-0000-000000000005',
    'id',
    'kodeva-smart-invoice-billing',
    'Kodeva Smart Invoice & Billing',
    'Aplikasi faktur tagihan digital, penagihan piutang otomatis, dan rekonsiliasi pembayaran instan.',
    'Percepat perputaran arus kas bisnis Anda. Buat invoice profesional dalam hitungan detik dengan tombol pembayaran online langsung. Sistem otomatis mengirimkan pengingat ramah via WhatsApp sebelum dan pada saat jatuh tempo tagihan.',
    'c1000000-0000-0000-0000-000000000004',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80", "alt": "Template Invoice & Pembayaran Digital"},
      {"url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80", "alt": "Rekonsiliasi Piutang & Bank"}
    ]'::jsonb,
    '["Faktur Digital PDF & Link Pembayaran QRIS", "Follow-up Piutang Otomatis via WA", "Rekonsiliasi Mutasi Bank Otomatis", "Laporan Umur Piutang (Aging Report)", "Multi-Mata Uang & Pajak PPN"]'::jsonb,
    null, 60, true
  ),
  (
    'd1000000-0000-0000-0000-000000000006',
    'id',
    'kodeva-resto-kitchen-display',
    'Kodeva Resto Kitchen Display & Table Order',
    'Sistem pemesanan QR mandiri di meja dan monitor antrean dapur koki untuk resto dan kafe kekinian.',
    'Tingkatkan efisiensi layanan restoran Anda. Pelanggan cukup scan QR di meja untuk memesan makanan dan membayar langsung. Pesanan langsung masuk ke monitor koki dapur secara terurut dan akurat tanpa salah catat.',
    'c1000000-0000-0000-0000-000000000001',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    '[
      {"url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", "alt": "Tampilan Layar Koki Dapur (KDS)"},
      {"url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80", "alt": "Scan QR Menu Meja Pelanggan"}
    ]'::jsonb,
    '["Menu Digital QR Tanpa Install Aplikasi", "Kitchen Display System (KDS) Layar Sentuh", "Fitur Split Bill & Bayar Terpisah", "Kalkulasi Waktu Penyajian Masakan", "Sinkronisasi Stok Menu Habis Seketika"]'::jsonb,
    null, 80, true
  )
ON CONFLICT (market_code, slug) DO UPDATE SET
  name = EXCLUDED.name,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  thumbnail_url = EXCLUDED.thumbnail_url,
  screenshots = EXCLUDED.screenshots,
  features = EXCLUDED.features,
  featured_rank = EXCLUDED.featured_rank,
  promo_quota_remaining = EXCLUDED.promo_quota_remaining,
  is_active = EXCLUDED.is_active;

-- 3. Paket Produk (Basic, Pro, Business)
-- Produk 1: POS Kasir Pro
INSERT INTO public.product_plans (id, product_id, tier, unit, price, promo_price, min_qty, max_qty, features)
VALUES
  ('b1000001-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'basic', 'outlet', 199000, 149000, 1, 100, '["1 Outlet / Kasir", "Maksimal 500 Transaksi/hari", "Laporan Penjualan Dasar", "Email Support"]'::jsonb),
  ('b1000001-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'pro', 'outlet', 349000, 249000, 1, 100, '["Hingga 3 Outlet", "Transaksi Tanpa Batas", "Manajemen Bahan Baku & Resep", "Mode Offline Lengkap", "Dukungan CS WhatsApp 24/7"]'::jsonb),
  ('b1000001-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'business', 'outlet', 699000, 499000, 1, 100, '["Outlet Tanpa Batas", "Akses API & Webhook", "Multi-Warehouse Terintegrasi", "Dedicated Account Manager", "Pelatihan Staf On-site"]'::jsonb),

-- Produk 2: Payroll HR Cloud
  ('b1000002-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'basic', 'user', 250000, 180000, 1, 100, '["Hingga 15 Karyawan", "Absensi GPS Mobile", "Hitung Gaji Pokok & Lembur", "Slip Gaji Email"]'::jsonb),
  ('b1000002-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'pro', 'user', 450000, 320000, 1, 100, '["Hingga 50 Karyawan", "Hitung PPh 21 TER Otomatis", "Integrasi BPJS TK & Kesehatan", "Slip Gaji WA Otomatis", "Pengajuan Cuti & Izin Mobile"]'::jsonb),
  ('b1000002-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'business', 'user', 900000, 650000, 1, 100, '["Karyawan Tanpa Batas", "Multi-Entitas Perusahaan", "Struktur Skala Upah Kemenaker", "Custom Approval Matrix", "SLA Dukungan 1 Jam"]'::jsonb),

-- Produk 3: Inventory Stock Master
  ('b1000003-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'basic', 'outlet', 175000, 125000, 1, 100, '["1 Gudang Utama", "Hingga 1.000 SKU Barang", "Barcode Scanner Kamera HP", "Email Support"]'::jsonb),
  ('b1000003-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'pro', 'outlet', 299000, 210000, 1, 100, '["Hingga 5 Gudang Cabang", "SKU Tanpa Batas", "Transfer Stok & Surat Jalan", "Notifikasi Minimum Stok", "Metode FIFO & Average"]'::jsonb),
  ('b1000003-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'business', 'outlet', 549000, 399000, 1, 100, '["Gudang Cabang Tanpa Batas", "Integrasi POS Kasir Otomatis", "Pelacakan Batch & Expired", "Akses API Gudang", "Dedicated Specialist"]'::jsonb),

-- Produk 4: WhatsApp CRM Blast
  ('b1000004-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', 'basic', 'user', 299000, 199000, 1, 100, '["1 Nomor WhatsApp Resmi", "2 Agen Customer Service", "Hingga 1.000 Kontak Pelanggan", "Broadcast Manual Terjadwal"]'::jsonb),
  ('b1000004-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', 'pro', 'user', 599000, 399000, 1, 100, '["1 Nomor WhatsApp Resmi", "5 Agen Customer Service", "Kontak Tanpa Batas", "Auto-Responder Bot Interaktif", "Broadcast Cepat Berkelompok"]'::jsonb),
  ('b1000004-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'business', 'user', 1199000, 799000, 1, 100, '["Multi-Nomor WhatsApp", "Agen CS Tanpa Batas", "Integrasi Webhook ERP & Kasir", "Bantuan Verifikasi Centang Hijau", "Prioritas Server Routing"]'::jsonb),

-- Produk 5: Smart Invoice & Billing
  ('b1000005-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000005', 'basic', 'user', 150000, 99000, 1, 100, '["Hingga 50 Invoice / bulan", "Template Faktur Standar", "Pembayaran QRIS", "Kirim via Email"]'::jsonb),
  ('b1000005-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000005', 'pro', 'user', 275000, 185000, 1, 100, '["Invoice Tanpa Batas", "Pengingat Tagihan Otomatis via WA", "Virtual Account Bank Otomatis", "Laporan Aging Piutang", "Multi-Mata Uang"]'::jsonb),
  ('b1000005-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000005', 'business', 'user', 499000, 349000, 1, 100, '["Rekonsiliasi Bank Otomatis", "Faktur Pajak Elektronik e-Faktur", "Custom Logo & Domain Invoice", "API Integrasi Finansial", "Dedicated Consultant"]'::jsonb),

-- Produk 6: Resto Kitchen Display
  ('b1000006-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000006', 'basic', 'outlet', 180000, 130000, 1, 100, '["1 Layar Koki Dapur", "Hingga 15 Meja QR", "Antrean Pesanan Berurutan", "Email Support"]'::jsonb),
  ('b1000006-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000006', 'pro', 'outlet', 320000, 220000, 1, 100, '["Hingga 3 Layar (Dapur, Bar, Kasir)", "Meja QR Tanpa Batas", "Fitur Split Bill & Add-on Pesanan", "Indikator Waktu Masak Warna", "Dukungan Prioritas WA"]'::jsonb),
  ('b1000006-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000006', 'business', 'outlet', 600000, 420000, 1, 100, '["Multi-Kitchen Routing Otomatis", "Paging Pelanggan Mandiri", "Integrasi POS Kasir Kodeva", "Custom Branding Tampilan Layar", "Pelatihan Staf Resto"]'::jsonb)
ON CONFLICT (product_id, tier) DO UPDATE SET
  unit = EXCLUDED.unit,
  price = EXCLUDED.price,
  promo_price = EXCLUDED.promo_price,
  min_qty = EXCLUDED.min_qty,
  max_qty = EXCLUDED.max_qty,
  features = EXCLUDED.features;

-- 4. Artikel Blog Edukasi UMKM
INSERT INTO public.articles (
  id, market_code, slug, title, excerpt, content_html, cover_url, cover_alt, category_id, author_name, status, published_at
)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'id',
    'strategi-memilih-aplikasi-kasir-umkm-2026',
    'Panduan Memilih Aplikasi Kasir (POS) Terbaik untuk UMKM Indonesia di Era Digital',
    'Menemukan aplikasi kasir yang tepat bukan hanya soal mencatat penjualan, melainkan bagaimana sistem tersebut membantu mengontrol stok, mencegah kebocoran kas, dan mendukung pembayaran digital non-tunai.',
    '<p>Di tengah pesatnya adopsi pembayaran non-tunai di Indonesia, memiliki sistem Point of Sale (POS) yang andal bukan lagi pilihan sekunder bagi pelaku usaha mikro, kecil, dan menengah (UMKM). Kasir konvensional dengan buku tulis atau mesin kalkulator rentan memicu selisih pembukuan dan membuang waktu operasional.</p><h2>1. Pastikan Mendukung QRIS Dinamis dan Metode Pembayaran Lokal</h2><p>Pelanggan saat ini mengharapkan kemudahan transaksi melalui berbagai dompet digital seperti GoPay, OVO, ShopeePay, dan perbankan digital. Sistem kasir modern seperti <strong>Kodeva POS Kasir Pro</strong> memungkinkan pembuatan QRIS dinamis secara instan di layar tablet kasir, memastikan nominal yang dibayarkan presisi tanpa risiko salah ketik oleh pelanggan.</p><h2>2. Keandalan Mode Offline</h2><p>Koneksi internet di Indonesia terkadang mengalami gangguan tidak terduga. Aplikasi kasir yang berbasis 100% online tanpa penyimpanan lokal akan membuat antrean pelanggan menumpuk saat sinyal terputus. Pastikan software kasir Anda memiliki sistem sinkronisasi offline-first yang tetap mencatat struk belanja secara aman.</p><h2>3. Kemudahan Integrasi Multi-Outlet</h2><p>Bagi pemilik bisnis yang berencana melakukan ekspansi cabang, memantau omzet setiap gerai dari satu smartphone adalah keharusan. Dengan sistem terpusat, transfer bahan baku antar-gerai dapat dipantau secara transparan.</p>',
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    'Pemilik bisnis UMKM menggunakan tablet kasir POS',
    'c2000000-0000-0000-0000-000000000001',
    'Rian Prasetyo',
    'published',
    NOW() - INTERVAL '3 days'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'id',
    'cara-hitung-pph21-ter-terbaru-hris',
    'Kupas Tuntas Perhitungan PPh 21 Skema TER Terbaru: Praktis dan Otomatis dengan Software HR',
    'Pemerintah telah memberlakukan tarif efektif rata-rata (TER) untuk pemotongan PPh Pasal 21. Ketahui bagaimana skema ini bekerja dan bagaimana software HR otomatis memudahkan penggajian bulanan.',
    '<p>Penerapan Peraturan Pemerintah Nomor 58 Tahun 2023 dan Peraturan Menteri Keuangan Nomor 168 Tahun 2023 membawa perubahan signifikan dalam metode perhitungan Pajak Penghasilan Pasal 21 (PPh 21) bagi karyawan di Indonesia. Skema Tarif Efektyif Rata-Rata (TER) hadir untuk menyederhanakan perhitungan pajak bulanan dari masa Januari hingga November.</p><h2>Apa Itu Skema TER?</h2><p>Skema TER membagi wajib pajak orang pribadi ke dalam tiga kategori (Kategori A, B, dan C) berdasarkan status Penghasilan Tidak Kena Pajak (PTKP) dan tanggungan keluarga. Tarif pajak bulanan ditentukan langsung dari persentase tabel penghasilan bruto, tanpa perlu menghitung biaya jabatan dan iuran secara rumit setiap bulannya.</p><h2>Tantangan Manual bagi HR & Finance UMKM</h2><p>Bagi perusahaan yang masih menghitung payroll menggunakan spreadsheet excel manual, perpindahan ke skema TER membutuhkan rumus yang rumit dan rentan kesalahan. Kesalahan perhitungan dapat berakibat pada selisih potong pajak di bulan Desember.</p><h2>Solusi Otomatisasi dengan Kodeva Payroll</h2><p>Dengan <strong>Kodeva Payroll & HR Cloud</strong>, seluruh kalkulasi TER, BPJS Ketenagakerjaan (JKK, JKM, JHT, JP), dan BPJS Kesehatan dihitung otomatis dalam satu klik. Slip gaji terkirim secara instan ke WhatsApp karyawan dalam format PDF rahasia.</p>',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    'Perhitungan pajak dan slip gaji karyawan',
    'c2000000-0000-0000-0000-000000000002',
    'Dewi Sartika',
    'published',
    NOW() - INTERVAL '5 days'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'id',
    'tips-meningkatkan-repeat-order-whatsapp-crm',
    '5 Trik Rahasia Meningkatkan Repeat Order Hingga 300% Menggunakan WhatsApp CRM',
    'Biaya akuisisi pelanggan baru semakin mahal. Memaksimalkan pelanggan yang sudah pernah berbelanja melalui komunikasi WhatsApp yang terpersonalisasi adalah strategi paling efektif untuk UMKM.',
    '<p>Banyak pemilik bisnis terjebak dalam perlombaan membakar anggaran iklan di media sosial untuk mendapatkan pelanggan baru, namun melupakan aset paling berharga mereka: data pelanggan yang sudah pernah membeli. Faktanya, menjual kepada pelanggan lama memiliki probabilitas konversi 60-70%, jauh lebih tinggi dibandingkan pelanggan baru yang hanya 5-20%.</p><h2>1. Kumpulkan Database Kontak Secara Etis</h2><p>Setiap kali pelanggan bertransaksi di kasir atau website, tawarkan struk digital via WhatsApp. Hal ini tidak hanya menghemat kertas struk, tetapi juga secara otomatis mengumpulkan database nomor telepon yang valid.</p><h2>2. Hindari Broadcast Spam Tanpa Izin</h2><p>Jangan pernah mengirim pesan promosi generik setiap hari. Gunakan fitur segmentasi pelanggan pada <strong>Kodeva WhatsApp CRM</strong> untuk membedakan pelanggan VIP, pelanggan langganan, dan pelanggan yang sudah 30 hari tidak berbelanja.</p><h2>3. Kirimkan Promo Kejutan Ulang Tahun</h2><p>Ucapan selamat ulang tahun yang disertai voucher diskon khusus memiliki rasio pembukaan pesan (open rate) mencapai 98% dan konversi pembelian yang sangat tinggi.</p>',
    'https://images.unsplash.com/photo-1611746872915-64382b5c76da?auto=format&fit=crop&w=1200&q=80',
    'Strategi pemasaran customer relationship management WhatsApp',
    'c2000000-0000-0000-0000-000000000001',
    'Farhan Kurniawan',
    'published',
    NOW() - INTERVAL '7 days'
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'id',
    'hindari-stok-bocor-tips-manajemen-gudang',
    'Cara Efektif Mencegah Kebocoran Stok Barang Dagangan bagi Pengusaha Retail',
    'Selisih stok antara catatan dan fisik di gudang merupakan salah satu sumber kerugian terbesar bisnis retail. Terapkan SOP dan sistem barcode modern untuk mengatasinya.',
    '<p>Bagi pemilik toko retail dan minimarket, fenomena "barang hilang misterius" atau barang kadaluarsa di pojok gudang seringkali baru terdeteksi saat audit tahunan. Padahal, kebocoran stok 2-3% dari omzet dapat menggerus margin laba bersih bisnis Anda secara signifikan.</p><h2>Kelemahan Stock Opname Manual</h2><p>Stock opname berkala dengan kertas checklist membutuhkan waktu berjam-jam dan rentan salah hitung. Petugas seringkali menebak jumlah barang hanya berdasarkan tumpukan kardus tanpa memeriksa isi kardus yang sebenarnya.</p><h2>Terapkan Barcode Scanner dan Notifikasi Kedaluwarsa</h2><p>Dengan <strong>Kodeva Inventory & Stock Master</strong>, setiap pergerakan barang dari penerimaan supplier hingga penjualan di kasir tercatat secara otomatis melalui barcode scanning kamera smartphone. Anda akan menerima peringatan otomatis saat ada batch barang yang mendekati masa kadaluarsa 30 hari sebelumnya.</p>',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    'Penataan gudang dan manajemen inventori modern',
    'c2000000-0000-0000-0000-000000000001',
    'Bambang Setyadi',
    'published',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (market_code, slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_html = EXCLUDED.content_html,
  cover_url = EXCLUDED.cover_url,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- 5. Tautkan Produk ke Artikel (article_products)
INSERT INTO public.article_products (article_id, product_id, rank)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 1),
  ('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000006', 2),
  ('a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 1),
  ('a1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 1),
  ('a1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 1)
ON CONFLICT (article_id, product_id) DO NOTHING;

-- 6. Testimoni Pelanggan UMKM
INSERT INTO public.testimonials (
  id, market_code, name, role, company, quote, avatar_url, rank, is_published
)
VALUES
  (
    'e1000000-0000-0000-0000-000000000001',
    'id',
    'Hendra Wijaya',
    'Owner',
    'Kopi Senja Nusantara',
    'Sebelum pakai Kodeva POS Kasir Pro, kami sering pusing mencocokkan setoran harian tiap kasir. Sekarang semua laporan penjualan cabang terpantau realtime dari HP. Fitur QRIS dinamisnya juga mempercepat antrean pelanggan saat jam istirahat siang.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    1,
    true
  ),
  (
    'e1000000-0000-0000-0000-000000000002',
    'id',
    'Sarah Amalia',
    'HR Manager',
    'PT Mitra Prima Distribusi',
    'Perhitungan PPh 21 TER yang baru awalnya bikin tim HR kami lembur berhari-hari. Berkat Kodeva Payroll, proses penggajian 45 karyawan selesai dalam 15 menit saja! Slip gaji langsung masuk ke nomor WhatsApp masing-masing karyawan secara rapi.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    2,
    true
  ),
  (
    'e1000000-0000-0000-0000-000000000003',
    'id',
    'Budi Santoso',
    'Founder',
    'Toko Bangunan Berkah Abadi',
    'Manajemen stok gudang kami jadi 100% terkontrol. Tidak ada lagi cerita barang hilang atau barang numpuk sampai kadaluarsa. Kodeva Inventory benar-benar menyelamatkan cash flow toko kami!',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    3,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  company = EXCLUDED.company,
  quote = EXCLUDED.quote,
  avatar_url = EXCLUDED.avatar_url;

-- 7. FAQ Seputar Lisensi & Promo
INSERT INTO public.faqs (id, market_code, question, answer, rank, is_published)
VALUES
  (
    'f1000000-0000-0000-0000-000000000001',
    'id',
    'Apakah lisensi software Kodeva berlaku selamanya atau berlangganan bulanan/tahunan?',
    'Software Kodeva menggunakan model lisensi berlangganan (SaaS) per bulan atau per tahun. Model ini menjamin Anda selalu mendapatkan pembaruan fitur terbaru, update peraturan perpajakan/pemerintah otomatis, backup data cloud harian, dan layanan bantuan CS tanpa biaya tambahan tersembunyi.',
    1,
    true
  ),
  (
    'f1000000-0000-0000-0000-000000000002',
    'id',
    'Bagaimana cara mengklaim promo diskon akhir tahun?',
    'Anda cukup memilih paket lisensi yang diinginkan di halaman katalog, memasukkannya ke keranjang belanja, dan menyelesaikan checkout selama kuota promo untuk produk tersebut masih tersedia. Diskon promo akan otomatis memotong total tagihan.',
    2,
    true
  ),
  (
    'f1000000-0000-0000-0000-000000000003',
    'id',
    'Bagaimana jika kuota promo suatu produk habis saat saya memesan beberapa paket sekaligus?',
    'Batas kuota promo berlaku untuk total akumulasi lisensi produk tersebut. Jika total lisensi yang Anda masukkan (misal Basic + Pro + Business) melebihi sisa kuota yang tersedia, sistem keranjang kami akan menginformasikan sisa batas kuota agar Anda dapat menyesuaikan jumlah pesanan.',
    3,
    true
  ),
  (
    'f1000000-0000-0000-0000-000000000004',
    'id',
    'Apakah aplikasi kasir dan gudang Kodeva bisa dipakai saat internet mati?',
    'Ya! Aplikasi Kodeva POS dan Inventory dilengkapi mode offline terintegrasi. Anda tetap bisa melakukan transaksi penjualan, cetak struk, dan scan barcode secara normal. Ketika koneksi internet pulih, seluruh data akan tersinkronisasi otomatis ke server cloud.',
    4,
    true
  ),
  (
    'f1000000-0000-0000-0000-000000000005',
    'id',
    'Berapa lama lisensi aktif setelah simulasi pembayaran berhasil?',
    'Aktivasi lisensi berlangsung instan secara otomatis (kurang dari 60 detik). Kode lisensi, kredensial login akun pengelola, dan link aktivasi aplikasi akan langsung dikirimkan ke email dan nomor WhatsApp yang Anda daftarkan saat checkout.',
    5,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  answer = EXCLUDED.answer,
  rank = EXCLUDED.rank;

-- 8. Landing Hero Section
INSERT INTO public.landing_hero (market_code, campaign_name, title, subtitle, cta_label, cta_href)
VALUES
  (
    'id',
    'Promo Akhir Tahun 2026',
    'Akselerasi Bisnis UMKM Anda dengan Software Terintegrasi.',
    'Dapatkan lisensi resmi aplikasi kasir (POS), payroll & HR, serta inventory terbaik di Indonesia dengan potongan harga promo khusus akhir tahun. Kuota lisensi terbatas!',
    'Dapatkan Diskon Promo',
    '/produk'
  )
ON CONFLICT (market_code) DO UPDATE SET
  campaign_name = EXCLUDED.campaign_name,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  cta_label = EXCLUDED.cta_label,
  cta_href = EXCLUDED.cta_href;
