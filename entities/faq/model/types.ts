import type { Database } from '@/shared/api/supabase';

export type FaqRow = Database['public']['Tables']['faqs']['Row'];

export interface Faq extends FaqRow {}
