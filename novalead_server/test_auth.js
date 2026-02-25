const { supabase } = require('./src/config/db');

async function testAuth() {
    try {
        console.log('Testing access with current key...');
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            console.log('ACCESS_ERROR:', error.message, error.code);
        } else {
            console.log('ACCESS_SUCCESS! Data length:', data.length);
        }
    } catch (err) {
        console.log('CRITICAL:', err.message);
    }
    process.exit(0);
}

testAuth();
