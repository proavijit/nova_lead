const { supabase } = require('./src/config/db');

async function inspect() {
    const tables = ['profiles', 'credits', 'leads', 'searches', 'users', 'credit_transactions'];
    for (const table of tables) {
        console.log(`Checking ${table}...`);
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`  [NOT FOUND] ${error.code} - ${error.message}`);
        } else {
            console.log(`  [FOUND] Columns: ${data[0] ? Object.keys(data[0]).join(', ') : 'EMPTY TABLE (No Rows)'}`);
            if (data[0]) console.log(`  [SAMPLE] ${JSON.stringify(data[0])}`);
        }
    }
    process.exit(0);
}

inspect();
