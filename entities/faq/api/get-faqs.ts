import { createPublicClient } from '@/shared/api/supabase/server';
import type { Faq } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getFaqs(
  marketCode: string = DEFAULT_MARKET_CODE,
  onlyPublished: boolean = true
): Promise<Faq[]> {
  const supabase = createPublicClient();

  let query = supabase
    .from('faqs')
    .select('*')
    .eq('market_code', marketCode);

  if (onlyPublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query.order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error.message);
    return [];
  }

  return (data || []) as Faq[];
}
