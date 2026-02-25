const { supabase } = require('./src/config/db');

async function debugSchema() {
    console.log('--- Debugging Schema ---');
    try {
        // Try to get all tables from information_schema
        const { data, error } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public');
        if (error) {
            console.log('Error selecting from pg_tables:', error.message);
            // Fallback: try to see what we CAN select
            const { data: d2, error: e2 } = await supabase.from('profiles').select('*').limit(1);
            if (e2) {
                console.log('Error selecting from profiles:', e2.message);
            } else {
                console.log('Successfully selected from profiles. Columns:', d2[0] ? Object.keys(d2[0]) : 'EMPTY');
            }
        } else {
            console.log('Tables in public schema:', data.map(t => t.tablename).join(', '));
        }
    } catch (err) {
        console.log('Critical:', err.message);
    }
    process.exit(0);
}

debugSchema();
