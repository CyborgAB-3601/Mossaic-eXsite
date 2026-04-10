import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pfnknkwbdvkeqiypfrkt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbmtua3diZHZrZXFpeXBmcmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDk2NDksImV4cCI6MjA5MTMyNTY0OX0.qm1kbeGH65YlQMPkTetJxEi5CYVXc82mVBwN0t9QLkI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  const { data: jobs } = await supabase.from('jobs').select('*');
  console.log('Jobs:', jobs);
  const { data: products } = await supabase.from('products').select('*');
  console.log('Products:', products);
}

check();
