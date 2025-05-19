
import { createClient } from '@supabase/supabase-js';

// These placeholder values allow the app to build without errors
// IMPORTANT: Replace these with actual values by connecting to Supabase
// using the Lovable Supabase integration (green button in top-right)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// You can use this function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder-url.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key';
};
