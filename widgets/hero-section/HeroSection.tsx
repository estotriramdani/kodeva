'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Button, Modal } from '@/shared/ui';
import { HeroHeadline, type LandingHero } from '@/entities/hero';
import { LeadForm } from '@/features/submit-lead';

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

  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pb-24">
      <Container>
        {/* Headline Display Block */}
        <HeroHeadline
          title={title}
          subtitle={subtitle}
          campaignBadge={campaignName}
          actionSlot={
            <div className="flex flex-wrap items-center justify-center gap-3.5 mt-2">
              <Button
                variant="coral-pill"
                size="lg"
                onClick={() => setIsModalOpen(true)}
              >
                {heroData?.cta_label || 'Dapatkan Penawaran Promo'}
              </Button>
              <Link href={heroData?.cta_href || '/produk'}>
                <Button variant="ghost-pill" size="lg" dotColor="grass">
                  Jelajahi Produk
                </Button>
              </Link>
            </div>
          }
        />

        {/* Paper-Cut Illustration Panel (MindMarket Aesthetic) */}
        <div className="mt-8 relative max-w-4xl mx-auto h-52 sm:h-72 rounded-[63.75px] bg-sandstone/70 border border-hairline-mist/80 p-8 flex items-center justify-center overflow-hidden">
          {/* Flat Paper-Cut Decorative Character Shapes */}
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-fresh-grass/80 transform rotate-12" />
          <div className="absolute left-1/4 -top-8 w-24 h-40 rounded-[40px] bg-sky-pop/75 transform -rotate-12" />
          <div className="absolute right-1/4 -bottom-10 w-36 h-36 rounded-[50px] bg-coral-pop/80 transform rotate-45" />
          <div className="absolute -right-4 -top-4 w-28 h-28 rounded-full bg-sunshine-pop/85" />

          {/* Central Editorial Badge */}
          <div className="relative z-10 bg-pure-white rounded-[40px] px-6 sm:px-10 py-5 sm:py-6 text-center border border-hairline-mist max-w-md">
            <span className="text-[13px] font-semibold text-fresh-grass uppercase tracking-wider block mb-1">
              ✓ 100% Lisensi Resmi & Terpercaya
            </span>
            <p className="text-[16px] sm:text-[18px] font-medium text-ink-black leading-snug">
              Bandingkan fitur ERP, POS, CRM, & HRIS langsung dengan konsultan ahli.
            </p>
          </div>
        </div>
      </Container>

      {/* Hero Quote Modal */}
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
    </section>
  );
}
