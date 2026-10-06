'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { Button, Container } from '@/shared/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log technical error details for debugging
    console.error('[Kodeva Error Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4">
      <Container>
        <div className="max-w-lg mx-auto text-center bg-pure-white rounded-[50px] p-8 sm:p-12 border border-coral-pop/30 shadow-xs">
          <div className="w-20 h-20 rounded-full bg-coral-pop/15 flex items-center justify-center mx-auto mb-6 text-coral-pop">
            <AlertOctagon className="w-10 h-10" />
          </div>

          <span className="text-[12px] font-bold text-coral-pop uppercase tracking-wider block mb-2">
            Terjadi Kendala Teknis
          </span>

          <h1 className="text-[28px] sm:text-[34px] font-medium text-ink-black leading-tight">
            Gagal Memuat Halaman
          </h1>

          <p className="text-[15px] text-stone-gray mt-3 leading-relaxed">
            Terjadi masalah saat mengambil data dari server atau koneksi terputus. Silakan coba muat ulang halaman ini.
          </p>

          {error.message && (
            <div className="mt-4 p-3 bg-cream-paper/80 rounded-[16px] text-[13px] text-stone-gray font-mono text-left overflow-x-auto border border-hairline-mist max-h-32">
              <span className="font-semibold text-ink-black block mb-1">Detail Error:</span>
              {error.message}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="coral-pill"
              size="md"
              onClick={() => reset()}
              className="w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              <span>Coba Muat Ulang</span>
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="ghost-pill"
                size="md"
                dotColor="grass"
                className="w-full justify-center"
              >
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
