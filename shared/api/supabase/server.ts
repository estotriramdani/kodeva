import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { env } from '@/shared/config';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component yang tidak dapat memutasi cookies secara langsung.
            // Operasi ini aman diabaikan karena session refresh ditangani oleh middleware.
          }
        },
      },
    }
  );
}

export function createPublicClient() {
  return createSupabaseClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

export { createClient as createServerClient };

