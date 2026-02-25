const { supabase } = require('./src/config/db');

async function inspectTables() {
    const tables = ['profiles', 'credits', 'leads', 'searches'];
    for (const table of tables) {
        console.log(`--- Table: ${table} ---`);
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                console.log(`Error: ${error.message}`);
            } else {
                console.log(`Columns: ${data[0] ? Object.keys(data[0]).join(', ') : 'EMPTY'}`);
            }
        } catch (err) {
            console.log(`Critical: ${err.message}`);
        }
    }
    process.exit(0);
}

inspectTables();
