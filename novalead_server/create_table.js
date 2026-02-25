const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://xsksfavlzheeygcbqutt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhza3NmYXZsemhlZXlnY2JxdXR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk1NTY4MCwiZXhwIjoyMDg3NTMxNjgwfQ.BVufnZsgPM9_NAz2VrsEFGMI_4xAz0GDFEwSR0RjKNk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createTable() {
  console.log('Attempting to create users table using pg-mem table...');

  // Try using the storage API to create a table indirectly
  // Or use the REST API with correct parameters
  
  // Let's try creating via POST to tables endpoint
  const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      query: "CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, credits INTEGER DEFAULT 10, createdPTZ DEFAULT NOW());"
    })
_at TIMESTAM  });

  console.log('Response status:', createResponse.status);
  const data = await createResponse.text();
  console.log('Response:', data);

  // Alternative: Use the tables endpoint
  console.log('\nTrying table creation via tables endpoint...');
  
  // Check current tables via different method
  const tablesResp = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_SERVICE_ROLE_KEY}`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
    }
  });
  console.log('Tables query status:', tablesResp.status);
}

createTable().catch(console.error);
