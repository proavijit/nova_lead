const app = require('./src/app');
const { getEnv } = require('./src/config/env');
const logger = require('./src/utils/logger');
const { Pool } = require('pg');

const env = getEnv();
const PORT = env.PORT || 5000;

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL
  });
  
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

