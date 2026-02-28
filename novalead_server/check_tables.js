const { supabase } = require('./src/config/db');

async function listTables() {
    console.log('--- Database Table Check ---');
    const tables = [
        'users',
        'profiles',
        'searches',
        'leads',
        'credit_transactions',
        'credits',
        'global_search_cache',
        'global_cached_leads'
    ];
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('*').limit(1);
            if (!error) {
                console.log(`[EXIST] ${table}`);
            } else if (
                error.code === 'PGRST205' ||
                error.code === '42P01' ||
                error.message.toLowerCase().includes('not find') ||
                error.message.toLowerCase().includes('does not exist')
            ) {
                console.log(`[MISSING] ${table} (Code: ${error.code})`);
            } else {
                console.log(`[ERROR] ${table}: ${error.message} (Code: ${error.code})`);
            }
        } catch (err) {
            console.log(`[CRITICAL] ${table}: ${err.message}`);
        }
    }
    process.exit(0);
}

listTables();
