const { supabase } = require('./src/config/db');

async function listTables() {
    console.log('--- Database Table Check ---');
    const tables = ['users', 'profiles', 'searches', 'leads', 'credit_transactions', 'credits'];
    for (const table of tables) {
        try {
            const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
            if (!error) {
                console.log(`[EXIST] ${table}`);
            } else if (error.code === 'PGRST116' || error.code === '42P01' || error.message.includes('not find')) {
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
