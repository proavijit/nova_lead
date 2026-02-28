const app = require('./src/app');
const { getEnv } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { Pool } = require('pg');

const env = getEnv();
const PORT = env.PORT || 5000;

async function runMigrations() {
  let poolConfig;
  if (process.env.SUPABASE_DB_URL) {
    poolConfig = { connectionString: process.env.SUPABASE_DB_URL, ssl: { rejectUnauthorized: false } };
  } else {
    const host = new URL(process.env.SUPABASE_URL).hostname;
    poolConfig = {
      host,
      port: Number(process.env.SUPABASE_DB_PORT || 6543),
      database: process.env.SUPABASE_DB_NAME || 'postgres',
      user: process.env.SUPABASE_DB_USER || 'postgres',
      password: process.env.SUPABASE_DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    };
  }
  
  const pool = new Pool(poolConfig);
  
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 10');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT');
    logger.info('Database migrations completed');
  } catch (err) {
    logger.warn('Migration warning (can be ignored if columns exist):', err.message);
  } finally {
    await pool.end();
  }
}

runMigrations().then(() => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
});

