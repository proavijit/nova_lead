const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xsksfavlzheeygcbqutt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDatabase() {
  console.log('Setting up database...');

  // Create users table
  console.log('Creating users table...');
  const { error: usersError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        credits INTEGER DEFAULT 10,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (usersError) {
    console.log('Trying alternative approach...');
    
    // Try direct table creation via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: 'users',
        schema: 'public',
        columns: [
          { name: 'id', type: 'uuid', default: 'gen_random_uuid()' },
          { name: 'email', type: 'text' },
          { name: 'password_hash', type: 'text' },
          { name: 'credits', type: 'integer', default: 10 },
          { name: 'created_at', type: 'timestamptz', default: 'now()' }
        ],
        primary_key: ['id'],
        unique_constraints: [{ columns: ['email'] }]
      })
    });
    
    console.log('Table creation response:', response.status);
  } else {
    console.log('Users table created successfully!');
  }

  // Check if table exists
  console.log('\nChecking existing tables...');
  const { data: tables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (tablesError) {
    console.log('Error checking tables:', tablesError.message);
  } else {
    console.log('Existing tables:', tables);
  }

  // Try to insert a test user directly
  console.log('\nTesting direct insert...');
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert({
      email: 'test@example.com',
      password_hash: 'test_hash',
      credits: 10
    })
    .select('*');

  if (insertError) {
    console.log('Direct insert error:', insertError.message);
    console.log('Error code:', insertError.code);
  } else {
    console.log('Test user created:', insertData);
  }
}

setupDatabase()
  .then(() => console.log('\nDone!'))
  .catch(console.error);
