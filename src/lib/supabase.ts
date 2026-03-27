import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check for valid URL format before initializing
const isConfigured = !!supabaseUrl && supabaseUrl.startsWith('http');

if (!isConfigured && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ Supabase URL is not configured. Redirecting to placeholder mode.');
}

// Export the client. If not configured, it will use a dummy URL that won't crash the build.
export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
);
