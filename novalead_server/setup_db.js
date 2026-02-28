require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

function buildConnectionConfig() {
  if (process.env.SUPABASE_DB_URL) {
    return {
      connectionString: process.env.SUPABASE_DB_URL,
      ssl: { rejectUnauthorized: false }
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;
  const dbUser = process.env.SUPABASE_DB_USER || 'postgres';
  const dbName = process.env.SUPABASE_DB_NAME || 'postgres';
  const dbPort = Number(process.env.SUPABASE_DB_PORT || 6543);

  if (!supabaseUrl || !dbPassword) {
    throw new Error(
      'Missing DB credentials. Set SUPABASE_DB_URL, or set SUPABASE_URL + SUPABASE_DB_PASSWORD (optionally SUPABASE_DB_USER/SUPABASE_DB_NAME/SUPABASE_DB_PORT).'
    );
  }

  const host = new URL(supabaseUrl).hostname;
  return {
    host,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
    ssl: { rejectUnauthorized: false }
  };
}

async function run() {
  const sqlPath = path.join(__dirname, 'scripts', 'setup_db.sql');
  if (!fs.existsSync(sqlPath)) {
    throw new Error(`SQL file not found: ${sqlPath}`);
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  const pool = new Pool(buildConnectionConfig());
  const client = await pool.connect();

  try {
    console.log('Applying schema from scripts/setup_db.sql ...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Schema sync complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    const details = [
      err?.message ? `message=${err.message}` : null,
      err?.code ? `code=${err.code}` : null,
      err?.detail ? `detail=${err.detail}` : null,
      err?.hint ? `hint=${err.hint}` : null,
      err?.stack ? `stack=${err.stack}` : null
    ]
      .filter(Boolean)
      .join(' | ');
    console.error(`DB setup failed: ${details || 'Unknown error'}`);
    process.exit(1);
  });
