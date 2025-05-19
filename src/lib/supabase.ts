
import { supabase } from '@/integrations/supabase/client';

// Export the configured Supabase client
export { supabase };

// You can use this function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabase !== null;
};
