import { createServerClient } from '@/shared/api/supabase';
import type { Testimonial } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getTestimonials(
  marketCode: string = DEFAULT_MARKET_CODE
): Promise<Testimonial[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('market_code', marketCode)
    .eq('is_published', true)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error.message);
    return [];
  }

  return (data || []) as Testimonial[];
}
