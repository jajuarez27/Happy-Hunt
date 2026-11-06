import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('SUPABASE_URL / SUPABASE_ANON_KEY not set — API will fail on DB calls.');
}

export const supabase = createClient(url || 'http://localhost', key || 'missing', {
  auth: { persistSession: false },
});
