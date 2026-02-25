const { Pool } = require('pg');

const pool = new Pool({
  host: 'xsksfavlzheeygcbqutt.supabase.co',
  port: 6543,
  database: 'postgres',
  user: 'postgres',
  password: 'sb_publishable_mxs1HaYwQae3mpdaeMJxNA_eXQywLeT',
  ssl: { rejectUnauthorized: false }
});

async function createTable() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to database. Creating users table...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        credits INTEGER DEFAULT 10,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('Users table created!');
    
    await client.query(`ALTER TABLE users DISABLE ROW LEVEL SECURITY`);
    console.log('RLS disabled!');
    
    await client.query(`GRANT ALL ON users TO anon, authenticated`);
    await client.query(`GRANT ALL ON SEQUENCE users_id_seq TO anon, authenticated`);
    console.log('Permissions granted!');
    
    await client.query(`
      CREATE OR REPLACE FUNCTION register_user(
        user_email TEXT,
        user_password_hash TEXT,
        initial_credits INTEGER DEFAULT 10
      )
      RETURNS TABLE(id UUID, email TEXT, credits INTEGER, created_at TIMESTAMPTZ)
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        new_user RECORD;
      BEGIN
        INSERT INTO users (email, password_hash, credits)
        VALUES (user_email, user_password_hash, initial_credits)
        RETURNING id, email, credits, created_at
        INTO new_user;
        RETURN QUERY SELECT new_user.id, new_user.email, new_user.credits, new_user.created_at;
      END;
      $$
    `);
    console.log('register_user function created!');
    
    await client.query(`GRANT EXECUTE ON FUNCTION register_user TO anon, authenticated`);
    console.log('Function permissions granted!');
    
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    console.log('Tables in public schema:', result.rows);
    
    console.log('\n✅ Database setup complete!');
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTable();
