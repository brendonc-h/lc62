const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureAdminRoles() {
  const adminEmails = [
    'info@lacasita.io',
    'berthoud@lacasita.io',
    'fortcollins@lacasita.io'
  ];

  for (const email of adminEmails) {
    // Update customers table
    const { error: updateError } = await supabase
      .from('customers')
      .update({ role: 'admin' })
      .eq('email', email);

    if (updateError) {
      console.error(`Error updating role for ${email}:`, updateError);
    } else {
      console.log(`Successfully updated role for ${email}`);
    }
  }

  console.log('Admin role update completed');
}

ensureAdminRoles()
  .catch(console.error)
  .finally(() => process.exit(0));
