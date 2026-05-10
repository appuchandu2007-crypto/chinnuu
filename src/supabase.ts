/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// We sanitize the URL to ensure it doesn't end with /rest/v1 or /rest/v1/ which causes 'Failed to fetch' in Supabase Auth.
let rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://obhucojfhoeoqsgvnefe.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lpq62QyfvF5aW3lCd53Bgg_8hZjkd9y';

export const supabase = createClient(supabaseUrl, supabaseKey);
