import type { Database } from '@/shared/api/supabase';

export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type CategoryType = Database['public']['Enums']['category_type'];

export type Category = CategoryRow;
