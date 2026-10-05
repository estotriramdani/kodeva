import React from 'react';
import { Container } from '@/shared/ui';
import { FaqItem, type Faq } from '@/entities/faq';

export interface FaqSectionProps {
  faqs: Faq[];
  title?: string;
  subtitle?: string;
}

export function FaqSection({
  faqs,
  title = 'Pertanyaan yang Sering Diajukan',
  subtitle = 'Semua yang perlu Anda ketahui tentang lisensi, integrasi, dan cara kerja pemesanan di Kodeva.',
}: FaqSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-[32px] sm:text-[44px] font-medium text-ink-black leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-[16px] sm:text-[18px] text-stone-gray mt-2.5">
            {subtitle}
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem key={faq.id} faq={faq} defaultOpen={index === 0} />
          ))}
        </div>
      </Container>
    </section>
  );
}
