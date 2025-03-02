import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// These will be replaced with your actual Supabase URL and anon key
// after you connect to Supabase using the "Connect to Supabase" button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);