const { supabase } = require('./src/config/db');

async function debugInsert() {
    console.log('--- Debugging Insert ---');
    try {
        const email = `test_minimal_${Date.now()}@example.com`;
        const { data, error } = await supabase
            .from('profiles')
            .insert({ email })
            .select();

        if (error) {
            console.log('INSERT_ERROR:', error.message);
            console.log('ERROR_CODE:', error.code);
        } else {
            console.log('INSERT_SUCCESS:', data);
        }
    } catch (err) {
        console.log('Critical:', err.message);
    }
    process.exit(0);
}

debugInsert();
