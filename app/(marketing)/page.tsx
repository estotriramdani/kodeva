import { HomePage } from '@/views/home';
import { getLandingHero } from '@/entities/hero/server';
import { getFeaturedProducts } from '@/entities/product/server';
import { getFaqs } from '@/entities/faq/server';
import { getTestimonials } from '@/entities/testimonial/server';

export const revalidate = 60;

export default async function Page() {
  const [heroData, featuredProducts, faqs, testimonials] = await Promise.all([
    getLandingHero(),
    getFeaturedProducts(),
    getFaqs(),
    getTestimonials(),
  ]);

  return (
    <HomePage
      heroData={heroData}
      featuredProducts={featuredProducts}
      faqs={faqs}
      testimonials={testimonials}
    />
  );
}
