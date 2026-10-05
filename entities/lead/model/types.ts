import type { Database } from '@/shared/api/supabase';

export type LeadRow = Database['public']['Tables']['leads']['Row'];

export type Lead = LeadRow;

export interface CreateLeadInput {
  name: string;
  email?: string;
  whatsapp?: string;
  source_cta?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_path?: string;
  referrer?: string;
}
