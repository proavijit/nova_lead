const { supabase } = require('./src/config/db');

async function finalScan() {
    const candidates = ['users', 'profiles', 'searches', 'leads', 'credit_transactions', 'credits'];
    console.log('--- FINAL TABLE SCAN ---');
    for (const table of candidates) {
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
        if (!error) {
            console.log(`[EXIST] ${table}`);
        } else {
            console.log(`[ABSENT] ${table} (${error.code})`);
        }
    }
    process.exit(0);
}

finalScan();
