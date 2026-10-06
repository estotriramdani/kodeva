import { createPublicClient } from '@/shared/api/supabase/server';
import type { Testimonial } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getTestimonials(
  marketCode: string = DEFAULT_MARKET_CODE,
  onlyPublished: boolean = true
): Promise<Testimonial[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from('testimonials')
    .select('*')
    .eq('market_code', marketCode);

  if (onlyPublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error.message);
    return [];
  }

  return (data || []) as Testimonial[];
}
