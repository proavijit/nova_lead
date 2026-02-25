const { supabase } = require('./src/config/db');

async function inspectSchema() {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('ERROR:', error.message);
        } else {
            console.log('COLUMNS:', data[0] ? Object.keys(data[0]).join(', ') : 'EMPTY');
        }
    } catch (err) {
        console.error('CRITICAL:', err.message);
    }
    process.exit(0);
}

inspectSchema();
