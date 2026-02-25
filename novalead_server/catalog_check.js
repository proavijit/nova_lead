const { supabase } = require('./src/config/db');

async function catalogCheck() {
    console.log('--- Postgres Catalog Check ---');
    try {
        // Query pg_tables to see all public tables
        const { data: tables, error: tableError } = await supabase
            .from('pg_catalog.pg_tables')
            .select('schemaname, tablename')
            .eq('schemaname', 'public');

        if (tableError) {
            console.log('Error querying pg_catalog.pg_tables:', tableError.message);
            // If pg_catalog is restricted, try another way
            const { data: d2, error: e2 } = await supabase.rpc('get_table_names'); // Just in case a custom RPC exists
            if (e2) console.log('RPC get_table_names failed');
            else console.log('RPC tables:', d2);
        } else {
            console.log('Tables in public schema:', tables.map(t => t.tablename).join(', '));
        }

        // Try to insert into a dummy table to see if it triggers the same cache error
        // But first, let's see why users might be special. 
        // Is there a 'users' table in another schema?
        const { data: allUsers, error: userSchemaError } = await supabase
            .from('pg_catalog.pg_tables')
            .select('schemaname, tablename')
            .eq('tablename', 'users');

        if (!userSchemaError) {
            console.log('Schemas containing "users" table:', allUsers.map(u => u.schemaname).join(', '));
        }

    } catch (err) {
        console.error('Critical:', err.message);
    }
    process.exit(0);
}

catalogCheck();
