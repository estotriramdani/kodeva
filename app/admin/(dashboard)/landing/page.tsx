import React from 'react';
import { AdminLandingPage } from '@/views/admin/landing';
import { getLandingHero } from '@/entities/hero/server';
import { getTestimonials } from '@/entities/testimonial/server';
import { getFaqs } from '@/entities/faq/server';

export const metadata = {
  title: 'Konten Landing Page | Admin Kodeva',
  description: 'Kelola banner hero, testimoni pelanggan, dan FAQ.',
};

export default async function AdminLandingRoute() {
  const [hero, testimonials, faqs] = await Promise.all([
    getLandingHero(),
    getTestimonials('id', false),
    getFaqs('id', false),
  ]);

  return (
    <AdminLandingPage
      hero={hero}
      testimonials={testimonials}
      faqs={faqs}
    />
  );
}
