import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Container } from '@/shared/ui';
import { SITE_CONFIG } from '@/shared/config';

export function Footer() {
  return (
    <footer className="w-full bg-sunshine-pop text-ink-black pt-16 pb-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-ink-black/15">
          {/* Kolom 1: Info Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] bg-ink-black text-sunshine-pop font-bold flex items-center justify-center text-lg">
                K
              </div>
              <span className="text-[22px] font-bold text-ink-black tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-[15px] text-ink-black/80 max-w-md leading-relaxed">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-ink-black mb-4">
              Jelajahi
            </h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <Link href="/" className="hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/produk" className="hover:underline">
                  Katalog Software
                </Link>
              </li>
              <li>
                <Link href="/artikel" className="hover:underline">
                  Artikel & Edukasi
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/admin/login"
                  className="hover:underline inline-flex items-center gap-1.5 font-medium text-ink-black/90 hover:text-ink-black"
                >
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Login Admin CMS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kontak & Dukungan */}
          <div>
            <h4 className="text-[14px] font-bold uppercase tracking-wider text-ink-black mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>
                <a
                  href={`https://wa.me/${SITE_CONFIG.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp Konsultan
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:underline"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="pt-2 text-[13px] text-ink-black/70">
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Baris Bawah */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-ink-black/70">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. Seluruh hak cipta dilindungi.</p>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            <span>Privasi & Keamanan</span>
            <span>Syarat & Ketentuan</span>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 font-medium text-ink-black/80 hover:text-ink-black hover:underline"
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
