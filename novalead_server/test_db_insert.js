const { supabase } = require('./src/config/db');

async function testInsert() {
    try {
        const { data, error } = await supabase
            .from('users')
            .insert({
                email: `db_test_${Date.now()}@example.com`,
                password_hash: 'dummy_hash',
                credits: 10
            });

        if (error) {
            console.log('INSERT_ERROR:', JSON.stringify(error, null, 2));
        } else {
            console.log('INSERT_SUCCESS:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.log('CRITICAL:', err.message);
    }
    process.exit(0);
}

testInsert();
