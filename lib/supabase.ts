import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfmvlquazumxvkbvpjfl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbXZscXVhenVteHZrYnZwamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTA2MTgsImV4cCI6MjA3OTM4NjYxOH0.OpFN2v_IyphsGLpZzEI5hmLeuPJ5rUzUE1axVHLfLEw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
