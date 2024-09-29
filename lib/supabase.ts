import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Todo: use env variables
const supabaseUrl = 'https://uznyrnwpoignzkemowpx.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6bnlybndwb2lnbnprZW1vd3B4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0NDYyNjEsImV4cCI6MjA0MzAyMjI2MX0.lJLgv0mkf2h05IBD0VPq9X42-jPTs5zUuNlg6UrVC2M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
