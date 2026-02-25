const { supabase } = require('./src/config/db');

async function findActiveTables() {
    const candidateTables = ['users', 'profiles', 'searches', 'leads', 'credit_transactions', 'credits'];
    console.log('--- Scanning for Active Tables ---');

    for (const table of candidateTables) {
        const { data, error, count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`[ABSENT] ${table}: ${error.code} - ${error.message}`);
        } else {
            console.log(`[ACTIVE] ${table} (Row Count: ${count})`);
        }
    }
    process.exit(0);
}

findActiveTables();
