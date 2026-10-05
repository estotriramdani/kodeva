import type { Database } from '@/shared/api/supabase';

export type ProductRow = Database['public']['Tables']['products']['Row'];
export type ProductPlanRow = Database['public']['Tables']['product_plans']['Row'];
export type PlanTier = Database['public']['Enums']['plan_tier'];
export type PlanUnit = Database['public']['Enums']['plan_unit'];

export interface ProductScreenshot {
  url: string;
  alt?: string;
}

export interface ProductPlan extends Omit<ProductPlanRow, 'features'> {
  features: string[];
}

export interface Product extends Omit<ProductRow, 'screenshots' | 'features'> {
  screenshots: ProductScreenshot[];
  features: string[];
  category?: {
    id: string;
    slug: string;
    name: string;
  } | null;
  plans?: ProductPlan[];
}
