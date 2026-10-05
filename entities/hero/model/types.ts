import type { Database } from '@/shared/api/supabase';

export type LandingHeroRow = Database['public']['Tables']['landing_hero']['Row'];

export type LandingHero = LandingHeroRow;
