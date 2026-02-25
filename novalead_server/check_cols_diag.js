const { supabase } = require('./src/config/db');

async function checkCols() {
    console.log('--- Checking Columns specifically ---');
    try {
        const { data, error } = await supabase.from('users').select('id').limit(1);
        if (error) {
            console.log('SELECT ID ERROR:', error.message, error.code);
        } else {
            console.log('SELECT ID SUCCESS! Rows:', data.length);
        }

        const { data: d2, error: e2 } = await supabase.from('users').select('email').limit(1);
        if (e2) {
            console.log('SELECT EMAIL ERROR:', e2.message, e2.code);
        } else {
            console.log('SELECT EMAIL SUCCESS!');
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}

checkCols();
