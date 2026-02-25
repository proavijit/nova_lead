const { supabase } = require('./src/config/db');

async function deepDiagnostic() {
    console.log('--- DEEP SCHEMA DIAGNOSTIC ---');

    // 1. Try to fetch from a system table that lists columns
    console.log('Fetching columns for "users"...');
    // Note: PostgREST might block access to information_schema if not configured, 
    // but with service_role we might have a chance.
    try {
        const { data, error } = await supabase
            .from('information_schema.columns')
            .select('column_name, data_type')
            .eq('table_name', 'users')
            .eq('table_schema', 'public');

        if (error) {
            console.log('  [ERROR] information_schema.columns:', error.message, error.code);
        } else if (!data || data.length === 0) {
            console.log('  [EMPTY] No columns found for "users" in public schema.');
        } else {
            console.log('  [SUCCESS] Columns found:', data.map(c => c.column_name).join(', '));
        }
    } catch (err) {
        console.log('  [CRITICAL] information_schema fail:', err.message);
    }

    // 2. Try to insert with a DIFFERENT table name to see if it's a global issue
    console.log('\nTesting insertion into a new "test_table"...');
    try {
        // We can't create tables via JS client easily, but we can try to find ANY table that works.
        const tables = ['searches', 'leads', 'credits', 'profiles'];
        for (const t of tables) {
            console.log(`Checking columns for "${t}"...`);
            const { data, error } = await supabase.from(t).select('*').limit(1);
            if (error) {
                console.log(`  [FAILED] ${t}: ${error.message}`);
            } else {
                console.log(`  [WORKS] ${t} is fully visible!`);
            }
        }
    } catch (err) {
        console.log('  [CRITICAL] Table loop fail:', err.message);
    }

    process.exit(0);
}

deepDiagnostic();
