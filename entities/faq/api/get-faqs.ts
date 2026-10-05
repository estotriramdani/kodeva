import { createServerClient } from '@/shared/api/supabase/server';
import type { Faq } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getFaqs(marketCode: string = DEFAULT_MARKET_CODE): Promise<Faq[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('market_code', marketCode)
    .eq('is_published', true)
    .order('rank', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error.message);
    return [];
  }

  return (data || []) as Faq[];
}
