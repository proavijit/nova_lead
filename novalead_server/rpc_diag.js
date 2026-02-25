const { supabase } = require('./src/config/db');

async function rpcDiag() {
    console.log('--- RPC Diagnostic ---');
    try {
        // Try to get the current search path and version
        const { data, error } = await supabase.rpc('get_db_info'); // This might not exist, but let's try a different approach

        // If we can't use RPC, we'll try a common hack to get info via a function that usually exists
        const { data: d2, error: e2 } = await supabase.from('users').select('count', { count: 'exact', head: true });
        console.log('Final check for "users":', !e2 ? 'VISIBLE' : 'HIDDEN');

        // Let's try to see if we can access the 'auth' schema's users table (often restricted but good to check)
        const { data: d3, error: e3 } = await supabase.from('auth.users').select('count', { count: 'exact', head: true });
        console.log('Final check for "auth.users":', !e3 ? 'VISIBLE' : 'HIDDEN');

    } catch (err) {
        console.error('Critical:', err.message);
    }
    process.exit(0);
}

rpcDiag();
