import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://lkonchsolzbmjckdxttx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrb25jaHNvbHpibWpja2R4dHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2Mzc0NzAsImV4cCI6MjAwNzIxMzQ3MH0.zJW0vuoKlB-6Y9Tth0Wgbo1t6mTOTHm8-g0K14y_ZKA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
