'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { Button, Container } from '@/shared/ui';
import { SITE_CONFIG } from '@/shared/config';
import { cn } from '@/shared/lib';
import { useCart } from '@/entities/cart';

const Modal = dynamic(() => import('@/shared/ui').then((m) => m.Modal), {
  ssr: false,
});
const LeadForm = dynamic(
  () => import('@/features/submit-lead').then((m) => m.LeadForm),
  { ssr: false }
);

export function Header() {
  const pathname = usePathname();
  const { isHydrated, summary, setDrawerOpen } = useCart();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/produk', label: 'Produk Software' },
    { href: '/artikel', label: 'Blog & Edukasi' },
  ];

  return (
    <header className="sticky top-5 z-40 w-full px-4 sm:px-6">
      <Container className="p-0">
        {/* Floating White Pill Bar */}
        <nav
          aria-label="Navigasi Utama"
          className="bg-pure-white rounded-[50px] px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between border border-hairline-mist/80 transition-all"
        >
          {/* Brand Logo & Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-[14px] bg-fresh-grass flex items-center justify-center font-bold text-ink-black text-lg transition-transform group-hover:scale-105">
              K
            </div>
            <span className="text-[17px] font-semibold text-ink-black tracking-tight hidden sm:inline-block">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-[15px] font-medium transition-colors',
                    isActive
                      ? 'bg-cream-paper text-ink-black font-semibold'
                      : 'text-ink-black/80 hover:text-ink-black hover:bg-cream-paper/50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action Area: Cart, Mobile Toggle & Quote CTA */}
          <div className="flex items-center gap-2">
            {/* Tombol Keranjang */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-cream-paper transition-colors flex items-center justify-center text-ink-black cursor-pointer"
              aria-label={`Buka Keranjang: ${isHydrated ? summary.totalItems : 0} lisensi`}
            >
              <ShoppingBag className="w-5 h-5" />
              {isHydrated && summary.totalItems > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-coral-pop text-pure-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-1 border-pure-white">
                  {summary.totalItems}
                </span>
              )}
            </button>

            {/* CTA Penawaran Utama */}
            <Button
              variant="ghost-pill"
              size="sm"
              dotColor="grass"
              onClick={() => setIsQuoteModalOpen(true)}
              className="text-[14px]"
            >
              Minta Penawaran
            </Button>

            {/* Circular Green Toggle Button */}
            <Button
              variant="circle-icon"
              aria-label="Menu"
              className="md:hidden flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-pure-white rounded-[35px] p-5 border border-hairline-mist shadow-xs flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-full text-[15px] font-medium text-ink-black hover:bg-cream-paper"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </Container>

      {/* Global Quote Modal */}
      {isQuoteModalOpen && (
        <Modal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          title="Minta Penawaran Software"
          description="Ceritakan kebutuhan software Anda, kami bantu berikan rekomendasi harga terbaik dan kuota promo."
        >
          <LeadForm
            sourceCta="header_quote_button"
            onSuccess={() => setIsQuoteModalOpen(false)}
            submitButtonText="Kirim Permintaan Penawaran"
          />
        </Modal>
      )}
    </header>
  );
}
