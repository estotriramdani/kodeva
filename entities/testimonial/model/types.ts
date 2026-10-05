import type { Database } from '@/shared/api/supabase';

export type TestimonialRow = Database['public']['Tables']['testimonials']['Row'];

export interface Testimonial extends TestimonialRow {}
