require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function updateRoles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Update all kitchen roles to admin
  const { data, error } = await supabase
    .from('customers')
    .update({ role: 'admin' })
    .eq('role', 'kitchen')
    .select('id, email, role');

  if (error) {
    console.error('Error updating roles:', error);
    return;
  }

  console.log('Updated roles:', data);
}

updateRoles().catch(console.error);
