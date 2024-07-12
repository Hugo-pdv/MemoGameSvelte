import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jvhbjetdeirsokasvwjt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2aGJqZXRkZWlyc29rYXN2d2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MjEyNzQsImV4cCI6MjAzNjI5NzI3NH0.UkQu-39W5pOCdYaGnCE3iUdGBrXcxG5A_D3l--IGzas';

export const supabase = createClient(supabaseUrl, supabaseKey);	