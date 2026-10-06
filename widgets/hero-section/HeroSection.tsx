'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Sparkles,
  Star,
  Lock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { Container, Button, Modal } from '@/shared/ui';
import { HeroHeadline, type LandingHero } from '@/entities/hero';
import { LeadForm } from '@/features/submit-lead';
import { trackLandingCta } from '@/shared/lib/analytics';

export interface HeroSectionProps {
  heroData?: LandingHero | null;
}

export function HeroSection({ heroData }: HeroSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = heroData?.title || 'Solusi Software Terbaik untuk Bisnis Anda.';
  const subtitle =
    heroData?.subtitle ||
    'Temukan, bandingkan, dan dapatkan lisensi SaaS resmi dengan potongan harga promo khusus di pasar Indonesia.';
  const campaignName = heroData?.campaign_name || 'Promo Lisensi 2026';
  const imageUrl = heroData?.image_url;
  const imageAlt = heroData?.image_alt || title;

  return (
    <section className="relative overflow-hidden pt-4 pb-20 sm:pb-28">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-fresh-grass/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-coral-pop/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <Container>
        {/* Headline Display Block */}
        <HeroHeadline
          title={title}
          subtitle={subtitle}
          campaignBadge={campaignName}
          actionSlot={
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Button
                  variant="coral-pill"
                  size="lg"
                  onClick={() => {
                    trackLandingCta(
                      heroData?.cta_label || 'Dapatkan Penawaran Promo',
                      'hero_section',
                      'modal_quote'
                    );
                    setIsModalOpen(true);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  {heroData?.cta_label || 'Dapatkan Penawaran Promo'}
                </Button>
                <Link
                  href={heroData?.cta_href || '/produk'}
                  onClick={() => {
                    trackLandingCta('Jelajahi Produk', 'hero_section', heroData?.cta_href || '/produk');
                  }}
                >
                  <Button variant="ghost-pill" size="lg" dotColor="grass">
                    <span>Jelajahi Katalog</span>
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {/* Social Proof Trust Strip */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[13px] text-stone-gray font-medium">
                {/* Overlapping Avatars */}
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-cream-paper bg-fresh-grass text-ink-black items-center justify-center text-[10px] font-bold">
                    KP
                  </div>
                  <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-cream-paper bg-sky-pop text-pure-white items-center justify-center text-[10px] font-bold">
                    MB
                  </div>
                  <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-cream-paper bg-coral-pop text-pure-white items-center justify-center text-[10px] font-bold">
                    RA
                  </div>
                  <div className="inline-flex h-7 w-7 rounded-full ring-2 ring-cream-paper bg-sunshine-pop text-ink-black items-center justify-center text-[10px] font-bold">
                    +1k
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sunshine-pop">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <span>
                  <strong className="text-ink-black font-semibold">4.9/5</strong> dari{' '}
                  <strong className="text-ink-black font-semibold">1.200+</strong> bisnis ritel, resto, & UMKM
                </span>
              </div>
            </div>
          }
        />

        {/* ================================================================= */}
        {/* INTERACTIVE FLOATING SHOWCASE MOCKUP WINDOW                        */}
        {/* ================================================================= */}
        <div className="mt-8 relative max-w-5xl mx-auto">
          {/* Floating Micro-Badge 1: Kiri Atas (Aktivasi Cepat) */}
          <div className="hidden lg:flex items-center gap-3 absolute -top-6 -left-6 z-20 bg-pure-white/95 backdrop-blur-md px-4 py-3 rounded-[24px] border border-hairline-mist shadow-xs hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-[14px] bg-sky-pop/15 text-sky-pop flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink-black leading-tight">
                Aktivasi Lisensi Instan
              </p>
              <p className="text-[11px] text-stone-gray">Setup dalam 5 menit</p>
            </div>
          </div>

          {/* Floating Micro-Badge 2: Kanan Atas (Promo Kuota) */}
          <div className="hidden lg:flex items-center gap-3 absolute -top-5 -right-6 z-20 bg-pure-white/95 backdrop-blur-md px-4 py-3 rounded-[24px] border border-hairline-mist shadow-xs hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-[14px] bg-coral-pop/15 text-coral-pop flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink-black leading-tight">
                Diskon Promo Terbatas
              </p>
              <p className="text-[11px] text-fresh-grass font-semibold">Hemat hingga 40%</p>
            </div>
          </div>

          {/* Floating Micro-Badge 3: Kiri Bawah (Garansi Resmi) */}
          <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -left-4 z-20 bg-pure-white/95 backdrop-blur-md px-4 py-3 rounded-[24px] border border-hairline-mist shadow-xs hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-[14px] bg-fresh-grass/20 text-fresh-grass flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-fresh-grass" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink-black leading-tight">
                100% Vendor Resmi
              </p>
              <p className="text-[11px] text-stone-gray">Garansi keaslian lisensi</p>
            </div>
          </div>

          {/* Floating Micro-Badge 4: Kanan Bawah (Efisiensi Waktu) */}
          <div className="hidden lg:flex items-center gap-3 absolute -bottom-6 -right-4 z-20 bg-pure-white/95 backdrop-blur-md px-4 py-3 rounded-[24px] border border-hairline-mist shadow-xs hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 rounded-[14px] bg-sunshine-pop/30 text-ink-black flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-ink-black" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-ink-black leading-tight">
                +120 Jam/Bulan
              </p>
              <p className="text-[11px] text-stone-gray">Efisiensi operasional UMKM</p>
            </div>
          </div>

          {/* Outer Browser Window Frame */}
          <div className="rounded-[35px] sm:rounded-[48px] overflow-hidden border border-hairline-mist bg-pure-white shadow-xs">
            {/* Window Top Bar Header */}
            <div className="px-5 sm:px-8 py-3.5 border-b border-hairline-mist/70 bg-sandstone/30 flex items-center justify-between">
              {/* Window Dots (MindMarket Colors) */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-coral-pop/80" />
                <div className="w-3 h-3 rounded-full bg-sunshine-pop/80" />
                <div className="w-3 h-3 rounded-full bg-fresh-grass/80" />
              </div>

              {/* Fake Address Bar */}
              <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1 rounded-[12px] bg-pure-white/90 border border-hairline-mist text-[12px] text-stone-gray font-mono">
                <Lock className="w-3 h-3 text-fresh-grass" />
                <span>kodeva.id/marketplace/official-licenses</span>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-stone-gray">
                <span className="w-2 h-2 rounded-full bg-fresh-grass animate-pulse" />
                <span className="hidden sm:inline">Katalog Aktif 2026</span>
              </div>
            </div>

            {/* Canvas Body: Banner Image or Fallback MindMarket Dashboard */}
            <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-sandstone/15 overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1100px"
                  className="object-cover object-center"
                />
              ) : (
                /* Fallback Rich Dashboard Canvas */
                <div className="w-full h-full p-6 sm:p-10 flex flex-col justify-between relative bg-gradient-to-br from-sandstone/30 via-cream-paper to-sandstone/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[12px] font-semibold tracking-wider uppercase text-fresh-grass">
                        Software Terintegrasi
                      </span>
                      <h3 className="text-[18px] sm:text-[24px] font-semibold text-ink-black">
                        Dashboard Manajemen Bisnis UMKM
                      </h3>
                    </div>
                    <div className="px-3 py-1.5 rounded-[12px] bg-pure-white border border-hairline-mist text-xs font-semibold text-ink-black flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-fresh-grass" />
                      <span>Verifikasi Resmi</span>
                    </div>
                  </div>

                  {/* 3 Metric Cards Mockup */}
                  <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-4">
                    <div className="p-3 sm:p-5 rounded-[20px] bg-pure-white/90 border border-hairline-mist">
                      <p className="text-[11px] sm:text-[13px] text-stone-gray font-medium">Kasir POS</p>
                      <p className="text-[16px] sm:text-[22px] font-bold text-ink-black mt-1">Real-time</p>
                      <p className="text-[10px] text-fresh-grass font-semibold mt-0.5">Sinkron multi-outlet</p>
                    </div>
                    <div className="p-3 sm:p-5 rounded-[20px] bg-pure-white/90 border border-hairline-mist">
                      <p className="text-[11px] sm:text-[13px] text-stone-gray font-medium">Payroll & HR</p>
                      <p className="text-[16px] sm:text-[22px] font-bold text-ink-black mt-1">Otomatis</p>
                      <p className="text-[10px] text-sky-pop font-semibold mt-0.5">BPJS & PPh 21 siap</p>
                    </div>
                    <div className="p-3 sm:p-5 rounded-[20px] bg-pure-white/90 border border-hairline-mist">
                      <p className="text-[11px] sm:text-[13px] text-stone-gray font-medium">Inventori</p>
                      <p className="text-[16px] sm:text-[22px] font-bold text-ink-black mt-1">99.8%</p>
                      <p className="text-[10px] text-coral-pop font-semibold mt-0.5">Akurasi stok bahan</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile-Only Feature Pills Row */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:hidden">
            <div className="flex items-center gap-2 p-2.5 rounded-[16px] bg-pure-white border border-hairline-mist">
              <Zap className="w-4 h-4 text-sky-pop shrink-0" />
              <span className="text-[12px] font-semibold text-ink-black truncate">
                Aktivasi Instan
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-[16px] bg-pure-white border border-hairline-mist">
              <Sparkles className="w-4 h-4 text-coral-pop shrink-0" />
              <span className="text-[12px] font-semibold text-ink-black truncate">
                Hemat s/d 40%
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-[16px] bg-pure-white border border-hairline-mist">
              <ShieldCheck className="w-4 h-4 text-fresh-grass shrink-0" />
              <span className="text-[12px] font-semibold text-ink-black truncate">
                Vendor Resmi
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-[16px] bg-pure-white border border-hairline-mist">
              <TrendingUp className="w-4 h-4 text-ink-black shrink-0" />
              <span className="text-[12px] font-semibold text-ink-black truncate">
                Efisiensi 120 Jam
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* Hero Quote Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Dapatkan Penawaran Promo"
          description="Konsultasikan kebutuhan software bisnis Anda secara gratis dan dapatkan kuota promo eksklusif."
        >
          <LeadForm
            sourceCta="hero_promo_button"
            onSuccess={() => setIsModalOpen(false)}
            submitButtonText="Amankan Penawaran Promo"
          />
        </Modal>
      )}
    </section>
  );
}
