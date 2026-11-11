import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

// Both values are browser-safe Supabase identifiers. They are intentionally
// supplied by environment variables, never hard-coded into the application.
export const supabase = url && publishableKey
  ? createClient(url, publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const supabaseConfigured = supabase !== null;
