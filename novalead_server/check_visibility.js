const { supabase } = require('./src/config/db');

async function checkAllTables() {
    console.log('--- Checking All Tables for select(*) ---');
    const tables = ['users', 'profiles', 'searches', 'leads', 'credits', 'credit_transactions'];

    for (const t of tables) {
        process.stdout.write(`Checking ${t}... `);
        const { data, error } = await supabase.from(t).select('*').limit(1);
        if (error) {
            console.log(`[FAIL] ${error.code}: ${error.message}`);
        } else {
            console.log(`[OK] Success! Rows: ${data.length}`);
        }
    }

    // Check if we can see ANY table in pg_tables again but with full detail
    const { data: pt, error: pe } = await supabase.from('pg_catalog.pg_tables').select('schemaname, tablename').eq('schemaname', 'public');
    if (pe) console.log('pg_tables fail:', pe.message);
    else console.log('Tables in public:', pt.map(t => t.tablename).join(', '));

    process.exit(0);
}

checkAllTables();
