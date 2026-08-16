/**
 * EduIQ — Supabase Client
 *
 * Initializes the Supabase client from environment variables.
 * If credentials are missing (development mode), returns null
 * so the UI can still render in a safe state.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };
export default supabase;
