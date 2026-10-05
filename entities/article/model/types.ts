import type { Database } from '@/shared/api/supabase';

export type ArticleRow = Database['public']['Tables']['articles']['Row'];
export type ArticleStatus = Database['public']['Enums']['article_status'];

export interface Article extends ArticleRow {
  category?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  linked_product_ids?: string[];
}
