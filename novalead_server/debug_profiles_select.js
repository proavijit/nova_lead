const { supabase } = require('./src/config/db');

async function debugProfiles() {
    const table = 'profiles';
    console.log(`Checking ${table}...`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
        console.log(`  select(*) ERROR: ${error.code} - ${error.message}`);
    } else {
        console.log(`  select(*) SUCCESS:`, data);
    }
    process.exit(0);
}

debugProfiles();
