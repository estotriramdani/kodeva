/**
 * Validated environment variables for client & server
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
} as const;

if (!env.supabaseUrl || !env.supabasePublishableKey) {
  // Hanya log warning di development agar tidak crash build saat prerendering
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '[Supabase Config] NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum terisi.'
    );
  }
}
