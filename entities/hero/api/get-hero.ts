import { createServerClient } from '@/shared/api/supabase/server';
import type { LandingHero } from '../model/types';
import { DEFAULT_MARKET_CODE } from '@/shared/config';

export async function getLandingHero(
  marketCode: string = DEFAULT_MARKET_CODE
): Promise<LandingHero | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('landing_hero')
    .select('*')
    .eq('market_code', marketCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching landing hero:', error.message);
    return null;
  }

  return data as LandingHero | null;
}
