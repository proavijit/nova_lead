const { supabase } = require('./src/config/db');

async function listTables() {
    try {
        // Query to list tables in public schema
        const { data, error } = await supabase.rpc('get_tables'); // If RPC exists
        if (error) {
            console.log('RPC failed, trying raw query if possible...');
            // Fallback: try a generic select from an internal table or just try common names
            const tables = ['users', 'user', 'profiles', 'accounts', 'leads', 'searches', 'credits'];
            for (const table of tables) {
                const { error: tableError } = await supabase.from(table).select('count').limit(1);
                if (!tableError || tableError.code !== 'PGRST116' && tableError.code !== '42P01') {
                    console.log(`Table '${table}' exists! Code: ${tableError ? tableError.code : 'OK'}`);
                } else {
                    console.log(`Table '${table}' NOT found. Code: ${tableError.code}`);
                }
            }
        } else {
            console.log('Tables:', data);
        }
    } catch (err) {
        console.error('Critical:', err.message);
    }
    process.exit(0);
}

listTables();
