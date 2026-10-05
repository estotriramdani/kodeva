# 02 — Design System Integration Specification

Dokumen ini mendefinisikan integrasi spesifikasi desain **MindMarket** dari [`STYLES.md`](../STYLES.md) ke dalam arsitektur **Tailwind CSS v4** dan layer `shared/ui` pada proyek **Kodeva**.

---

## 1. Karakter Visual Utama (MindMarket Aesthetic)

- **Canvas**: Kertas krem hangat (`#f5f1e4` — *Cream Paper*) sebagai latar belakang utama seluruh halaman, **bukan putih polos** (`#ffffff`). Putih hanya digunakan untuk permukaan kartu (*elevated card*) dan navigasi mengambang.
- **Tipografi**: Menggunakan keluarga font tunggal **Inter** secara agresif. Headline display berukuran sangat besar (53px hingga 144px) dengan tracking rapat (*tight letter spacing*, -0.04em s.d -0.06em) dan line-height padat (0.95 s.d 1.15).
- **Rounding / Sudut**: Sudut membulat lembut bergaya *sticker-soft* dengan radius **50px** pada tombol, kartu, dan bilah navigasi. Tidak menggunakan sudut tajam (0–4px).
- **Elevasi & Bayangan**: **Tanpa drop-shadow digital**. Kedalaman visual dibentuk murni melalui kontras permukaan: Kanvas Krem (`#f5f1e4`) vs Permukaan Kartu Putih (`#ffffff`) atau Sandstone (`#e0dbce`).
- **Aksen Warna**:
  - **Fresh Grass (`#8ed462`)**: Aksen struktural brand utama (border navigasi, ikon toggle, highlight).
  - **Coral Pop (`#ff705d`)**: Aksen khusus tombol tindakan layanan (*service-level CTA*).
  - **Sky Pop (`#2ba0ff`)** & **Sunshine Pop (`#f5e211`)**: Aksen ilustrasi dan penutup footer.

---

## 2. Integrasi Tailwind CSS v4 (`app/globals.css`)

Tailwind CSS v4 menggunakan direktif `@theme` langsung di dalam file CSS tanpa memerlukan `tailwind.config.js`. Konfigurasi berikut dimasukkan ke `app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Palet Warna MindMarket */
  --color-fresh-grass: #8ed462;
  --color-cream-paper: #f5f1e4;
  --color-ink-black: #2c2e2a;
  --color-pure-white: #ffffff;
  --color-sandstone: #e0dbce;
  --color-stone-gray: #80827f;
  --color-hairline-mist: #d5d5d4;
  --color-pure-ink: #000000;
  --color-sky-pop: #2ba0ff;
  --color-coral-pop: #ff705d;
  --color-sunshine-pop: #f5e211;

  /* Tipografi Inter */
  --font-inter: var(--font-inter), 'Inter', ui-sans-serif, system-ui, sans-serif;

  /* Skala Tipografi Khusus */
  --text-body-sm: 15px;
  --leading-body-sm: 1.5;
  --text-body-lg: 18px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.25;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.2;
  --text-heading: 53px;
  --leading-heading: 1.15;
  --tracking-heading: -2.12px;
  --text-heading-lg: 81px;
  --leading-heading-lg: 1.2;
  --tracking-heading-lg: -4.86px;
  --text-display: 140px;
  --leading-display: 0.95;
  --tracking-display: -8.4px;
  --text-display-lg: 144px;
  --leading-display-lg: 0.95;
  --tracking-display-lg: -8.64px;

  /* Radius Sudut Halus */
  --radius-sm: 10px;
  --radius-card: 50px;
  --radius-pill: 50px;
  --radius-art: 63.75px;
}

body {
  background-color: var(--color-cream-paper);
  color: var(--color-ink-black);
  font-family: var(--font-inter);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}
```

---

## 3. Komponen Dasar pada Layer `shared/ui/`

Komponen di `shared/ui/` menjadi fondasi atomik yang digunakan oleh semua entities, features, dan widgets:

### 1. `Button` (`shared/ui/button`)
- **Variant `ghost-pill`**: Latar putih, border tipis ink-black/hairline, radius 50px, dilengkapi dot ikon warna aksen di sisi kanan.
- **Variant `coral-pill`**: Latar `#ff705d` dengan teks putih untuk CTA penawaran langsung.
- **Variant `icon-circle`**: Tombol bundar 40px (contoh: menu toggle hijau `#8ed462`).

### 2. `Card` (`shared/ui/card`)
- Permukaan putih (`#ffffff`), radius membulat 50px, padding 20–24px.
- Tanpa box-shadow. Bersandar di atas kanvas krem `#f5f1e4`.

### 3. `Input` & `Textarea` (`shared/ui/input`)
- Desain bersih dengan border lembut `#2c2e2a` atau `#d5d5d4`, radius 16–24px untuk formulir leads, fokus outline fresh grass.

### 4. `Badge` (`shared/ui/badge`)
- Radius 10px untuk tag kategori, label promo diskon, atau kuota lisensi tersisa.

### 5. `Modal` (`shared/ui/modal`)
- Dialog overlay berlatar cream paper atau white pill dengan radius 50px untuk penangkap prospek (*Lead Modal*).
