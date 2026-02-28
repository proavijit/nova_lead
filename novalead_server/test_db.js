const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
    const supabaseUrl = new URL(process.env.SUPABASE_URL);
    const host = supabaseUrl.hostname;
    const password = process.env.SUPABASE_DB_PASSWORD;
    const url = `postgresql://postgres:${password}@${host}:6543/postgres`;

    console.log('Testing URL (SUPABASE_URL host + 6543):', url.replace(/:[^:@]+@/, ':****@'));

    const pool = new Pool({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
    });

    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Success!', res.rows[0]);
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
