# 03 — Tahap 1: Implementasi Shared Layer

Dokumen ini menjelaskan langkah-langkah terperinci untuk membangun fondasi sistem di layer **`shared/`**, yang akan menjadi penopang seluruh layer di atasnya.

---

## 1. Tujuan Tahap Ini

Membangun utilitas yang bebas dari keterikatan domain bisnis (*agnostic*):
1. Koneksi Supabase SSR untuk Client, Server, dan Middleware Next.js 16.
2. Definisi TypeScript terpusat (`database.types.ts`).
3. UI Kit dasar sesuai panduan desain **MindMarket** (`STYLES.md`).
4. Utility functions (formatting mata uang Rupiah, date locale ID, classname merge).
5. Konfigurasi dan konstanta aplikasi terpusat.

---

## 2. Struktur Direktori `shared/`

```
shared/
├── api/
│   └── supabase/
│       ├── index.ts              # Public API Supabase helpers & types
│       ├── client.ts             # createBrowserClient (@supabase/ssr)
│       ├── server.ts             # createServerClient (@supabase/ssr) dengan Next.js cookies
│       ├── middleware.ts         # Session update handler untuk Next.js middleware
│       └── database.types.ts     # Interface tabel Supabase
├── ui/
│   ├── index.ts                  # Public API UI components
│   ├── button/
│   │   ├── Button.tsx
│   │   └── types.ts
│   ├── card/
│   │   └── Card.tsx
│   ├── badge/
│   │   └── Badge.tsx
│   ├── input/
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── modal/
│   │   └── Modal.tsx
│   └── container/
│       └── Container.tsx
├── lib/
│   ├── index.ts                  # Public API utility functions
│   ├── cn.ts                     # Helper clsx / tailwind-merge
│   ├── format-currency.ts        # Format IDR (misal: "Rp 150.000 / user / bulan")
│   ├── format-date.ts            # Format tanggal bahasa Indonesia
│   └── hash.ts                   # Utilitas hashing jika diperlukan di client/server
└── config/
    ├── index.ts                  # Public API config
    ├── env.ts                    # Validasi env Supabase URL & Key
    └── constants.ts              # Market default ('id'), brand names, default metadata
```

---

## 3. Langkah Implementasi Rinci

### Langkah 1.1: Setup Supabase SSR Client (`shared/api/supabase`)
- **`client.ts`**:
  ```ts
  import { createBrowserClient } from '@supabase/ssr';
  import type { Database } from './database.types';

  export function createClient() {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    );
  }
  ```
- **`server.ts`**:
  Menggunakan `cookies()` dari `next/headers`. Perhatikan bahwa di Next.js 16, `cookies()` bersifat `async`:
  ```ts
  import { createServerClient } from '@supabase/ssr';
  import { cookies } from 'next/headers';
  import type { Database } from './database.types';

  export async function createClient() {
    const cookieStore = await cookies();
    return createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Terjadi bila dipanggil dari Server Component
            }
          },
        },
      }
    );
  }
  ```
- **`database.types.ts`**:
  Memetakan enum (`user_role`, `category_type`, `plan_tier`, `plan_unit`, `article_status`) dan tabel (`products`, `product_plans`, `categories`, `articles`, `article_products`, `leads`, `landing_hero`, `testimonials`, `faqs`, `site_settings`).

### Langkah 1.2: Base UI Kit (`shared/ui`)
- Membangun `Button` dengan varian `ghost-pill`, `coral-pill`, `green-circle`.
- Membangun `Card` dengan radius 50px dan background putih di atas kanvas krem.
- Membangun `Input` dan `Textarea` yang nyaman untuk form pengisian nomor WhatsApp dan email.
- Membangun `Badge` dengan radius 10px untuk label harga dan status promo.
- Membangun `Container` dengan max-width 1200px dan padding responsif.

### Langkah 1.3: Utilities & Helpers (`shared/lib`)
- **`format-currency.ts`**:
  ```ts
  export function formatIDR(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  ```
- **`cn.ts`**: Fungsi utilitas penggabungan classname.

---

## 4. Kriteria Keberhasilan (Checklist Verifikasi)

- [ ] Supabase Browser Client dapat menginisialisasi koneksi tanpa error.
- [ ] Supabase Server Client dapat membaca session di Server Component Next.js 16.
- [ ] Komponen `shared/ui` lolos render dengan styling MindMarket tanpa ada border-radius tajam (< 10px).
- [ ] Semua file diekspor melalui Public API (`index.ts`) masing-masing folder.
