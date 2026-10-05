import React from 'react';
import { Container } from '@/shared/ui';
import { TestimonialCard, type Testimonial } from '@/entities/testimonial';

export interface TestimonialWallProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
}

export function TestimonialWall({
  testimonials,
  title = 'Dipercaya oleh Bisnis & Perusahaan Indonesia',
  subtitle = 'Dengarkan pengalaman para pemimpin bisnis yang menemukan solusi software terbaik bersama Kodeva.',
}: TestimonialWallProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-sandstone/30">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-[32px] sm:text-[44px] font-medium text-ink-black leading-tight tracking-tight">
            {title}
          </h2>
          <p className="text-[16px] sm:text-[18px] text-stone-gray mt-2.5">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {testimonials.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
