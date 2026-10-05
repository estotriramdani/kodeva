import React from 'react';
import { HeroSection } from '@/widgets/hero-section';
import { FeaturedProductsSection } from '@/widgets/featured-products';
import { FaqSection } from '@/widgets/faq-section';
import { TestimonialWall } from '@/widgets/testimonial-wall';
import type { LandingHero } from '@/entities/hero';
import type { Product } from '@/entities/product';
import type { Faq } from '@/entities/faq';
import type { Testimonial } from '@/entities/testimonial';

export interface HomePageProps {
  heroData?: LandingHero | null;
  featuredProducts: Product[];
  faqs: Faq[];
  testimonials: Testimonial[];
}

export function HomePage({
  heroData,
  featuredProducts,
  faqs,
  testimonials,
}: HomePageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection heroData={heroData} />
      <FeaturedProductsSection products={featuredProducts} />
      <TestimonialWall testimonials={testimonials} />
      <FaqSection faqs={faqs} />
    </div>
  );
}
