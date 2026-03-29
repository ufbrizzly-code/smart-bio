import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !!url && url.startsWith('https://') && !url.includes('your-');
}

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // If we're during build and don't have keys, use a valid-looking dummy to satisfy the crawl
  if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
    // Return a proxy that looks like SupabaseClient but won't crash the build crawler
    return new Proxy({} as SupabaseClient, {
        get: (target, prop) => {
            if (prop === 'from') return () => ({ select: () => ({ eq: () => ({ single: () => ({ data: null, error: null }) }) }) });
            return () => {};
        }
    });
  }

  _supabase = createClient(supabaseUrl, supabaseAnonKey);
  return _supabase;
}
