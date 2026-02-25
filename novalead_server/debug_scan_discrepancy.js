const { supabase } = require('./src/config/db');

async function debugScan() {
    const table = 'users';
    console.log(`Checking ${table}...`);
    const { error: e1 } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (e1) {
        console.log(`  select(count) ERROR: ${e1.code} - ${e1.message}`);
    } else {
        console.log(`  select(count) SUCCESS`);
    }

    const { error: e2 } = await supabase.from(table).select('*').limit(1);
    if (e2) {
        console.log(`  select(*) ERROR: ${e2.code} - ${e2.message}`);
    } else {
        console.log(`  select(*) SUCCESS`);
    }
    process.exit(0);
}

debugScan();
