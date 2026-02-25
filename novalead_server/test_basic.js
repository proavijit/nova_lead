const { supabase } = require('./src/config/db');

async function testConnection() {
    console.log('--- Testing Connection and Permissions ---');
    try {
        // Try a raw SQL query via RPC to create a table (if possible)
        // Usually, JS client can't run raw SQL unless an RPC is set up.
        // Let's try to just insert into a table that doesn't exist yet? No, that will 404.

        // Let's try to select from information_schema
        const { data, error } = await supabase.from('information_schema.tables').select('table_name').limit(1);
        if (error) {
            console.log('information_schema access error:', error.message);
        } else {
            console.log('information_schema access success!');
        }

        // Try a common Supabase function
        const { data: d2, error: e2 } = await supabase.rpc('get_service_status'); // Hypothetical
        if (e2) console.log('RPC check failed (expected if non-existent)');

    } catch (err) {
        console.error('Critical:', err.message);
    }
    process.exit(0);
}

testConnection();
