import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://obhucojfhoeoqsgvnefe.supabase.co';
const supabaseKey = 'sb_publishable_lpq62QyfvF5aW3lCd53Bgg_8hZjkd9y';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err: any) {
    console.log('Exception:', err.message);
  }
}

testFetch();
