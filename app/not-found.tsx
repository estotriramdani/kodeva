import React from 'react';
import Link from 'next/link';
import { SearchX, Package, Home } from 'lucide-react';
import { Button, Container } from '@/shared/ui';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-lg mx-auto text-center bg-pure-white rounded-[50px] p-8 sm:p-12 border border-hairline-mist shadow-xs">
          <div className="w-20 h-20 rounded-full bg-sandstone/70 flex items-center justify-center mx-auto mb-6 text-stone-gray">
            <SearchX className="w-10 h-10 text-stone-gray" />
          </div>

          <span className="text-[12px] font-bold text-coral-pop uppercase tracking-wider block mb-2">
            Error 404 — Tidak Ditemukan
          </span>

          <h1 className="text-[30px] sm:text-[36px] font-medium text-ink-black leading-tight">
            Halaman atau Produk Tidak Ditemukan
          </h1>

          <p className="text-[15px] text-stone-gray mt-3 leading-relaxed">
            Halaman, lisensi software, atau artikel yang Anda cari mungkin telah dipindahkan, dinonaktifkan, atau tautan yang Anda tuju salah.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/produk" className="w-full sm:w-auto">
              <Button variant="coral-pill" size="md" className="w-full justify-center">
                <Package className="w-4 h-4 mr-1.5" />
                <span>Lihat Katalog Produk</span>
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="ghost-pill" size="md" dotColor="grass" className="w-full justify-center">
                <Home className="w-4 h-4 mr-1.5" />
                <span>Kembali ke Beranda</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
