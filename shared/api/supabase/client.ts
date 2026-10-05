import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';
import { env } from '@/shared/config';

export function createClient() {
  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey
  );
}
