const { supabase } = require('./src/config/db');

async function testSelect() {
    console.log('--- Testing Select * from users ---');
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
        console.log('SELECT_ERROR:', error.message, error.code);
    } else {
        console.log('SELECT_SUCCESS:', data);
    }
    process.exit(0);
}

testSelect();
